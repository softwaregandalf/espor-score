"use client";

import { useState, useMemo } from "react";
import { Search, Trophy, Globe, Shield, Filter, ChevronRight, TrendingUp } from "lucide-react";
import { GAMES } from "@/app/data/mockData";
import TeamDetail from "./TeamDetail"; // 🚀 YENİ OLUŞTURDUĞUMUZ MODÜLÜ İÇE AKTARDIK

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

const MOCK_RANKINGS = [
  // --- VALORANT ---
  { id: 101, rank: 1, name: 'Team Vitality', short: 'VIT', color: '#ffbd00', country: 'France', points: 2000, game: 'val', region: 'eu' },
  { id: 102, rank: 2, name: 'FNATIC', short: 'FNC', color: '#ff5900', country: 'United Kingdom', points: 1920, game: 'val', region: 'eu' },
  { id: 103, rank: 3, name: 'FUT Esports', short: 'FUT', color: '#DC2626', country: 'Türkiye', points: 1887, game: 'val', region: 'eu' },
  { id: 201, rank: 1, name: 'LEVIATÁN', short: 'LEV', color: '#0EA5E9', country: 'Argentina', points: 2000, game: 'val', region: 'na' },
  { id: 202, rank: 2, name: 'NRG', short: 'NRG', color: '#ff4655', country: 'United States', points: 1949, game: 'val', region: 'na' },
  { id: 203, rank: 3, name: 'Sentinels', short: 'SEN', color: '#ce0037', country: 'United States', points: 1792, game: 'val', region: 'na' },
  { id: 301, rank: 1, name: 'Paper Rex', short: 'PRX', color: '#f26284', country: 'Singapore', points: 1980, game: 'val', region: 'ap' },
  { id: 401, rank: 1, name: 'Gen.G', short: 'GEN', color: '#aa8a00', country: 'Korea', points: 1950, game: 'val', region: 'kr' },
  { id: 501, rank: 1, name: 'LOUD', short: 'LOUD', color: '#22C55E', country: 'Brazil', points: 1850, game: 'val', region: 'br' },
  { id: 601, rank: 1, name: 'EDward Gaming', short: 'EDG', color: '#000000', country: 'China', points: 1920, game: 'val', region: 'cn' },
  
  // --- CS2 ---
  { id: 701, rank: 1, name: 'FaZe Clan', short: 'FAZE', color: '#DC2626', country: 'Europe', points: 985, game: 'cs2', region: 'eu' },
  { id: 702, rank: 1, name: 'Complexity', short: 'COL', color: '#3B82F6', country: 'United States', points: 650, game: 'cs2', region: 'na' },

  // 🚀 --- LEAGUE OF LEGENDS ---
  { id: 801, rank: 1, name: 'T1', short: 'T1', color: '#E11D48', country: 'Korea', points: 2500, game: 'lol', region: 'kr' },
  { id: 802, rank: 2, name: 'Gen.G LoL', short: 'GEN', color: '#aa8a00', country: 'Korea', points: 2450, game: 'lol', region: 'kr' },
  { id: 803, rank: 1, name: 'G2 Esports', short: 'G2', color: '#ffffff', country: 'Europe', points: 2100, game: 'lol', region: 'eu' },
  { id: 804, rank: 2, name: 'Fnatic LoL', short: 'FNC', color: '#ff5900', country: 'Europe', points: 1950, game: 'lol', region: 'eu' },
  { id: 805, rank: 1, name: 'Bilibili Gaming', short: 'BLG', color: '#00A1D6', country: 'China', points: 2300, game: 'lol', region: 'cn' },
  { id: 806, rank: 1, name: 'Cloud9 LoL', short: 'C9', color: '#00D4FF', country: 'United States', points: 1800, game: 'lol', region: 'na' },
];

