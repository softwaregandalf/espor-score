"use client";

import { useState, useMemo } from "react";
import { Search, Trophy, Globe, Shield, Filter, ChevronRight, TrendingUp } from "lucide-react";
import { GAMES } from "@/app/data/mockData";
import TeamDetail from "./TeamDetail"; 
import { useLanguage } from "./LanguageProvider"; 

const ALLOWED_GAMES = ['lol', 'val', 'cs2', 'dota2'];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

const REGIONS = [
  { id: 'world', label: 'World', flag: '🌍' },
  { id: 'eu', label: 'Europe', flag: '🇪🇺' },
  { id: 'na', label: 'North America', flag: '🇺🇸' },
  { id: 'br', label: 'Brazil', flag: '🇧🇷' },
  { id: 'ap', label: 'Asia-Pacific', flag: '🌏' },
  { id: 'kr', label: 'Korea', flag: '🇰🇷' },
  { id: 'cn', label: 'China', flag: '🇨🇳' },
];

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-md`} style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

// 🚀 VERİTABANI KURALI: Tüm ülke isimleri İngilizce yazıldı (Turkey dahil!)
const MOCK_RANKINGS = [
  { id: 101, rank: 1, name: 'Team Vitality', short: 'VIT', color: '#ffbd00', country: 'France', points: 2000, game: 'val', region: 'eu' },
  { id: 102, rank: 2, name: 'FNATIC', short: 'FNC', color: '#ff5900', country: 'United Kingdom', points: 1920, game: 'val', region: 'eu' },
  { id: 103, rank: 3, name: 'FUT Esports', short: 'FUT', color: '#DC2626', country: 'Turkey', points: 1887, game: 'val', region: 'eu' },
  { id: 201, rank: 1, name: 'LEVIATÁN', short: 'LEV', color: '#0EA5E9', country: 'Argentina', points: 2000, game: 'val', region: 'na' },
  { id: 202, rank: 2, name: 'NRG', short: 'NRG', color: '#ff4655', country: 'United States', points: 1949, game: 'val', region: 'na' },
  { id: 203, rank: 3, name: 'Sentinels', short: 'SEN', color: '#ce0037', country: 'United States', points: 1792, game: 'val', region: 'na' },
  { id: 301, rank: 1, name: 'Paper Rex', short: 'PRX', color: '#f26284', country: 'Singapore', points: 1980, game: 'val', region: 'ap' },
  { id: 401, rank: 1, name: 'Gen.G', short: 'GEN', color: '#aa8a00', country: 'Korea', points: 1950, game: 'val', region: 'kr' },
  { id: 501, rank: 1, name: 'LOUD', short: 'LOUD', color: '#22C55E', country: 'Brazil', points: 1850, game: 'val', region: 'br' },
  { id: 601, rank: 1, name: 'EDward Gaming', short: 'EDG', color: '#000000', country: 'China', points: 1920, game: 'val', region: 'cn' },
  
  { id: 701, rank: 1, name: 'FaZe Clan', short: 'FAZE', color: '#DC2626', country: 'Europe', points: 985, game: 'cs2', region: 'eu' },
  { id: 702, rank: 1, name: 'Complexity', short: 'COL', color: '#3B82F6', country: 'United States', points: 650, game: 'cs2', region: 'na' },

  { id: 801, rank: 1, name: 'T1', short: 'T1', color: '#E11D48', country: 'Korea', points: 2500, game: 'lol', region: 'kr' },
  { id: 802, rank: 2, name: 'Gen.G LoL', short: 'GEN', color: '#aa8a00', country: 'Korea', points: 2450, game: 'lol', region: 'kr' },
  { id: 803, rank: 1, name: 'G2 Esports', short: 'G2', color: '#ffffff', country: 'Europe', points: 2100, game: 'lol', region: 'eu' },
  { id: 804, rank: 2, name: 'Fnatic LoL', short: 'FNC', color: '#ff5900', country: 'Europe', points: 1950, game: 'lol', region: 'eu' },
  { id: 805, rank: 1, name: 'Bilibili Gaming', short: 'BLG', color: '#00A1D6', country: 'China', points: 2300, game: 'lol', region: 'cn' },
  { id: 806, rank: 1, name: 'Cloud9 LoL', short: 'C9', color: '#00D4FF', country: 'United States', points: 1800, game: 'lol', region: 'na' },
];

export default function TeamsView() {
  const { t, translateApiText, language } = useLanguage(); 
  
  const [selectedGame, setSelectedGame] = useState<string>('val');
  const [selectedRegion, setSelectedRegion] = useState<string>('world');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const filteredTeams = useMemo(() => {
    return MOCK_RANKINGS.filter(team => {
      const matchGame = team.game === selectedGame;
      const matchSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          team.short.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGame && matchSearch;
    });
  }, [selectedGame, searchQuery]);

  const gameColor = GAME_COLORS[selectedGame] || '#4D7CFE';
  const gameName = GAMES.find(g => g.id === selectedGame)?.name || 'E-Spor';

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-400 font-black drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'; 
    if (rank === 2) return 'text-slate-300 font-black drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]'; 
    if (rank === 3) return 'text-amber-600 font-black drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]'; 
    return 'text-slate-500 font-bold'; 
  };

  if (selectedTeam) {
    return <TeamDetail team={selectedTeam} gameColor={gameColor} onBack={() => setSelectedTeam(null)} />;
  }

  const renderRegionColumn = (regionId: string) => {
    const regionConfig = REGIONS.find(r => r.id === regionId);
    const regionTeams = filteredTeams.filter(t => t.region === regionId).sort((a, b) => a.rank - b.rank);

    if (!regionConfig || regionTeams.length === 0) return null;

    return (
      <div key={regionId} className="flex flex-col animate-fade-in min-w-0">
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 border-b pb-1.5 sm:pb-2 transition-colors min-w-0 gap-2" style={{ borderColor: 'var(--es-border)' }}>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0 truncate" style={{ color: 'var(--es-text-1)' }}>
            <span className="text-base sm:text-lg shrink-0">{regionConfig.flag}</span>
            <span className="truncate">{translateApiText(regionConfig.label)}</span>
          </h2>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase shrink-0 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.points}</span>
        </div>
        
        <div className="flex flex-col gap-1 sm:gap-1.5 min-w-0">
          {regionTeams.map((team) => (
            <div key={team.id} onClick={() => setSelectedTeam(team)} className="flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-xl border hover:opacity-80 transition-opacity cursor-pointer group shadow-sm min-w-0" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5 min-w-0 flex-1 overflow-hidden">
                <span className={`w-4 sm:w-5 text-center text-sm sm:text-base shrink-0 tabular-nums ${getRankStyle(team.rank)}`}>{team.rank}</span>
                <div className="md:hidden"><TeamLogo name={team.short} color={team.color} size="sm" /></div>
                <div className="hidden md:block"><TeamLogo name={team.short} color={team.color} size="md" /></div>
                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                  <span className="text-xs sm:text-sm font-bold group-hover:text-es-cyan transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{team.name}</span>
                  <span className="text-[9px] sm:text-[10px] font-semibold transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{translateApiText(team.country)}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
                <span className="text-xs sm:text-sm font-black tabular-nums transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-1)' }}>{team.points}</span>
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }} />
              </div>
            </div>
          ))}
          {selectedRegion === 'world' && (
            <button onClick={() => setSelectedRegion(regionId)} className="mt-1.5 sm:mt-2 w-full py-2.5 sm:py-3 rounded-xl border text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest hover:opacity-80 transition-opacity flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 px-2" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>
              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="truncate">{t.seeAllRegion} {translateApiText(regionConfig.label)} {t.rankingsStr}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden overflow-x-hidden animate-fade-in transition-colors min-w-0" style={{ background: 'var(--es-bg)' }}>
      <div className="shrink-0 p-3 sm:p-4 md:p-8 border-b relative overflow-hidden overflow-x-hidden flex flex-col gap-3 sm:gap-4 md:gap-6 transition-colors min-w-0" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-700" style={{ background: gameColor, transform: 'translate(30%, -30%)' }} />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 min-w-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-0.5 sm:mb-1 flex items-center gap-2 sm:gap-3 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
              <span className="truncate">{t.worldTeamRankings}</span>
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" style={{ color: gameColor }} />
            </h1>
            <p className="text-xs sm:text-sm transition-colors leading-relaxed" style={{ color: 'var(--es-text-3)' }}>{gameName} {t.teamRankingsDesc}</p>
          </div>
          <div className="relative group w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.searchTeamInput} className="w-full py-2 sm:py-2.5 pl-9 sm:pl-10 pr-3 sm:pr-4 rounded-xl text-xs sm:text-sm outline-none transition-all focus:border-es-cyan shadow-lg placeholder:text-slate-500 dark:placeholder:text-slate-400 min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }} />
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 p-1 sm:p-1.5 rounded-xl transition-colors overflow-x-auto scrollbar-hide whitespace-nowrap w-full sm:w-auto min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
            {GAMES.filter(g => ALLOWED_GAMES.includes(g.id)).map(game => (
              <button 
                key={game.id} 
                onClick={() => setSelectedGame(game.id)} 
                className="px-2.5 sm:px-3 md:px-5 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all flex items-center gap-1.5 sm:gap-2 hover:opacity-80 shrink-0" 
                style={{ background: selectedGame === game.id ? `${GAME_COLORS[game.id]}30` : 'transparent', color: selectedGame === game.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}
              >
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0" style={{ background: GAME_COLORS[game.id] }} />{game.short}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-bold transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }}>
            <span className="flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 whitespace-nowrap"><Filter className="w-3.5 h-3.5 shrink-0" /> {t.detailedFilter}</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide whitespace-nowrap pt-2 border-t pr-4 md:pr-0 min-w-0 transition-colors" style={{ borderColor: 'var(--es-border)' }}>
          {REGIONS.map(reg => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className="shrink-0 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-all border-b-2 flex items-center gap-1.5 sm:gap-2 hover:opacity-80"
              style={{ borderColor: selectedRegion === reg.id ? gameColor : 'transparent', color: selectedRegion === reg.id ? 'var(--es-text-1)' : 'var(--es-text-3)', background: 'transparent' }}
            >
              <span className="text-sm sm:text-base shrink-0">{reg.flag}</span> {translateApiText(reg.label)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-2.5 sm:p-3 md:p-8 min-w-0">
        <div className="max-w-7xl mx-auto min-w-0">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 flex flex-col items-center gap-3 sm:gap-4 transition-colors px-3" style={{ color: 'var(--es-text-3)' }}>
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 opacity-20" />
              <div className="text-sm sm:text-base md:text-lg font-black uppercase tracking-wider sm:tracking-widest">Bu kriterlere uygun takım bulunamadı</div>
            </div>
          ) : (
            <>
              {selectedRegion === 'world' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 min-w-0">
                  {['eu', 'na', 'ap', 'kr', 'br', 'cn'].map(regionId => renderRegionColumn(regionId))}
                </div>
              ) : (
                <div className="max-w-3xl mx-auto min-w-0">
                  {renderRegionColumn(selectedRegion)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
