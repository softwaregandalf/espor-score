"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { User, Settings, MessageSquare, ArrowBigUp, Shield, LogOut, Medal, Flame, History, Loader2 } from "lucide-react";

import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider"; 
// 🚀 TIER 1 DÜZELTME: Supabase İstemcisi Şifre Güncelleme İçin Eklendi
import { supabase } from "@/app/utils/supabaseClient"; 

const MOCK_STATS = { threads: 0, comments: 0, upvotes: 0 };
const MOCK_RECENT_ACTIVITY = [
  { id: 1, type: 'thread', title: 'VCT EMEA Stage 2 Grand Finals Analizi', time: '2 gün önce', upvotes: 142 },
  { id: 2, type: 'comment', title: 'Re: Son güncelleme sonrası subtick oranları...', time: '4 gün önce', upvotes: 15 },
  { id: 3, type: 'thread', title: 'Yeni Meta: Çift Kontrol Uzmanı neden bu kadar güçlü?', time: '1 hafta önce', upvotes: 89 },
];

export default function UserProfileView() {
  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');
  
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const { t, language } = useLanguage(); 

  // 🚀 ŞİFRE DEĞİŞTİRME STATELERİ
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex w-full h-full items-center justify-center" style={{ background: 'var(--es-bg)' }}>
        <Loader2 className="w-10 h-10 animate-spin text-es-cyan" />
      </div>
    );
  }

  // 🚀 ŞİFRE GÜNCELLEME FONKSİYONU
  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      setPassStatus({ type: 'error', message: (t as any).passwordShort || 'Şifreniz en az 6 karakter olmalıdır.' });
      return;
    }
    
    setIsPassLoading(true);
    setPassStatus({ type: null, message: '' });

    // Supabase üzerinden şifre güncelleme isteği
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
  const joinDate = new Date(user.created_at).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'long', year: 'numeric' });
  const isPro = true; 

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in" style={{ background: 'var(--es-bg)' }}>
      
      {/* 🌟 ÜST PROFİL HEADER */}
      <div className="shrink-0 px-8 py-10 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 pointer-events-none transition-colors" style={{ background: '#00D4FF', transform: 'translate(20%, -40%)' }} />
        
        <div className="max-w-5xl mx-auto relative z-10 flex items-end justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl relative">
              <span className="text-4xl font-black text-white">{liveAvatarLetter}</span>
              {isPro && (
                <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-es-cyan border-[3px] border-slate-900 flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">{liveUsername}</h1>
                {isPro && (
                  <span className="px-2 py-0.5 rounded bg-es-cyan/10 border border-es-cyan/30 text-es-cyan text-[9px] font-black uppercase tracking-widest mt-1">
                    {(t as any).proMember || 'PRO MEMBER'}
                  </span>
                )}
              </div>
              <span className="text-sm text-slate-400 font-semibold">{liveEmail} • {language === 'tr' ? 'Katılım' : 'Joined'}: {joinDate}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center bg-slate-900/80 px-5 py-3 rounded-xl border border-white/5">
              <span className="text-xl font-black text-white">{MOCK_STATS.upvotes}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <ArrowBigUp className="w-3 h-3"/> {(t as any).upvote || 'UPVOTE'}
              </span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 px-5 py-3 rounded-xl border border-white/5">
              <span className="text-xl font-black text-white">{MOCK_STATS.threads}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Flame className="w-3 h-3"/> {(t as any).thread || 'KONU'}
              </span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 px-5 py-3 rounded-xl border border-white/5">
              <span className="text-xl font-black text-white">{MOCK_STATS.comments}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <MessageSquare className="w-3 h-3"/> {(t as any).comment || 'YORUM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 SEKME BUTONLARI */}
      <div className="shrink-0 px-8 border-b border-white/5 bg-es-bg-2">
        <div className="max-w-5xl mx-auto flex gap-8">
          <button onClick={() => setActiveTab('activity')} className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'activity' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
            <History className="w-4 h-4" /> {(t as any).communityInteractions || 'Topluluk Etkileşimleri'}
            {activeTab === 'activity' && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t bg-es-cyan" />}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
            <Settings className="w-4 h-4" /> {(t as any).accountSettings || 'Hesap Ayarları'}
            {activeTab === 'settings' && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t bg-es-cyan" />}
          </button>
        </div>
      </div>

      {/* 🚀 İÇERİK ALANI */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto">
          
          {activeTab === 'activity' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                <Medal className="w-4 h-4 text-es-cyan" /> {(t as any).recentActivities || 'Son Aktiviteler'}
              </h3>
              
              {MOCK_RECENT_ACTIVITY.map((item) => (
                <div key={item.id} className="bg-es-bg-2 p-5 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                      {item.type === 'thread' ? <Flame className="w-5 h-5 text-orange-400" /> : <MessageSquare className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                        {item.type === 'thread' ? ((t as any).openedThread || 'Konu Açtı') : ((t as any).madeComment || 'Yorum Yaptı')} • {item.time}
                      </span>
                      <span className="text-sm font-bold text-white group-hover:text-es-cyan transition-colors">{item.title}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-white/5">
                    <ArrowBigUp className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-black text-white">{item.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              
              <div className="bg-es-bg-2 p-6 rounded-xl border border-white/5 flex flex-col gap-4 shadow-lg">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-3">{(t as any).profileInfo || 'Profil Bilgileri'}</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{(t as any).usernameLabel || 'Kullanıcı Adı'}</label>
                  <input type="text" readOnly defaultValue={liveUsername} className="w-full bg-slate-900/50 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none cursor-not-allowed" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{(t as any).emailAddressLabel || 'E-posta Adresi'}</label>
                  <input type="email" readOnly defaultValue={liveEmail} className="w-full bg-slate-900/50 border border-slate-800 text-slate-300 text-sm rounded-xl px-4 py-2.5 outline-none cursor-not-allowed" />
                </div>
                <p className="text-[10px] font-bold text-es-cyan mt-2">{(t as any).accountLockedNote || 'Not: Hesap bilgileri güvenliğiniz için şu an kilitlidir.'}</p>
              </div>

              <div className="flex flex-col gap-6">
                
                {/* 🚀 DİNAMİK ŞİFRE DEĞİŞTİRME ALANI */}
                <div className="bg-es-bg-2 p-6 rounded-xl border border-white/5 flex flex-col gap-4 shadow-lg transition-all">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-3">{(t as any).security || 'Güvenlik'}</h3>
                  
                  {!isChangingPassword ? (
                    <button onClick={() => setIsChangingPassword(true)} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-black uppercase tracking-widest transition-all">
                      {(t as any).changePassword || 'Şifre Değiştir'}
                    </button>
                  ) : (
                    <div className="flex flex-col gap-3 animate-fade-in">
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder={(t as any).newPassword || 'Yeni Şifre'}
                        className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-es-cyan transition-colors"
                      />
                      
                      {passStatus.message && (
                        <p className={`text-[10px] font-bold ${passStatus.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                          {passStatus.message}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button onClick={() => { setIsChangingPassword(false); setPassStatus({ type: null, message: '' }); setNewPassword(""); }} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-black uppercase tracking-widest transition-all">
                          {(t as any).cancel || 'İptal'}
                        </button>
                        <button onClick={handlePasswordUpdate} disabled={isPassLoading} className="flex-1 py-2.5 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                          {isPassLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : ((t as any).save || 'Kaydet')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20 flex flex-col gap-4 shadow-lg">
                  <h3 className="text-sm font-black text-red-400 uppercase tracking-widest mb-2">{(t as any).dangerZone || 'Tehlikeli Bölge'}</h3>
                  <button onClick={signOut} className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> {(t as any).logout || 'Oturumu Kapat'}
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