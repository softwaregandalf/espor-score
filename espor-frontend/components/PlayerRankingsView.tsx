"use client";

import { useState, useMemo } from "react";
import { Search, Trophy, Filter, Medal, User, ChevronDown, RotateCcw } from "lucide-react";
import { GAMES } from "@/app/data/mockData";
import PlayerDetail from "./PlayerDetail";

const ALLOWED_GAMES = ['lol', 'val', 'cs2', 'dota2'];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

// 🚀 OYUNLARA ÖZEL DİNAMİK ROL LİSTELERİ
const GAME_ROLES: Record<string, { id: string, label: string }[]> = {
  val: [ { id: 'Duelist', label: 'Düellocu (Duelist)' }, { id: 'Initiator', label: 'Öncü (Initiator)' }, { id: 'Sentinel', label: 'Gözcü (Sentinel)' }, { id: 'Controller', label: 'Kontrol Uzmanı (Controller)' } ],
  cs2: [ { id: 'Sniper', label: 'Keskin Nişancı (AWPer)' }, { id: 'Entry', label: 'Giriş (Entry Fragger)' }, { id: 'Rifler', label: 'Tüfekçi (Rifler)' }, { id: 'IGL', label: 'Oyun İçi Lider (IGL)' } ],
  lol: [ { id: 'Top', label: 'Üst Koridor (Top)' }, { id: 'Jungle', label: 'Ormancı (Jungle)' }, { id: 'Mid', label: 'Orta Koridor (Mid)' }, { id: 'ADC', label: 'Nişancı (ADC)' }, { id: 'Support', label: 'Destek (Support)' } ],
  dota2: [ { id: 'Carry', label: 'Taşıyıcı (Carry)' }, { id: 'Mid', label: 'Orta Koridor (Mid)' }, { id: 'Offlane', label: 'Offlane' }, { id: 'Support', label: 'Destek (Support)' } ]
};

