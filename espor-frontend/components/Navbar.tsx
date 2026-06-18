"use client";

import React from 'react';
import { Crosshair, Target, Swords, Shield, Search, Bell, User, Menu } from 'lucide-react';

export default function Navbar() {
  const games = [
    { id: 1, name: 'CS2', icon: 'Crosshair' },
    { id: 2, name: 'Valorant', icon: 'Target' },
    { id: 3, name: 'League of Legends', icon: 'Swords' },
    { id: 4, name: 'Dota 2', icon: 'Shield' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0b101e]/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Sol Alan: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <span className="text-white font-black italic text-2xl tracking-tighter drop-shadow-md">EA</span>
          </div>
          <div className="flex flex-col justify-center">
             <span className="text-xl font-black text-white tracking-widest uppercase hidden md:block font-['Rajdhani',sans-serif] leading-none">ESPOR<span className="text-cyan-400">ARENA</span></span>
             <span className="text-[9px] text-slate-400 uppercase tracking-widest hidden md:block leading-none mt-0.5 font-bold">Global Canlı Skor Ağı</span>
          </div>
        </div>

        {/* Orta Alan: Oyun Kategorileri (Masaüstü) */}
        <div className="hidden md:flex items-center gap-1 bg-[#0f172a] border border-slate-800/80 rounded-2xl px-2 py-1 shadow-inner">
          {games.map((game) => {
            const IconComponent = { Crosshair, Target, Swords, Shield }[game.icon] || Shield;
            return (
              <button
                key={game.id}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-900/80 transition-all duration-300 group"
              >
                <IconComponent size={16} className="group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all" />
                <span className="font-bold text-xs tracking-wide uppercase">{game.name}</span>
              </button>
            );
          })}
        </div>

        {/* Sağ Alan: Kullanıcı ve Aksiyonlar */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-cyan-400 bg-[#0f172a] hover:bg-slate-900 border border-slate-800 rounded-full transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Search size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-cyan-400 bg-[#0f172a] hover:bg-slate-900 border border-slate-800 rounded-full transition-all relative hover:shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Bell size={16} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0b101e] shadow-[0_0_8px_rgba(239,68,68,1)] animate-pulse"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-800 hidden md:block mx-1"></div>

          <button className="hidden md:flex items-center gap-2 bg-[#0f172a] hover:bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full transition-colors group">
             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center border border-slate-600 text-slate-300 group-hover:border-cyan-500/50">
              <User size={12} />
             </div>
             <span className="text-xs font-bold text-slate-300 group-hover:text-white">Giriş Yap</span>
          </button>

          <button className="md:hidden p-2 text-slate-400 hover:text-white">
             <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}