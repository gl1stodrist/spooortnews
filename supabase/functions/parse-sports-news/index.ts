import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { XMLParser } from "https://esm.sh/fast-xml-parser@4.3.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Список проверенных RSS-лент
const RSS_FEEDS = [
  'https://www.sports.ru/rss/main.xml',
  'https://www.championat.com/xml/rss.xml'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const parser = new XMLParser();
    let allArticles = [];

    // --- STEP 1: Собираем новости ---
    for (const url of RSS_FEEDS) {
      try {
        const response = await fetch(url);
        const xmlData = await response.text();
        const result = parser.parse(xmlData);
        const items = result.rss?.channel?.item || [];
        
        for (const item of (Array.isArray(items) ? items : [items])) {
          allArticles.push({
            title: item.title,
            content: item.description || item['content:encoded'] || '',
            link: item.link
          });
        }
      } catch (e) {
        console.error(`Ошибка при чтении ленты ${url}:`, e);
      }
    }

    console.log(`Найдено новостей в лентах: ${allArticles.length}`);

    // --- STEP 2: Обработка через Gemini ---
    const processedArticles = [];
    
    // Берем только 5 самых свежих, чтобы не превышать лимиты Gemini
    for (const article of allArticles.slice(0, 5)) {
      try {
        // Проверяем, нет ли такой новости уже в базе (по ссылке)
        const { data: existing } = await supabase
          .from('posts')
          .select('id')
          .eq('source_url', article.link)
          .maybeSingle();

        if (existing) continue;

        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Ты спортивный журналист. Перепиши новость. Верни СТРОГО JSON:
                {"title": "заголовок", "excerpt": "кратко", "content": "текст", "tags": ["тег1"]}
                Новость: ${article.title}. Текст: ${article.content.substring(0, 1000)}`
              }]
            }]
          }),
        });

        const geminiData = await aiResponse.json();
        const aiContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiContent) {
          const jsonString = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(jsonString);
          
          processedArticles.push({
            title: parsed.title,
            excerpt: parsed.excerpt,
            content: parsed.content,
            tags: parsed.tags,
            source_url: article.link,
            image_url: `https://source.unsplash.com/800x600/?sport,${encodeURIComponent(parsed.tags?.[0] || 'football')}`
          });
        }
      } catch (e) {
        console.error(`Ошибка Gemini для статьи ${article.title}:`, e);
      }
    }

    // --- STEP 3: Сохранение ---
    if (processedArticles.length > 0) {
      const { error: insertError } = await supabase
        .from('posts') // ВАЖНО: именно posts
        .insert(processedArticles);

      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({ message: `Success. Saved ${processedArticles.length} articles` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
