"use client";

import { useState } from "react";
import { ChevronLeft, Trophy, MapPin, Calendar, DollarSign, Users, Shield, LayoutGrid, Info, GitMerge, BarChart3, Filter, Target } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import NestedMatchDetail from "./NestedMatchDetail"; 

// --- 🚀 TİP TANIMLAMALARI ---
type TeamData = { name: string; short: string; color: string; score: number | string };
type MapData = { name: string; t1Score: number; t2Score: number };
type LineupData = { t1Player: string; t1Rating: number; t2Player: string; t2Rating: number };
type BracketMatch = { id: number; team1: TeamData; team2: TeamData; status: 'completed' | 'upcoming' | 'live'; time?: string; maps?: MapData[]; lineups?: LineupData[]; };
type BracketStage = { title: string; matches: BracketMatch[]; };

const GAME_CATEGORIES: Record<string, 'fps' | 'moba'> = { lol: 'moba', val: 'fps', cs2: 'fps', dota2: 'moba' };
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

// --- 🟢 API SİMÜLASYONU (Mock Data) ---
const MOCK_TOURNAMENT_TEAMS = [
  { id: 1, name: 'Sentinels', short: 'SEN', color: '#ce0037' }, { id: 2, name: 'Fnatic', short: 'FNC', color: '#ff5900' },
  { id: 3, name: 'NRG', short: 'NRG', color: '#ff4655' }, { id: 4, name: 'Cloud9', short: 'C9', color: '#00D4FF' },
  // 🚀 G2 RENK DÜZELTMESİ: Koyu gri (#1E293B) yerine parlak beyaz (#FFFFFF) yapıldı.
  { id: 5, name: 'G2 Esports', short: 'G2', color: '#FFFFFF' }, { id: 6, name: 'Vitality', short: 'VIT', color: '#ffbd00' },
  { id: 7, name: 'Team Spirit', short: 'TS', color: '#999999' }, { id: 8, name: 'Falcons', short: 'FLC', color: '#00ff00' },
];

const MOCK_BRACKET: BracketStage[] = [
  { 
    title: 'Çeyrek Final', 
    matches: [ 
      { id: 11, team1: { name: 'NRG', short: 'NRG', color: '#ff4655', score: 2 }, team2: { name: 'G2 Esports', short: 'G2', color: '#FFFFFF', score: 1 }, status: 'completed', maps: [ { name: 'Dust2', t1Score: 13, t2Score: 8 }, { name: 'Mirage', t1Score: 9, t2Score: 13 }, { name: 'Overpass', t1Score: 13, t2Score: 11 } ], lineups: [ { t1Player: 'ropz', t1Rating: 1.25, t2Player: 'm0NESY', t2Rating: 1.28 }, { t1Player: 'Fiend', t1Rating: 1.10, t2Player: 'NiKo', t2Rating: 1.15 } ] }, 
      { id: 12, team1: { name: 'Cloud9', short: 'C9', color: '#00D4FF', score: 2 }, team2: { name: 'Falcons', short: 'FLC', color: '#00ff00', score: 0 }, status: 'completed', maps: [ { name: 'Nuke', t1Score: 13, t2Score: 5 }, { name: 'Ancient', t1Score: 13, t2Score: 10 } ], lineups: [ { t1Player: 'Xeppaa', t1Rating: 1.30, t2Player: 'Snappi', t2Rating: 0.95 } ] }, 
      { id: 13, team1: { name: 'Sentinels', short: 'SEN', color: '#ce0037', score: 1 }, team2: { name: 'Team Spirit', short: 'TS', color: '#999999', score: 2 }, status: 'completed', maps: [ { name: 'Bind', t1Score: 13, t2Score: 11 }, { name: 'Split', t1Score: 7, t2Score: 13 } ], lineups: [ { t1Player: 'TenZ', t1Rating: 1.18, t2Player: 'donk', t2Rating: 1.45 } ] }, 
      { id: 14, team1: { name: 'Fnatic', short: 'FNC', color: '#ff5900', score: 1 }, team2: { name: 'Vitality', short: 'VIT', color: '#ffbd00', score: 1 }, status: 'live', maps: [ { name: 'Lotus', t1Score: 13, t2Score: 11 }, { name: 'Sunset', t1Score: 8, t2Score: 13 }, { name: 'Breeze', t1Score: 5, t2Score: 7 } ], lineups: [ { t1Player: 'Boaster', t1Rating: 1.15, t2Player: 'ZywOo', t2Rating: 1.45 }, { t1Player: 'Derke', t1Rating: 1.08, t2Player: 'Spinx', t2Rating: 1.12 } ] } 
    ] 
  },
  { 
    title: 'Yarı Final', 
    matches: [ 
      { id: 21, team1: { name: 'NRG', short: 'NRG', color: '#ff4655', score: 2 }, team2: { name: 'Cloud9', short: 'C9', color: '#00D4FF', score: 1 }, status: 'completed', maps: [ { name: 'Anubis', t1Score: 11, t2Score: 13 }, { name: 'Inferno', t1Score: 13, t2Score: 9 } ], lineups: [ { t1Player: 'ropz', t1Rating: 1.35, t2Player: 'Xeppaa', t2Rating: 1.15 } ] }, 
      { id: 22, team1: { name: 'Team Spirit', short: 'TS', color: '#999999', score: '-' }, team2: { name: 'Vitality', short: 'VIT', color: '#ffbd00', score: '-' }, status: 'upcoming', time: 'Bugün, 20:00' } 
    ] 
  },
  { title: 'Büyük Final', matches: [ { id: 31, team1: { name: 'NRG', short: 'NRG', color: '#ff4655', score: '-' }, team2: { name: 'TBD', short: 'TBD', color: '#555555', score: '-' }, status: 'upcoming', time: 'Yarın, 18:00' } ] }
];

