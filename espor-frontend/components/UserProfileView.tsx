"use client";

import { useState } from "react";
// 🚀 ÇÖZÜM: History ikonu buraya eklendi!
import { User, Settings, MessageSquare, ArrowBigUp, Shield, LogOut, Medal, Flame, History } from "lucide-react";

// --- 🟢 API SİMÜLASYONU (Kullanıcı Verileri) ---
const MOCK_USER = {
  username: "NexusPlayer99",
  email: "player99@nexuspro.com",
  joinDate: "Ocak 2026",
  isPro: true,
  stats: {
    threads: 12,
    comments: 148,
    upvotes: 3240
  },
  recentActivity: [
    { id: 1, type: 'thread', title: 'VCT EMEA Stage 2 Grand Finals Analizi', time: '2 gün önce', upvotes: 142 },
    { id: 2, type: 'comment', title: 'Re: Son güncelleme sonrası subtick oranları...', time: '4 gün önce', upvotes: 15 },
    { id: 3, type: 'thread', title: 'Yeni Meta: Çift Kontrol Uzmanı neden bu kadar güçlü?', time: '1 hafta önce', upvotes: 89 },
  ]
};

export default function UserProfileView() {
  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity');

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in" style={{ background: 'var(--es-bg)' }}>
      
      {/* 🌟 ÜST PROFİL HEADER */}
      <div className="shrink-0 px-8 py-10 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 pointer-events-none transition-colors" style={{ background: '#00D4FF', transform: 'translate(20%, -40%)' }} />
        
        <div className="max-w-5xl mx-auto relative z-10 flex items-end justify-between">
          <div className="flex items-center gap-6">
            
            {/* Profil Avatarı */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl relative">
              <User className="w-10 h-10 text-slate-500" />
              {MOCK_USER.isPro && (
                <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-es-cyan border-[3px] border-slate-900 flex items-center justify-center shadow-lg">
                  <Shield className="w-4 h-4 text-black" />
                </div>
              )}
            </div>
            
            {/* Kullanıcı Bilgileri */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black text-white tracking-tight">{MOCK_USER.username}</h1>
                {MOCK_USER.isPro && <span className="px-2 py-0.5 rounded bg-es-cyan/10 border border-es-cyan/30 text-es-cyan text-[9px] font-black uppercase tracking-widest mt-1">PRO ÜYE</span>}
              </div>
              <span className="text-sm text-slate-400 font-semibold">{MOCK_USER.email} • Katılım: {MOCK_USER.joinDate}</span>
            </div>
          </div>

          {/* İstatistik Kartları */}
          <div className="flex gap-3">
            <div className="flex flex-col items-center bg-slate-900/80 px-5 py-3 rounded-xl border border-white/5">
              <span className="text-xl font-black text-white">{MOCK_USER.stats.upvotes}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><ArrowBigUp className="w-3 h-3"/> Upvote</span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 px-5 py-3 rounded-xl border border-white/5">
              <span className="text-xl font-black text-white">{MOCK_USER.stats.threads}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><Flame className="w-3 h-3"/> Konu</span>
            </div>
            <div className="flex flex-col items-center bg-slate-900/80 px-5 py-3 rounded-xl border border-white/5">
              <span className="text-xl font-black text-white">{MOCK_USER.stats.comments}</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1"><MessageSquare className="w-3 h-3"/> Yorum</span>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 SEKME BUTONLARI */}
      <div className="shrink-0 px-8 border-b border-white/5 bg-es-bg-2">
        <div className="max-w-5xl mx-auto flex gap-8">
          <button onClick={() => setActiveTab('activity')} className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'activity' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
            <History className="w-4 h-4" /> Topluluk Etkileşimleri
            {activeTab === 'activity' && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t bg-es-cyan" />}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'settings' ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
            <Settings className="w-4 h-4" /> Hesap Ayarları
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
                <Medal className="w-4 h-4 text-es-cyan" /> Son Aktiviteler
              </h3>
              
              {MOCK_USER.recentActivity.map((item) => (
                <div key={item.id} className="bg-es-bg-2 p-5 rounded-xl border border-white/5 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400">
                      {item.type === 'thread' ? <Flame className="w-5 h-5 text-orange-400" /> : <MessageSquare className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">
                        {item.type === 'thread' ? 'Konu Açtı' : 'Yorum Yaptı'} • {item.time}
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
              
              {/* Profil Bilgileri Formu */}
              <div className="bg-es-bg-2 p-6 rounded-xl border border-white/5 flex flex-col gap-4 shadow-lg">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-3">Profil Bilgileri</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kullanıcı Adı</label>
                  <input type="text" defaultValue={MOCK_USER.username} className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-es-cyan transition-colors" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E-posta Adresi</label>
                  <input type="email" defaultValue={MOCK_USER.email} className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl px-4 py-2.5 outline-none focus:border-es-cyan transition-colors" />
                </div>
                <button className="mt-2 w-full py-3 rounded-xl bg-es-cyan hover:bg-white text-black text-xs font-black uppercase tracking-widest transition-all">Değişiklikleri Kaydet</button>
              </div>

              {/* Güvenlik ve Çıkış */}
              <div className="flex flex-col gap-6">
                <div className="bg-es-bg-2 p-6 rounded-xl border border-white/5 flex flex-col gap-4 shadow-lg">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 border-b border-white/5 pb-3">Güvenlik</h3>
                  <button className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-black uppercase tracking-widest transition-all">Şifre Değiştir</button>
                </div>

                <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20 flex flex-col gap-4 shadow-lg">
                  <h3 className="text-sm font-black text-red-400 uppercase tracking-widest mb-2">Tehlikeli Bölge</h3>
                  <button className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <LogOut className="w-4 h-4" /> Oturumu Kapat
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