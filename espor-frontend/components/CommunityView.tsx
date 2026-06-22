"use client";

import { useAuth } from "./AuthProvider"; // Supabase Auth Hook'u
import { useState, useMemo } from "react";
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, MessageCircle, ShieldAlert, Sparkles, Flame, Trophy, HelpCircle, X, UserCheck } from "lucide-react";
import { GAMES } from "@/app/data/mockData";
import { useLanguage, TranslationKeys } from "./LanguageProvider"; 

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C', all: '#00D4FF' };

const MOCK_THREADS = [
  { id: 1, category: 'analytics', game: 'val', title: 'VCT EMEA Stage 2 Grand Finals Analizi: FNATIC stratejik olarak nerede hata yaptı?', author: 'TacticalMaster', avatar: 'TM', time: '2 hours ago', votes: 142, comments: 45, content: 'Ascent haritasındaki B savunmasında Viper perdelerinin zamanlaması tamamen yanlıştı. Sizce ana sebep neydi?' },
  { id: 2, category: 'transfers', game: 'lol', title: '🚨 İDDİA: G2 Esports LoL takımında alt koridor için Asya pazarından bir isimle flörtleşiyor!', author: 'RumorMill', avatar: 'RM', time: '4 hours ago', votes: 310, comments: 89, content: 'Güvenilir kaynaklardan gelen bilgilere göre kontrat süreçleri başlamış durumda. Avrupa ekosistemi için devasa bir hamle olur.' },
  { id: 3, category: 'patches', game: 'cs2', title: 'Son güncelleme sonrası subtick oranlarında ve mermi kaydolma (hitreg) sisteminde sorun yaşayan var mı?', author: 'GlobalElite99', avatar: 'GE', time: '1 day ago', votes: 85, comments: 120, content: 'Özellikle sprey atarken mermilerin gitmediği hissiyatı çok yoğun. Ping değerlerim normal olmasına rağmen bunu yaşıyorum.' },
];

