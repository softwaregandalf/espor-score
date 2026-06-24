"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider"; 
import { useState, useMemo, useEffect } from "react"; 
import { useRouter } from "next/navigation"; 
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, MessageCircle, ShieldAlert, Sparkles, Flame, Trophy, HelpCircle, X, Loader2, Trash2 } from "lucide-react"; 
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

  // 🚀 TIER 1 DÜZELTME: Silme işlemi için durum yöneticisi
  const [threadToDelete, setThreadToDelete] = useState<number | null>(null);

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

  // 🚀 TIER 1 DÜZELTME: Doğrudan pop-up onayı ile silme
  const executeDeleteThread = async () => {
    if (!threadToDelete) return;
    try {
      const res = await fetch(`http://localhost:5000/api/community/${threadToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });
      const json = await res.json();
      if (json.success) {
        setThreadToDelete(null); // Modalı kapat
        fetchThreads(); // Listeyi yenile
      } else {
        alert(json.message);
      }
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
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
    <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden min-w-0 animate-fade-in relative transition-colors" style={{ background: 'var(--es-bg)' }}>
      
      <div className="shrink-0 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 border-b relative overflow-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
              <span className="truncate min-w-0">{t.communityHub}</span>
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-es-cyan shrink-0" />
            </h1>
            <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 transition-colors line-clamp-2 md:line-clamp-none whitespace-normal" style={{ color: 'var(--es-text-3)' }}>{t.communityDesc}</p>
          </div>
          <div className="w-full md:w-72 shrink-0 min-w-0">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder={t.searchDiscussion} 
              className="w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm outline-none transition-all focus:border-es-cyan shadow-lg placeholder:text-slate-500" 
              style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row max-w-6xl w-full mx-auto p-3 sm:p-4 md:p-8 gap-4 md:gap-6 lg:gap-8 min-w-0">
        
        <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-1 min-w-0">
          <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-1 sm:px-3 mb-1.5 sm:mb-2 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.boards}</div>
          <div className="flex lg:flex-col gap-1.5 overflow-x-auto scrollbar-hide lg:overflow-visible whitespace-nowrap lg:whitespace-normal pr-4 lg:pr-0 pb-1 lg:pb-0 -mr-1 lg:mr-0">
          {FORUM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 lg:shrink lg:w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all hover:opacity-80`}
              style={selectedCategory === cat.id ? {
                background: 'rgba(77, 124, 254, 0.1)', color: '#4D7CFE', border: '1px solid rgba(77, 124, 254, 0.2)'
              } : {
                background: 'transparent', color: 'var(--es-text-3)', border: '1px solid transparent'
              }}
            >
              <cat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: selectedCategory === cat.id ? '#4D7CFE' : 'var(--es-text-3)' }} />
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar lg:pr-2 flex flex-col gap-3 sm:gap-4 min-w-0">
          
          <div 
            onClick={() => handleAction('actionStartDiscussion', () => setShowCreateModal(true))}
            className="p-3 sm:p-4 rounded-xl border hover:opacity-80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 group shadow-sm min-w-0"
            style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}
          >
            <span className="text-xs sm:text-sm font-semibold transition-colors truncate min-w-0" style={{ color: 'var(--es-text-3)' }}>{t.startDiscussion}</span>
            <button className="px-4 sm:px-5 py-1.5 sm:py-2 group-hover:bg-es-cyan group-hover:text-black text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors border shrink-0 self-start sm:self-auto" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>{t.createBtn}</button>
          </div>

          {isThreadsLoading ? (
            <div className="flex justify-center py-12 sm:py-20">
              <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-es-cyan" />
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-12 sm:py-20 text-xs sm:text-sm font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>
              {t.noTopicsInBoard}
            </div>
          ) : (
            filteredThreads.map(thread => (
              <div key={thread.id} className="rounded-xl border shadow-sm flex min-h-[90px] sm:min-h-[105px] hover:opacity-90 transition-colors min-w-0 overflow-hidden" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                
                <div className="w-9 sm:w-12 md:w-14 shrink-0 border-r flex flex-col items-center justify-center py-2 sm:py-3 gap-0.5 sm:gap-1 select-none transition-colors" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                  <button 
                    onClick={() => handleAction('actionVote', () => handleVote(thread.id, 1))} 
                    className="p-0.5 sm:p-1 rounded hover:text-green-500 transition-colors" style={{ color: 'var(--es-text-3)' }}
                    title={t.upvoteTitle}
                  >
                    <ArrowBigUp className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" />
                  </button>
                  <span className="text-[10px] sm:text-xs font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{thread.upvotes}</span>
                  <button 
                    onClick={() => handleAction('actionVote', () => handleVote(thread.id, -1))} 
                    className="p-0.5 sm:p-1 rounded hover:text-red-500 transition-colors" style={{ color: 'var(--es-text-3)' }}
                    title={t.downvoteTitle}
                  >
                    <ArrowBigDown className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-current" />
                  </button>
                </div>

                <div className="flex-1 min-w-0 p-2.5 sm:p-4 md:p-5 flex flex-col gap-1 sm:gap-1.5 md:gap-2 overflow-hidden">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold transition-colors flex-wrap min-w-0 leading-tight" style={{ color: 'var(--es-text-3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GAME_COLORS[thread.gameSlug] || GAME_COLORS.all }} />
                    <span className="uppercase tracking-widest shrink-0">{thread.gameSlug.toUpperCase()}</span>
                    <span className="shrink-0 hidden sm:inline">•</span>
                    <span className="font-black transition-colors truncate max-w-[72px] sm:max-w-[120px] md:max-w-none" style={{ color: 'var(--es-text-1)' }}>{thread.author?.nickname || 'Unknown'}</span>
                    <span className="shrink-0 truncate">{translateApiText(thread.timeAgo)}</span>
                  </div>
                  
                  <Link href={`/community/${thread.id}`} className="block min-w-0">
                    <h2 className="text-sm sm:text-base md:text-lg font-black tracking-tight leading-snug hover:text-es-cyan transition-colors cursor-pointer break-words whitespace-normal line-clamp-2" style={{ color: 'var(--es-text-1)' }}>
                      {thread.title}
                    </h2>
                  </Link>
                  <p className="text-[11px] sm:text-xs line-clamp-2 leading-relaxed transition-colors whitespace-normal min-w-0" style={{ color: 'var(--es-text-3)' }}>{thread.content}</p>
                  
                  <div className="mt-1 sm:mt-1.5 border-t pt-2 sm:pt-2.5 w-full min-w-0" style={{ borderColor: 'var(--es-border)' }}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
                      <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 min-w-0">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            handleAction('actionComment', () => router.push(`/community/${thread.id}`));
                          }} 
                          className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold transition-colors hover:opacity-80 shrink-0" style={{ color: 'var(--es-text-1)' }}
                        >
                          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="tabular-nums">{thread.commentCount}</span>
                          <span className="hidden sm:inline">{(t as any).comment || 'Yorum'}</span>
                        </button>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/community/${thread.id}`);
                            alert(t.threadLinkCopied);
                          }}
                          className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold transition-colors hover:opacity-80 shrink-0" style={{ color: 'var(--es-text-1)' }}
                          title={t.shareStr}
                          aria-label={t.shareStr}
                        >
                          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                          <span className="hidden sm:inline">{t.shareStr}</span>
                        </button>
                      </div>

                      {thread.authorId === user?.id && (
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setThreadToDelete(thread.id);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 h-8 w-8 sm:w-auto sm:min-w-[4.5rem] sm:px-3 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 self-end sm:self-auto border border-red-500/25 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                          title={(t as any).deleteBtn || 'Sil'}
                          aria-label={(t as any).deleteBtn || 'Sil'}
                        >
                          <Trash2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="whitespace-nowrap hidden sm:inline">{(t as any).deleteBtn || 'Sil'}</span>
                        </button>
                      )}
                    </div>
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
              {t.newDiscussionTitle}
            </h3>
            <form onSubmit={handleCreateThread} className="flex flex-col gap-4 relative z-10">
              <input type="text" required value={newThreadTitle} onChange={e => setNewThreadTitle(e.target.value)} placeholder={t.threadTitlePlaceholder} className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border shadow-inner" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }} />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <select value={newThreadCategory} onChange={e => setNewThreadCategory(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border cursor-pointer" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
                  {FORUM_CATEGORIES.filter(c => c.id !== 'all').map(cat => ( <option key={cat.id} value={cat.id}>{cat.label}</option> ))}
                </select>
                <select value={newThreadGame} onChange={e => setNewThreadGame(e.target.value)} className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border cursor-pointer" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
                  <option value="all">{t.generalAll}</option>
                  {GAMES.map(game => ( <option key={game.id} value={game.id}>{game.name}</option> ))}
                </select>
              </div>
              <textarea required value={newThreadContent} onChange={e => setNewThreadContent(e.target.value)} placeholder={t.thoughtsPlaceholder} className="w-full py-3 px-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan border min-h-[150px] resize-y shadow-inner custom-scrollbar" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }} />
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:opacity-80" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                  {t.cancelBtn}
                </button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-es-cyan/20 flex justify-center items-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t.postBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🚀 TIER 1 DÜZELTME: Siber-Spor Temalı Silme Pop-up'ı */}
      {threadToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="p-8 rounded-2xl border max-w-sm w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <button onClick={() => setThreadToDelete(null)} className="absolute top-4 right-4 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-3)' }}><X className="w-5 h-5" /></button>

            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-5 animate-pulse">
              <Trash2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black tracking-tight mb-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>
              {(t as any).deleteConfirmTitle || 'Konuyu Sil'}
            </h3>

            <p className="text-sm mb-6 leading-relaxed transition-colors" style={{ color: 'var(--es-text-3)' }}>
              {(t as any).deleteConfirmDesc || 'Bu konuyu silmek istediğinize emin misiniz? Tüm yorumlar kalıcı olarak silinecektir.'}
            </p>

            <div className="flex gap-3 w-full">
              <button onClick={() => setThreadToDelete(null)} className="flex-1 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:opacity-80" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                {(t as any).cancelBtn || 'İptal'}
              </button>
              <button onClick={executeDeleteThread} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20">
                {(t as any).deleteBtn || 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showRealAuthModal} onClose={() => setShowRealAuthModal(false)} initialMode={authMode} />
    </div>
  );
}