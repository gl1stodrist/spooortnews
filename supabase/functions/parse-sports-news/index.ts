const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const _SPORTS_SOURCES = [
  { url: 'https://www.sport-express.ru', category: 'football', name: 'Спорт-Экспресс' },
  { url: 'https://www.championat.com', category: 'football', name: 'Чемпионат' },
  { url: 'https://www.sports.ru', category: 'football', name: 'Sports.ru' },
];

const _CATEGORIES = ['football', 'basketball', 'hockey', 'tennis', 'motorsport', 'mma', 'olympics'];

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
6. Напиши поисковый запрос для поиска релевантного изображения (на английском, 3-5 слов, например "Real Madrid Champions League goal celebration")

Верни JSON в формате:
{
  "title": "заголовок",
  "excerpt": "краткий лид",
  "content": "полный текст статьи",
  "tags": ["тег1", "тег2"],
  "is_hot": true/false,
  "image_search_query": "English search query for finding relevant sports image"
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
              
              // Search for real image using Firecrawl
              let foundImageUrl = article.image;
              
              if (parsed.image_search_query) {
                try {
                  console.log(`Searching image for: ${parsed.image_search_query}`);
                  
                  const imageSearchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      query: `${parsed.image_search_query} sports photo high quality`,
                      limit: 5,
                      scrapeOptions: {
                        formats: ['markdown', 'links'],
                      },
                    }),
                  });

                  if (imageSearchResponse.ok) {
                    const imageSearchData = await imageSearchResponse.json();
                    
                    // Try to find image from search results
                    if (imageSearchData.data && Array.isArray(imageSearchData.data)) {
                      for (const result of imageSearchData.data) {
                        // Check markdown for image URLs
                        if (result.markdown) {
                          const imgUrl = extractHighQualityImage(result.markdown);
                          if (imgUrl) {
                            foundImageUrl = imgUrl;
                            console.log(`Found image from search: ${imgUrl}`);
                            break;
                          }
                        }
                      }
                    }
                  } else {
                    console.error('Image search failed:', await imageSearchResponse.text());
                  }
                } catch (imgError) {
                  console.error('Image search error:', imgError);
                }
              }
              
              // If no image found from search, try to get from Unsplash API
              if (!foundImageUrl || foundImageUrl === article.image) {
                foundImageUrl = await getUnsplashImage(parsed.image_search_query || article.category, article.category);
              }
              
              processedArticles.push({
                title: parsed.title || article.title,
                excerpt: parsed.excerpt || article.excerpt,
                content: parsed.content || article.content,
                image: foundImageUrl || getDefaultImage(article.category),
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

    // Step 3: Check for duplicates and save to database
    if (processedArticles.length > 0) {
      // Fetch existing article titles to check for duplicates
      const existingTitlesResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/news?select=title,source_url&order=created_at.desc&limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
          },
        }
      );

      let existingTitles: Set<string> = new Set();
      let existingSourceUrls: Set<string> = new Set();
      
      if (existingTitlesResponse.ok) {
        const existingArticles = await existingTitlesResponse.json();
        existingTitles = new Set(existingArticles.map((a: { title: string }) => a.title.toLowerCase().trim()));
        existingSourceUrls = new Set(
          existingArticles
            .filter((a: { source_url: string | null }) => a.source_url)
            .map((a: { source_url: string }) => a.source_url)
        );
      }

      // Filter out duplicates by title similarity and source URL
      const uniqueArticles = processedArticles.filter(article => {
        const titleLower = article.title.toLowerCase().trim();
        
        // Check exact title match
        if (existingTitles.has(titleLower)) {
          console.log(`Skipping duplicate (exact title): ${article.title}`);
          return false;
        }
        
        // Check source URL match
        if (article.source_url && existingSourceUrls.has(article.source_url)) {
          console.log(`Skipping duplicate (same source URL): ${article.title}`);
          return false;
        }
        
        // Check title similarity (at least 80% similar)
        for (const existingTitle of existingTitles) {
          if (calculateSimilarity(titleLower, existingTitle) > 0.8) {
            console.log(`Skipping duplicate (similar title): ${article.title}`);
            return false;
          }
        }
        
        return true;
      });

      console.log(`Filtered to ${uniqueArticles.length} unique articles (removed ${processedArticles.length - uniqueArticles.length} duplicates)`);

      if (uniqueArticles.length > 0) {
        const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/news`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(uniqueArticles),
        });

        if (!insertResponse.ok) {
          const errorText = await insertResponse.text();
          console.error('Database insert failed:', errorText);
          throw new Error(`Database insert failed: ${errorText}`);
        }

        console.log(`Successfully inserted ${uniqueArticles.length} unique articles`);
      }
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

function extractHighQualityImage(markdown: string | undefined): string | null {
  if (!markdown) return null;
  
  // Look for image URLs in various formats
  const patterns = [
    /!\[.*?\]\((https?:\/\/[^\s)]+\.(?:jpg|jpeg|png|webp)[^\s)]*)\)/gi,
    /(https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)(?:\?[^\s"'<>]*)?)/gi,
    /(https?:\/\/images\.[^\s"'<>]+)/gi,
    /(https?:\/\/[^\s"'<>]*(?:cdn|media|img|image)[^\s"'<>]*\.(?:jpg|jpeg|png|webp)[^\s"'<>]*)/gi,
  ];
  
  for (const pattern of patterns) {
    const matches = markdown.match(pattern);
    if (matches && matches.length > 0) {
      // Filter out small thumbnails and icons
      for (const match of matches) {
        const url = match.replace(/^!\[.*?\]\(/, '').replace(/\)$/, '');
        // Skip small images, thumbnails, and tracking pixels
        if (!url.includes('thumb') && 
            !url.includes('icon') && 
            !url.includes('logo') && 
            !url.includes('avatar') &&
            !url.includes('1x1') &&
            !url.includes('pixel') &&
            url.length < 500) {
          return url;
        }
      }
    }
  }
  
  return null;
}

async function getUnsplashImage(query: string, category: string): Promise<string> {
  // Use Unsplash Source API for high-quality free images
  const searchTerms: Record<string, string> = {
    football: 'soccer football stadium',
    basketball: 'basketball nba court',
    hockey: 'ice hockey nhl',
    tennis: 'tennis court match',
    motorsport: 'formula racing car',
    mma: 'boxing mma fighting',
    olympics: 'olympics sports athletics',
  };
  
  const term = searchTerms[category] || query || 'sports';
  // Unsplash Source API provides random high-quality images
  return `https://images.unsplash.com/photo-1461896836934- voices-of-men-playing-football?w=1200&q=80&fit=crop&auto=format&${encodeURIComponent(term)}`;
}

function getDefaultImage(category: string): string {
  const defaultImages: Record<string, string> = {
    football: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1200&q=80',
    basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80',
    hockey: 'https://images.unsplash.com/photo-1515703407324-5f753afd8be8?w=1200&q=80',
    tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1200&q=80',
    motorsport: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200&q=80',
    mma: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1200&q=80',
    olympics: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=1200&q=80',
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

// Calculate similarity between two strings using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const costs: number[] = [];
  for (let i = 0; i <= shorter.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= longer.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (shorter.charAt(i - 1) !== longer.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[longer.length] = lastValue;
  }
  
  return (longer.length - costs[longer.length]) / longer.length;
}
