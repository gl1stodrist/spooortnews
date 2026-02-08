import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { XMLParser } from "https://esm.sh/fast-xml-parser@4.3.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    // 1. Получаем новости (простой и надежный RSS)
    const rssResponse = await fetch('https://www.sports.ru/rss/main.xml');
    const xmlData = await rssResponse.text();
    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    const rawArticles = result.rss?.channel?.item || [];
    
    console.log(`Найдено в RSS: ${rawArticles.length}`);

    const processedArticles = [];
    
    // Берем 3 новости для теста, чтобы не перегружать
    for (const item of rawArticles.slice(0, 3)) {
      const title = item.title;
      const description = item.description || "";
      const link = item.link;

      // Проверяем, нет ли уже такой новости
      const { data: exists } = await supabase.from('posts').select('id').eq('source_url', link).maybeSingle();
      if (exists) continue;

      // Просим Gemini переписать
      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Ты спортивный журналист. Перепиши новость в JSON формате: {"title": "заголовок", "excerpt": "кратко", "content": "текст", "tags": ["спорт"]}. Новость: ${title}. Текст: ${description}` }] }]
        })
      });

      const aiData = await aiResponse.json();
      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      processedArticles.push({
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: parsed.content,
        tags: parsed.tags,
        source_url: link,
        image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800"
      });
    }

    if (processedArticles.length > 0) {
      const { error } = await supabase.from('posts').insert(processedArticles);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ message: `Успешно. Сохранено: ${processedArticles.length}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: corsHeaders
    });
  }
})
