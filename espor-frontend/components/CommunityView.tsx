"use client";

import Link from "next/link"; // 🚀 TIER 1 DÜZELTME: Link Eklendi
import { useAuth } from "./AuthProvider"; 
import { useState, useMemo, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, MessageCircle, ShieldAlert, Sparkles, Flame, Trophy, HelpCircle, X, Loader2 } from "lucide-react"; 
import { GAMES } from "@/app/data/mockData";
import { useLanguage, TranslationKeys } from "./LanguageProvider"; 
import AuthModal from "./AuthModal";

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C', all: '#00D4FF' };

export default function CommunityView() {
  const router = useRouter(); 
  const { t, translateApiText, language } = useLanguage(); 

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth(); 
  const isLoggedIn = !!user; 
  
  const [showAuthModal, setShowAuthModal] = useState(false); 
  const [showRealAuthModal, setShowRealAuthModal] = useState(false); 
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login'); 
  const [modalReasonKey, setModalReasonKey] = useState<TranslationKeys | ''>('');

  const [threads, setThreads] = useState<any[]>([]);
  const [isThreadsLoading, setIsThreadsLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('general');
  const [newThreadGame, setNewThreadGame] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const FORUM_CATEGORIES = [
    { id: 'all', label: t.allTopics, icon: MessageCircle },
    { id: 'transfers', label: t.transferRumors, icon: Flame },
    { id: 'analytics', label: t.tournamentAnalysis, icon: Trophy },
    { id: 'patches', label: t.patchesMeta, icon: Sparkles },
    { id: 'general', label: t.generalChat, icon: HelpCircle },
  ];

  const fetchThreads = async () => {
    setIsThreadsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/community');
      const json = await res.json();
      if (json.success) {
        setThreads(json.data);
      }
    } catch (error) {
      console.error("Topluluk verileri çekilemedi:", error);
    } finally {
      setIsThreadsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newThreadTitle,
          content: newThreadContent,
          category: newThreadCategory,
          gameSlug: newThreadGame,
          authorId: user.id
        })
      });
      
      const json = await res.json();
      if (json.success) {
        setShowCreateModal(false);
        setNewThreadTitle('');
        setNewThreadContent('');
        setNewThreadCategory('general');
        setNewThreadGame('all');
        fetchThreads(); 
      }
    } catch (error) {
      console.error("Konu oluşturulamadı:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (threadId: number, value: number) => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:5000/api/community/${threadId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, value })
      });
      if (res.ok) {
        fetchThreads(); 
      }
    } catch (error) {
      console.error("Oy işlemi başarısız:", error);
    }
  };

  const filteredThreads = useMemo(() => {
    return threads.filter(thread => {
      const matchCategory = selectedCategory === 'all' || thread.category === selectedCategory;
      const matchSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          thread.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }).sort((a, b) => b.upvotes - a.upvotes); 
  }, [selectedCategory, searchQuery, threads]);

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
            onClick={() => handleAction('actionStartDiscussion', () => setShowCreateModal(true))}
            className="p-4 rounded-xl border hover:opacity-80 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
            style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}
          >
            <span className="text-sm font-semibold transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.startDiscussion}</span>
            <button className="px-5 py-2 group-hover:bg-es-cyan group-hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors border" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>{t.createBtn}</button>
          </div>

          {isThreadsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-es-cyan" />
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-20 font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>
              {language === 'tr' ? 'Bu panoda henüz konu açılmamış' : 'No topics found in this board'}
            </div>
          ) : (
            filteredThreads.map(thread => (
              <div key={thread.id} className="rounded-xl border shadow-sm flex overflow-hidden hover:opacity-90 transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                
                <div className="w-12 border-r flex flex-col items-center pt-4 gap-1 select-none transition-colors" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                  <button 
                    onClick={() => handleAction('actionVote', () => handleVote(thread.id, 1))} 
                    className="p-1 rounded hover:text-green-500 transition-colors" style={{ color: 'var(--es-text-3)' }}
                    title={language === 'tr' ? 'Yukarı Oy' : 'Upvote'}
                  >
                    <ArrowBigUp className="w-5 h-5 fill-current" />
                  </button>
                  <span className="text-xs font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{thread.upvotes}</span>
                  <button 
                    onClick={() => handleAction('actionVote', () => handleVote(thread.id, -1))} 
                    className="p-1 rounded hover:text-red-500 transition-colors" style={{ color: 'var(--es-text-3)' }}
                    title={language === 'tr' ? 'Aşağı Oy' : 'Downvote'}
                  >
                    <ArrowBigDown className="w-5 h-5 fill-current" />
                  </button>
                </div>

                <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] font-bold transition-colors" style={{ color: 'var(--es-text-3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: GAME_COLORS[thread.gameSlug] || GAME_COLORS.all }} />
                    <span className="uppercase tracking-widest">{thread.gameSlug.toUpperCase()}</span>
                    <span>•</span>
                    <span className="font-black transition-colors" style={{ color: 'var(--es-text-1)' }}>{thread.author?.nickname || 'Unknown'}</span>
                    <span>{translateApiText(thread.timeAgo)}</span>
                  </div>
                  
                  {/* 🚀 TIER 1 DÜZELTME: Konu başlığı Next.js Link yapısıyla sarıldı */}
                  <Link href={`/community/${thread.id}`} className="block">
                    <h2 className="text-lg font-black tracking-tight leading-snug hover:text-es-cyan transition-colors cursor-pointer" style={{ color: 'var(--es-text-1)' }}>
                      {thread.title}
                    </h2>
                  </Link>
                  <p className="text-xs line-clamp-2 leading-relaxed transition-colors" style={{ color: 'var(--es-text-3)' }}>{thread.content}</p>
                  
                  <div className="flex items-center gap-6 mt-2 border-t pt-3 text-xs font-bold transition-colors" style={{ borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>
                    {/* 🚀 TIER 1 DÜZELTME: Yorum butonuna e.preventDefault eklendi */}
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAction('actionComment', () => router.push(`/community/${thread.id}`));
                      }} 
                      className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-1)' }}
                    >
                      <MessageSquare className="w-4 h-4" /> {thread.commentCount} {(t as any).comment || 'Yorum'}
                    </button>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/community/${thread.id}`);
                        alert(language === 'tr' ? 'Konu bağlantısı kopyalandı!' : 'Thread link copied!');
                      }}
                      className="flex items-center gap-2 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-1)' }}
                    >
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
              <button onClick={() => { setShowAuthModal(false); setAuthMode('register'); setShowRealAuthModal(true); }} className="w-full py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-es-cyan/10">
                {t.createAccount}
              </button>
              <button onClick={() => { setShowAuthModal(false); setAuthMode('login'); setShowRealAuthModal(true); }} className="w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border hover:opacity-80" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                {t.login}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="p-8 rounded-2xl border max-w-2xl w-full shadow-2xl relative overflow-hidden flex flex-col transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-3)' }}><X className="w-5 h-5" /></button>

            <h3 className="text-xl font-black tracking-tight mb-6 transition-colors" style={{ color: 'var(--es-text-1)' }}>
              {language === 'tr' ? 'Yeni Konu Aç' : 'Start a New Discussion'}
            </h3>

            <form onSubmit={handleCreateThread} className="flex flex-col gap-4 relative z-10">
              <input
                type="text"
                required
                value={newThreadTitle}
                onChange={e => setNewThreadTitle(e.target.value)}
                placeholder={language === 'tr' ? 'Konu Başlığı' : 'Thread Title'}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border shadow-inner"
                style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
              />

              <div className="flex gap-4">
                <select
                  value={newThreadCategory}
                  onChange={e => setNewThreadCategory(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border cursor-pointer"
                  style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
                >
                  {FORUM_CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>

                <select
                  value={newThreadGame}
                  onChange={e => setNewThreadGame(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border cursor-pointer"
                  style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
                >
                  <option value="all">{language === 'tr' ? 'Genel (Tümü)' : 'General (All)'}</option>
                  {GAMES.map(game => (
                    <option key={game.id} value={game.id}>{game.name}</option>
                  ))}
                </select>
              </div>

              <textarea
                required
                value={newThreadContent}
                onChange={e => setNewThreadContent(e.target.value)}
                placeholder={language === 'tr' ? 'Ne düşünüyorsun?' : 'What are your thoughts?'}
                className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border min-h-[150px] resize-y shadow-inner custom-scrollbar"
                style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
              />

              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:opacity-80"
                  style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}
                >
                  {language === 'tr' ? 'İptal' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-[2] py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-es-cyan/20 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'tr' ? 'Gönder' : 'Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AuthModal isOpen={showRealAuthModal} onClose={() => setShowRealAuthModal(false)} initialMode={authMode} />
    </div>
  );
}