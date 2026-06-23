"use client";

import { useState, useEffect } from "react"; 
import { X, Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./LanguageProvider"; 
import { signUpWithEmail, signInWithEmail } from "@/app/actions/authActions"; 

// 🚀 TIER 1 DÜZELTME: initialMode adında yeni bir prop eklendi
export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: { isOpen: boolean; onClose: () => void; initialMode?: 'login' | 'register' }) {
  const { t, language } = useLanguage();
  
  // 🚀 TIER 1 DÜZELTME: State artık dışarıdan gelen initialMode ile başlıyor
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  // 🚀 TIER 1 DÜZELTME: Modal açıldığında istenen moda geçer, kapandığında temizlenir
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
    } else {
      setStatus({ type: null, message: "" });
      setEmail("");
      setPassword("");
      setNickname("");
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === 'register' && !nickname) return;

    setIsLoading(true);
    setStatus({ type: null, message: "" });

    if (mode === 'register') {
      const result = await signUpWithEmail(email, password, nickname);
      if (!result.success) {
        const errorMessage = typeof result.message === 'object' || String(result.message).includes("already registered") || String(result.message).includes("duplicate") 
          ? t.errorUserTaken 
          : String(result.message);

        setStatus({ type: "error", message: errorMessage });
      } else {
        setStatus({ 
          type: "success", 
          message: language === "tr" ? "Kayıt başarılı! Lütfen e-postanızı onaylayın." : "Sign up successful! Please confirm your email." 
        });
      }
    } else {
      const result = await signInWithEmail(email, password);
      if (!result.success) {
        setStatus({ type: "error", message: language === "tr" ? "Giriş başarısız. Bilgilerinizi kontrol edin." : "Login failed. Check your credentials." });
      } else {
        setStatus({ type: "success", message: language === "tr" ? "Giriş başarılı! Yönlendiriliyorsunuz..." : "Login successful! Redirecting..." });
        setTimeout(() => {
          onClose(); 
        }, 1500);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in p-4">
      <div className="p-8 rounded-3xl border max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col transition-colors" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
        
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-es-cyan/10 rounded-full blur-[80px] pointer-events-none" />

        <button onClick={onClose} className="absolute top-5 right-5 transition-colors z-20 hover:opacity-80" style={{ color: 'var(--es-text-3)' }}>
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-es-cyan/10 border border-es-cyan/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <ShieldCheck className="w-6 h-6 text-es-cyan" />
          </div>
          <h2 className="text-2xl font-black tracking-tight transition-colors" style={{ color: 'var(--es-text-1)' }}>
            {mode === 'login' 
              ? (language === 'tr' ? 'NEXUS PRO\'ya Giriş Yap' : 'Log in to NEXUS PRO') 
              : (language === 'tr' ? 'NEXUS PRO Hesabı Oluştur' : 'Create a NEXUS PRO Account')}
          </h2>
          <p className="text-xs mt-2 text-center transition-colors" style={{ color: 'var(--es-text-3)' }}>
            {mode === 'login' 
              ? (language === 'tr' ? 'Espor ekosistemine geri dön ve tartışmalara katıl.' : 'Return to the esports ecosystem and join discussions.') 
              : (language === 'tr' ? 'Tier 1 espor topluluğunun bir parçası ol.' : 'Become part of the Tier 1 esports community.')}
          </p>
        </div>

        {status.type && (
          <div className={`p-3 rounded-xl border text-xs font-bold flex items-start gap-2 mb-4 relative z-10`} style={{ background: status.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)", color: status.type === "success" ? "#22C55E" : "#EF4444", borderColor: status.type === "success" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)" }}>
            {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
            <span className="leading-relaxed">{status.message}</span>
          </div>
        )}

        <form className="flex flex-col gap-4 relative z-10" onSubmit={handleSubmit}>
          
          {mode === 'register' && (
            <div className="relative group">
              <UserIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-es-cyan" style={{ color: 'var(--es-text-3)' }} />
              <input 
                type="text" 
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={language === 'tr' ? 'Topluluk Kullanıcı Adı' : 'Community Username'} 
                className="w-full border text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-es-cyan transition-colors shadow-inner" 
                style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-es-cyan" style={{ color: 'var(--es-text-3)' }} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={language === 'tr' ? 'E-posta Adresi' : 'Email Address'} 
              className="w-full border text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-es-cyan transition-colors shadow-inner" 
              style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
            />
          </div>

          <div className="relative group">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-es-cyan" style={{ color: 'var(--es-text-3)' }} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={language === 'tr' ? 'Şifre' : 'Password'} 
              className="w-full border text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-es-cyan transition-colors shadow-inner" 
              style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}
            />
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <a href="#" className="text-[10px] font-bold hover:text-es-cyan transition-colors" style={{ color: 'var(--es-text-3)' }}>
                {language === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password?'}
              </a>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 mt-2 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {mode === 'login' 
                  ? (language === 'tr' ? 'Giriş Yap' : 'Log In') 
                  : (language === 'tr' ? 'Hesabımı Oluştur' : 'Create Account')} 
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center relative z-10 border-t pt-5 transition-colors" style={{ borderColor: 'var(--es-border)' }}>
          <span className="text-xs transition-colors" style={{ color: 'var(--es-text-3)' }}>
            {mode === 'login' 
              ? (language === 'tr' ? 'Henüz hesabın yok mu? ' : 'Don\'t have an account yet? ') 
              : (language === 'tr' ? 'Zaten bir hesabın var mı? ' : 'Already have an account? ')}
          </span>
          <button 
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setStatus({type: null, message: ""}); }}
            className="text-xs font-black text-es-cyan hover:opacity-80 transition-colors"
          >
            {mode === 'login' 
              ? (language === 'tr' ? 'Hemen Kayıt Ol' : 'Sign Up Now') 
              : (language === 'tr' ? 'Giriş Yap' : 'Log In')}
          </button>
        </div>

      </div>
    </div>
  );
}