"use client";

import { useMemo } from "react";
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

function CollapsibleSection({
  isExpanded,
  children,
}: {
  isExpanded: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-300 ease-in-out"
      style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden min-h-0">
        {children}
      </div>
    </div>
  );
}

export default function MatchListSidebar({
  searchQuery,
  setSearchQuery,
  expandedSections,
  setExpandedSections,
  sections,
  selectedMatchId,
  onMatchSelect,
  favoriteMatchIds,
  onToggleFavorite,
  isMobile = false,
  onClose,
  swipeHint,
}: {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  expandedSections: string[];
  setExpandedSections: any;
  sections: any[];
  selectedMatchId: string | null;
  onMatchSelect: (id: string) => void;
  favoriteMatchIds: Set<string>;
  onToggleFavorite: (matchId: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
  swipeHint?: string;
}) {
  const { t } = useLanguage();

  const toggleFavorite = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    onToggleFavorite(matchId);
  };

  const displaySections = useMemo(() => {
    const allMatches = sections.flatMap(s => s.matches || []);
    const uniqueMatches = Array.from(new Map(allMatches.map(m => [m.id, m])).values());
    const favoritedMatchesList = uniqueMatches.filter(m => favoriteMatchIds.has(m.id));

    if (favoritedMatchesList.length === 0) return sections;

    const favoriteSection = {
      label: 'Favorites',
      title: t.favoriteMatchesTitle,
      matches: favoritedMatchesList,
      color: '#F59E0B'
    };

    return [favoriteSection, ...sections];
  }, [sections, favoriteMatchIds, t.favoriteMatchesTitle]);

  return (
    <div className={`${isMobile ? 'w-full h-full' : 'w-[280px] h-full'} shrink-0 flex flex-col overflow-hidden overflow-x-hidden transition-all duration-300 relative z-20 min-w-0`} style={{ borderRight: isMobile ? 'none' : '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
      {isMobile && (
        <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 border-b min-w-0" style={{ borderColor: 'var(--es-border)' }}>
          <span className="text-sm font-black truncate min-w-0 flex-1" style={{ color: 'var(--es-text-1)' }}>{t.liveMatches}</span>
          <div className="flex items-center gap-1.5 shrink-0">
            {swipeHint && (
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider max-w-[100px] sm:max-w-[140px] truncate" style={{ color: 'var(--es-text-3)' }}>
                {swipeHint}
              </span>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg transition-colors hover:bg-white/5 shrink-0"
                style={{ color: 'var(--es-text-3)' }}
                aria-label={swipeHint || t.liveMatches}
              >
                <ChevronDown className="w-4 h-4 -rotate-90" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className={`border-b shrink-0 ${isMobile ? 'p-2.5' : 'p-3'}`} style={{ borderColor: 'var(--es-border)' }}>
        <div className="relative group min-w-0">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }} />
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder={t.searchMatch}
            className={`w-full min-w-0 pl-8 pr-3 rounded-lg outline-none transition-all ${isMobile ? 'py-2.5 text-sm' : 'py-2 text-xs'}`}
            style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }}
          />
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0 ${isMobile ? 'p-2 pb-6' : 'p-2 pb-20'}`}>
        {displaySections.map(({ label, title, matches, color }: any) => {
          const isExpanded = expandedSections.includes(label);
          return (
            <div key={label} className="mb-1 min-w-0">
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() => setExpandedSections((prev: any) => prev.includes(label) ? prev.filter((s: string) => s !== label) : [...prev, label])}
                className="w-full flex items-center justify-between gap-2 px-2 py-2 mb-0.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 hover:bg-white/5 rounded-lg group min-w-0"
                style={{ color }}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {label === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />}
                  {label === 'Favorites' && <Star className="w-3.5 h-3.5 fill-current text-yellow-500 animate-bounce shrink-0" />}
                  <span className="truncate">{title}</span>
                  <span className="px-1.5 py-0.5 rounded font-bold shrink-0" style={{ background: `${color}15`, color }}>{matches.length}</span>
                </div>
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-300 shrink-0 opacity-60 group-hover:opacity-100"
                  style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
              </button>

              <CollapsibleSection isExpanded={isExpanded}>
                <div className="flex flex-col gap-1.5 pb-2 pt-0.5 min-w-0">
                  {matches.map((match: any) => {
                    const isSelected = selectedMatchId === match.id;
                    const isFavorite = favoriteMatchIds.has(match.id);

                    return (
                      <button 
                        key={match.id} 
                        onClick={() => onMatchSelect(match.id)} 
                        className={`w-full min-w-0 text-left rounded-xl transition-all group relative overflow-hidden shadow-sm hover:opacity-90 ${isMobile ? 'px-2.5 py-2' : 'px-3 py-2.5'}`}
                        style={{ background: isSelected ? 'var(--es-surface)' : 'var(--es-bg)', border: '1px solid var(--es-border)', borderLeft: isSelected ? `3px solid ${GAME_COLORS[match.game]}` : '1px solid transparent' }}
                      >
                        <div className="flex items-stretch gap-2 min-w-0">
                          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 min-w-0">
                              <TeamLogo name={match.team1.short} color={match.team1.color} size="xs" />
                              <span className="flex-1 min-w-0 text-xs font-semibold truncate" style={{ color: 'var(--es-text-1)' }}>{match.team1.name}</span>
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <TeamLogo name={match.team2.short} color={match.team2.color} size="xs" />
                              <span className="flex-1 min-w-0 text-xs font-semibold truncate" style={{ color: 'var(--es-text-1)' }}>{match.team2.name}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 w-7">
                            <span className="text-sm font-black tabular-nums leading-none" style={{ color: 'var(--es-text-1)' }}>{match.team1.score}</span>
                            <span className="text-sm font-black tabular-nums leading-none" style={{ color: 'var(--es-text-1)' }}>{match.team2.score}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t min-w-0" style={{ borderColor: 'var(--es-border)' }}>
                           <div className="flex items-center gap-1.5 min-w-0 flex-1">
                             <GameBadge gameId={match.game} small />
                             <span className="text-[9px] font-semibold truncate min-w-0" style={{ color: 'var(--es-text-3)' }}>{match.tournamentShort}</span>
                           </div>
                           <div 
                             onClick={(e) => toggleFavorite(e, match.id)}
                             className={`p-1 rounded-md transition-all flex items-center justify-center shrink-0 ${isFavorite ? 'opacity-100 bg-yellow-500/10 text-yellow-500' : isMobile ? 'opacity-70' : 'opacity-0 group-hover:opacity-100 hover:bg-yellow-500/10 hover:text-yellow-500'}`}
                             style={{ color: isFavorite ? '' : 'var(--es-text-3)' }}
                           >
                             <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                           </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CollapsibleSection>
            </div>
          );
        })}
      </div>
    </div>
  );
}