export default function CommunityView() {
  const { t, translateApiText, language } = useLanguage(); 

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🚀 TIER 1 DÜZELTME: signOut eklendi!
  const { user, isLoading, signOut } = useAuth();
  const isLoggedIn = !!user; 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalReasonKey, setModalReasonKey] = useState<TranslationKeys | ''>('');

  const FORUM_CATEGORIES = [
    { id: 'all', label: t.allTopics, icon: MessageCircle },
    { id: 'transfers', label: t.transferRumors, icon: Flame },
    { id: 'analytics', label: t.tournamentAnalysis, icon: Trophy },
    { id: 'patches', label: t.patchesMeta, icon: Sparkles },
    { id: 'general', label: t.generalChat, icon: HelpCircle },
  ];

  const filteredThreads = useMemo(() => {
    return MOCK_THREADS.filter(thread => {
      const matchCategory = selectedCategory === 'all' || thread.category === selectedCategory;
      const matchSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          thread.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => b.votes - a.votes);
  }, [selectedCategory, searchQuery]);

  const handleAction = (reasonKey: TranslationKeys, callback: () => void) => {
    if (!isLoggedIn) {
      setModalReasonKey(reasonKey);
      setShowAuthModal(true);
    } else {
      callback();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full animate-fade-in relative transition-colors" style={{ background: 'var(--es-bg)' }}>
      
      <div className="shrink-0 px-8 py-6 border-b relative overflow-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>
              {t.communityHub} <MessageCircle className="w-7 h-7 text-es-cyan" />
            </h1>
            <p className="text-sm mt-1 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.communityDesc}</p>
          </div>
          <div className="w-72">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder={t.searchDiscussion} 
              className="w-full py-2.5 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan shadow-lg placeholder:text-slate-500" 
              style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex max-w-6xl w-full mx-auto p-8 gap-8">
        
        <aside className="w-64 shrink-0 flex flex-col gap-1">
          <div className="text-[10px] font-black uppercase tracking-widest px-3 mb-2 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.boards}</div>
          {FORUM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-80`}
              style={selectedCategory === cat.id ? {
                background: 'rgba(77, 124, 254, 0.1)', color: '#4D7CFE', border: '1px solid rgba(77, 124, 254, 0.2)'
              } : {
                background: 'transparent', color: 'var(--es-text-3)', border: '1px solid transparent'
              }}
            >
              <cat.icon className="w-4 h-4" style={{ color: selectedCategory === cat.id ? '#4D7CFE' : 'var(--es-text-3)' }} />
              {cat.label}
            </button>
          ))}
          
        </aside>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
          
          <div 
            onClick={() => handleAction('actionStartDiscussion', () => alert(language === 'tr' ? 'Konu açma başarılı!' : 'Thread created!'))}
            className="p-4 rounded-xl border hover:opacity-80 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
            style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}
          >
            <span className="text-sm font-semibold transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.startDiscussion}</span>
            <button className="px-5 py-2 group-hover:bg-es-cyan group-hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors border" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>{t.createBtn}</button>
          </div>

          {filteredThreads.length === 0 ? (
            <div className="text-center py-20 font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>
              {language === 'tr' ? 'Bu panoda henüz konu açılmamış' : 'No topics found in this board'}
            </div>
          ) : (
            filteredThreads.map(thread => (
              <div key={thread.id} className="rounded-xl border shadow-sm flex overflow-hidden hover:opacity-90 transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                
                <div className="w-12 border-r flex flex-col items-center pt-4 gap-1 select-none transition-colors" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                  <button 
                    onClick={() => handleAction('actionVote', () => {})} 
                    className="p-1 rounded hover:text-green-500 transition-colors" style={{ color: 'var(--es-text-3)' }}
                  >
                    <ArrowBigUp className="w-5 h-5 fill-current" />
                  </button>
                  <span className="text-xs font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{thread.votes}</span>
                  <button 
                    onClick={() => handleAction('actionVote', () => {})} 
                    className="p-1 rounded hover:text-red-500 transition-colors" style={{ color: 'var(--es-text-3)' }}
                  >
                    <ArrowBigDown className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold transition-colors" style={{ color: 'var(--es-text-3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: GAME_COLORS[thread.game] }} />
                    <span className="uppercase tracking-widest">{thread.game.toUpperCase()}</span>
                    <span>•</span>
                    <span className="font-black transition-colors" style={{ color: 'var(--es-text-1)' }}>{thread.author}</span>
                    <span>{translateApiText(thread.time)}</span>
                  </div>
                  
                  <h2 className="text-lg font-black tracking-tight leading-snug hover:text-es-cyan transition-colors cursor-pointer" style={{ color: 'var(--es-text-1)' }}>{thread.title}</h2>
                  <p className="text-xs line-clamp-2 leading-relaxed transition-colors" style={{ color: 'var(--es-text-3)' }}>{thread.content}</p>
                  
                  <div className="flex items-center gap-6 mt-2 border-t pt-3 text-xs font-bold transition-colors" style={{ borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>
                    <button 
                      onClick={() => handleAction('actionComment', () => {})} 
                      className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-1)' }}
                    >
                      <MessageSquare className="w-4 h-4" /> {thread.comments} {t.commentStr}
                    </button>
                    <button className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-1)' }}>
                      <Share2 className="w-4 h-4" /> {t.shareStr}
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="p-8 rounded-2xl border max-w-md w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-3)' }}><X className="w-5 h-5" /></button>
            
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-5 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black tracking-tight mb-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.accessDenied}</h3>
            
            <p className="text-sm mb-6 leading-relaxed transition-colors" style={{ color: 'var(--es-text-3)' }}>
              {t.authWallDesc1}
              <span className="text-es-cyan font-black">{modalReasonKey ? t[modalReasonKey] : ''}</span>
              {t.authWallDesc2}
            </p>

            <div className="flex flex-col gap-3 w-full">
              <button onClick={() => setShowAuthModal(false)} className="w-full py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-es-cyan/10">
                {t.createAccount}
              </button>
              <button onClick={() => setShowAuthModal(false)} className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border hover:opacity-80" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                {t.login}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}