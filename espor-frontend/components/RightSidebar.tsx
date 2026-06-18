"use client";

import { Clock, Users, Star, ChevronRight, TrendingUp, Zap } from "lucide-react";

export default function RightSidebar({ rankings }: { rankings: any[] }) {
  const GAME_COLORS: Record<string, string> = { lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B' };

  return (
    <div className="w-full flex flex-col gap-4 h-full rounded-xl overflow-y-auto custom-scrollbar p-1">
      
      {/* Öne Çıkan Turnuva */}
      <div className="rounded-xl p-4 relative overflow-hidden shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400">ÖNE ÇIKAN • CANLI</span>
          </div>
          <div className="text-sm font-black text-white mb-1 tracking-wide">VCT Masters Shanghai</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--es-text-3)' }}>Büyük Final • SEN vs FNC</div>
          <div className="mt-3 text-[10px] font-bold flex items-center gap-1" style={{ color: '#FF4655' }}>
            <Users className="w-3 h-3" /> 214K İzleyici
          </div>
        </div>
      </div>

      {/* Sırada Ne Var? (Yaklaşan Maçlar Mini) */}
      <div className="rounded-xl p-4 shadow-lg" style={{ background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-3.5 h-3.5" style={{ color: 'var(--es-blue)' }} />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Günün Takvimi</span>
        </div>
        <div className="flex flex-col gap-2">
          {['T1 vs HLE', 'NAVI vs FAZE', 'LOUD vs PRX'].map((match, i) => (
            <button key={i} className="flex items-center gap-2 p-2.5 rounded-lg w-full text-left transition-colors hover:bg-white/5" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#4D7CFE20', color: '#4D7CFE' }}>YAKLAŞAN</span>
                  <span className="text-[10px]" style={{ color: 'var(--es-text-3)' }}>18:00</span>
                </div>
                <span className="text-xs font-semibold text-white truncate block">{match}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--es-text-3)' }} />
            </button>
          ))}
        </div>
      </div>

      {/* Popüler Oyuncular */}
      <div className="rounded-xl p-4 shadow-lg" style={{ background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: '#22C55E' }} />
          <span className="text-[11px] font-bold text-white uppercase tracking-widest">Trend Oyuncular</span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { name: 'Faker', team: 'T1', stat: '9.5 KDA', color: '#E84057' },
            { name: 'TenZ', team: 'SEN', stat: '312 ACS', color: '#AC323F' },
            { name: 'ropz', team: 'FAZE', stat: '1.24 Rtg', color: '#FF4500' }
          ].map((player, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-white/5" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: player.color }}>
                {player.name.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white">{player.name}</div>
                <div className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--es-text-3)' }}>{player.team} • {player.stat}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsor Alanı */}
      <div className="rounded-xl p-4 flex flex-col items-center justify-center gap-2 mt-auto" style={{ background: 'var(--es-surface)', border: '1px dashed var(--es-border)', minHeight: '120px' }}>
        <Zap className="w-5 h-5" style={{ color: 'var(--es-text-3)', opacity: 0.4 }} />
        <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--es-text-3)', opacity: 0.5 }}>SPONSOR ALANI</span>
      </div>

    </div>
  );
}