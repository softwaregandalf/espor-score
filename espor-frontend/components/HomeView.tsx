"use client";

import { Flame, PlayCircle, Trophy, Star, MonitorPlay, ChevronRight, Clock, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

const GAME_COLORS: Record<string, string> = {
  lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C'
};

function GameBadge({ gameType }: { gameType: string }) {
  const color = GAME_COLORS[gameType.toLowerCase()] || '#A0AEC0';
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
      {gameType}
    </span>
  );
}

function TeamLogo({ logoUrl, name, color, size = 'md' }: { logoUrl?: string, name: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizePx = size === 'sm' ? '28px' : size === 'md' ? '44px' : '64px';
  return (
    <div className="rounded-xl flex items-center justify-center font-black text-white shrink-0 overflow-hidden bg-slate-900 border border-slate-800" style={{ width: sizePx, height: sizePx, minWidth: sizePx, minHeight: sizePx, background: color }}>
      {logoUrl ? <img src={logoUrl} alt={name} className="w-full h-full object-contain p-1" /> : name?.slice(0, 3).toUpperCase()}
    </div>
  );
}

export default function HomeView({ matches }: { matches: any[] }) {
  // Canlı ve Biten Maçları Filtreleme
  const liveMatches = matches.filter(m => m.status === 'Live').slice(0, 6);
  const completedMatches = matches.filter(m => m.status === 'Finished').slice(0, 4);
  const featuredMatch = liveMatches[0] || matches[0]; // İlk canlı maç veya herhangi bir maç

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        
        {/* 🌟 HERO: ÖNE ÇIKAN MAÇ */}
        {featuredMatch && (
          <section className="mb-8">
            <div className="relative rounded-2xl overflow-hidden group" style={{ height: '280px', background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${GAME_COLORS[featuredMatch.gameDetails?.type?.toLowerCase() || 'cs2']}15 0%, transparent 50%, var(--es-card) 100%)` }} />
              <div className="absolute inset-0 cyber-grid opacity-20" />
              
              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  {featuredMatch.status === 'Live' && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-red-400">CANLI — GÜNÜN MAÇI</span>
                    </div>
                  )}
                  <GameBadge gameType={featuredMatch.gameDetails?.type || 'ESPOR'} />
                  <span className="text-xs font-bold" style={{ color: 'var(--es-text-3)' }}>{featuredMatch.tournament?.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center gap-2">
                      <TeamLogo logoUrl={featuredMatch.team1?.logoUrl} name={featuredMatch.team1?.name} color={GAME_COLORS[featuredMatch.gameDetails?.type?.toLowerCase() || 'cs2']} size="lg" />
                      <span className="text-sm font-bold text-white">{featuredMatch.team1?.name}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="text-5xl font-black text-white score-display tracking-tighter">
                        {featuredMatch.team1Score} <span style={{ color: 'var(--es-text-3)' }}>:</span> {featuredMatch.team2Score}
                      </div>
                      <span className="text-xs font-medium px-3 py-1.5 rounded-lg mt-1" style={{ background: 'var(--es-surface)', color: GAME_COLORS[featuredMatch.gameDetails?.type?.toLowerCase() || 'cs2'] }}>
                        {featuredMatch.status === 'Live' ? 'Skor Güncelleniyor' : 'Maç Sona Erdi'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <TeamLogo logoUrl={featuredMatch.team2?.logoUrl} name={featuredMatch.team2?.name} color={GAME_COLORS[featuredMatch.gameDetails?.type?.toLowerCase() || 'cs2']} size="lg" />
                      <span className="text-sm font-bold text-white">{featuredMatch.team2?.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg" style={{ background: 'linear-gradient(135deg, #4D7CFE, #7C3AED)', color: 'white' }}>
                      <PlayCircle className="w-5 h-5" /> Canlı İzle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 🔴 CANLI MAÇLAR GRID */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-white text-lg">Canlı Maçlar</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>{liveMatches.length}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {liveMatches.length === 0 ? (
              <div className="col-span-2 p-8 text-center border border-dashed rounded-xl border-slate-800 text-slate-500 font-bold text-sm">Şu an canlı maç bulunmuyor.</div>
            ) : (
              liveMatches.map((match) => (
                <div key={match.id} className="p-4 rounded-xl cursor-pointer transition-all hover:brightness-110 hover:border-slate-600 relative overflow-hidden group" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <GameBadge gameType={match.gameDetails?.type || 'ESPOR'} />
                      <span className="text-xs truncate max-w-[120px] font-bold" style={{ color: 'var(--es-text-3)' }}>{match.tournament?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] font-black text-red-400 tracking-widest">CANLI</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TeamLogo logoUrl={match.team1?.logoUrl} name={match.team1?.name} color={GAME_COLORS[match.gameDetails?.type?.toLowerCase() || 'cs2']} size="sm" />
                        <span className="text-sm font-bold text-white">{match.team1?.name}</span>
                      </div>
                      <span className="font-black text-xl text-white score-display">{match.team1Score}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TeamLogo logoUrl={match.team2?.logoUrl} name={match.team2?.name} color={GAME_COLORS[match.gameDetails?.type?.toLowerCase() || 'cs2']} size="sm" />
                        <span className="text-sm font-bold text-white">{match.team2?.name}</span>
                      </div>
                      <span className="font-black text-xl text-white score-display">{match.team2Score}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}