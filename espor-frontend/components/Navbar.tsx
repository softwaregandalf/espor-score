"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-900/80 border-b border-slate-800 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Alanı */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-black text-white text-lg tracking-tighter">
              E
            </div>
            <span className="text-white font-black text-xl tracking-tight hidden sm:block">
              ESPOR<span className="text-blue-500">ARENA</span>
            </span>
          </Link>

          {/* Sağ Menü - Filtreleme Butonları */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/?status=Live" className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-bold text-white transition-colors border border-slate-700/50">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Canlı
            </Link>
            
            <Link href="/?status=Upcoming" className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-bold text-slate-300 transition-colors border border-slate-700/50">
              📅 Yaklaşan
            </Link>

            {/* YENİ EKLENEN: SONUÇLAR (RESULTS) BUTONU */}
            <Link href="/?status=Finished" className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-bold text-slate-300 transition-colors border border-green-700/50">
              ✅ Sonuçlar
            </Link>

            <Link href="/" className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-bold text-slate-300 transition-colors border border-slate-700/50">
              🌍 Tümü
            </Link>
            
            {/* Tema Butonu (Görsel Temsil) */}
            <button className="p-2 ml-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-md border border-slate-700/50 transition-colors">
              ☼
            </button>
          </div>

          {/* Mobil Menü Butonu */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}