export default function TeamsView() {
  const [selectedGame, setSelectedGame] = useState<string>('val');
  const [selectedRegion, setSelectedRegion] = useState<string>('world');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 🚀 İÇ İÇE DETAY YÖNETİMİ (Kullanıcı bir takıma tıkladığında devreye girer)
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

  // 🚀 EĞER BİR TAKIM SEÇİLDİYSE, LİSTEYİ GİZLE VE DETAY SAYFASINI GÖSTER (Nested View)
  if (selectedTeam) {
    return <TeamDetail team={selectedTeam} gameColor={gameColor} onBack={() => setSelectedTeam(null)} />;
  }

  // 🏠 ANA LİSTE GÖRÜNÜMÜ
  const renderRegionColumn = (regionId: string) => {
    const regionConfig = REGIONS.find(r => r.id === regionId);
    const regionTeams = filteredTeams.filter(t => t.region === regionId).sort((a, b) => a.rank - b.rank);

    if (regionTeams.length === 0) return null;

    return (
      <div key={regionId} className="flex flex-col animate-fade-in">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <span className="text-lg">{regionConfig?.flag}</span> {regionConfig?.label}
          </h2>
          <span className="text-[10px] font-bold text-slate-500 uppercase">Puan</span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          {regionTeams.map((team) => (
            // 🔥 onClick EVENTİ EKLENDİ (Tıklandığında takımı state'e atar)
            <div key={team.id} onClick={() => setSelectedTeam(team)} className="flex items-center justify-between p-3.5 rounded-xl bg-es-bg-2 border border-white/5 hover:bg-white/5 hover:border-es-cyan/30 transition-all cursor-pointer group shadow-sm">
              <div className="flex items-center gap-5">
                <span className={`w-4 text-center ${getRankStyle(team.rank)}`}>{team.rank}</span>
                <TeamLogo name={team.short} color={team.color} size="md" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white group-hover:text-es-cyan transition-colors">{team.name}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{team.country}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-white tabular-nums">{team.points}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))}
          {selectedRegion === 'world' && (
            <button onClick={() => setSelectedRegion(regionId)} className="mt-2 w-full py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Tüm {regionConfig?.label} Sıralamasını Gör
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in" style={{ background: 'var(--es-bg)' }}>
      {/* ÜST BAR VE FİLTRELER */}
      <div className="shrink-0 p-8 border-b border-white/5 bg-es-bg-2 relative overflow-hidden flex flex-col gap-6">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-700" style={{ background: gameColor, transform: 'translate(30%, -30%)' }} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1 flex items-center gap-3">
              Dünya Takım Sıralamaları <Trophy className="w-6 h-6" style={{ color: gameColor }} />
            </h1>
            <p className="text-sm text-slate-400">{gameName} ekosistemindeki en güncel global ve bölgesel güç sıralamaları.</p>
          </div>
          <div className="relative group w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Takım ara..." className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all bg-slate-900 border border-slate-700 text-white focus:border-es-cyan shadow-lg" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {GAMES.filter(g => ALLOWED_GAMES.includes(g.id)).map(game => (
              <button 
                key={game.id} 
                onClick={() => setSelectedGame(game.id)} 
                className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedGame === game.id ? 'text-white shadow-lg' : 'text-slate-500 hover:text-white'}`} 
                style={{ background: selectedGame === game.id ? `${GAME_COLORS[game.id]}30` : 'transparent' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: GAME_COLORS[game.id] }} />{game.short}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5 hover:text-white cursor-pointer transition-colors"><Filter className="w-3.5 h-3.5" /> Detaylı Filtre</span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-1 overflow-x-auto custom-scrollbar pt-2 border-t border-white/5">
          {REGIONS.map(reg => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`shrink-0 px-5 py-3 text-xs font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${selectedRegion === reg.id ? 'text-white bg-white/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
              style={{ borderColor: selectedRegion === reg.id ? gameColor : 'transparent' }}
            >
              <span className="text-base">{reg.flag}</span> {reg.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          {filteredTeams.length === 0 ? (
            <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-4">
              <Shield className="w-12 h-12 opacity-20" />
              <div className="text-lg font-black uppercase tracking-widest">Bu kriterlere uygun takım bulunamadı</div>
            </div>
          ) : (
            <>
              {selectedRegion === 'world' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {['eu', 'na', 'ap', 'kr', 'br', 'cn'].map(regionId => renderRegionColumn(regionId))}
                </div>
              ) : (
                <div className="max-w-3xl mx-auto">
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