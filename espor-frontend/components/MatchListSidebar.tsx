"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, Star } from "lucide-react";
import { GAMES } from "@/app/data/mockData";
import { useLanguage } from "./LanguageProvider";

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

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
  const { t } = useLanguage();
  const [favoriteMatches, setFavoriteMatches] = useState<Set<string>>(new Set());

  const toggleFavorite = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation(); 
    setFavoriteMatches(prev => {
      const next = new Set(prev);
      if (next.has(matchId)) next.delete(matchId); 
      else next.add(matchId);
      return next;
    });
  };

  const displaySections = useMemo(() => {
    const allMatches = sections.flatMap(s => s.matches || []);
    const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.id, m])).values());
    const favoritedMatchesList = uniqueMatches.filter(m => favoriteMatches.has(m.id));

    if (favoritedMatchesList.length === 0) return sections;

    const favoriteSection = {
      label: 'Favorites',
      title: t.favoriteMatchesTitle,
      matches: favoritedMatchesList,
      color: '#F59E0B'
    };

    return [favoriteSection, ...sections];
  }, [sections, favoriteMatches, t.favoriteMatchesTitle]); 

  return (
    <div className="w-[280px] shrink-0 flex flex-col overflow-hidden transition-all duration-300 relative z-20" style={{ borderRight: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
      <div className="p-3 border-b" style={{ borderColor: 'var(--es-border)' }}>
        <div className="relative group">
          {/* 🚀 ARAMA İKONU VE YAZISI DÜZELTİLDİ */}
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--es-text-3)' }} />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder={t.searchMatch}
            className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none transition-all" 
            style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {displaySections.map(({ label, title, matches, color }: any) => {
          const isExpanded = expandedSections.includes(label);
          return (
            <div key={label} className="mb-2">
              <button onClick={() => setExpandedSections((prev: any) => prev.includes(label) ? prev.filter((s: string) => s !== label) : [...prev, label])} className="w-full flex items-center justify-between px-2 py-2 mb-1 text-[10px] font-black uppercase tracking-widest transition-opacity hover:opacity-80 rounded-lg" style={{ color }}>
                <div className="flex items-center gap-2">
                  {label === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {label === 'Favorites' && <Star className="w-3.5 h-3.5 fill-current text-yellow-500 animate-bounce" />}
                  {title} <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${color}15`, color }}>{matches.length}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
              </button>
              
              {isExpanded && (
                <div className="flex flex-col gap-1.5 pb-2">
                  {matches.map((match: any) => {
                    const isSelected = selectedMatchId === match.id;
                    const isFavorite = favoriteMatches.has(match.id);

                    return (
                      <button 
                        key={match.id} 
                        onClick={() => onMatchSelect(match.id)} 
                        className="w-full text-left px-3 py-2.5 rounded-xl transition-all group relative overflow-hidden shadow-sm hover:opacity-90" 
                        style={{ background: isSelected ? 'var(--es-surface)' : 'var(--es-bg)', border: '1px solid var(--es-border)', borderLeft: isSelected ? `3px solid ${GAME_COLORS[match.game]}` : '1px solid transparent' }}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                           <div className="flex items-center gap-2">
                             <TeamLogo name={match.team1.short} color={match.team1.color} size="xs" />
                             {/* 🚀 CSS DEĞİŞKENİNE (VAR) GERİ DÖNÜLDÜ */}
                             <span className="text-xs font-semibold truncate max-w-[100px] transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team1.name}</span>
                           </div>
                           <span className="text-xs font-black score-display tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team1.score}</span>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                           <div className="flex items-center gap-2">
                             <TeamLogo name={match.team2.short} color={match.team2.color} size="xs" />
                             {/* 🚀 CSS DEĞİŞKENİNE (VAR) GERİ DÖNÜLDÜ */}
                             <span className="text-xs font-semibold truncate max-w-[100px] transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team2.name}</span>
                           </div>
                           <span className="text-xs font-black score-display tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team2.score}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--es-border)' }}>
                           <div className="flex items-center gap-1.5">
                             <GameBadge gameId={match.game} small />
                             <span className="text-[9px] font-semibold truncate transition-colors" style={{ color: 'var(--es-text-3)' }}>{match.tournamentShort}</span>
                           </div>
                           <div 
                             onClick={(e) => toggleFavorite(e, match.id)}
                             className={`p-1.5 rounded-md transition-all flex items-center justify-center ${isFavorite ? 'opacity-100 bg-yellow-500/10 text-yellow-500' : 'opacity-0 group-hover:opacity-100 hover:bg-yellow-500/10 hover:text-yellow-500'}`} style={{ color: isFavorite ? '' : 'var(--es-text-3)' }}
                           >
                             <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                           </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}