const MOCK_STATS = {
  topPlayers: [ { rank: 1, name: 'ZywOo', team: 'VIT', color: '#ffbd00', rating: 1.46, maps: 12 }, { rank: 2, name: 'donk', team: 'TS', color: '#999999', rating: 1.45, maps: 11 }, { rank: 3, name: 'TenZ', team: 'SEN', color: '#ce0037', rating: 1.31, maps: 11 }, { rank: 4, name: 'ropz', team: 'NRG', color: '#ff4655', rating: 1.28, maps: 16 } ],
  topTeams: [ { rank: 1, name: 'NRG', color: '#ff4655', rating: 1.15, maps: 16 }, { rank: 2, name: 'Vitality', color: '#ffbd00', rating: 1.13, maps: 12 }, { rank: 3, name: 'Team Spirit', color: '#999999', rating: 1.12, maps: 11 } ],
  fpsDistribution: [ { name: 'AK-47', value: 42, color: '#4D7CFE' }, { name: 'M4A1-S', value: 28, color: '#22C55E' }, { name: 'AWP', value: 15, color: '#F59E0B' }, { name: 'Deagle', value: 8, color: '#EF4444' }, { name: 'Diğer', value: 7, color: '#8B5CF6' } ],
  mobaDistribution: [ { name: 'K’Sante', value: 35, color: '#4D7CFE' }, { name: 'Azir', value: 25, color: '#22C55E' }, { name: 'Sejuani', value: 20, color: '#F59E0B' }, { name: 'Varus', value: 12, color: '#EF4444' }, { name: 'Diğer', value: 8, color: '#8B5CF6' } ]
};

