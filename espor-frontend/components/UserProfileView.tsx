"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { User, Settings, MessageSquare, ArrowBigUp, Shield, LogOut, Medal, Flame, History, Loader2 } from "lucide-react";

import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import { LOCALE_MAP } from "@/i18n"; 
import { supabase } from "@/app/utils/supabaseClient"; 
import { fetchUserProfile } from "@/lib/api/users";

export default function UserProfileView() {
  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');
  
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage(); 

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const [userStats, setUserStats] = useState({ threads: 0, comments: 0, upvotes: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setIsStatsLoading(true);
        const data = await fetchUserProfile(user.id);
        setUserStats(data.stats);
        setRecentActivities(data.recentActivity);
      } catch (error) {
        console.error("Profil istatistikleri çekilemedi:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex w-full h-full items-center justify-center" style={{ background: 'var(--es-bg)' }}>
        <Loader2 className="w-10 h-10 animate-spin text-es-cyan" />
      </div>
    );
  }

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      setPassStatus({ type: 'error', message: (t as any).passwordShort || 'Şifreniz en az 6 karakter olmalıdır.' });
      return;
    }
    
    setIsPassLoading(true);
    setPassStatus({ type: null, message: '' });

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPassStatus({ type: 'error', message: error.message });
    } else {
      setPassStatus({ type: 'success', message: (t as any).passwordUpdated || 'Şifreniz başarıyla güncellendi!' });
      setTimeout(() => {
        setIsChangingPassword(false);
        setNewPassword("");
        setPassStatus({ type: null, message: '' });
      }, 2000);
    }
    setIsPassLoading(false);
  };

  const liveUsername = user.user_metadata?.nickname || user.email?.split('@')[0];
  const liveAvatarLetter = user.user_metadata?.avatar_url || user.email?.charAt(0).toUpperCase();
  const liveEmail = user.email;
  const joinDate = new Date(user.created_at).toLocaleDateString(LOCALE_MAP[language], { month: 'long', year: 'numeric' });
  const isPro = true; 

  return (
    <div className="flex flex-col w-full h-full overflow-hidden overflow-x-hidden min-w-0 animate-fade-in" style={{ background: 'var(--es-bg)' }}>
      
      <div className="shrink-0 px-3 sm:px-4 md:px-8 py-5 sm:py-6 md:py-10 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 pointer-events-none transition-colors" style={{ background: '#00D4FF', transform: 'translate(20%, -40%)' }} />
        
        <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-4 sm:gap-5 md:gap-6 md:flex-row md:items-end md:justify-between min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl relative shrink-0">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{liveAvatarLetter}</span>
              {isPro && (
                <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-es-cyan border-2 sm:border-[3px] border-slate-900 flex items-center justify-center shadow-lg">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-white tracking-tight truncate min-w-0">{liveUsername}</h1>
                {isPro && (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded bg-es-cyan/10 border border-es-cyan/30 text-es-cyan text-[8px] sm:text-[9px] font-black uppercase tracking-widest shrink-0">
                    {(t as any).proMember || 'PRO MEMBER'}
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm text-slate-400 font-semibold break-words whitespace-normal leading-snug">{liveEmail}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">{t.joined}: {joinDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0 w-full md:w-auto">
            <div className="flex flex-col items-center bg-slate-900/80 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-white/5 min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-black text-white tabular-nums">
                {isStatsLoading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-slate-500" /> : userStats.upvotes}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase flex items-center gap-0.5 sm:gap-1 text-center leading-tight">
                <ArrowBigUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0"/> <span className="truncate">{(t as any).upvote || 'UPVOTE'}</span>
              </span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-white/5 min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-black text-white tabular-nums">
                {isStatsLoading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-slate-500" /> : userStats.threads}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase flex items-center gap-0.5 sm:gap-1 text-center leading-tight">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0"/> <span className="truncate">{(t as any).thread || 'KONU'}</span>
              </span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 px-2 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border border-white/5 min-w-0">
              <span className="text-base sm:text-lg md:text-xl font-black text-white tabular-nums">
                {isStatsLoading ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-slate-500" /> : userStats.comments}
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase flex items-center gap-0.5 sm:gap-1 text-center leading-tight">
                <MessageSquare className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0"/> <span className="truncate">{(t as any).comment || 'YORUM'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-3 sm:px-4 md:px-8 border-b border-white/5 bg-es-bg-2 overflow-x-auto scrollbar-hide">
        <div className="max-w-5xl mx-auto flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap min-w-0">
          <button onClick={() => setActiveTab('activity')} className={`py-3 sm:py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-1.5 sm:gap-2 shrink-0 ${activeTab === 'activity' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
            <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span>{(t as any).communityInteractions || 'Topluluk Etkileşimleri'}</span>
            {activeTab === 'activity' && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t bg-es-cyan" />}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`py-3 sm:py-4 text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-1.5 sm:gap-2 shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span>{(t as any).accountSettings || 'Hesap Ayarları'}</span>
            {activeTab === 'settings' && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t bg-es-cyan" />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 sm:p-4 md:p-8 min-w-0">
        <div className="max-w-5xl mx-auto min-w-0">
          
          {activeTab === 'activity' && (
            <div className="flex flex-col gap-3 sm:gap-4 animate-fade-in min-w-0">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-0.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                <Medal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-es-cyan shrink-0" /> {(t as any).recentActivities || 'Son Aktiviteler'}
              </h3>
              
              {isStatsLoading ? (
                <div className="flex justify-center py-6 sm:py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-es-cyan" />
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="bg-es-bg-2 p-5 sm:p-8 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center min-w-0">
                  <History className="w-7 h-7 sm:w-8 sm:h-8 text-slate-600 mb-2 sm:mb-3" />
                  <span className="text-xs sm:text-sm font-bold text-slate-400 px-2">
                    {(t as any).noActivity || 'Henüz bir etkileşim bulunmuyor.'}
                  </span>
                </div>
              ) : (
                recentActivities.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => router.push(`/community/${item.threadId}`)}
                    className="bg-es-bg-2 p-3 sm:p-4 md:p-5 rounded-xl border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3 hover:bg-white/5 hover:border-es-cyan/30 transition-all group cursor-pointer shadow-sm min-w-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0 flex-1">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-es-cyan transition-colors shrink-0">
                        {item.type === 'thread' ? <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" /> : <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5 truncate">
                          {item.type === 'thread' ? ((t as any).openedThread || 'Konu Açtı') : ((t as any).madeComment || 'Yorum Yaptı')} • {item.time}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white group-hover:text-es-cyan transition-colors line-clamp-2 sm:line-clamp-1 break-words whitespace-normal">{item.title}</span>
                      </div>
                    </div>
                    {item.type === 'thread' && (
                      <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/5 group-hover:border-green-500/30 transition-colors shrink-0 self-start sm:self-auto ml-10 sm:ml-0">
                        <ArrowBigUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                        <span className="text-[11px] sm:text-xs font-black text-white tabular-nums">{item.upvotes}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 animate-fade-in min-w-0">
              
              <div className="bg-es-bg-2 p-4 sm:p-5 md:p-6 rounded-xl border border-white/5 flex flex-col gap-3 sm:gap-4 shadow-lg min-w-0">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-1 sm:mb-2 border-b border-white/5 pb-2 sm:pb-3">{(t as any).profileInfo || 'Profil Bilgileri'}</h3>
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">{(t as any).usernameLabel || 'Kullanıcı Adı'}</label>
                  <input type="text" readOnly defaultValue={liveUsername} className="w-full min-w-0 bg-slate-900/50 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 outline-none cursor-not-allowed truncate" />
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
                  <label className="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest">{(t as any).emailAddressLabel || 'E-posta Adresi'}</label>
                  <input type="email" readOnly defaultValue={liveEmail} className="w-full min-w-0 bg-slate-900/50 border border-slate-800 text-slate-300 text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 outline-none cursor-not-allowed truncate" />
                </div>
                <p className="text-[9px] sm:text-[10px] font-bold text-es-cyan mt-1 sm:mt-2 leading-relaxed">{(t as any).accountLockedNote || 'Not: Hesap bilgileri güvenliğiniz için şu an kilitlidir.'}</p>
              </div>

              <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
                
                <div className="bg-es-bg-2 p-4 sm:p-5 md:p-6 rounded-xl border border-white/5 flex flex-col gap-3 sm:gap-4 shadow-lg transition-all min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest mb-1 sm:mb-2 border-b border-white/5 pb-2 sm:pb-3">{(t as any).security || 'Güvenlik'}</h3>
                  
                  {!isChangingPassword ? (
                    <button onClick={() => setIsChangingPassword(true)} className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all">
                      {(t as any).changePassword || 'Şifre Değiştir'}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2.5 sm:gap-3 animate-fade-in min-w-0">
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={(t as any).newPassword || 'Yeni Şifre'}
                        className="w-full min-w-0 bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 outline-none focus:border-es-cyan transition-colors"
                      />
                      
                      {passStatus.message && (
                        <p className={`text-[9px] sm:text-[10px] font-bold leading-relaxed ${passStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                          {passStatus.message}
                        </p>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button onClick={() => { setIsChangingPassword(false); setPassStatus({ type: null, message: '' }); setNewPassword(""); }} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all">
                          {(t as any).cancel || 'İptal'}
                        </button>
                        <button onClick={handlePasswordUpdate} disabled={isPassLoading} className="flex-1 py-2.5 rounded-xl bg-es-cyan hover:bg-white text-black text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                          {isPassLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : ((t as any).save || 'Kaydet')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-red-500/5 p-4 sm:p-5 md:p-6 rounded-xl border border-red-500/20 flex flex-col gap-3 sm:gap-4 shadow-lg min-w-0">
                  <h3 className="text-xs sm:text-sm font-black text-red-400 uppercase tracking-widest mb-0.5 sm:mb-2">{(t as any).dangerZone || 'Tehlikeli Bölge'}</h3>
                  <button onClick={signOut} className="w-full py-2.5 sm:py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> {(t as any).logout || 'Oturumu Kapat'}
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}