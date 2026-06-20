"use client";

import { Search, ChevronDown } from "lucide-react";
import { GAMES } from "@/app/data/mockData";

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

// Bileşen içi kullanılacak ufak UI elementleri
function GameBadge({ gameId, small }: { gameId: string; small?: boolean }) {
  const game = GAMES.find(g => g.id === gameId);
  const color = GAME_COLORS[gameId] || '#A0AEC0';
  return (
    <span className={`font-bold rounded ${small ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'}`} style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
      {game?.short || gameId.toUpperCase()}
    </span>
  );
}

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-sm`} style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function MatchListSidebar({
  searchQuery,
  setSearchQuery,
  expandedSections,
  setExpandedSections,
  sections,
  selectedMatchId,
  onMatchSelect
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  expandedSections: string[];
  setExpandedSections: any;
  sections: any[];
  selectedMatchId: string | null;
  onMatchSelect: (id: string) => void;
}) {
  return (
    <div className="w-[280px] shrink-0 flex flex-col overflow-hidden transition-all duration-300 relative z-20" style={{ borderRight: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
      
      {/* ARAMA ÇUBUĞU */}
      <div className="p-3 border-b border-white/5">
        <div className="relative group">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Maç veya takım ara..." 
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none text-white transition-all bg-es-surface border border-es-border focus:border-es-cyan" 
          />
        </div>
      </div>
      
      {/* MAÇ AĞACI LİSTESİ */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {sections.map(({ label, title, matches, color }: any) => {
          const isExpanded = expandedSections.includes(label);
          return (
            <div key={label}>
              <button onClick={() => setExpandedSections((prev: any) => prev.includes(label) ? prev.filter((s: string) => s !== label) : [...prev, label])} className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/5" style={{ color }}>
                <div className="flex items-center gap-2">
                  {label === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {title} <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${color}15`, color }}>{matches.length}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
              </button>
              
              {isExpanded && (
                <div className="flex flex-col px-2 pb-2">
                  {matches.map((match: any) => (
                    <button 
                      key={match.id} 
                      onClick={() => onMatchSelect(match.id)} 
                      className="w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all group relative overflow-hidden" 
                      style={{ background: selectedMatchId === match.id ? `${GAME_COLORS[match.game]}10` : 'transparent', borderLeft: selectedMatchId === match.id ? `2px solid ${GAME_COLORS[match.game]}` : '2px solid transparent' }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                         <div className="flex items-center gap-2"><TeamLogo name={match.team1.short} color={match.team1.color} size="xs" /><span className="text-xs font-semibold text-white truncate max-w-[100px] group-hover:text-es-cyan transition-colors">{match.team1.name}</span></div>
                         <span className="text-xs font-black text-white score-display tabular-nums">{match.team1.score}</span>
                      </div>
                      <div className="flex items-center justify-between mb-1.5">
                         <div className="flex items-center gap-2"><TeamLogo name={match.team2.short} color={match.team2.color} size="xs" /><span className="text-xs font-semibold text-white truncate max-w-[100px] group-hover:text-es-cyan transition-colors">{match.team2.name}</span></div>
                         <span className="text-xs font-black text-white score-display tabular-nums">{match.team2.score}</span>
                      </div>
                      <div className="flex items-center gap-1.5"><GameBadge gameId={match.game} small /><span className="text-[9px] text-slate-500 truncate">{match.tournamentShort}</span></div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}