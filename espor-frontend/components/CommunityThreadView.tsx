"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; 
import { useAuth } from "./AuthProvider";
import { useLanguage, TranslationKeys } from "./LanguageProvider";
import { ArrowLeft, MessageSquare, ArrowBigUp, ArrowBigDown, Share2, Loader2, Send, ShieldAlert, X, Trash2 } from "lucide-react"; 
import AuthModal from "./AuthModal";

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C', all: '#00D4FF' };

export default function CommunityThreadView() {
  const params = useParams();
  const threadId = params.id as string;
  const router = useRouter();
  
  const { t, language, translateApiText } = useLanguage();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const [thread, setThread] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRealAuthModal, setShowRealAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // 🚀 TIER 1 DÜZELTME: Silme pop-up yöneticisi
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  const fetchThreadDetails = async () => {
    if (!threadId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:5000/api/community/${threadId}`);
      const json = await res.json();
      if (json.success) {
        setThread(json.data);
      } else {
        setThread(null); 
      }
    } catch (error) {
      console.error("Konu detayı çekilemedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThreadDetails();
  }, [threadId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/community/${threadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent, authorId: user.id })
      });
      const json = await res.json();
      if (json.success) {
        setCommentContent('');
        fetchThreadDetails(); 
      }
    } catch (error) {
      console.error("Yorum eklenemedi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (value: number) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/community/${threadId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, value })
      });
      if (res.ok) fetchThreadDetails();
    } catch (error) {
      console.error("Oy işlemi başarısız:", error);
    }
  };

  // 🚀 TIER 1 DÜZELTME: Pop-up'tan onay gelince siler
  const executeDeleteThread = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/${threadId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });
      if (res.ok) {
        router.push('/community');
      }
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
    }
  };

  const executeDeleteComment = async () => {
    if (!commentToDelete || !user) return;

    try {
      const res = await fetch(`http://localhost:5000/api/community/${threadId}/comments/${commentToDelete}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const json = await res.json();

      if (json.success) {
        setCommentToDelete(null);
        fetchThreadDetails();
      } else {
        alert(json.message || 'Yorum silinemedi.');
      }
    } catch (error) {
      console.error("Yorum silme işlemi başarısız:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: 'var(--es-bg)' }}>
        <Loader2 className="w-10 h-10 animate-spin text-es-cyan" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full gap-3 sm:gap-4 px-4 min-w-0 overflow-x-hidden" style={{ background: 'var(--es-bg)' }}>
        <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
        <h2 className="text-base sm:text-xl font-black transition-colors text-center" style={{ color: 'var(--es-text-1)' }}>Konu Bulunamadı veya Yüklenemedi</h2>
        <button onClick={() => router.push('/community')} className="px-5 sm:px-6 py-2 bg-es-cyan text-black rounded-xl font-black uppercase text-[10px] sm:text-xs hover:opacity-80">
          {(t as any).backToCommunity || 'Topluluğa Dön'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden overflow-x-hidden min-w-0 animate-fade-in relative transition-colors" style={{ background: 'var(--es-bg)' }}>
      
      <div className="shrink-0 px-3 sm:px-4 md:px-8 py-2.5 sm:py-3 md:py-4 border-b flex items-center gap-2 sm:gap-3 md:gap-4 transition-colors relative z-10 shadow-sm min-w-0" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <button onClick={() => router.push('/community')} className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl border hover:opacity-80 transition-all flex items-center justify-center shrink-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>
            {(t as any).backToCommunity || 'Topluluğa Dön'}
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 sm:p-4 md:p-8 min-w-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-4 sm:gap-5 md:gap-6 min-w-0">
          
          <div className="rounded-xl border shadow-lg flex min-h-[90px] sm:min-h-[105px] overflow-hidden transition-colors relative min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-es-cyan/5 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="w-9 sm:w-12 md:w-14 shrink-0 border-r flex flex-col items-center justify-center py-2 sm:py-3 gap-1 sm:gap-2 select-none transition-colors" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
              <button onClick={() => handleVote(1)} className="p-0.5 sm:p-1 rounded hover:text-green-500 transition-colors" style={{ color: 'var(--es-text-3)' }}>
                <ArrowBigUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" />
              </button>
              <span className="text-xs sm:text-sm font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{thread.upvotes}</span>
              <button onClick={() => handleVote(-1)} className="p-0.5 sm:p-1 rounded hover:text-red-500 transition-colors" style={{ color: 'var(--es-text-3)' }}>
                <ArrowBigDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-current" />
              </button>
            </div>

            <div className="flex-1 min-w-0 p-2.5 sm:p-4 md:p-6 flex flex-col gap-2 sm:gap-3 md:gap-4 relative z-10 overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold transition-colors flex-wrap min-w-0 leading-tight" style={{ color: 'var(--es-text-3)' }}>
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shadow-[0_0_8px_currentColor] shrink-0" style={{ background: GAME_COLORS[thread.gameSlug] || GAME_COLORS.all, color: GAME_COLORS[thread.gameSlug] || GAME_COLORS.all }} />
                <span className="uppercase tracking-widest shrink-0">{thread.gameSlug.toUpperCase()}</span>
                <span className="shrink-0 hidden sm:inline">•</span>
                <span className="font-black text-es-cyan truncate max-w-[100px] sm:max-w-none">{thread.author?.nickname || 'Unknown'}</span>
                <span className="opacity-70 shrink-0 truncate">{translateApiText(thread.timeAgo)}</span>
              </div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-snug transition-colors break-words whitespace-normal min-w-0" style={{ color: 'var(--es-text-1)' }}>{thread.title}</h2>
              <p className="text-xs sm:text-sm leading-relaxed transition-colors whitespace-pre-wrap break-words min-w-0" style={{ color: 'var(--es-text-3)' }}>{thread.content}</p>
              
              <div className="mt-1 sm:mt-2 md:mt-4 border-t pt-2 sm:pt-3 md:pt-4 w-full min-w-0" style={{ borderColor: 'var(--es-border)' }}>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full min-w-0">
                  <div className="flex items-center gap-2.5 sm:gap-4 md:gap-6 min-w-0">
                    <div className="inline-flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold transition-colors shrink-0" style={{ color: 'var(--es-text-1)' }}>
                      <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="tabular-nums">{thread.comments.length}</span>
                      <span className="hidden sm:inline">{(t as any).commentsLabel || 'Yorumlar'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Bağlantı kopyalandı!'); }}
                      className="inline-flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold transition-colors hover:opacity-80 shrink-0"
                      style={{ color: 'var(--es-text-1)' }}
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
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center justify-center gap-1.5 h-8 w-8 sm:h-9 sm:w-auto sm:min-w-[4.5rem] sm:px-3.5 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 self-end sm:self-auto border border-red-500/25 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
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

          <form onSubmit={handlePostComment} className="flex flex-col gap-2.5 sm:gap-3 min-w-0">
            <textarea
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              placeholder={(t as any).writeComment || 'Bir yorum yaz...'}
              className="w-full py-3 px-3 sm:py-4 sm:px-5 rounded-xl text-xs sm:text-sm outline-none transition-all focus:border-es-cyan border min-h-[88px] sm:min-h-[100px] resize-y shadow-inner custom-scrollbar min-w-0"
              style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
              onClick={() => !isLoggedIn && setShowAuthModal(true)}
            />
            <div className="flex justify-stretch sm:justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting || !commentContent.trim()} 
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0"/> <span className="truncate">{(t as any).postComment || 'Gönder'}</span></>}
              </button>
            </div>
          </form>

          <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4 mt-0 sm:mt-2 min-w-0">
            {thread.comments.length === 0 ? (
              <div className="text-center py-8 sm:py-10 font-bold tracking-widest transition-colors text-xs sm:text-sm px-2" style={{ color: 'var(--es-text-3)' }}>
                {(t as any).noCommentsYet || 'Henüz yorum yok. İlk fikrini paylaşan sen ol!'}
              </div>
            ) : (
              thread.comments.map((comment: any) => (
                <div key={comment.id} className="p-3 sm:p-4 md:p-5 rounded-xl border flex flex-col gap-2 sm:gap-3 transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold transition-colors flex-wrap min-w-0 flex-1" style={{ color: 'var(--es-text-3)' }}>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-es-cyan/20 border border-es-cyan/50 flex items-center justify-center text-es-cyan text-[10px] sm:text-xs shrink-0">
                        {(comment.author?.nickname || 'U')[0].toUpperCase()}
                      </div>
                      <span className="font-black truncate max-w-[120px] sm:max-w-none" style={{ color: 'var(--es-text-1)' }}>{comment.author?.nickname || 'Unknown'}</span>
                      <span className="opacity-70 shrink-0">• {translateApiText(comment.timeAgo)}</span>
                    </div>

                    {comment.authorId === user?.id && (
                      <button
                        type="button"
                        onClick={() => setCommentToDelete(comment.id)}
                        className="inline-flex items-center justify-center gap-1 h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 border border-red-500/25 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                        title={t.deleteBtn}
                        aria-label={t.deleteBtn}
                      >
                        <Trash2 className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed transition-colors whitespace-pre-wrap break-words min-w-0 pl-0 sm:pl-8" style={{ color: 'var(--es-text-3)' }}>{comment.content}</p>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="p-8 rounded-2xl border max-w-md w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 hover:opacity-80 transition-colors" style={{ color: 'var(--es-text-3)' }}><X className="w-5 h-5" /></button>
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-500 mb-5 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.accessDenied}</h3>
            <p className="text-sm mb-6 leading-relaxed transition-colors" style={{ color: 'var(--es-text-3)' }}>
              Yorum yapabilmek veya oy kullanabilmek için lütfen giriş yapın.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button onClick={() => { setShowAuthModal(false); setAuthMode('register'); setShowRealAuthModal(true); }} className="w-full py-3 rounded-xl bg-es-cyan text-black text-xs font-black uppercase transition-all shadow-xl shadow-es-cyan/10">
                {t.createAccount}
              </button>
              <button onClick={() => { setShowAuthModal(false); setAuthMode('login'); setShowRealAuthModal(true); }} className="w-full py-3 rounded-xl text-xs font-black uppercase transition-all border" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                {t.login}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yorum silme onay modalı */}
      {commentToDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="p-6 sm:p-8 rounded-2xl border max-w-sm w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <button onClick={() => setCommentToDelete(null)} className="absolute top-4 right-4 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-3)' }}><X className="w-5 h-5" /></button>

            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 sm:mb-5">
              <Trash2 className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <h3 className="text-lg sm:text-xl font-black tracking-tight mb-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>
              {t.deleteCommentConfirmTitle}
            </h3>

            <p className="text-xs sm:text-sm mb-5 sm:mb-6 leading-relaxed transition-colors px-1" style={{ color: 'var(--es-text-3)' }}>
              {t.deleteCommentConfirmDesc}
            </p>

            <div className="flex gap-3 w-full">
              <button onClick={() => setCommentToDelete(null)} className="flex-1 py-2.5 sm:py-3 rounded-xl border text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all hover:opacity-80" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                {t.cancelBtn}
              </button>
              <button onClick={executeDeleteComment} className="flex-1 py-2.5 sm:py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-red-500/20">
                {t.deleteBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Konu silme onay modalı */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
          <div className="p-8 rounded-2xl border max-w-sm w-full shadow-2xl relative overflow-hidden text-center flex flex-col items-center transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
            <button onClick={() => setShowDeleteConfirm(false)} className="absolute top-4 right-4 transition-colors hover:opacity-80" style={{ color: 'var(--es-text-3)' }}><X className="w-5 h-5" /></button>

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
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 rounded-xl border text-xs font-black uppercase tracking-widest transition-all hover:opacity-80" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
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