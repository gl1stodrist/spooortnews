// Step 2: Use FREE Google Gemini directly
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const processedArticles = [];
    
    for (const article of allArticles.slice(0, 10)) {
      try {
        console.log(`Processing article with Gemini: ${article.title}`);
        
        const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Ты профессиональный спортивный журналист. Перепиши новость для портала. 
                Верни ответ СТРОГО в формате JSON:
                {
                  "title": "заголовок до 80 симв",
                  "excerpt": "лид до 150 симв",
                  "content": "текст 3-5 абзацев",
                  "tags": ["тег1", "тег2"],
                  "is_hot": true/false,
                  "image_search_query": "English keywords for photo search"
                }
                
                Новость для обработки:
                Заголовок: ${article.title}
                Текст: ${article.content.substring(0, 2000)}`
              }]
            }]
          }),
        });

        if (!aiResponse.ok) {
          console.error('Gemini API error:', await aiResponse.text());
          continue;
        }

        const geminiData = await aiResponse.json();
        const aiContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiContent) {
          // Чистим ответ от возможных Markdown-меток ```json ... ```
          const jsonString = aiContent.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(jsonString);
          
          // Дальше идет твой существующий код поиска картинок...
