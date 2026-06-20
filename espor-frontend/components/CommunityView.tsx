"use client";

import { useState, useMemo } from "react";
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, MessageCircle, ShieldAlert, Sparkles, Flame, Trophy, HelpCircle, X, UserCheck } from "lucide-react";
import { GAMES } from "@/app/data/mockData";

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C', all: '#00D4FF' };

// --- 🟢 API SİMÜLASYONU (Forum Konuları ve Kategoriler) ---
const FORUM_CATEGORIES = [
  { id: 'all', label: 'Tüm Konular', icon: MessageCircle },
  { id: 'transfers', label: 'Transfer Dedikoduları', icon: Flame },
  { id: 'analytics', label: 'Turnuva Analizleri', icon: Trophy },
  { id: 'patches', label: 'Oyun Yamaları & Meta', icon: Sparkles },
  { id: 'general', label: 'Genel Sohbet', icon: HelpCircle },
];

const MOCK_THREADS = [
  { id: 1, category: 'analytics', game: 'val', title: 'VCT EMEA Stage 2 Grand Finals Analizi: FNATIC stratejik olarak nerede hata yaptı?', author: 'TacticalMaster', avatar: 'TM', time: '2 saat önce', votes: 142, comments: 45, content: 'Ascent haritasındaki B savunmasında Viper perdelerinin zamanlaması tamamen yanlıştı. Sizce ana sebep neydi?' },
  { id: 2, category: 'transfers', game: 'lol', title: '🚨 İDDİA: G2 Esports LoL takımında alt koridor için Asya pazarından bir isimle flörtleşiyor!', author: 'RumorMill', avatar: 'RM', time: '4 saat önce', votes: 310, comments: 89, content: 'Güvenilir kaynaklardan gelen bilgilere göre kontrat süreçleri başlamış durumda. Avrupa ekosistemi için devasa bir hamle olur.' },
  { id: 3, category: 'patches', game: 'cs2', title: 'Son güncelleme sonrası subtick oranlarında ve mermi kaydolma (hitreg) sisteminde sorun yaşayan var mı?', author: 'GlobalElite99', avatar: 'GE', time: '1 gün önce', votes: 85, comments: 120, content: 'Özellikle sprey atarken mermilerin gitmediği hissiyatı çok yoğun. Ping değerlerim normal olmasına rağmen bunu yaşıyorum.' },
];

