import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function getNews() {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(8);
      if (data) setNews(data);
    }
    getNews();
  }, []);

  return (
    <div style={{ backgroundColor: '#0a0a0a', color: '#ffffff', minHeight: '100vh', fontFamily: '-apple-system, system-ui, sans-serif' }}>
      
      {/* HEADER — Премиальный темный */}
      <header style={{ borderBottom: '1px solid #1a1a1a', padding: '20px', backgroundColor: '#000', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
            SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span>
          </div>
          <div style={{ display: 'flex', gap: '25px', fontSize: '12px', fontWeight: '700', color: '#888', letterSpacing: '1px' }}>
            <span style={{ cursor: 'pointer' }}>ФУТБОЛ</span>
            <span style={{ color: '#ea384c', cursor: 'pointer' }}>LIVE</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* ВЕРХНЯЯ ПАНЕЛЬ: LIVE И VIP */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          
          {/* LIVE блок — Глубокий серый */}
          <div style={{ background: '#161616', padding: '25px', borderRadius: '20px', border: '1px solid #222' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ width: '8px', height: '8px', background: '#ea384c', borderRadius: '50%', boxShadow: '0 0 10px #ea384c' }}></div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#ea384c', letterSpacing: '1px' }}>LIVE РЕЗУЛЬТАТЫ</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>Ливерпуль</span>
              <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff', background: '#000', padding: '5px 15px', borderRadius: '10px' }}>2 : 1</span>
              <span style={{ fontSize: '16px', fontWeight: '600', textAlign: 'right' }}>Арсенал</span>
            </div>
          </div>

          {/* VIP блок — Золотой на черном */}
          <div style={{ background
