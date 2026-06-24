"use client";

import { useState } from "react";
import { ChevronLeft, Trophy, Calendar, DollarSign, Users, Shield, Info, GitMerge, BarChart3, Filter } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import MatchDetail from "./MatchDetail"; 
import { useLanguage } from "./LanguageProvider"; 

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
  { id: 5, name: 'G2 Esports', short: 'G2', color: '#FFFFFF' }, { id: 6, name: 'Vitality', short: 'VIT', color: '#ffbd00' },
  { id: 7, name: 'Team Spirit', short: 'TS', color: '#999999' }, { id: 8, name: 'Falcons', short: 'FLC', color: '#00ff00' },
];

const MOCK_BRACKET: BracketStage[] = [
  { 
    title: 'Quarterfinals', 
    matches: [ 
      { id: 11, team1: { name: 'NRG', short: 'NRG', color: '#ff4655', score: 2 }, team2: { name: 'G2 Esports', short: 'G2', color: '#FFFFFF', score: 1 }, status: 'completed', maps: [ { name: 'Dust2', t1Score: 13, t2Score: 8 }, { name: 'Mirage', t1Score: 9, t2Score: 13 }, { name: 'Overpass', t1Score: 13, t2Score: 11 } ], lineups: [ { t1Player: 'ropz', t1Rating: 1.25, t2Player: 'm0NESY', t2Rating: 1.28 }, { t1Player: 'Fiend', t1Rating: 1.10, t2Player: 'NiKo', t2Rating: 1.15 } ] }, 
      { id: 12, team1: { name: 'Cloud9', short: 'C9', color: '#00D4FF', score: 2 }, team2: { name: 'Falcons', short: 'FLC', color: '#00ff00', score: 0 }, status: 'completed', maps: [ { name: 'Nuke', t1Score: 13, t2Score: 5 }, { name: 'Ancient', t1Score: 13, t2Score: 10 } ], lineups: [ { t1Player: 'Xeppaa', t1Rating: 1.30, t2Player: 'Snappi', t2Rating: 0.95 } ] }, 
      { id: 13, team1: { name: 'Sentinels', short: 'SEN', color: '#ce0037', score: 1 }, team2: { name: 'Team Spirit', short: 'TS', color: '#999999', score: 2 }, status: 'completed', maps: [ { name: 'Bind', t1Score: 13, t2Score: 11 }, { name: 'Split', t1Score: 7, t2Score: 13 } ], lineups: [ { t1Player: 'TenZ', t1Rating: 1.18, t2Player: 'donk', t2Rating: 1.45 } ] }, 
      { id: 14, team1: { name: 'Fnatic', short: 'FNC', color: '#ff5900', score: 1 }, team2: { name: 'Vitality', short: 'VIT', color: '#ffbd00', score: 1 }, status: 'live', maps: [ { name: 'Lotus', t1Score: 13, t2Score: 11 }, { name: 'Sunset', t1Score: 8, t2Score: 13 }, { name: 'Breeze', t1Score: 5, t2Score: 7 } ], lineups: [ { t1Player: 'Boaster', t1Rating: 1.15, t2Player: 'ZywOo', t2Rating: 1.45 }, { t1Player: 'Derke', t1Rating: 1.08, t2Player: 'Spinx', t2Rating: 1.12 } ] } 
    ] 
  },
  { 
    title: 'Semifinals', 
    matches: [ 
      { id: 21, team1: { name: 'NRG', short: 'NRG', color: '#ff4655', score: 2 }, team2: { name: 'Cloud9', short: 'C9', color: '#00D4FF', score: 1 }, status: 'completed', maps: [ { name: 'Anubis', t1Score: 11, t2Score: 13 }, { name: 'Inferno', t1Score: 13, t2Score: 9 } ], lineups: [ { t1Player: 'ropz', t1Rating: 1.35, t2Player: 'Xeppaa', t2Rating: 1.15 } ] }, 
      { id: 22, team1: { name: 'Team Spirit', short: 'TS', color: '#999999', score: '-' }, team2: { name: 'Vitality', short: 'VIT', color: '#ffbd00', score: '-' }, status: 'upcoming', time: 'Today, 20:00' } 
    ] 
  },
  { title: 'Grand Final', matches: [ { id: 31, team1: { name: 'NRG', short: 'NRG', color: '#ff4655', score: '-' }, team2: { name: 'TBD', short: 'TBD', color: '#555555', score: '-' }, status: 'upcoming', time: 'Tomorrow, 18:00' } ] }
];