export default function CommunityView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🔐 ÜYELİK KONTROL STATE'LERİ
  // Şu an üyelik sistemi açılmadığı için varsayılan olarak 'false' (giriş yapılmamış) kabul ediyoruz.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalReason, setModalReason] = useState('');

  // Filtreleme Algoritması
  const filteredThreads = useMemo(() => {
    return MOCK_THREADS.filter(thread => {
      const matchCategory = selectedCategory === 'all' || thread.category === selectedCategory;
      const matchSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          thread.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => b.votes - a.votes);
  }, [selectedCategory, searchQuery]);

  // 🛡️ Aksiyon Öncesi Üyelik Kontrol Fonksiyonu (Gatekeeper)
  const handleAction = (actionName: string, callback: () => void) => {
    if (!isLoggedIn) {
      setModalReason(actionName);
      setShowAuthModal(true);
    } else {
      callback();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-es-bg animate-fade-in relative">
      
      {/* 🌟 ÜST BAŞLIK VE ARAMA */}
      <div className="shrink-0 px-8 py-6 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              Merkez Topluluk <MessageCircle className="w-7 h-7 text-es-cyan" />
            </h1>
            <p className="text-sm text-slate-400 mt-1">Fikirlerini paylaş, tartışmalara katıl ve espor ekosistemini yönlendir.</p>
          </div>
          <div className="w-72">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Tartışma veya başlık ara..." 
              className="w-full py-2.5 px-4 rounded-xl text-sm outline-none transition-all bg-slate-900 border border-slate-700 text-white focus:border-es-cyan shadow-lg" 
            />
          </div>
        </div>
      </div>

      {/* 🚀 FORUM ALANI (Sol Kategoriler, Orta Başlıklar) */}
      <div className="flex-1 overflow-hidden flex max-w-6xl w-full mx-auto p-8 gap-8">
        
        {/* SOL SÜTUN: KATEGORİ SEÇİCİ */}
        <aside className="w-64 shrink-0 flex flex-col gap-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 mb-2">Panolar</div>
          {FORUM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <cat.icon className="w-4 h-4" style={{ color: selectedCategory === cat.id ? 'var(--es-cyan)' : 'var(--es-text-3)' }} />
              {cat.label}
            </button>
          ))}
          
          {/* Geliştirici için hızlı Test Butonu */}
          <div className="mt-auto p-4 bg-slate-900/50 rounded-xl border border-white/5 flex flex-col gap-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase">Simülasyon Modu</span>
            <button 
              onClick={() => setIsLoggedIn(!isLoggedIn)} 
              className={`w-full py-2 rounded text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${isLoggedIn ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}
            >
              <UserCheck className="w-3.5 h-3.5" /> {isLoggedIn ? 'Giriş Yapıldı' : 'Ziyaretçi Modu'}
            </button>
          </div>
        </aside>

        {/* ORTA SÜTUN: THREAD AKIŞI */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
          
          {/* Yeni Konu Açma Paneli (Kilit Entegreli) */}
          <div 
            onClick={() => handleAction('yeni bir tartışma konusu açmak', () => alert('Konu açma başarılı!'))}
            className="bg-slate-900/40 p-4 rounded-xl border border-white/5 hover:border-es-cyan/30 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
          >
            <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">Yeni bir tartışma konusu başlat veya soru sor...</span>
            <button className="px-5 py-2 bg-slate-800 group-hover:bg-es-cyan group-hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">Oluştur</button>
          </div>

          {/* Konu Listesi */}
          {filteredThreads.length === 0 ? (
            <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest">Bu panoda henüz konu açılmamış</div>
          ) : (
            filteredThreads.map(thread => (
              <div key={thread.id} className="bg-es-bg-2 rounded-xl border border-white/5 shadow-sm flex overflow-hidden hover:border-white/10 transition-colors">
                
                {/* 1. OYLAMA PANELİ (Reddit Style) */}
                <div className="w-12 bg-slate-900/30 border-r border-white/5 flex flex-col items-center pt-4 gap-1 select-none">
                  <button 
                    onClick={() => handleAction('bu konuyu oylamak', () => {})} 
                    className="p-1 rounded text-slate-500 hover:text-green-400 hover:bg-white/5 transition-colors"
                  >
                    <ArrowBigUp className="w-5 h-5 fill-current" />
                  </button>
                  <span className="text-xs font-black text-white tabular-nums">{thread.votes}</span>
                  <button 
                    onClick={() => handleAction('bu konuyu oylamak', () => {})} 
                    className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <ArrowBigDown className="w-5 h-5 fill-current" />
                  </button>
                </div>

                {/* 2. İÇERİK PANELİ */}
                <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: GAME_COLORS[thread.game] }} />
                    <span className="text-slate-400 uppercase tracking-widest">{thread.game.toUpperCase()}</span>
                    <span>•</span>
                    <span className="text-white font-black">{thread.author}</span>
                    <span>{thread.time}</span>
                  </div>
                  
                  <h2 className="text-lg font-black text-white tracking-tight leading-snug hover:text-es-cyan transition-colors cursor-pointer">{thread.title}</h2>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{thread.content}</p>
                  
                  {/* Etkileşim Barı */}
                  <div className="flex items-center gap-6 mt-2 border-t border-white/5 pt-3 text-slate-500 text-xs font-bold">
                    <button 
                      onClick={() => handleAction('yorumları görmek ve cevap yazmak', () => {})} 
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" /> {thread.comments} Yorum
                    </button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors">
                      <Share2 className="w-4 h-4" /> Paylaş
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {/* 🛡️ ULTRA MODERN ÜYELİK DUVARI MODALİ (AUTH WALL) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-gradient-to-b from-slate-900 to-black p-8 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-5 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white tracking-tight mb-2">Erişim Engellendi</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Sitede <span className="text-es-cyan font-black">{modalReason}</span> için bir Nexus Pro hesabına sahip olmanız gerekmektedir. Ücretsiz üye olarak tüm platform özelliklerini aktif edebilirsiniz.
            </p>

            <div className="flex flex-col gap-3 w-full">
              {/* Giriş ve Kayıt aksiyonları bir sonraki adımda buralara yönlenecek */}
              <button onClick={() => setShowAuthModal(false)} className="w-full py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-es-cyan/10">Hesap Oluştur</button>
              <button onClick={() => setShowAuthModal(false)} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-widest transition-all border border-slate-700">Giriş Yap</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}