"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

// Dinamik Oyun Renkleri
const GAME_COLORS: Record<string, string> = {
  "lol": "#C89B3C",
  "valorant": "#FF4655",
  "cs2": "#F59E0B"
};

function GameBadge({ gameType, small }: { gameType: string; small?: boolean }) {
  const color = GAME_COLORS[gameType.toLowerCase()] || '#A0AEC0';
  return (
    <span
      className={`font-bold rounded ${small ? 'text-[9px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'}`}
      style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
    >
      {gameType.toUpperCase()}
    </span>
  );
}

// 1. Zırhlanmış Logo Bileşeni (Asla taşmaz)
function TeamLogo({ logoUrl, name, color, size = 'sm' }: { logoUrl?: string, name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  // Kesin piksel değerleri
  const sizePx = size === 'xs' ? '16px' : size === 'sm' ? '24px' : size === 'md' ? '40px' : '64px';
  
  return (
    <div
      className="flex items-center justify-center font-black text-white shrink-0 overflow-hidden bg-slate-900 border border-slate-800 rounded-lg"
      style={{ 
        width: sizePx, height: sizePx, 
        minWidth: sizePx, minHeight: sizePx, // Küçülmeyi ve büyümeyi engeller
        boxShadow: `0 0 5px ${color}30` 
      }}
    >
      {logoUrl ? (
        // object-contain ve p-0.5 resmi tam kutunun içine sığdırır
        <img src={logoUrl} alt={name} className="w-full h-full object-contain p-0.5" /> 
      ) : (
        <span style={{ fontSize: size === 'xs' ? '8px' : '10px' }}>{name?.slice(0, 3).toUpperCase()}</span>
      )}
    </div>
  );
}

// 2. Taşmayı Engelleyen Kart Bileşeni
function MatchListItem({ match, isSelected, onClick }: { match: any, isSelected: boolean, onClick: () => void }) {
  const gameType = match.gameDetails?.type?.toLowerCase() || 'cs2';
  const gameColor = GAME_COLORS[gameType] || '#A0AEC0';
  const isLive = match.status === 'Live';
  const isCompleted = match.status === 'Finished';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 transition-all rounded-lg mb-1 block overflow-hidden ${isSelected ? 'bg-white/5' : 'hover:bg-white/5'}`}
      style={{ borderLeft: isSelected ? `2px solid ${gameColor}` : '2px solid transparent' }}
    >
      <div className="flex items-start gap-2.5 w-full">
        {/* Time / Status */}
        <div className="flex flex-col items-center gap-1 pt-0.5 w-10 shrink-0">
          {isLive ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-bold text-red-400">CANLI</span>
            </>
          ) : isCompleted ? (
            <span className="text-[9px] font-semibold text-slate-500">BİTTİ</span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-400">YAKLAŞAN</span>
          )}
        </div>

        {/* Teams - min-w-0 eklenmesi metin taşmalarını önler */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 min-w-0">
              <TeamLogo logoUrl={match.team1?.logoUrl} name={match.team1?.name} color={gameColor} size="xs" />
              <span className="text-xs font-semibold truncate text-white">
                {match.team1?.name}
              </span>
            </div>
            <span className="text-xs font-black text-white shrink-0 ml-2">{isCompleted || isLive ? match.team1Score : '-'}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <TeamLogo logoUrl={match.team2?.logoUrl} name={match.team2?.name} color={gameColor} size="xs" />
              <span className="text-xs font-semibold truncate text-white">
                {match.team2?.name}
              </span>
            </div>
            <span className="text-xs font-black text-white shrink-0 ml-2">{isCompleted || isLive ? match.team2Score : '-'}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <GameBadge gameType={gameType} small />
            <span className="text-[10px] truncate text-slate-500">{match.tournament?.name}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

type FilterSection = 'Live' | 'Upcoming' | 'Finished';

export default function MatchList({ matches, selectedGame, setSelectedGame, selectedMatch, setSelectedMatch }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<FilterSection[]>(['Live', 'Upcoming', 'Finished']);

  const toggleSection = (section: FilterSection) => {
    setExpandedSections(prev => prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]);
  };

  const SECTIONS: { label: FilterSection; title: string; filter: string; color: string }[] = [
    { label: 'Live', title: 'CANLI', filter: 'Live', color: '#EF4444' },
    { label: 'Upcoming', title: 'YAKLAŞAN', filter: 'Upcoming', color: '#4D7CFE' },
    { label: 'Finished', title: 'SONUÇLAR', filter: 'Finished', color: 'var(--es-text-3)' },
  ];

  return (
    <div className="w-full flex flex-col h-full rounded-xl overflow-hidden shadow-lg border" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
      {/* Search */}
      <div className="p-3" style={{ borderBottom: '1px solid var(--es-border)' }}>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--es-text-3)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Takım ara..."
            className="w-full pl-7 pr-3 py-2 rounded-lg text-xs outline-none"
            style={{
              background: 'var(--es-surface)',
              border: '1px solid var(--es-border)',
              color: 'white',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>
      </div>

      {/* Match List (Accordion) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {SECTIONS.map(({ label, title, filter, color }) => {
          const isExpanded = expandedSections.includes(label);
          const filteredMatches = matches.filter((m: any) => {
             const statusMatch = m.status === filter;
             const searchMatch = !searchQuery || 
                m.team1?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                m.team2?.name.toLowerCase().includes(searchQuery.toLowerCase());
             return statusMatch && searchMatch;
          });

          if (filteredMatches.length === 0) return null;

          return (
            <div key={label}>
              <button
                onClick={() => toggleSection(label)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5"
                style={{ color }}
              >
                <div className="flex items-center gap-2">
                  {label === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {title}
                  <span className="text-[9px] px-1 py-0.5 rounded font-bold" style={{ background: `${color}20`, color }}>
                    {filteredMatches.length}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 transition-transform" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
              </button>

              {isExpanded && (
                <div className="flex flex-col px-2 pb-2 mt-1">
                  {filteredMatches.map((match: any) => (
                    <MatchListItem
                      key={match.id}
                      match={match}
                      isSelected={selectedMatch?.id === match.id}
                      onClick={() => setSelectedMatch(match)}
                    />
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