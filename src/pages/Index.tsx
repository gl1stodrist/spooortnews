const handleParseNews = useCallback(async () => {
    setIsParsing(true);
    try {
      // Прямой вызов твоей функции smart-api
      const { data, error } = await supabase.functions.invoke(
        "smart-api"
      );

      if (error) {
        // Если стандартный вызов не прошел, пробуем через прямой fetch
        console.log("Пробуем прямой запрос...");
        const response = await fetch('https://yamtqvmekavsaquossah.supabase.co/functions/v1/smart-api', {
          method: 'POST'
        });
        if (!response.ok) throw new Error('Ошибка сети');
      }

      toast({
        title: "Успешно",
        description: "Новости обновлены! Сейчас страница перезагрузится.",
      });

      // Перезагружаем данные и страницу через секунду
      setTimeout(() => {
        refetch();
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error("Parse error:", err);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить новости. Проверь консоль (F12)",
        variant: "destructive",
      });
    } finally {
      setIsParsing(false);
    }
  }, [refetch, toast]);