const MOCK_STATS = {
  topPlayers: [ { rank: 1, name: 'ZywOo', team: 'VIT', color: '#ffbd00', rating: 1.46, maps: 12 }, { rank: 2, name: 'donk', team: 'TS', color: '#999999', rating: 1.45, maps: 11 }, { rank: 3, name: 'TenZ', team: 'SEN', color: '#ce0037', rating: 1.31, maps: 11 }, { rank: 4, name: 'ropz', team: 'NRG', color: '#ff4655', rating: 1.28, maps: 16 } ],
  topTeams: [ { rank: 1, name: 'NRG', color: '#ff4655', rating: 1.15, maps: 16 }, { rank: 2, name: 'Vitality', color: '#ffbd00', rating: 1.13, maps: 12 }, { rank: 3, name: 'Team Spirit', color: '#999999', rating: 1.12, maps: 11 } ],
  fpsDistribution: [ { name: 'AK-47', value: 42, color: '#4D7CFE' }, { name: 'M4A1-S', value: 28, color: '#22C55E' }, { name: 'AWP', value: 15, color: '#F59E0B' }, { name: 'Deagle', value: 8, color: '#EF4444' }, { name: 'Other', value: 7, color: '#8B5CF6' } ],
  mobaDistribution: [ { name: 'K’Sante', value: 35, color: '#4D7CFE' }, { name: 'Azir', value: 25, color: '#22C55E' }, { name: 'Sejuani', value: 20, color: '#F59E0B' }, { name: 'Varus', value: 12, color: '#EF4444' }, { name: 'Other', value: 8, color: '#8B5CF6' } ]
};

