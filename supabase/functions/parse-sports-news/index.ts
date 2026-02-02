const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SPORTS_SOURCES = [
  { url: 'https://www.sport-express.ru', category: 'football', name: 'Спорт-Экспресс' },
  { url: 'https://www.championat.com', category: 'football', name: 'Чемпионат' },
  { url: 'https://www.sports.ru', category: 'football', name: 'Sports.ru' },
];

const CATEGORIES = ['football', 'basketball', 'hockey', 'tennis', 'motorsport', 'mma', 'olympics'];

interface ScrapedArticle {
  title: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: string;
  sourceUrl: string;
  tags: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY is not configured');
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase credentials not configured');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting news parsing...');

    // Step 1: Use Firecrawl to search for latest sports news
    const searchQueries = [
      'последние новости спорта футбол',
      'новости NBA баскетбол',
      'новости КХЛ хоккей',
      'теннис ATP WTA новости',
      'формула 1 новости',
      'UFC MMA единоборства',
    ];

    const allArticles: ScrapedArticle[] = [];

    for (const query of searchQueries) {
      console.log(`Searching for: ${query}`);
      
      try {
        const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query,
            limit: 3,
            lang: 'ru',
            country: 'ru',
            tbs: 'qdr:d', // Last 24 hours
            scrapeOptions: {
              formats: ['markdown'],
            },
          }),
        });

        if (!searchResponse.ok) {
          console.error(`Search failed for query "${query}":`, await searchResponse.text());
          continue;
        }

        const searchData = await searchResponse.json();
        
        if (searchData.data && Array.isArray(searchData.data)) {
          for (const result of searchData.data) {
            const category = detectCategory(query);
            
            allArticles.push({
              title: result.title || 'Без заголовка',
              excerpt: result.description || '',
              content: result.markdown || result.description || '',
              image: extractImageFromMarkdown(result.markdown) || getDefaultImage(category),
              category: category,
              sourceUrl: result.url || '',
              tags: extractTags(result.title, result.description),
            });
          }
        }
      } catch (searchError) {
        console.error(`Error searching for "${query}":`, searchError);
      }
    }

    console.log(`Found ${allArticles.length} raw articles`);

    if (allArticles.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No new articles found', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Use AI to process and enhance articles
    const processedArticles = [];
    
    for (const article of allArticles.slice(0, 10)) { // Process up to 10 articles
      try {
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `Ты профессиональный спортивный журналист. Твоя задача - переписать новость в формате для спортивного портала.
                
Правила:
1. Напиши SEO-заголовок (до 80 символов)
2. Напиши краткий лид (1-2 предложения, до 150 символов)
3. Напиши полный текст статьи (3-5 абзацев, профессиональный журналистский стиль)
4. Определи 3-5 тегов
5. Определи, является ли новость "горячей" (важная/срочная)
6. Напиши короткий промпт для генерации изображения (на английском, 10-20 слов, описание спортивной сцены без текста и логотипов)

Верни JSON в формате:
{
  "title": "заголовок",
  "excerpt": "краткий лид",
  "content": "полный текст статьи",
  "tags": ["тег1", "тег2"],
  "is_hot": true/false,
  "image_prompt": "English prompt for image generation"
}`,
              },
              {
                role: 'user',
                content: `Исходная новость:\n\nЗаголовок: ${article.title}\n\nТекст: ${article.content.substring(0, 2000)}`,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (!aiResponse.ok) {
          console.error('AI processing failed:', await aiResponse.text());
          continue;
        }

        const aiData = await aiResponse.json();
        const aiContent = aiData.choices?.[0]?.message?.content;
        
        if (aiContent) {
          try {
            // Extract JSON from response
            const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              
              // Generate image using AI
              let generatedImageUrl = article.image;
              
              if (parsed.image_prompt) {
                try {
                  console.log(`Generating image for: ${parsed.title}`);
                  
                  const imageResponse = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      model: 'google/gemini-3-pro-image-preview',
                      prompt: `Professional sports photography, high quality, dynamic action shot: ${parsed.image_prompt}. Ultra high resolution, cinematic lighting, 16:9 aspect ratio.`,
                      n: 1,
                      size: '1024x576',
                    }),
                  });

                  if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    if (imageData.data?.[0]?.url) {
                      generatedImageUrl = imageData.data[0].url;
                      console.log(`Image generated successfully for: ${parsed.title}`);
                    }
                  } else {
                    console.error('Image generation failed:', await imageResponse.text());
                  }
                } catch (imgError) {
                  console.error('Image generation error:', imgError);
                }
              }
              
              processedArticles.push({
                title: parsed.title || article.title,
                excerpt: parsed.excerpt || article.excerpt,
                content: parsed.content || article.content,
                image: generatedImageUrl || getDefaultImage(article.category),
                category: article.category,
                source_url: article.sourceUrl,
                tags: parsed.tags || article.tags,
                is_hot: parsed.is_hot || false,
                is_live: false,
                author: 'Редакция',
                views: Math.floor(Math.random() * 10000),
              });
            }
          } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
          }
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError);
      }
    }

    console.log(`Processed ${processedArticles.length} articles with AI`);

    // Step 3: Save to database
    if (processedArticles.length > 0) {
      const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/news`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(processedArticles),
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Database insert failed:', errorText);
        throw new Error(`Database insert failed: ${errorText}`);
      }

      console.log(`Successfully inserted ${processedArticles.length} articles`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Parsed and saved ${processedArticles.length} articles`,
        count: processedArticles.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-sports-news:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function detectCategory(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('футбол') || lowerQuery.includes('football')) return 'football';
  if (lowerQuery.includes('баскетбол') || lowerQuery.includes('nba')) return 'basketball';
  if (lowerQuery.includes('хоккей') || lowerQuery.includes('кхл') || lowerQuery.includes('nhl')) return 'hockey';
  if (lowerQuery.includes('теннис') || lowerQuery.includes('atp') || lowerQuery.includes('wta')) return 'tennis';
  if (lowerQuery.includes('формула') || lowerQuery.includes('f1') || lowerQuery.includes('motorsport')) return 'motorsport';
  if (lowerQuery.includes('ufc') || lowerQuery.includes('mma') || lowerQuery.includes('единоборств')) return 'mma';
  if (lowerQuery.includes('олимп')) return 'olympics';
  return 'football';
}

function extractImageFromMarkdown(markdown: string | undefined): string | null {
  if (!markdown) return null;
  const imgMatch = markdown.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
  if (imgMatch) return imgMatch[1];
  const urlMatch = markdown.match(/(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp))/i);
  return urlMatch ? urlMatch[1] : null;
}

function getDefaultImage(category: string): string {
  const defaultImages: Record<string, string> = {
    football: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800',
    basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    hockey: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=800',
    tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
    motorsport: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=800',
    mma: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800',
    olympics: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800',
  };
  return defaultImages[category] || defaultImages.football;
}

function extractTags(title: string, description: string | undefined): string[] {
  const text = `${title} ${description || ''}`.toLowerCase();
  const tags: string[] = [];
  
  const keywords = [
    'реал мадрид', 'барселона', 'манчестер', 'ливерпуль', 'бавария',
    'цска', 'спартак', 'зенит', 'локомотив',
    'nba', 'кхл', 'нхл', 'ufc', 'формула 1',
    'чемпионат', 'кубок', 'лига чемпионов', 'премьер-лига',
  ];
  
  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      tags.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
    }
  }
  
  return tags.slice(0, 5);
}
