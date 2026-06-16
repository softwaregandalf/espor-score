// Middle Side Bar.
"use client";

import { useState } from "react";
import { ArrowLeft, Star, X, PlayCircle, Trophy, BarChart3, Users, Crosshair, Shield } from "lucide-react";

type MatchDetailProps = {
  selectedMatch: any;
  setSelectedMatch: (match: any) => void;
};

export default function MatchDetail({ selectedMatch, setSelectedMatch }: MatchDetailProps) {
  const [activeTab, setActiveTab] = useState("Detay");

  if (!selectedMatch) {
    return (
      <div className="w-full lg:w-5/12 xl:w-6/12 flex-col gap-4 hidden lg:flex">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 h-full min-h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3 mb-4">
            <div className="flex gap-4">
              <button className="text-xs font-bold text-red-500 border-b-2 border-red-500 pb-3 -mb-[13px]">GÜNDEM</button>
            </div>
          </div>
          <div className="bg-slate-800/80 rounded-lg border border-slate-700/50 p-4 hover:border-slate-600 transition-colors cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px]">E</span>
                Espor Arena Akışı
              </div>
              <button className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors">Detay &gt;</button>
            </div>
            <p className="text-sm text-slate-300">PGL Major 2026 finalleri yaklaşıyor! Canlı skorları ve turnuva ağacını sol menüden takip edebilirsiniz.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-5/12 xl:w-6/12 flex flex-col gap-4">
      <div className="bg-[#1a1d24] border border-slate-700/50 rounded-lg overflow-hidden flex flex-col shadow-2xl">
        
        {/* Üst Bar */}
        <div className="flex justify-between items-center px-4 py-3 bg-[#22262f] border-b border-slate-700">
          <button onClick={() => setSelectedMatch(null)} className="lg:hidden text-slate-400 flex items-center gap-1 text-xs"><ArrowLeft size={16} /> Geri</button>
          <button onClick={() => setSelectedMatch(null)} className="hidden lg:flex text-slate-400 hover:text-white bg-slate-800 p-1 rounded transition-colors"><X size={16} /></button>
          <span className="text-[10px] bg-red-600 text-white font-bold px-3 py-1 rounded-sm">Detaylı Görünüm</span>
          <Star size={16} className="text-slate-400 cursor-pointer hover:text-yellow-500 transition-colors" />
        </div>

        {/* Skor Alanı */}
        <div className="p-6 flex items-center justify-between relative overflow-hidden">
          {/* Arka plan süslemesi */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="flex flex-col items-center gap-2 w-1/3 z-10">
            <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center font-black text-2xl text-white shadow-lg">
              {selectedMatch?.team1?.acronym?.charAt(0)}
            </div>
            <span className="text-sm font-bold text-white text-center">{selectedMatch?.team1?.acronym}</span>
          </div>

          <div className="flex flex-col items-center w-1/3 z-10">
            <span className="text-[10px] text-red-500 font-bold mb-1 animate-pulse">CANLI</span>
            <div className="text-4xl font-black text-white tracking-widest bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700/50">
              {selectedMatch?.team1Score ?? "-"} <span className="text-slate-600">-</span> {selectedMatch?.team2Score ?? "-"}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 w-1/3 z-10">
            <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-slate-700 flex items-center justify-center font-black text-2xl text-white shadow-lg">
              {selectedMatch?.team2?.acronym?.charAt(0)}
            </div>
            <span className="text-sm font-bold text-white text-center">{selectedMatch?.team2?.acronym}</span>
          </div>
        </div>

        {/* Tab Menü */}
        <div className="flex items-center gap-6 px-4 bg-[#22262f] border-y border-slate-700 overflow-x-auto hide-scrollbar">
          {["Detay", "Kadro", "İstatistik"].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`text-xs font-bold whitespace-nowrap py-3 transition-colors ${activeTab === tab ? 'text-red-500 border-b-2 border-red-500' : 'text-slate-400 hover:text-slate-200 border-b-2 border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- TAB İÇERİKLERİ --- */}
        <div className="bg-[#1a1d24] flex-1 min-h-[400px]">
          
          {/* 1. DETAY SEKMESİ */}
          {activeTab === "Detay" && (
            <div className="p-4 flex flex-col gap-4">
              {/* MVP Kartı */}
              <div className="rounded-xl overflow-hidden relative border border-purple-500/30 p-4 bg-gradient-to-r from-purple-900/80 to-blue-900/80 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-white italic font-black text-sm uppercase tracking-wider">Maçın Oyuncusu</span>
                  <Trophy size={20} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-yellow-400 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(250,204,21,0.3)]">👤</div>
                  <div>
                    <div className="text-white font-bold text-xl">Aleksib</div>
                    <div className="flex items-center gap-2 text-xs mt-1.5">
                      <span className="bg-green-500 text-black px-2 py-0.5 rounded font-bold">1.32 Rtg</span>
                      <span className="text-slate-300 font-medium">24 Kill / 12 Death</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Video Player Yeri */}
              <div className="w-full aspect-video bg-black relative flex items-center justify-center group border border-slate-700/50 rounded-xl overflow-hidden cursor-pointer shadow-lg">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"></div>
                <PlayCircle size={64} className="text-red-600 bg-white rounded-full z-10 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(220,38,38,0.5)]" />
                <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-white text-xs font-bold text-shadow">Canlı Yayını İzle</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. KADRO SEKMESİ (5v5 E-spor Tasarımı) */}
          {activeTab === "Kadro" && (
            <div className="flex w-full h-full">
              {/* Sol Takım */}
              <div className="w-1/2 border-r border-slate-700/50 p-2 space-y-1">
                <div className="text-center pb-2 mb-2 border-b border-slate-700/50 font-bold text-white text-sm">{selectedMatch?.team1?.acronym}</div>
                {[1, 2, 3, 4, 5].map((player) => (
                  <div key={`t1-${player}`} className="flex items-center gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
                    <div className="w-8 h-8 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-slate-500">P{player}</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">Oyuncu {player}</span>
                      <span className="text-[10px] text-slate-400">KDA: 12/5/4</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Sağ Takım */}
              <div className="w-1/2 p-2 space-y-1">
                <div className="text-center pb-2 mb-2 border-b border-slate-700/50 font-bold text-white text-sm">{selectedMatch?.team2?.acronym}</div>
                {[1, 2, 3, 4, 5].map((player) => (
                  <div key={`t2-${player}`} className="flex items-center justify-end gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-white">Oyuncu {player}</span>
                      <span className="text-[10px] text-slate-400">KDA: 9/8/2</span>
                    </div>
                    <div className="w-8 h-8 bg-slate-800 rounded border border-slate-700 flex items-center justify-center text-xs text-slate-500">P{player}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. İSTATİSTİK SEKMESİ (Karşılaştırma Barları) */}
          {activeTab === "İstatistik" && (
            <div className="p-6 flex flex-col gap-6">
              {[
                { label: "Toplam Öldürme", t1: 54, t2: 42, t1Win: true },
                { label: "İlk Kan (First Blood)", t1: 8, t2: 12, t1Win: false },
                { label: "Ekonomi Puanı", t1: 24500, t2: 18000, t1Win: true },
                { label: "Kazanılan Round Serisi", t1: 3, t2: 3, t1Win: false }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={stat.t1Win ? "text-white" : "text-slate-500"}>{stat.t1}</span>
                    <span className="text-slate-400">{stat.label}</span>
                    <span className={!stat.t1Win && stat.t1 !== stat.t2 ? "text-white" : "text-slate-500"}>{stat.t2}</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className="flex-1 bg-slate-800 rounded-l-full overflow-hidden flex justify-end">
                      <div className={`h-full rounded-l-full ${stat.t1Win ? 'bg-blue-500' : 'bg-slate-600'}`} style={{ width: `${(stat.t1 / (stat.t1 + stat.t2)) * 100}%` }}></div>
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-r-full overflow-hidden">
                      <div className={`h-full rounded-r-full ${!stat.t1Win && stat.t1 !== stat.t2 ? 'bg-purple-500' : 'bg-slate-600'}`} style={{ width: `${(stat.t2 / (stat.t1 + stat.t2)) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}