// ============================================================================
// 1. ANA BİLEŞEN (KONTROLCÜ)
// ============================================================================
export default function TournamentDetail({ tournament, onBack }: { tournament: any, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'teams' | 'matches'>('overview');
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null); 
  
  if (!tournament) return null;
  const gameColor = GAME_COLORS[tournament.game] || '#4D7CFE';
  const category = GAME_CATEGORIES[tournament.game] || 'fps';

  // 🚀 İÇ İÇE MAÇ GÖRÜNÜMÜ RENDERI 
  if (selectedMatch) {
    const adaptedMatch = {
      id: selectedMatch.id.toString(), game: tournament.game, status: selectedMatch.status, tournament: tournament.name, stage: 'Playoffs',
      team1: { ...selectedMatch.team1 }, team2: { ...selectedMatch.team2 }, displayDate: selectedMatch.status === 'live' ? 'Şu An Canlı' : 'Bugün, 19:00'
    };
    return <NestedMatchDetail match={adaptedMatch} gameColor={gameColor} category={category} onBack={() => setSelectedMatch(null)} />;
  }

  // 🏠 ANA TURNUVA GÖRÜNÜMÜ
  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in bg-es-bg">
      {/* ÜST HEADER */}
      <div className="shrink-0 relative overflow-hidden bg-es-bg-2 border-b border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: gameColor, transform: 'translate(30%, -30%)' }} />
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 px-8 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group w-fit">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Turnuvalara Dön</span>
          </button>

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded text-[10px] font-black tracking-widest text-white shadow-sm" style={{ background: gameColor }}>{tournament.game.toUpperCase()}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-white/10"><Shield className="w-3 h-3" style={{ color: gameColor }}/> {tournament.tier}</span>
                <span className={`px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-widest ${tournament.status === 'live' ? 'bg-red-500/10 text-red-400 border-red-500/20' : tournament.status === 'completed' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {tournament.status === 'live' ? 'CANLI' : tournament.status === 'completed' ? 'TAMAMLANDI' : 'YAKLAŞAN'}
                </span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">{tournament.name}</h1>
            </div>
            
            <div className="flex gap-6 bg-slate-900/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><DollarSign className="w-3 h-3"/> Ödül Havuzu</span><span className="text-base font-black text-green-400">{tournament.prizePool}</span></div>
              <div className="w-px bg-white/10" />
              <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Tarih</span><span className="text-base font-black text-white">{tournament.startDate}</span></div>
            </div>
          </div>
        </div>

        {/* SEKMELER */}
        <div className="px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex items-center gap-8">
            {[ { id: 'overview', label: 'Genel Bakış & Şema', icon: Info }, { id: 'stats', label: 'İstatistikler', icon: BarChart3 }, { id: 'teams', label: 'Katılan Takımlar', icon: Users } ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
                {activeTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: gameColor }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'overview' && <TabOverview gameColor={gameColor} bracket={MOCK_BRACKET} onMatchSelect={setSelectedMatch} />}
          {activeTab === 'stats' && <TabStats gameColor={gameColor} category={category} stats={MOCK_STATS} />}
          {activeTab === 'teams' && <TabTeams teams={MOCK_TOURNAMENT_TEAMS} />}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. ALT BİLEŞENLER
// ============================================================================

function TabOverview({ gameColor, bracket, onMatchSelect }: { gameColor: string, bracket: BracketStage[], onMatchSelect: (m: BracketMatch) => void }) {
  const renderBracketPairs = (stage: BracketStage, stageIndex: number) => {
    const pairs = [];
    for (let i = 0; i < stage.matches.length; i += 2) { pairs.push([stage.matches[i], stage.matches[i + 1]]); }
    
    return pairs.map((pair, pairIndex) => (
      <div key={pairIndex} className="flex flex-col justify-around relative flex-1 gap-6 py-4 min-h-[220px]">
        {pair[0] && <BracketMatchCard match={pair[0]} stageIndex={stageIndex} isLastStage={stageIndex === bracket.length - 1} onClick={() => onMatchSelect(pair[0])} />}
        {pair[1] && <BracketMatchCard match={pair[1]} stageIndex={stageIndex} isLastStage={stageIndex === bracket.length - 1} onClick={() => onMatchSelect(pair[1])} />}
        
        {/* KUSURSUZ ÇIZGILER */}
        {pair[1] && stageIndex < bracket.length - 1 && (
          <>
            <div className="absolute right-[-1.5rem] w-[1.5rem] border-t-2 border-b-2 border-r-2 border-slate-600 rounded-r-lg pointer-events-none" style={{ top: '25%', bottom: '25%' }} />
            <div className="absolute right-[-3rem] top-1/2 w-[1.5rem] h-[2px] bg-slate-600 pointer-events-none" />
          </>
        )}
        {!pair[1] && stageIndex < bracket.length - 1 && (
           <div className="absolute right-[-3rem] top-1/2 w-[3rem] h-[2px] bg-slate-600 pointer-events-none" />
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-xl p-6 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy className="w-4 h-4" style={{ color: gameColor }}/> Turnuva Formatı</h3>
          <p className="text-sm text-slate-400 leading-relaxed">Bu turnuva, resmi ligin son aşamasıdır. Grup aşamasından çıkan takımlar Çeyrek Finalden itibaren "Single Elimination" (Tekli Eleme) sistemiyle eşleşirler.</p>
        </div>
        <div className="col-span-1 rounded-xl p-6 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Ödül Dağılımı</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-white/5"><span className="text-xs text-slate-400 font-bold">1. Sıra</span><span className="text-xs font-black text-green-400">50%</span></div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5"><span className="text-xs text-slate-400 font-bold">2. Sıra</span><span className="text-xs font-black text-white">25%</span></div>
            <div className="flex justify-between items-center pb-2 border-b border-white/5"><span className="text-xs text-slate-400 font-bold">3. - 4. Sıra</span><span className="text-xs font-black text-white">10%</span></div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-8 shadow-lg overflow-x-auto custom-scrollbar" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2"><GitMerge className="w-4 h-4" style={{ color: gameColor }}/> Playoff Eşleşmeleri (Bracket)</h3>
        <div className="flex justify-between min-w-[900px] h-[600px] pb-12">
          {bracket.map((stage, stageIndex) => (
            <div key={stageIndex} className="flex flex-col w-64 relative">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-6 h-4">{stage.title}</div>
              <div className="flex flex-col justify-around flex-1 relative">
                {renderBracketPairs(stage, stageIndex)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BracketMatchCard({ match, stageIndex, isLastStage, onClick }: { match: BracketMatch, stageIndex: number, isLastStage: boolean, onClick: () => void }) {
  const tooltipPositionClass = isLastStage ? 'right-[105%]' : 'left-[105%]';

  return (
    <div onClick={onClick} className="relative z-10 hover:z-[60] w-full rounded-xl overflow-visible shadow-xl border border-white/10 bg-slate-900 group cursor-pointer hover:border-es-cyan/50 transition-colors">
      
      {match.status === 'upcoming' && <div className="absolute inset-0 bg-slate-900/80 z-20 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-xs font-black text-white bg-slate-800 px-3 py-1 rounded-full">{match.time}</span></div>}
      {match.status === 'live' && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg z-20 animate-pulse">CANLI</div>}
      
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-slate-800/50">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{ background: match.team1.color }} /><span className="text-xs font-bold text-white">{match.team1.name}</span></div>
        <span className={`text-sm font-black ${match.team1.score > match.team2.score ? 'text-white' : 'text-slate-500'}`}>{match.team1.score}</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-slate-800/50">
        <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-sm" style={{ background: match.team2.color }} /><span className="text-xs font-bold text-white">{match.team2.name}</span></div>
        <span className={`text-sm font-black ${match.team2.score > match.team1.score ? 'text-white' : 'text-slate-500'}`}>{match.team2.score}</span>
      </div>

      {/* CANLI VE BİTMİŞ MAÇLAR İÇİN TOOLTIP */}
      {(match.status === 'completed' || match.status === 'live') && match.maps && match.lineups && (
        <div className={`absolute ${tooltipPositionClass} top-1/2 -translate-y-1/2 w-80 bg-slate-900/95 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] p-5 pointer-events-none`} style={{ backdropFilter: 'blur(16px)' }}>
          
          <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3 relative">
            {/* CANLI MAÇ İNDİKATÖRÜ */}
            {match.status === 'live' && (
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-red-500/20 border border-red-500/50 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-black text-red-400 tracking-wider">CANLI VERİ</span>
              </div>
            )}
            
            <span className="text-sm font-black text-white" style={{ color: match.team1.color }}>{match.team1.short}</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg"><span className="text-lg font-black text-white">{match.team1.score}</span><span className="text-xs text-slate-500 font-black">:</span><span className="text-lg font-black text-white">{match.team2.score}</span></div>
            <span className="text-sm font-black text-white" style={{ color: match.team2.color }}>{match.team2.short}</span>
          </div>

          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center mb-3">Harita Skorları</div>
          <div className="space-y-1.5 mb-5">
            {match.maps.map((m, i) => (
              <div key={i} className="flex justify-between items-center text-xs px-2 py-1 rounded bg-white/5">
                <span className={`w-6 text-center ${m.t1Score > m.t2Score ? 'text-green-400 font-black' : 'text-slate-400'}`}>{m.t1Score}</span>
                <span className="text-slate-300 font-bold">{m.name}</span>
                <span className={`w-6 text-center ${m.t2Score > m.t1Score ? 'text-green-400 font-black' : 'text-slate-400'}`}>{m.t2Score}</span>
              </div>
            ))}
          </div>

          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center mb-3">Oyuncu Ratingleri</div>
          <div className="space-y-1">
            {match.lineups.map((l, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <div className="w-1/3 text-left truncate text-slate-300 font-semibold">{l.t1Player}</div>
                <div className="w-1/3 flex items-center justify-center gap-3"><span className={l.t1Rating > l.t2Rating ? 'text-white font-black' : 'text-slate-500'}>{l.t1Rating.toFixed(2)}</span><span className={l.t2Rating > l.t1Rating ? 'text-white font-black' : 'text-slate-500'}>{l.t2Rating.toFixed(2)}</span></div>
                <div className="w-1/3 text-right truncate text-slate-300 font-semibold">{l.t2Player}</div>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 pt-3 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-widest animate-pulse ${match.status === 'live' ? 'text-red-400' : 'text-es-cyan'}`}>
            {match.status === 'live' ? 'Canlı Detaylar İçin Tıklayın' : 'Maç Detayları İçin Tıklayın'}
          </div>
        </div>
      )}
    </div>
  );
}