// ============================================================================
// 1. ANA BİLEŞEN (KONTROLCÜ)
// ============================================================================
export default function TournamentDetail({ tournament, onBack }: { tournament: any, onBack: () => void }) {
  const { t, translateApiText } = useLanguage(); 
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'teams' | 'matches'>('overview');
  const [selectedMatch, setSelectedMatch] = useState<BracketMatch | null>(null); 
  
  if (!tournament) return null;
  const gameColor = GAME_COLORS[tournament.game] || '#4D7CFE';
  const category = GAME_CATEGORIES[tournament.game] || 'fps';

  if (selectedMatch) {
    const adaptedMatch = {
      id: selectedMatch.id.toString(), 
      game: tournament.game, 
      status: selectedMatch.status === 'completed' ? 'Finished' : selectedMatch.status === 'live' ? 'Live' : 'Upcoming', 
      tournament: { name: tournament.name, stage: "Playoffs", prizePool: tournament.prizePool }, 
      team1: { ...selectedMatch.team1 }, 
      team2: { ...selectedMatch.team2 }, 
      team1Score: selectedMatch.team1.score, 
      team2Score: selectedMatch.team2.score,
      displayDate: selectedMatch.status === 'live' ? 'Şu An Canlı' : 'Bugün, 19:00'
    };
    return (
      <div className="flex-1 flex flex-col h-full overflow-x-hidden transition-colors" style={{ background: 'var(--es-bg)' }}>
        <MatchDetail selectedMatch={adaptedMatch} onBack={() => setSelectedMatch(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden overflow-x-hidden animate-fade-in transition-colors" style={{ background: 'var(--es-bg)' }}>
      <div className="shrink-0 relative overflow-hidden overflow-x-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none" style={{ background: gameColor, transform: 'translate(30%, -30%)' }} />
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 px-3 py-4 md:px-8 md:py-6 max-w-7xl mx-auto w-full min-w-0 flex flex-col gap-4 md:gap-6">
          <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 transition-opacity group w-fit max-w-full min-w-0">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all shrink-0" style={{ background: 'var(--es-surface)' }}>
              <ChevronLeft className="w-4 h-4" style={{ color: 'var(--es-text-1)' }} />
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{t.backToTournaments}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 min-w-0">
            <div className="flex flex-col gap-2 md:gap-3 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded text-[9px] md:text-[10px] font-black tracking-widest text-white shadow-sm shrink-0" style={{ background: gameColor }}>
                  {tournament.game.toUpperCase()}
                </span>
                <span className="flex items-center gap-1 md:gap-1.5 text-[9px] md:text-[10px] font-black uppercase tracking-widest px-1.5 md:px-2 py-0.5 md:py-1 rounded border transition-colors shrink-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>
                  <Shield className="w-3 h-3 shrink-0" style={{ color: gameColor }}/>
                  {translateApiText(tournament.tier)}
                </span>
                <span className={`px-2 md:px-2.5 py-0.5 md:py-1 rounded border text-[9px] md:text-[10px] font-black uppercase tracking-widest shrink-0 ${tournament.status === 'live' ? 'bg-red-500/10 text-red-500 border-red-500/20' : tournament.status === 'completed' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                  {tournament.status === 'live' ? t.live : tournament.status === 'completed' ? t.completed : t.upcoming}
                </span>
              </div>
              <h1 className="text-xl md:text-4xl font-black tracking-tight transition-colors break-words leading-tight" style={{ color: 'var(--es-text-1)' }}>
                {tournament.name}
              </h1>
            </div>
            
            <div className="flex gap-4 md:gap-6 p-3 md:p-4 rounded-xl border backdrop-blur-sm transition-colors w-full md:w-auto shrink-0 min-w-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
              <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors leading-tight" style={{ color: 'var(--es-text-3)' }}>
                  <DollarSign className="w-3 h-3 shrink-0"/> {t.prizePool}
                </span>
                <span className="text-sm md:text-base font-black text-green-500 truncate transition-colors">{tournament.prizePool}</span>
              </div>
              <div className="w-px shrink-0 transition-colors" style={{ background: 'var(--es-border)' }} />
              <div className="flex flex-col gap-0.5 md:gap-1 min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors leading-tight" style={{ color: 'var(--es-text-3)' }}>
                  <Calendar className="w-3 h-3 shrink-0"/> {t.date}
                </span>
                <span className="text-sm md:text-base font-black truncate transition-colors" style={{ color: 'var(--es-text-1)' }}>{translateApiText(tournament.startDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3 md:px-8 border-t transition-colors overflow-x-hidden" style={{ borderColor: 'var(--es-border)' }}>
          <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-8 overflow-x-auto scrollbar-hide whitespace-nowrap pr-4 md:pr-0 min-w-0">
            {[
              { id: 'overview', label: t.overview, icon: Info },
              { id: 'stats', label: t.statistics, icon: BarChart3 },
              { id: 'teams', label: t.teams, icon: Users },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="py-3 md:py-4 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-1.5 md:gap-2 hover:opacity-80 shrink-0"
                style={{ color: activeTab === tab.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}
              >
                <tab.icon className="w-3.5 md:w-4 h-3.5 md:h-4 shrink-0" />
                {tab.label}
                {activeTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: gameColor }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 pb-12 md:p-8 md:pb-8 min-h-0">
        <div className="max-w-7xl mx-auto min-w-0">
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
  const { t, translateApiText } = useLanguage();

  const renderBracketPairs = (stage: BracketStage, stageIndex: number) => {
    const pairs = [];
    for (let i = 0; i < stage.matches.length; i += 2) { pairs.push([stage.matches[i], stage.matches[i + 1]]); }
    
    return pairs.map((pair, pairIndex) => (
      <div key={pairIndex} className="flex flex-col justify-around relative flex-1 gap-6 py-4 min-h-[180px] md:min-h-[220px]">
        {pair[0] && <BracketMatchCard match={pair[0]} stageIndex={stageIndex} isLastStage={stageIndex === bracket.length - 1} onClick={() => onMatchSelect(pair[0])} />}
        {pair[1] && <BracketMatchCard match={pair[1]} stageIndex={stageIndex} isLastStage={stageIndex === bracket.length - 1} onClick={() => onMatchSelect(pair[1])} />}
        
        {pair[1] && stageIndex < bracket.length - 1 && (
          <>
            <div className="absolute right-[-1.5rem] w-[1.5rem] border-t-2 border-b-2 border-r-2 rounded-r-lg pointer-events-none transition-colors hidden md:block" style={{ top: '25%', bottom: '25%', borderColor: 'var(--es-border)' }} />
            <div className="absolute right-[-3rem] top-1/2 w-[1.5rem] h-[2px] pointer-events-none transition-colors hidden md:block" style={{ background: 'var(--es-border)' }} />
          </>
        )}
        {!pair[1] && stageIndex < bracket.length - 1 && (
           <div className="absolute right-[-3rem] top-1/2 w-[3rem] h-[2px] pointer-events-none transition-colors hidden md:block" style={{ background: 'var(--es-border)' }} />
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-6 animate-fade-in min-w-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="md:col-span-2 rounded-xl p-3 md:p-6 shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>
            <Trophy className="w-4 h-4 shrink-0" style={{ color: gameColor }}/> {t.format}
          </h3>
          <p className="text-xs md:text-sm leading-relaxed transition-colors whitespace-normal" style={{ color: 'var(--es-text-3)' }}>{t.tournamentFormatDesc}</p>
        </div>
        <div className="rounded-xl p-3 md:p-6 shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mb-3 md:mb-4 transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.prizeDistribution}</h3>
          <div className="space-y-2 md:space-y-3">
            <div className="flex justify-between items-center gap-2 pb-2 border-b transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
              <span className="text-[11px] md:text-xs font-bold transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{t.firstPlace}</span>
              <span className="text-[11px] md:text-xs font-black text-green-500 shrink-0">50%</span>
            </div>
            <div className="flex justify-between items-center gap-2 pb-2 border-b transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
              <span className="text-[11px] md:text-xs font-bold transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{t.secondPlace}</span>
              <span className="text-[11px] md:text-xs font-black shrink-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>25%</span>
            </div>
            <div className="flex justify-between items-center gap-2 pb-2 border-b transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
              <span className="text-[11px] md:text-xs font-bold transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{t.thirdFourthPlace}</span>
              <span className="text-[11px] md:text-xs font-black shrink-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>10%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-3 md:p-8 shadow-lg transition-colors min-w-0 overflow-x-hidden" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
        <h3 className="text-xs md:text-sm font-black uppercase tracking-widest mb-4 md:mb-8 flex items-center gap-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>
          <GitMerge className="w-4 h-4 shrink-0" style={{ color: gameColor }}/> {t.playoffBracket}
        </h3>

        {/* Mobil: aşamalar alt alta, tüm maçlar kaydırılabilir */}
        <div className="flex flex-col gap-5 md:hidden min-w-0 pb-2">
          {bracket.map((stage, stageIndex) => (
            <div key={stageIndex} className="flex flex-col gap-3 min-w-0">
              <div
                className="text-[10px] font-black uppercase tracking-widest text-center px-2 py-1.5 rounded-lg truncate"
                style={{ color: gameColor, background: `${gameColor}15` }}
              >
                {translateApiText(stage.title)}
              </div>
              <div className="flex flex-col gap-2.5 min-w-0">
                {stage.matches.map((match) => (
                  <BracketMatchCard
                    key={match.id}
                    match={match}
                    stageIndex={stageIndex}
                    isLastStage={stageIndex === bracket.length - 1}
                    onClick={() => onMatchSelect(match)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Masaüstü: yatay bracket ağacı */}
        <div className="hidden md:block overflow-x-auto scrollbar-hide pr-4">
          <div className="flex justify-between min-w-[900px] h-[600px] pb-12">
            {bracket.map((stage, stageIndex) => (
              <div key={stageIndex} className="flex flex-col w-64 relative shrink-0">
                <div className="text-[10px] font-black uppercase tracking-widest text-center mb-6 h-4 truncate px-1" style={{ color: 'var(--es-text-3)' }}>
                   {translateApiText(stage.title)}
                </div>
                <div className="flex flex-col justify-around flex-1 relative">
                  {renderBracketPairs(stage, stageIndex)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BracketMatchCard({ match, stageIndex, isLastStage, onClick }: { match: BracketMatch, stageIndex: number, isLastStage: boolean, onClick: () => void }) {
  const { t } = useLanguage();
  const tooltipPositionClass = isLastStage ? 'right-[105%]' : 'left-[105%]';

  return (
    <div onClick={onClick} className="relative z-10 hover:z-[60] w-full rounded-xl overflow-visible shadow-xl border group cursor-pointer transition-colors min-w-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
      
      {match.status === 'upcoming' && <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.5)' }}><span className="text-[10px] md:text-xs font-black px-2 md:px-3 py-1 rounded-full transition-colors truncate max-w-[90%]" style={{ background: 'var(--es-surface-2)', color: 'var(--es-text-1)' }}>{match.time}</span></div>}
      {match.status === 'live' && <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-bl-lg z-20 animate-pulse">LIVE</div>}
      
      <div className="flex items-center justify-between gap-2 p-2.5 md:p-3 border-b transition-colors min-w-0" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)' }}>
        <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
          <div className="w-4 h-4 rounded-sm shrink-0" style={{ background: match.team1.color }} />
          <span className="text-[11px] md:text-xs font-bold truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team1.name}</span>
        </div>
        <span className="text-xs md:text-sm font-black shrink-0 transition-colors" style={{ color: match.team1.score > match.team2.score ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>{match.team1.score}</span>
      </div>
      <div className="flex items-center justify-between gap-2 p-2.5 md:p-3 transition-colors min-w-0" style={{ background: 'var(--es-bg)' }}>
        <div className="flex items-center gap-1.5 md:gap-2 min-w-0 flex-1">
          <div className="w-4 h-4 rounded-sm shrink-0" style={{ background: match.team2.color }} />
          <span className="text-[11px] md:text-xs font-bold truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team2.name}</span>
        </div>
        <span className="text-xs md:text-sm font-black shrink-0 transition-colors" style={{ color: match.team2.score > match.team1.score ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>{match.team2.score}</span>
      </div>

      {(match.status === 'completed' || match.status === 'live') && match.maps && match.lineups && (
        <div className={`absolute ${tooltipPositionClass} top-1/2 -translate-y-1/2 w-80 border rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] p-5 pointer-events-none hidden md:block`} style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)', backdropFilter: 'blur(16px)' }}>
          
          <div className="flex justify-between items-center pb-3 border-b mb-3 relative transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
            {match.status === 'live' && (
              <div className="absolute -top-3 -right-3 flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] font-black text-red-500 tracking-wider">LIVE DATA</span>
              </div>
            )}
            
            <span className="text-sm font-black shrink-0" style={{ color: match.team1.color }}>{match.team1.short}</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg transition-colors shrink-0" style={{ background: 'var(--es-surface)' }}><span className="text-lg font-black transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team1.score}</span><span className="text-xs font-black" style={{ color: 'var(--es-text-3)' }}>:</span><span className="text-lg font-black transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.team2.score}</span></div>
            <span className="text-sm font-black shrink-0" style={{ color: match.team2.color }}>{match.team2.short}</span>
          </div>

          <div className="text-[9px] font-black uppercase tracking-widest text-center mb-3" style={{ color: 'var(--es-text-3)' }}>{t.mapScores}</div>
          <div className="space-y-1.5 mb-5">
            {match.maps.map((m, i) => (
              <div key={i} className="flex justify-between items-center text-xs px-2 py-1 rounded transition-colors" style={{ background: 'var(--es-surface)' }}>
                <span className={`w-6 text-center font-black ${m.t1Score > m.t2Score ? 'text-green-500' : ''}`} style={{ color: m.t1Score > m.t2Score ? '' : 'var(--es-text-3)' }}>{m.t1Score}</span>
                <span className="font-bold transition-colors truncate px-1" style={{ color: 'var(--es-text-1)' }}>{m.name}</span>
                <span className={`w-6 text-center font-black ${m.t2Score > m.t1Score ? 'text-green-500' : ''}`} style={{ color: m.t2Score > m.t1Score ? '' : 'var(--es-text-3)' }}>{m.t2Score}</span>
              </div>
            ))}
          </div>

          <div className="text-[9px] font-black uppercase tracking-widest text-center mb-3" style={{ color: 'var(--es-text-3)' }}>{t.playerRatings}</div>
          <div className="space-y-1">
            {match.lineups.map((l, i) => (
              <div key={i} className="flex justify-between items-center text-[11px] min-w-0 gap-1">
                <div className="w-1/3 text-left truncate font-semibold min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{l.t1Player}</div>
                <div className="w-1/3 flex items-center justify-center gap-3 shrink-0"><span className="font-black" style={{ color: l.t1Rating > l.t2Rating ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>{l.t1Rating.toFixed(2)}</span><span className="font-black" style={{ color: l.t2Rating > l.t1Rating ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>{l.t2Rating.toFixed(2)}</span></div>
                <div className="w-1/3 text-right truncate font-semibold min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{l.t2Player}</div>
              </div>
            ))}
          </div>
          
          <div className={`mt-4 pt-3 border-t text-center text-[9px] font-black uppercase tracking-widest animate-pulse transition-colors`} style={{ borderColor: 'var(--es-border)', color: match.status === 'live' ? '#EF4444' : '#00D4FF' }}>
            {match.status === 'live' ? t.clickForLiveDetails : t.clickForMatchDetails}
          </div>
        </div>
      )}
    </div>
  );
}

function TabStats({ gameColor, category, stats }: { gameColor: string, category: 'fps' | 'moba', stats: any }) {
  const { t } = useLanguage();
  const distributionData = category === 'fps' ? stats.fpsDistribution : stats.mobaDistribution;
  return (
    <div className="animate-fade-in flex flex-col gap-4 md:gap-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2.5 md:p-3 rounded-xl border transition-colors min-w-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0"/>
          <span className="text-[10px] font-black uppercase" style={{ color: 'var(--es-text-3)' }}>{t.filterLabel}</span>
        </div>
        <select className="border text-xs px-3 py-1.5 rounded outline-none cursor-pointer transition-colors w-full sm:w-auto min-w-0" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>
          <option>{t.allStages}</option>
          <option>Playoff</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="rounded-xl overflow-hidden shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <div className="p-3 md:p-4 border-b transition-colors" style={{ borderColor: 'var(--es-border)', background: 'var(--es-surface)' }}>
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.topPlayer}</h3>
          </div>
          <div className="p-1.5 md:p-2 space-y-1">
            {stats.topPlayers.map((player: any) => (
              <div key={player.rank} className="flex items-center justify-between gap-2 px-2.5 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-w-0">
                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                  <span className="text-[11px] md:text-xs font-black w-4 shrink-0" style={{ color: 'var(--es-text-3)' }}>{player.rank}.</span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-black text-white overflow-hidden shrink-0" style={{ borderColor: player.color, background: `${player.color}40` }}>{player.team}</div>
                  <span className="text-xs md:text-sm font-bold text-es-cyan truncate min-w-0">{player.name}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-xs md:text-sm font-black" style={{ color: player.rating > 1.2 ? '#22C55E' : 'var(--es-text-1)' }}>{player.rating.toFixed(2)}</div>
                    <div className="text-[9px] font-bold" style={{ color: 'var(--es-text-3)' }}>Rating</div>
                  </div>
                  <div className="text-right w-10 md:w-12">
                    <div className="text-[11px] md:text-xs font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.maps}</div>
                    <div className="text-[9px] font-bold" style={{ color: 'var(--es-text-3)' }}>{t.mapsLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl overflow-hidden shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <div className="p-3 md:p-4 border-b transition-colors" style={{ borderColor: 'var(--es-border)', background: 'var(--es-surface)' }}>
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.topTeams}</h3>
          </div>
          <div className="p-1.5 md:p-2 space-y-1">
            {stats.topTeams.map((team: any) => (
              <div key={team.rank} className="flex items-center justify-between gap-2 px-2.5 md:px-4 py-2 md:py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-w-0">
                <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
                  <span className="text-[11px] md:text-xs font-black w-4 shrink-0" style={{ color: 'var(--es-text-3)' }}>{team.rank}.</span>
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded flex items-center justify-center text-[9px] md:text-[10px] font-black text-white shrink-0" style={{ background: team.color }}>{team.name.slice(0,3).toUpperCase()}</div>
                  <span className="text-xs md:text-sm font-bold text-es-cyan truncate min-w-0">{team.name}</span>
                </div>
                <div className="flex items-center gap-3 md:gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-xs md:text-sm font-black" style={{ color: team.rating > 1.1 ? '#22C55E' : 'var(--es-text-1)' }}>{team.rating.toFixed(2)}</div>
                    <div className="text-[9px] font-bold" style={{ color: 'var(--es-text-3)' }}>Rating</div>
                  </div>
                  <div className="text-right w-10 md:w-12">
                    <div className="text-[11px] md:text-xs font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>{team.maps}</div>
                    <div className="text-[9px] font-bold" style={{ color: 'var(--es-text-3)' }}>{t.mapsLabel}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl p-3 md:p-6 shadow-lg flex flex-col items-center transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
         <h3 className="text-xs md:text-sm font-black uppercase tracking-widest w-full border-b pb-3 md:pb-4 mb-3 md:mb-4 transition-colors" style={{ color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>{category === 'fps' ? t.mostUsedWeapons : t.mostPickedChampions}</h3>
         <div className="w-full max-w-md h-48 md:h-64 relative">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie data={distributionData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                 {distributionData.map((entry: any, index: number) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
               </Pie>
               <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: 'white', fontWeight: 'bold' }} formatter={(val: any) => [`%${val}`, t.usageRate]} />
             </PieChart>
           </ResponsiveContainer>
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-xl md:text-2xl font-black transition-colors" style={{ color: 'var(--es-text-1)' }}>100%</span>
             <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--es-text-3)' }}>{t.dataLabel}</span>
           </div>
         </div>
         <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-3 md:mt-4 w-full">
           {distributionData.map((entry: any, index: number) => (
             <div key={index} className="flex items-center gap-1.5 md:gap-2 min-w-0">
               <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: entry.color }} />
               <span className="text-[11px] md:text-xs font-bold transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>
                 {entry.name} <span style={{ color: 'var(--es-text-3)' }}>(%{entry.value})</span>
               </span>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}

function TabTeams({ teams }: { teams: any[] }) {
  const { t } = useLanguage();
  return (
    <div className="animate-fade-in grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 min-w-0">
      {teams.map(team => (
        <div key={team.id} className="flex items-center gap-2.5 md:gap-3 p-3 md:p-4 rounded-xl shadow-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-black text-white text-[10px] md:text-xs group-hover:scale-110 transition-transform shadow-md shrink-0" style={{ background: team.color }}>{team.short}</div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs md:text-sm font-bold truncate transition-colors" style={{ color: 'var(--es-text-1)' }}>{team.name}</span>
            <span className="text-[10px] font-bold uppercase truncate" style={{ color: 'var(--es-text-3)' }}>{t.rosterReady}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
