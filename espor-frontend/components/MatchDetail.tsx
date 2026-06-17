"use client";

import { useState } from "react";

export default function MatchDetail({ selectedMatch }: { selectedMatch: any, setSelectedMatch: any }) {
  const [activeTab, setActiveTab] = useState("Detay");

  if (!selectedMatch) {
    return (
      <div className="w-full lg:w-6/12 bg-slate-900/40 border border-slate-800 rounded-lg p-6 flex items-center justify-center min-h-[500px]">
        <span className="text-slate-500 text-sm italic">Detaylarını görmek istediğiniz maçı sol menüden seçiniz.</span>
      </div>
    );
  }

  // Dinamik verileri güvenle okuyoruz
  const details = selectedMatch.gameDetails || {};
  const gameType = details.type?.toLowerCase(); // 'cs2', 'valorant', 'lol'
  const gameData = details.data || {};

  return (
    <div className="w-full lg:w-6/12 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-col shadow-xl overflow-hidden">
      
      {/* ÜST SKOR TABLOSU */}
      <div className="bg-gradient-to-b from-slate-800/50 to-transparent p-6 border-b border-slate-800/50">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <div className="flex flex-col items-center gap-2 w-1/3">
            <span className="text-white font-black text-sm text-center">{selectedMatch.team1?.name}</span>
          </div>
          <div className="flex flex-col items-center gap-1 w-1/3">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${selectedMatch.status === 'Live' ? 'bg-red-500/20 text-red-400 animate-pulse' : selectedMatch.status === 'Finished' ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}>
              {selectedMatch.status}
            </span>
            <span className="text-3xl font-black text-white tracking-widest">
              {selectedMatch.team1Score} - {selectedMatch.team2Score}
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 w-1/3">
            <span className="text-white font-black text-sm text-center">{selectedMatch.team2?.name}</span>
          </div>
        </div>
      </div>

      {/* SEKMELER */}
      <div className="flex border-b border-slate-800 px-4 gap-4 bg-slate-950/30">
        {["Detay", "Kadro", "İstatistik"].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 text-xs font-bold transition-colors relative ${activeTab === tab ? "text-blue-500" : "text-slate-400 hover:text-white"}`}>
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />}
          </button>
        ))}
      </div>

      <div className="p-4 flex-1 overflow-y-auto min-h-[400px]">
        
        {/* DETAY SEKMESİ */}
        {activeTab === "Detay" && (
          <div className="space-y-4">
            {selectedMatch.status === "Finished" && (
              <div className="bg-gradient-to-r from-blue-900/40 to-slate-800/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-800 rounded-full border-2 border-yellow-500 flex items-center justify-center text-2xl shadow-inner">👤</div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-black text-yellow-500 tracking-widest flex items-center gap-1">👑 MAÇIN OYUNCUSU (MVP)</span>
                    <span className="text-lg font-black text-white tracking-tight">{selectedMatch.mvpNickname}</span>
                  </div>
                </div>
                <div className="bg-yellow-500 text-slate-950 font-black text-sm px-3 py-2 rounded-lg shadow flex flex-col items-center">
                  <span>{selectedMatch.mvpRating}</span>
                  <span className="text-[8px] tracking-tighter uppercase font-bold -mt-0.5">Rating</span>
                </div>
              </div>
            )}
            <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-slate-800 group shadow-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-slate-800 opacity-40 filter blur-sm" />
              <button className="z-10 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg hover:scale-105 transition-all">▶</button>
              <span className="absolute bottom-3 left-3 text-[10px] text-slate-400 font-bold bg-slate-950/80 px-2 py-1 rounded border border-slate-800">🔴 Canlı Yayını İzle</span>
            </div>
          </div>
        )}

        {/* KADRO SEKMESİ */}
        {activeTab === "Kadro" && (
          <div className="text-center text-slate-500 text-xs py-10 italic">Kadro verileri sistemde mevcuttur.</div>
        )}

        {/* 🏆 AKILLI İSTATİSTİK SEKMESİ (OYUNA ÖZEL) */}
        {activeTab === "İstatistik" && (
          <div className="space-y-6">
            
            {/* --- CS2 İSTATİSTİKLERİ --- */}
            {gameType === "cs2" && (
              <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-3 border-b border-slate-700/50 pb-2 flex items-center gap-2">🔫 Harita Skorları (CS2)</h4>
                <div className="space-y-2">
                  {gameData.maps?.map((map: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded border border-slate-800">
                      <span className="text-white text-xs font-bold capitalize w-1/3">{map.mapName}</span>
                      <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded text-xs font-black text-white">{map.team1Score} - {map.team2Score}</span>
                      <span className="text-slate-500 text-[10px] font-bold uppercase w-1/3 text-right">Tamamlandı</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- VALORANT İSTATİSTİKLERİ --- */}
            {gameType === "valorant" && (
              <div className="space-y-4">
                <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <h4 className="text-red-400 text-xs font-black uppercase tracking-widest mb-3 border-b border-slate-700/50 pb-2">🎯 Harita Skorları (Valorant)</h4>
                  <div className="space-y-2">
                    {gameData.maps?.map((map: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded border border-slate-800">
                        <span className="text-white text-xs font-bold capitalize w-1/3">{map.mapName}</span>
                        <span className="bg-slate-950 border border-red-500/30 px-3 py-1 rounded text-xs font-black text-white">{map.team1Score} - {map.team2Score}</span>
                        <span className="text-slate-500 text-[10px] font-bold uppercase w-1/3 text-right">Tamamlandı</span>
                      </div>
                    ))}
                  </div>
                </div>
                {gameData.topFragger && (
                  <div className="bg-gradient-to-r from-red-900/20 to-slate-900 border border-red-500/20 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Maçın En Çok Vuranı</div>
                      <div className="text-white font-black text-sm">{gameData.topFragger.nickname} <span className="text-slate-500 font-normal ml-1">({gameData.topFragger.agent})</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold text-xs">{gameData.topFragger.kda} <span className="text-[9px] text-slate-500 uppercase ml-1">KDA</span></div>
                      <div className="text-slate-400 text-[10px]">ACS: <span className="text-white font-bold">{gameData.topFragger.combatScore}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- LEAGUE OF LEGENDS İSTATİSTİKLERİ --- */}
            {gameType === "lol" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Maç Süresi</span>
                  <span className="text-white font-black text-sm bg-slate-900 px-3 py-1 rounded border border-slate-800">{gameData.matchDuration || "34:12"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4 space-y-3">
                    <h4 className="text-blue-400 text-[10px] font-black uppercase text-center border-b border-blue-500/20 pb-2">{selectedMatch.team1?.name}</h4>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Altın:</span> <span className="text-white font-bold">{gameData.team1Stats?.gold}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Kule:</span> <span className="text-white font-bold">{gameData.team1Stats?.towers}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Ejder/Baron:</span> <span className="text-white font-bold">{gameData.team1Stats?.dragons} / {gameData.team1Stats?.barons}</span></div>
                  </div>
                  <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4 space-y-3">
                    <h4 className="text-red-400 text-[10px] font-black uppercase text-center border-b border-red-500/20 pb-2">{selectedMatch.team2?.name}</h4>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Altın:</span> <span className="text-white font-bold">{gameData.team2Stats?.gold}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Kule:</span> <span className="text-white font-bold">{gameData.team2Stats?.towers}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Ejder/Baron:</span> <span className="text-white font-bold">{gameData.team2Stats?.dragons} / {gameData.team2Stats?.barons}</span></div>
                  </div>
                </div>

                {gameData.mvpPlayer && (
                  <div className="bg-gradient-to-r from-yellow-900/20 to-slate-900 border border-yellow-500/20 rounded-lg p-4 flex justify-between items-center">
                     <div>
                      <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider mb-1">Vadi'nin Yıldızı (MVP)</div>
                      <div className="text-white font-black text-sm">{gameData.mvpPlayer.nickname} <span className="text-slate-500 font-normal ml-1">({gameData.mvpPlayer.champion})</span></div>
                    </div>
                    <div className="text-right text-white font-bold text-xs">{gameData.mvpPlayer.kda} <span className="text-[9px] text-slate-500 uppercase ml-1">KDA</span></div>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}