function TabStats({ gameColor, category, stats }: { gameColor: string, category: 'fps' | 'moba', stats: any }) {
  const distributionData = category === 'fps' ? stats.fpsDistribution : stats.mobaDistribution;
  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center gap-4 bg-es-surface p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-slate-500"/><span className="text-[10px] font-black uppercase text-slate-400">Filtre:</span></div>
        <select className="bg-slate-900 border border-slate-700 text-white text-xs px-3 py-1.5 rounded outline-none cursor-pointer"><option>Tüm Aşamalar</option><option>Playoff</option></select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <div className="p-4 border-b border-white/5 bg-slate-900/50"><h3 className="text-sm font-black text-white uppercase tracking-widest">En İyi Oyuncular</h3></div>
          <div className="p-2 space-y-1">
            {stats.topPlayers.map((player: any) => (
              <div key={player.rank} className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4"><span className="text-xs font-black text-slate-500 w-4">{player.rank}.</span><div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black text-white overflow-hidden" style={{ borderColor: player.color, background: `${player.color}40` }}>{player.team}</div><span className="text-sm font-bold text-es-cyan">{player.name}</span></div>
                <div className="flex items-center gap-6">
                  <div className="text-right"><div className="text-sm font-black" style={{ color: player.rating > 1.2 ? '#22C55E' : 'white' }}>{player.rating.toFixed(2)}</div><div className="text-[9px] font-bold text-slate-500">Rating</div></div>
                  <div className="text-right w-12"><div className="text-xs font-bold text-white">{player.maps}</div><div className="text-[9px] font-bold text-slate-500">Harita</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <div className="p-4 border-b border-white/5 bg-slate-900/50"><h3 className="text-sm font-black text-white uppercase tracking-widest">En İyi Takımlar</h3></div>
          <div className="p-2 space-y-1">
            {stats.topTeams.map((team: any) => (
              <div key={team.rank} className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4"><span className="text-xs font-black text-slate-500 w-4">{team.rank}.</span><div className="w-8 h-8 rounded flex items-center justify-center text-[10px] font-black text-white" style={{ background: team.color }}>{team.name.slice(0,3).toUpperCase()}</div><span className="text-sm font-bold text-es-cyan">{team.name}</span></div>
                <div className="flex items-center gap-6">
                  <div className="text-right"><div className="text-sm font-black" style={{ color: team.rating > 1.1 ? '#22C55E' : 'white' }}>{team.rating.toFixed(2)}</div><div className="text-[9px] font-bold text-slate-500">Rating</div></div>
                  <div className="text-right w-12"><div className="text-xs font-bold text-white">{team.maps}</div><div className="text-[9px] font-bold text-slate-500">Harita</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-6 shadow-lg flex flex-col items-center" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
         <h3 className="text-sm font-black text-white uppercase tracking-widest w-full border-b border-white/5 pb-4 mb-4">{category === 'fps' ? 'En Çok Kullanılan Silahlar' : 'En Çok Seçilen Şampiyonlar'}</h3>
         <div className="w-full max-w-md h-64 relative">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                 {distributionData.map((entry: any, index: number) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
               </Pie>
               <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: 'white', fontWeight: 'bold' }} formatter={(val: any) => [`%${val}`, 'Kullanım Oranı']} />
             </PieChart>
           </ResponsiveContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><span className="text-2xl font-black text-white">100%</span><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Veri</span></div>
         </div>
         <div className="flex flex-wrap justify-center gap-4 mt-4">
           {distributionData.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm" style={{ background: entry.color }} /><span className="text-xs font-bold text-slate-300">{entry.name} <span className="text-slate-500">(%{entry.value})</span></span></div>
           ))}
         </div>
      </div>
    </div>
  );
}

function TabTeams({ teams }: { teams: any[] }) {
  return (
    <div className="animate-fade-in grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {teams.map(team => (
        <div key={team.id} className="flex items-center gap-3 p-4 rounded-xl shadow-lg border border-white/5 hover:bg-white/5 transition-colors cursor-pointer group" style={{ background: 'var(--es-card)' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-xs group-hover:scale-110 transition-transform shadow-md" style={{ background: team.color }}>{team.short}</div>
          <div className="flex flex-col"><span className="text-sm font-bold text-white">{team.name}</span><span className="text-[10px] text-slate-500 font-bold uppercase">Kadro Hazır</span></div>
        </div>
      ))}
    </div>
  );
}