"use client";

import { useState } from "react";
import { X, Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight } from "lucide-react";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
      <div className="bg-gradient-to-b from-slate-900 to-black p-8 rounded-3xl border border-white/10 max-w-md w-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col">
        
        {/* Arka Plan Efektleri */}
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-es-cyan/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Kapat Butonu */}
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-500 hover:text-white transition-colors z-20">
          <X className="w-5 h-5" />
        </button>

        {/* Üst Kısım / Logo */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-es-cyan/10 border border-es-cyan/30 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,212,255,0.2)]">
            <ShieldCheck className="w-6 h-6 text-es-cyan" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'NEXUS PRO\'ya Giriş Yap' : 'NEXUS PRO Hesabı Oluştur'}
          </h2>
          <p className="text-xs text-slate-400 mt-2 text-center">
            {mode === 'login' ? 'Espor ekosistemine geri dön ve tartışmalara katıl.' : 'Tier 1 espor topluluğunun bir parçası ol.'}
          </p>
        </div>

        {/* Form Alanı */}
        <form className="flex flex-col gap-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
          
          {mode === 'register' && (
            <div className="relative group">
              <UserIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
              <input type="text" placeholder="Kullanıcı Adı" className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-es-cyan transition-colors shadow-inner" />
            </div>
          )}

          <div className="relative group">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
            <input type="email" placeholder="E-posta Adresi" className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-es-cyan transition-colors shadow-inner" />
          </div>

          <div className="relative group">
            <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
            <input type="password" placeholder="Şifre" className="w-full bg-slate-950/50 border border-slate-800 text-white text-sm rounded-xl pl-11 pr-4 py-3 outline-none focus:border-es-cyan transition-colors shadow-inner" />
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <a href="#" className="text-[10px] font-bold text-slate-400 hover:text-es-cyan transition-colors">Şifremi Unuttum</a>
            </div>
          )}

          <button className="w-full py-3.5 mt-2 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            {mode === 'login' ? 'Giriş Yap' : 'Hesabımı Oluştur'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mod Değiştirici */}
        <div className="mt-8 text-center relative z-10 border-t border-white/5 pt-6">
          <span className="text-xs text-slate-400">
            {mode === 'login' ? 'Henüz hesabın yok mu? ' : 'Zaten bir hesabın var mı? '}
          </span>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs font-black text-es-cyan hover:text-white transition-colors"
          >
            {mode === 'login' ? 'Hemen Kayıt Ol' : 'Giriş Yap'}
          </button>
        </div>

      </div>
    </div>
  );
}