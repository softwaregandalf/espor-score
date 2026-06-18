"use client";

import { useState } from "react";
import { Newspaper, Clock, ChevronRight, User, TrendingUp, Flame } from "lucide-react";

// --- STATİK VERİLER (İleride Backend'den Gelecek) ---
const GAME_COLORS: Record<string, string> = {
  lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C'
};

const CATEGORIES = [
  { label: 'Tümü', value: 'all' },
  { label: '🔥 Trendler', value: 'trending' },
  { label: 'LoL', value: 'lol' },
  { label: 'VALORANT', value: 'val' },
  { label: 'CS2', value: 'cs2' },
];

const NEWS_ITEMS = [
  { id: 1, title: "Faker T1 ile Sözleşmesini 2028'e Kadar Uzattı, 5. Dünya Şampiyonluğunu Hedefliyor", excerpt: "Efsanevi orta koridor oyuncusu, onu 2028 sezonuna kadar T1'de tutacak bir sözleşme uzatması imzaladı.", category: "LoL", game: "lol", time: "2 saat önce", author: "James Chen", readTime: "3 dk okuma" },
  { id: 2, title: "Sentinels, VCT Masters Shanghai Büyük Finalinde FNATIC'i Mağlup Etti", excerpt: "VALORANT tarihinin en dramatik finallerinden birinde SEN, 1-2'lik harita açığını kapatarak seriyi 3-2 kazandı.", category: "VAL", game: "val", time: "4 saat önce", author: "Sarah Kim", readTime: "5 dk okuma" },
  { id: 3, title: "s1mple Yeni Süper Takımıyla Rekabetçi Sahneye Geri Dönüyor", excerpt: "Ukraynalı süperstar, 18 aylık bir aranın ardından IEM Dallas'ta mücadele etmeye hazırlanıyor.", category: "CS2", game: "cs2", time: "5 saat önce", author: "Marcus Weber", readTime: "4 dk okuma" },
  { id: 4, title: "Dota 2 Yama 8.0 Eşya Sistemine Devasa Değişiklikler Getiriyor", category: "DOTA", game: "dota2", time: "1 gün önce", author: "Chris Park" },
  { id: 5, title: "BLAST Premier Sonbahar 2026 Sezonu İçin İki Yeni CS2 Takımı Ekliyor", category: "CS2", game: "cs2", time: "2 gün önce", author: "Erik Hansen" },
  { id: 6, title: "Riot Games, VALORANT'ın Yeni Kontrol Uzmanı Ajanını Tanıttı", category: "VAL", game: "val", time: "3 gün önce", author: "Ana Torres" },
];

export default function NewsView() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = NEWS_ITEMS.filter(n => {
    if (activeCategory === 'all' || activeCategory === 'trending') return true;
    return n.game === activeCategory;
  });

  const featuredNews = filtered[0];
  const sideNews = filtered.slice(1, 4);
  const listNews = filtered.slice(4);

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto animate-fade-in">
      {/* Üst Başlık */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <Newspaper className="w-6 h-6" style={{ color: 'var(--es-blue)' }} />
            E-Spor Haberleri
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--es-text-3)' }}>
            E-spor dünyasından son dakika haberleri, analizler ve güncellemeler
          </p>
        </div>
      </div>

      {/* Kategori Filtresi */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={activeCategory === value ? {
              background: 'rgba(77, 124, 254, 0.2)', color: '#4D7CFE', border: '1px solid rgba(77, 124, 254, 0.3)'
            } : {
              background: 'var(--es-card)', color: 'var(--es-text-3)', border: '1px solid var(--es-border)'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Öne Çıkan ve Yan Haberler */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {/* Ana Öne Çıkan Haber */}
        {featuredNews && (
          <div className="lg:col-span-2 rounded-2xl overflow-hidden cursor-pointer group transition-all hover:brightness-110" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
            <div className="relative h-64 overflow-hidden" style={{ background: `linear-gradient(135deg, ${GAME_COLORS[featuredNews.game]}30, var(--es-surface))` }}>
              <div className="absolute inset-0 cyber-grid opacity-20" />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Günün Haberi</span>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider" style={{ background: `${GAME_COLORS[featuredNews.game]}30`, color: GAME_COLORS[featuredNews.game], border: `1px solid ${GAME_COLORS[featuredNews.game]}40` }}>
                  {featuredNews.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors leading-tight mb-3">
                {featuredNews.title}
              </h3>
              {'excerpt' in featuredNews && (
                <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: 'var(--es-text-2)' }}>
                  {featuredNews.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-medium" style={{ color: 'var(--es-text-3)' }}>
                  <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /><span>{featuredNews.author || 'Editör'}</span></div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /><span>{featuredNews.time}</span></div>
                  {'readTime' in featuredNews && <span>• {featuredNews.readTime}</span>}
                </div>
                <button className="flex items-center gap-1 text-xs font-bold transition-colors" style={{ color: 'var(--es-blue)' }}>
                  Devamını Oku <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Yan Haberler */}
        <div className="flex flex-col gap-4">
          {sideNews.map((news) => (
            <div key={news.id} className="flex-1 rounded-xl overflow-hidden cursor-pointer group transition-all hover:brightness-110" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <div className="flex gap-4 p-4 h-full items-center">
                <div className="w-20 h-20 rounded-lg shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${GAME_COLORS[news.game]}25, var(--es-surface))` }}>
                  <div className="absolute inset-0 cyber-grid opacity-20" />
                </div>
                <div className="flex flex-col justify-center gap-1.5 min-w-0">
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: GAME_COLORS[news.game] }}>{news.category}</span>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors leading-tight line-clamp-3">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] mt-1" style={{ color: 'var(--es-text-3)' }}>
                    <Clock className="w-3 h-3" /> {news.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diğer Haberler Listesi */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4" style={{ color: 'var(--es-text-3)' }} />
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Daha Fazla Haber</h3>
        </div>
        <div className="flex flex-col gap-3">
          {listNews.map((news, i) => (
            <div key={news.id || i} className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all hover:brightness-110 group" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <span className="text-sm font-black w-6 shrink-0 score-display" style={{ color: 'var(--es-text-3)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="w-12 h-12 rounded-lg shrink-0 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${GAME_COLORS[news.game]}20, var(--es-surface))` }}>
                <div className="absolute inset-0 cyber-grid opacity-20" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider mb-1 block" style={{ color: GAME_COLORS[news.game] }}>{news.category}</span>
                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors leading-tight truncate">
                  {news.title}
                </h4>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 hidden sm:flex">
                <span className="text-xs font-medium" style={{ color: 'var(--es-text-3)' }}>{news.time}</span>
                {news.author && <span className="text-[10px]" style={{ color: 'var(--es-text-3)' }}>{news.author}</span>}
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--es-blue)' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}