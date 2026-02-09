import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fn = async () => {
      const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(6);
      if (data) setNews(data);
    };
    fn();
  }, []);

  // Выносим стили, чтобы не перегружать JSX
  const s: any = {
    bg: { backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' },
    hdr: { borderBottom: '1px solid #1a1a1a', padding: '20px', textAlign: 'center', backgroundColor: '#000' },
    main: { maxWidth: '1000px', margin: '0 auto', padding: '20px' },
    live: { background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', marginBottom: '20px' },
    vip: { background: '#000', border: '1px solid #FDB931', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '30px' },
    grid: { display: 'flex', flexWrap: 'wrap', gap: '20px' },
    card: { flex: '1 1 300px', background: '#0f0f0f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' },
    foot: { background: '#000', borderTop: '1px solid #1a1a1a', padding: '40px 20px', marginTop: '50px' }
  };

  return (
    <div style={s.bg}>
      <header style={s.hdr}>
        <div style={{ fontSize: '22px', fontWeight: '900' }}>SPOOORT<span style={{ color: '#ea384c' }}>NEWS</span></div>
      </header>

      <main style={s.main}>
        {/* LIVE */}
        <div style={s.live}>
          <div style={{ color: '#ea384c', fontSize: '10px', fontWeight: 'bold', marginBottom: '10px' }}>● LIVE СЧЕТ</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
            <span>Манчестер Сити</span> <span style={{ color: '#FDB931' }}>2 : 1</span> <span>Арсенал</span>
          </div>
        </div>

        {/* VIP */}
        <div style={s.vip}>
          <div style={{ color: '#FDB931', fontSize: '1
