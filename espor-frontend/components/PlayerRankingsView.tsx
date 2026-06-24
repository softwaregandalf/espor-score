"use client";

import { useState, useMemo } from "react";
import { Search, Trophy, Filter, Medal, User, ChevronDown, RotateCcw } from "lucide-react";
import { GAMES } from "@/app/data/mockData";
import PlayerDetail from "./PlayerDetail";
import { useLanguage } from "./LanguageProvider";

const ALLOWED_GAMES = ['lol', 'val', 'cs2', 'dota2'];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

const REGIONS = [ { id: 'eu', label: 'Europe' }, { id: 'na', label: 'North America' }, { id: 'kr', label: 'Korea' }, { id: 'cn', label: 'China' }, { id: 'br', label: 'Brazil' }, { id: 'world', label: 'World' } ];

const MOCK_PLAYERS = [
  // --- VALORANT (FPS) ---
  { id: 101, rank: 1, nickname: 'TenZ', realName: 'Tyson Ngo', nationality: '🇨🇦', role: 'Duelist', teamName: 'Sentinels', teamShort: 'SEN', teamColor: '#ce0037', game: 'val', region: 'na', rating: 1.31, acs: 265.4, kd: 1.34, hs: '35%' },
  { id: 102, rank: 2, nickname: 'Leo', realName: 'Leo Jannesson', nationality: '🇸🇪', role: 'Initiator', teamName: 'FNATIC', teamShort: 'FNC', teamColor: '#ff5900', game: 'val', region: 'eu', rating: 1.28, acs: 242.1, kd: 1.40, hs: '28%' },
  { id: 103, rank: 3, nickname: 'Aspas', realName: 'Erick Santos', nationality: '🇧🇷', role: 'Duelist', teamName: 'LEVIATÁN', teamShort: 'LEV', teamColor: '#0EA5E9', game: 'val', region: 'na', rating: 1.25, acs: 258.9, kd: 1.25, hs: '32%' },
  { id: 104, rank: 4, nickname: 'Alfajer', realName: 'Emir Beder', nationality: '🇹🇷', role: 'Sentinel', teamName: 'FNATIC', teamShort: 'FNC', teamColor: '#ff5900', game: 'val', region: 'eu', rating: 1.22, acs: 235.5, kd: 1.30, hs: '41%' },
  
  // --- CS2 (FPS) ---
  { id: 201, rank: 1, nickname: 'ZywOo', realName: 'Mathieu Herbaut', nationality: '🇫🇷', role: 'Sniper', teamName: 'Vitality', teamShort: 'VIT', teamColor: '#ffbd00', game: 'cs2', region: 'eu', rating: 1.35, acs: 85.2, kd: 1.45, hs: '42%' }, 
  { id: 202, rank: 2, nickname: 'donk', realName: 'Danil Kryshkovets', nationality: '🇷🇺', role: 'Entry', teamName: 'Team Spirit', teamShort: 'TS', teamColor: '#999999', game: 'cs2', region: 'eu', rating: 1.32, acs: 92.4, kd: 1.38, hs: '55%' },
  { id: 203, rank: 3, nickname: 'm0NESY', realName: 'Ilya Osipov', nationality: '🇷🇺', role: 'Sniper', teamName: 'G2 Esports', teamShort: 'G2', teamColor: '#ffffff', game: 'cs2', region: 'eu', rating: 1.29, acs: 80.1, kd: 1.35, hs: '38%' },

  // --- LEAGUE OF LEGENDS (MOBA) ---
  { id: 301, rank: 1, nickname: 'Faker', realName: 'Lee Sang-hyeok', nationality: '🇰🇷', role: 'Mid', teamName: 'T1', teamShort: 'T1', teamColor: '#E11D48', game: 'lol', region: 'kr', kda: '4.8', csm: 9.5, kp: '72%', dpm: 650 },
  { id: 302, rank: 2, nickname: 'Chovy', realName: 'Jeong Ji-hoon', nationality: '🇰🇷', role: 'Mid', teamName: 'Gen.G', teamShort: 'GEN', teamColor: '#aa8a00', game: 'lol', region: 'kr', kda: '6.2', csm: 10.2, kp: '68%', dpm: 710 },
  { id: 303, rank: 3, nickname: 'Caps', realName: 'Rasmus Winther', nationality: '🇩🇰', role: 'Mid', teamName: 'G2 Esports', teamShort: 'G2', teamColor: '#ffffff', game: 'lol', region: 'eu', kda: '3.9', csm: 8.9, kp: '75%', dpm: 620 },
  { id: 304, rank: 4, nickname: 'Bin', realName: 'Chen Ze-Bin', nationality: '🇨🇳', role: 'Top', teamName: 'Bilibili Gaming', teamShort: 'BLG', teamColor: '#00A1D6', game: 'lol', region: 'cn', kda: '3.5', csm: 9.1, kp: '60%', dpm: 580 },
];