const REGIONS = [ { id: 'eu', label: 'Europe (EU)' }, { id: 'na', label: 'North America (NA)' }, { id: 'kr', label: 'Korea (KR)' }, { id: 'cn', label: 'China (CN)' }, { id: 'br', label: 'Brazil (BR)' } ];
const TIMESPANS = [ { id: '30d', label: 'Son 30 Gün' }, { id: '60d', label: 'Son 60 Gün' }, { id: '90d', label: 'Son 90 Gün' }, { id: 'all', label: 'Tüm Zamanlar' } ];

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
  const [selectedGame, setSelectedGame] = useState<string>('val');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  // 🚀 FİLTRE DURUMLARI (STATE)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('all');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterTime, setFilterTime] = useState('all');

  // Akıllı Arama ve Detaylı Filtreleme Mantığı
  const filteredPlayers = useMemo(() => {
    let result = MOCK_PLAYERS.filter(player => player.game === selectedGame);

    if (searchQuery) {
      result = result.filter(p => p.nickname.toLowerCase().includes(searchQuery.toLowerCase()) || p.realName.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterRole !== 'all') {
      result = result.filter(p => p.role === filterRole);
    }
    if (filterRegion !== 'all') {
      result = result.filter(p => p.region === filterRegion);
    }

    return result.sort((a, b) => a.rank - b.rank);
  }, [selectedGame, searchQuery, filterRole, filterRegion]);

  const gameColor = GAME_COLORS[selectedGame] || '#4D7CFE';
  const gameName = GAMES.find(g => g.id === selectedGame)?.name || 'E-Spor';
  const isFPS = selectedGame === 'cs2' || selectedGame === 'val';

  // Oyun Değiştiğinde Filtreleri Sıfırla (Çünkü LoL rolüyle CS2 filtrelenemez)
  const handleGameChange = (gameId: string) => {
    setSelectedGame(gameId);
    setFilterRole('all');
    setFilterRegion('all');
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'text-yellow-400 font-black drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'; 
    if (rank === 2) return 'text-slate-300 font-black drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]'; 
    if (rank === 3) return 'text-amber-600 font-black drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]'; 
    return 'text-slate-500 font-bold'; 
  };

  if (selectedPlayer) {
    const category = isFPS ? 'fps' : 'moba';
    return <PlayerDetail player={selectedPlayer} gameColor={gameColor} category={category} onBack={() => setSelectedPlayer(null)} />;
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in" style={{ background: 'var(--es-bg)' }}>
      
      {/* ÜST BAR VE FİLTRELER */}
      <div className="shrink-0 p-8 border-b border-white/5 bg-es-bg-2 relative overflow-hidden flex flex-col gap-6 transition-all">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 pointer-events-none transition-colors duration-700" style={{ background: gameColor, transform: 'translate(30%, -30%)' }} />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1 flex items-center gap-3">
              Global Oyuncu Sıralamaları <Medal className="w-6 h-6" style={{ color: gameColor }} />
            </h1>
            <p className="text-sm text-slate-400">{gameName} arenasında bireysel istatistikleri ve ratingleri ile öne çıkan en iyi oyuncular.</p>
          </div>
          <div className="relative group w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Oyuncu ara..." className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all bg-slate-900 border border-slate-700 text-white focus:border-es-cyan shadow-lg" />
          </div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {GAMES.filter(g => ALLOWED_GAMES.includes(g.id)).map(game => (
              <button key={game.id} onClick={() => handleGameChange(game.id)} className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedGame === game.id ? 'text-white shadow-lg' : 'text-slate-500 hover:text-white'}`} style={{ background: selectedGame === game.id ? `${GAME_COLORS[game.id]}30` : 'transparent' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: GAME_COLORS[game.id] }} />{game.short}
              </button>
            ))}
          </div>
          
          {/* DETAYLI FİLTRE AÇ/KAPA BUTONU */}
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-black uppercase tracking-widest transition-all shadow-lg ${isFilterOpen ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'}`}
          >
            <Filter className="w-3.5 h-3.5" /> Detaylı Filtre
          </button>
        </div>

        {/* 🚀 AKILLI AÇILIR FİLTRE PANELİ (VLR.gg Tarzı) */}
        {isFilterOpen && (
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/80 p-5 rounded-2xl border border-white/10 animate-fade-in shadow-2xl backdrop-blur-md">
            
            {/* Rol Filtresi (Oyuna Göre Dinamik Değişir) */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">{gameName} Rolü</label>
              <div className="relative">
                <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-es-cyan transition-colors appearance-none cursor-pointer shadow-inner">
                  <option value="all">Tüm Roller</option>
                  {GAME_ROLES[selectedGame]?.map(role => (
                    <option key={role.id} value={role.id}>{role.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Bölge Filtresi */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Bölge (Region)</label>
              <div className="relative">
                <select value={filterRegion} onChange={(e) => setFilterRegion(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-es-cyan transition-colors appearance-none cursor-pointer shadow-inner">
                  <option value="all">Global (Dünya)</option>
                  {REGIONS.map(region => (
                    <option key={region.id} value={region.id}>{region.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Zaman Aralığı Filtresi */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Zaman Aralığı</label>
              <div className="relative">
                <select value={filterTime} onChange={(e) => setFilterTime(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-bold rounded-xl px-4 py-3 outline-none focus:border-es-cyan transition-colors appearance-none cursor-pointer shadow-inner">
                  {TIMESPANS.map(time => (
                    <option key={time.id} value={time.id}>{time.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sıfırlama Butonu */}
            <div className="flex flex-col gap-2 justify-end">
              <button 
                onClick={() => { setFilterRole('all'); setFilterRegion('all'); setFilterTime('all'); setSearchQuery(''); }}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/50 text-xs font-black uppercase tracking-widest rounded-xl px-4 py-3 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Temizle
              </button>
            </div>

          </div>
        )}
      </div>

      {/* İÇERİK ALANI (DİNAMİK TABLO) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto">
          
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-20 text-slate-500 flex flex-col items-center gap-4">
              <User className="w-12 h-12 opacity-20" />
              <div className="text-lg font-black uppercase tracking-widest">Bu filtrelere uygun oyuncu bulunamadı</div>
            </div>
          ) : (
            <div className="bg-es-bg-2 rounded-xl border border-white/5 overflow-hidden shadow-2xl animate-fade-in">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5">
                    <th className="p-4 w-16 text-center">Sıra</th>
                    <th className="p-4">Oyuncu</th>
                    <th className="p-4">Takım</th>
                    
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
                        <th className="p-4 text-center">CS / Dk</th>
                        <th className="p-4 text-center">Skor Katkısı</th>
                        <th className="p-4 text-center">Hasar / Dk</th>
                      </>
                    )}
                    <th className="p-4 text-right">Profil</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-slate-300">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} onClick={() => setSelectedPlayer(player)} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
                      <td className={`p-4 text-center text-lg ${getRankStyle(player.rank)}`}>{player.rank}</td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{player.nationality}</span>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white group-hover:text-es-cyan transition-colors">{player.nickname}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[8px] font-black uppercase text-slate-400">{player.role}</span>
                              <span className="text-[10px] text-slate-500 uppercase tracking-widest">{player.realName}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <TeamLogo name={player.teamShort} color={player.teamColor} />
                          <span className="text-xs font-bold text-white">{player.teamName}</span>
                        </div>
                      </td>

                      {isFPS ? (
                        <>
                          <td className="p-4 text-center font-black text-white tabular-nums text-base">{player.rating?.toFixed(2)}</td>
                          <td className="p-4 text-center tabular-nums">{player.acs}</td>
                          <td className="p-4 text-center tabular-nums">{player.kd}</td>
                          <td className="p-4 text-center tabular-nums text-slate-400">{player.hs}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-4 text-center font-black text-white tabular-nums text-base">{player.kda}</td>
                          <td className="p-4 text-center tabular-nums">{player.csm}</td>
                          <td className="p-4 text-center tabular-nums text-slate-400">{player.kp}</td>
                          <td className="p-4 text-center tabular-nums">{player.dpm}</td>
                        </>
                      )}

                      <td className="p-4 text-right">
                        <button className="px-3 py-1.5 rounded-lg bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-es-cyan group-hover:text-black transition-colors">
                          İncele
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