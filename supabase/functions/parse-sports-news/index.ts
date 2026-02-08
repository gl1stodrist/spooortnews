import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"
import { XMLParser } from "https://esm.sh/fast-xml-parser@4.3.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Исправляем проблему с CORS для браузера
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    // 1. Берем новости из RSS Sports.ru
    const rssResponse = await fetch('https://www.sports.ru/rss/main.xml');
    const xmlData = await rssResponse.text();
    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    const items = result.rss?.channel?.item || [];
    
    // Берем 3 самые свежие новости
    const rawArticles = Array.isArray(items) ? items.slice(0, 3) : [items];
    const processedArticles = [];

    for (const item of rawArticles) {
      const link = item.link;

      // Проверяем, нет ли уже этой ссылки в таблице posts
      const { data: exists } = await supabase.from('posts').select('id').eq('source_url', link).maybeSingle();
      if (exists) continue;

      // Просим Gemini переписать новость
      const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Ты спортивный журналист. Перепиши новость в JSON формате: {"title": "заголовок", "excerpt": "краткое описание", "content": "полный текст", "tags": ["спорт"]}. Текст для переработки: ${item.title}. ${item.description}` }] }]
        })
      });

      const aiData = await aiResponse.json();
      const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      
      // Очищаем JSON от лишних символов, если Gemini их добавил
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      processedArticles.push({
        title: parsed.title,
        excerpt: parsed.excerpt,
        content: parsed.content,
        tags: parsed.tags,
        source_url: link,
        image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800" // Стандартное фото спорта
      });
    }

    // 2. Сохраняем результат в таблицу posts
    if (processedArticles.length > 0) {
      const { error: insertError } = await supabase.from('posts').insert(processedArticles);
      if (insertError) throw insertError;
    }

    return new Response(JSON.stringify({ message: `Успех! Сохранено новостей: ${processedArticles.length}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: corsHeaders
    });
  }
})
