// src/App.tsx
import React, { useState } from 'react';

interface Prediction {
  id: number;
  sport: string;
  home: string;
  homeLogo: string;
  away: string;
  awayLogo: string;
  prediction: string;
  date: string;
  time: string;
  coeff?: string;
}

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const predictions: Prediction[] = [
    {
      id: 1,
      sport: 'football',
      home: 'Atleti',
      homeLogo: '🔴',
      away: 'Club Brugge',
      awayLogo: '🔵',
      prediction: 'Обе забьют',
      date: '24 февраля 2026 г.',
      time: '00:36',
    },
    {
      id: 2,
      sport: 'football',
      home: 'Bristol City',
      homeLogo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      away: 'Wrexham',
      awayLogo: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      prediction: 'Обе забьют',
      date: '17 февраля 2026 г.',
      time: '20:51',
    },
    {
      id: 3,
      sport: 'football',
      home: 'Monaco',
      homeLogo: '🇲🇨',
      away: 'PSG',
      awayLogo: '🇫🇷',
      prediction: 'Тотал больше 2.5',
      date: '17 февраля 2026 г.',
      time: '19:58',
      coeff: '1.74',
    },
    {
      id: 4,
      sport: 'esports',
      home: 'Fuego',
      homeLogo: '🔥',
      away: 'Chivas Esports',
      awayLogo: '🌶️',
      prediction: 'Fuego победит',
      date: '17 февраля 2026 г.',
      time: '02:02',
    },
    {
      id: 5,
      sport: 'esports',
      home: 'VP.Prodigy',
      homeLogo: '🟣',
      away: 'CSDIILIT',
      awayLogo: '🔵',
      prediction: 'VP.Prodigy +1.5',
      date: '17 февраля 2026 г.',
      time: '02:02',
    },
    {
      id: 6,
      sport: 'esports',
      home: 'Time Waves',
      homeLogo: '🌊',
      away: 'BBBMBCBS',
      awayLogo: '🔴',
      prediction: 'Time Waves победит',
      date: '17 февраля 2026 г.',
      time: '02:02',
    },
    {
      id: 7,
      sport: 'football',
      home: 'LAZER',
      homeLogo: '⚽',
      away: 'LYON',
      awayLogo: '🇫🇷',
      prediction: 'Победа LAZER',
      date: '17 февраля 2026 г.',
      time: '03:00',
    },
  ];

  const filteredPredictions = predictions.filter((p) => {
    const matchesSearch =
      p.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prediction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || p.sport === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const aboutCards = [
    {
      icon: '🤖',
      title: 'Нейросеть',
      desc: 'Прогнозы генерируются мощной ИИ-моделью, которая анализирует тысячи статистических показателей в реальном времени.',
    },
    {
      icon: '⚡',
      title: 'Скорость',
      desc: 'Обновление каждые 4 часа. Только самые актуальные матчи с реальными коэффициентами.',
    },
    {
      icon: '🏆',
      title: 'Все виды спорта',
      desc: 'Футбол, хоккей, баскетбол, теннис, CS2 и другие дисциплины — всё в одном месте.',
    },
    {
      icon: '💰',
      title: 'Бесплатно и удобно',
      desc: 'Никакой регистрации. Просто, красиво, доступно каждому. Revshare 20% для партнёров.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* 1. НАШ КОМПАКТНЫЙ ЛОГОТИП (красная S) */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center border-2 border-red-500/60 shadow-2xl overflow-hidden">
              <span className="text-[42px] font-black text-red-500 tracking-[-6px] leading-none">S</span>
            </div>
            <div className="leading-none">
              <div className="text-3xl font-black tracking-tighter">spooort</div>
              <div className="text-[10px] text-zinc-500 -mt-1">.ru</div>
            </div>
          </div>

          {/* 2. ПОИСК + МАЛЕНЬКАЯ ЛУПА */}
          <div className="flex-1 max-w-xl mx-8 relative group">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск прогноза..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-red-500 rounded-3xl py-3.5 pl-14 pr-6 text-base placeholder:text-zinc-500 focus:outline-none transition"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-red-500 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 01-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 3. ПРАВЫЙ БЛОК (иконка пользователя + кнопка) */}
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center cursor-pointer transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9-5.197V8.5m.002 3.5L12 15l-3 3" />
              </svg>
            </div>
            <div className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center cursor-pointer transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7" />
              </svg>
            </div>
            <button className="bg-red-600 hover:bg-red-700 px-8 py-2.5 rounded-3xl text-sm font-semibold transition">
              Войти
            </button>
          </div>
        </div>

        {/* ФИЛЬТРЫ */}
        <div className="max-w-7xl mx-auto px-6 pb-6 flex gap-3 flex-wrap">
          {[
            { key: 'all', label: 'Все' },
            { key: 'football', label: '⚽ Футбол' },
            { key: 'esports', label: '🎮 Киберспорт' },
            { key: 'hockey', label: '🏒 Хоккей' },
            { key: 'basketball', label: '🏀 Баскетбол' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-6 py-2 rounded-3xl text-sm font-medium transition ${
                activeFilter === f.key
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        <h1 className="text-center text-6xl font-black tracking-tighter mb-16">
          СВЕЖИЕ ПРОГНОЗЫ
        </h1>

        {/* СЕТКА ПРОГНОЗОВ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPredictions.map((p) => (
            <div
              key={p.id}
              className="group bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-red-500/50 transition-all hover:-translate-y-1"
            >
              <div className="p-7">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl">
                      {p.homeLogo}
                    </div>
                    <div className="font-bold text-2xl tracking-tight">{p.home}</div>
                  </div>

                  <div className="text-red-600 font-black text-4xl">VS</div>

                  <div className="flex items-center gap-4 flex-row-reverse">
                    <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-3xl">
                      {p.awayLogo}
                    </div>
                    <div className="font-bold text-2xl tracking-tight text-right">{p.away}</div>
                  </div>
                </div>

                <div className="bg-black/60 rounded-2xl p-6 text-center border border-zinc-700/50">
                  <div className="uppercase text-red-400 text-xs tracking-widest mb-2">НАШ ПРОГНОЗ</div>
                  <div className="text-3xl font-bold mb-1">{p.prediction}</div>
                  {p.coeff && (
                    <div className="text-emerald-400 text-2xl font-semibold">@{p.coeff}</div>
                  )}
                </div>
              </div>

              <div className="border-t border-zinc-800 bg-zinc-950 px-7 py-4 flex justify-between text-sm text-zinc-400">
                <div>{p.date}</div>
                <div className="font-mono">в {p.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* === РАЗДЕЛ О НАС (квадратики как у Lovable) === */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-block bg-zinc-900 text-red-400 text-sm px-8 py-2 rounded-3xl mb-4 border border-red-500/20">
              О НАС
            </div>
            <h2 className="text-5xl font-black tracking-tighter mb-4">
              spooort.ru — прогнозы от нейросети
            </h2>
            <p className="max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed">
              Современный спортивный портал с прогнозами от нейросети. Мы анализируем футбольные, хоккейные, баскетбольные и киберспортивные матчи, чтобы дать пользователям актуальные и точные прогнозы. Всё просто, удобно и доступно каждому.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {aboutCards.map((card, index) => (
              <div
                key={index}
                className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 hover:border-red-500/40 transition-all group hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-5xl mb-8 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">{card.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
          © 2026 spooort.ru • Все прогнозы — для развлечения • Revshare 20% навсегда
        </div>
      </footer>
    </div>
  );
};

export default App;
