// Добавь это в начало компонента Index
const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

// Внутри useEffect или fetchPosts добавь:
const getRelated = (allPosts: any[]) => {
  return [...allPosts].sort(() => 0.5 - Math.random()).slice(0, 3);
};

// ... Внутри return (Index.tsx)

{/* МОДАЛЬНОЕ ОКНО С SEO И ПЕРЕЛИНКОВКОЙ */}
{selectedPost && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 overflow-y-auto">
    <div className="relative bg-[#1a1d24] max-w-4xl w-full my-auto border border-white/10 shadow-2xl rounded-sm">
      <button onClick={() => setSelectedPost(null)} className="absolute -top-10 right-0 text-white flex items-center gap-2 font-black uppercase text-xs">
        ЗАКРЫТЬ <X size={20} />
      </button>
      
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/3 p-6 md:p-10 border-r border-white/5">
          <img src={selectedPost.image_url} className="w-full h-64 object-cover mb-8 rounded-sm" alt={selectedPost.title} />
          <h2 className="text-3xl font-black uppercase italic mb-6 leading-none text-red-500">{selectedPost.title}</h2>
          <div className="text-gray-300 text-lg leading-relaxed space-y-4 mb-10">
            {selectedPost.excerpt.split('. ').map((sent, i) => (
              <p key={i}>{sent}.</p>
            ))}
          </div>
          <a href="https://betsxwin.pro/click?o=5&a=49439&link_id=20&sub_id3=tg" target="_blank" className="block w-full bg-[#ff5c00] text-black text-center py-5 font-black uppercase italic text-2xl hover:scale-[1.02] transition-transform">
            ЗАБРАТЬ ФРИБЕТ 3000₽ В WINLINE
          </a>
        </div>

        {/* БЛОК ПОХОЖИЕ (ПЕРЕЛИНКОВКА ДЛЯ SEO) */}
        <div className="md:w-1/3 p-6 bg-black/20">
          <h3 className="font-black uppercase text-xs tracking-widest mb-6 text-gray-500 italic">Читайте также:</h3>
          <div className="space-y-8">
            {posts.slice(0, 3).map(p => (
              <div key={p.id} onClick={() => setSelectedPost(p)} className="cursor-pointer group">
                <img src={p.image_url} className="w-full h-24 object-cover mb-2 opacity-60 group-hover:opacity-100 transition-opacity" />
                <h4 className="text-[11px] font-black uppercase italic leading-tight group-hover:text-red-500 transition-colors">{p.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)}