function TeamLogo({ name, color }: { name: string; color: string }) {
  return <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-[10px] shadow-sm" style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function PlayerRankingsView() {
  const { t, translateApiText } = useLanguage();

  const [selectedGame, setSelectedGame] = useState<string>('val');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  const GAME_ROLES: Record<string, { id: string; label: string }[]> = {
    val: [
      { id: 'Duelist', label: 'Duelist' },
      { id: 'Initiator', label: 'Initiator' },
      { id: 'Sentinel', label: 'Sentinel' },
      { id: 'Controller', label: 'Controller' },
    ],
    cs2: [
      { id: 'Sniper', label: 'Sniper' },
      { id: 'Entry', label: 'Entry' },
      { id: 'Rifler', label: 'Rifler' },
      { id: 'IGL', label: 'IGL' },
    ],
    lol: [
      { id: 'Top', label: 'Top' },
      { id: 'Jungle', label: 'Jungle' },
      { id: 'Mid', label: 'Mid' },
      { id: 'ADC', label: 'ADC' },
      { id: 'Support', label: 'Support' },
    ],
    dota2: [
      { id: 'Carry', label: 'Carry' },
      { id: 'Mid', label: 'Mid' },
      { id: 'Offlane', label: 'Offlane' },
      { id: 'Support', label: 'Support' },
    ],
  };

  const TIMESPANS = [
    { id: '30d', label: t.last30Days },
    { id: '60d', label: t.last60Days },
    { id: '90d', label: t.last90Days },
    { id: 'all', label: t.allTime },
  ];

  const filteredPlayers = useMemo(() => {
    let result = MOCK_PLAYERS.filter(player => player.game === selectedGame);

    if (searchQuery) {
      result = result.filter(p => p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || p.realName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterRole !== 'all') {
      result = result.filter(p => p.role === filterRole);
    }
    if (filterRegion !== 'all' && filterRegion !== 'world') {
      result = result.filter(p => p.region === filterRegion);
    }

    return result.sort((a, b) => a.rank - b.rank);
  }, [selectedGame, searchQuery, filterRole, filterRegion]);

  const gameColor = GAME_COLORS[selectedGame] || '#4D7CFE';
  const gameName = GAMES.find(g => g.id === selectedGame)?.name || 'E-Spor';
  const isFPS = selectedGame === 'cs2' || selectedGame === 'val';

  const handleGameChange = (gameId: string) => {
    setSelectedGame(gameId);
    setFilterRole('all');
    setFilterRegion('all');
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-500 font-black drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]'; 
    if (rank === 2) return 'text-slate-400 font-black drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]'; 
    if (rank === 3) return 'text-amber-600 font-black drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]'; 
    return 'text-slate-500 font-bold'; 
  };

  if (selectedPlayer) {
    const category = isFPS ? 'fps' : 'moba';
    return <PlayerDetail player={selectedPlayer} gameColor={gameColor} category={category} onBack={() => setSelectedPlayer(null)} />;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in transition-colors" style={{ background: 'var(--es-bg)' }}>
      
      <div className="shrink-0 p-8 border-b relative overflow-hidden flex flex-col gap-6 transition-colors" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-700" style={{ background: gameColor, transform: 'translate(30%, -30%)' }} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-1 flex items-center gap-3 transition-colors" style={{ color: 'var(--es-text-1)' }}>
              {t.globalPlayerRankings} <Medal className="w-6 h-6" style={{ color: gameColor }} />
            </h1>
            <p className="text-sm transition-colors" style={{ color: 'var(--es-text-3)' }}>{gameName} {t.playerRankingsDesc}</p>
          </div>
          <div className="relative group w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--es-text-3)' }} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.searchPlayerInput} className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan shadow-lg placeholder:text-slate-500 dark:placeholder:text-slate-400" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }} />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 p-1.5 rounded-xl transition-colors" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
            {GAMES.filter(g => ALLOWED_GAMES.includes(g.id)).map(game => (
              <button key={game.id} onClick={() => handleGameChange(game.id)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 hover:opacity-80`} style={{ background: selectedGame === game.id ? `${GAME_COLORS[game.id]}30` : 'transparent', color: selectedGame === game.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: GAME_COLORS[game.id] }} />{game.short}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest transition-all shadow-lg hover:opacity-80`}
            style={{ background: isFilterOpen ? 'var(--es-text-1)' : 'var(--es-surface)', color: isFilterOpen ? 'var(--es-bg)' : 'var(--es-text-3)', borderColor: 'var(--es-border)' }}
          >
            <Filter className="w-3.5 h-3.5" /> {t.detailedFilter}
          </button>
        </div>

        {isFilterOpen && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-2xl border animate-fade-in shadow-2xl backdrop-blur-md transition-colors" style={{ background: 'var(--es-surface-2)', borderColor: 'var(--es-border)' }}>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1 transition-colors" style={{ color: 'var(--es-text-3)' }}>{gameName} {t.roleLabel}</label>
              <div className="relative">
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full border text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-es-cyan transition-colors appearance-none cursor-pointer shadow-inner" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
                  <option value="all">{t.allRoles}</option>
                  {GAME_ROLES[selectedGame]?.map(role => (
                    <option key={role.id} value={role.id}>{translateApiText(role.label)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" style={{ color: 'var(--es-text-3)' }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.regionLabel}</label>
              <div className="relative">
                <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="w-full border text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-es-cyan transition-colors appearance-none cursor-pointer shadow-inner" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
                  <option value="all">{t.globalWorld}</option>
                  {REGIONS.map(region => (
                    <option key={region.id} value={region.id}>{translateApiText(region.label)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" style={{ color: 'var(--es-text-3)' }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest pl-1 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.timeSpan}</label>
              <div className="relative">
                <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)} className="w-full border text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-es-cyan transition-colors appearance-none cursor-pointer shadow-inner" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
                  {TIMESPANS.map(time => (
                    <option key={time.id} value={time.id}>{time.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" style={{ color: 'var(--es-text-3)' }} />
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              <button 
                onClick={() => { setFilterRole('all'); setFilterRegion('all'); setFilterTime('all'); setSearchQuery(''); }}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/50 text-xs font-black uppercase tracking-widest rounded-xl px-4 py-3 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> {t.clearFilters}
              </button>
            </div>

          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto">
          
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4 transition-colors" style={{ color: 'var(--es-text-3)' }}>
              <User className="w-12 h-12 opacity-20" />
              <div className="text-lg font-black uppercase tracking-widest">{t.noPlayersFound}</div>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden shadow-2xl animate-fade-in transition-colors" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-widest border-b transition-colors" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)', borderColor: 'var(--es-border)' }}>
                    <th className="p-4 w-16 text-center">{t.rankCol}</th>
                    <th className="p-4">{t.playerCol}</th>
                    <th className="p-4">{t.teamCol}</th>
                    
                    {isFPS ? (
                      <>
                        <th className="p-4 text-center text-es-cyan">OVR Rating</th>
                        <th className="p-4 text-center">{selectedGame === 'cs2' ? 'ADR' : 'ACS'}</th>
                        <th className="p-4 text-center">K:D</th>
                        <th className="p-4 text-center">HS %</th>
                      </>
                    ) : (
                      <>
                        <th className="p-4 text-center text-es-cyan">KDA</th>
                        <th className="p-4 text-center">CS / {t.perMin}</th>
                        <th className="p-4 text-center">{t.scoreContribution}</th>
                        <th className="p-4 text-center">{t.damage} / {t.perMin}</th>
                      </>
                    )}
                    <th className="p-4 text-right">{t.profileCol}</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold transition-colors" style={{ color: 'var(--es-text-1)' }}>
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} onClick={() => setSelectedPlayer(player)} className="border-b transition-colors cursor-pointer group hover:opacity-80" style={{ borderColor: 'var(--es-border)' }}>
                      <td className={`p-4 text-center text-lg ${getRankStyle(player.rank)}`}>{player.rank}</td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{player.nationality}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black group-hover:text-es-cyan transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.nickname}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {/* 🚀 OYUNCU ROLÜ ARTIK TÜM OYUNLAR İÇİN ÇEVRİLİYOR (Örn: Sniper -> Keskin Nişancı, Mid -> Orta Koridor) */}
                              <span className="px-1.5 py-0.5 rounded border text-[8px] font-black uppercase transition-colors" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>{translateApiText(player.role)}</span>
                              <span className="text-[10px] uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>{player.realName}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TeamLogo name={player.teamShort} color={player.teamColor} />
                          <span className="text-xs font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.teamName}</span>
                        </div>
                      </td>

                      {isFPS ? (
                        <>
                          <td className="p-4 text-center font-black tabular-nums text-base transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.rating?.toFixed(2)}</td>
                          <td className="p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.acs}</td>
                          <td className="p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.kd}</td>
                          <td className="p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{player.hs}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 text-center font-black tabular-nums text-base transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.kda}</td>
                          <td className="p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.csm}</td>
                          <td className="p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{player.kp}</td>
                          <td className="p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.dpm}</td>
                        </>
                      )}

                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest group-hover:bg-es-cyan group-hover:text-black transition-colors" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)' }}>
                          {t.inspect}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}