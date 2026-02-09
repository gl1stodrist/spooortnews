import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(10);
      if (data) setNews(data);
    };
    fetchNews();
  }, []);

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#1a1a1a', minHeight: '100vh', fontFamily: '"Inter", sans-serif', margin: 0 }}>
      
      {/* 1. ГЛАВНАЯ ШАПКА В СТИЛЕ LOVABLE */}
      <header style={{ borderBottom: '1px solid #eee', padding: '20px 0', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', px: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-1px', textTransform: 'uppercase' }}>
            SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span>
          </h1>
          <nav style={{ display: 'flex', gap: '20px', fontSize: '14px', fontWeight: '500' }}>
            <span>Футбол</span>
            <span>Трансферы</span>
            <span style={{ color: '#ea384c' }}>LIVE</span>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
          
          {/* ЛЕВАЯ КОЛОНКА: НОВОСТИ */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <div style={{ width: '4px', height: '24px', backgroundColor: '#ea384c' }}></div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Последние новости</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              {news.map((item: any) => (
                <div key={item.id} style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '20px' }}>
                  {item.image_url && (
                    <img src={item.image_url} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '15px' }} alt="" />
                  )}
                  <span style={{ color: '#ea384c', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Футбол</span>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '10px 0', lineHeight: '1.4' }}>{item.title}</h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{item.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: НАШИ ФУНКЦИИ (LIVE И VIP) */}
          <aside>
            {/* LIVE РЕЗУЛЬТАТЫ */}
            <div style={{ backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '20px', marginBottom: '30px', border: '1px solid #eee' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <div style={{ width: '8px', height: '8px', backgroundColor: '#ea384c', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1px' }}>LIVE MATCHES</span>
              </div>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Ливерпуль</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: '#ea384c' }}>2 - 1</span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>Реал Мадрид</span>
                </div>
                <div style={{ fontSize: '11px', color
