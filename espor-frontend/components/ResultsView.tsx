"use client";

import { useState, useMemo } from "react";
import { Search, Calendar, Filter, ChevronLeft, BarChart3, Info, Layers3, ListFilter, TrendingUp, Clock, Flame, Radio, MonitorPlay } from "lucide-react";
import { COMPLETED_MATCHES, GAMES } from "@/app/data/mockData";
import MatchScoreboard from "./MatchScoreboard"; 
import MatchAnalytics from "./MatchAnalytics";   
import { useLanguage } from "./LanguageProvider"; 

const ALLOWED_GAMES = ['lol', 'val', 'cs2', 'dota2'];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0`} style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

const ENRICHED_MATCHES = [
  ...COMPLETED_MATCHES.map(m => ({ ...m, id: `${m.id}-1`, dateKey: '20 June 2026', timestamp: new Date('2026-06-20T14:30:00').getTime(), displayTime: '14:30' })),
  ...COMPLETED_MATCHES.map(m => ({ ...m, id: `${m.id}-2`, dateKey: '19 June 2026', timestamp: new Date('2026-06-19T19:00:00').getTime(), displayTime: '19:00' })),
  ...COMPLETED_MATCHES.map(m => ({ ...m, id: `${m.id}-3`, dateKey: '18 June 2026', timestamp: new Date('2026-06-18T21:00:00').getTime(), displayTime: '21:00' })),
];

export default function ResultsView() {
  const { t, translateApiText } = useLanguage(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'analysis'>('list');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [standardTab, setStandardTab] = useState<'overview' | 'lineups' | 'stats'>('overview');
  const [activeVideo, setActiveVideo] = useState<'twitch' | 'youtube' | null>(null);

  const filteredMatches = ENRICHED_MATCHES.filter(match => {
    const matchesSearch = match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.tournament.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || match.game === selectedGame;
    return matchesSearch && matchesGame;
  });

  const sortedMatches = useMemo(() => {
    return [...filteredMatches].sort((a, b) => b.timestamp - a.timestamp);
  }, [filteredMatches]);

  const groupedMatches = useMemo(() => {
    const groups: Record<string, typeof sortedMatches> = {};
    sortedMatches.forEach(match => {
      if (!groups[match.dateKey]) groups[match.dateKey] = [];
      groups[match.dateKey].push(match);
    });
    return groups;
  }, [sortedMatches]);

  const gameColor = selectedMatch ? (GAME_COLORS[selectedMatch.game] || '#4D7CFE') : '#4D7CFE';

  if (viewMode === 'analysis' && selectedMatch) {
    const category = (selectedMatch.game === 'cs2' || selectedMatch.game === 'val') ? 'fps' : 'moba';
    return (
      <div className="flex flex-col w-full h-full overflow-hidden overflow-x-hidden animate-fade-in transition-colors min-w-0" style={{ background: 'var(--es-bg)' }}>
        <div className="px-3 md:px-8 py-2.5 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b shrink-0 min-w-0" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
          <button onClick={() => setViewMode('detail')} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity min-w-0 shrink-0 max-w-full" style={{ color: 'var(--es-text-3)' }}>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all shrink-0" style={{ background: 'var(--es-surface)' }}><ChevronLeft className="w-4 h-4" style={{ color: 'var(--es-text-1)' }} /></div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors truncate min-w-0" style={{ color: 'var(--es-text-1)' }}>{t.backToResults}</span>
          </button>
          <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 overflow-x-auto scrollbar-hide whitespace-nowrap pr-2 sm:pr-0">
             <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 min-w-0 max-w-[42%] sm:max-w-none shrink">
               <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" />
               <span className="text-[10px] sm:text-[11px] md:text-xs font-black truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team1.name}</span>
             </div>
             <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded text-[10px] sm:text-sm font-black tabular-nums shrink-0 transition-colors" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)' }}>{selectedMatch.team1.score} - {selectedMatch.team2.score}</span>
             <div className="flex items-center gap-1 sm:gap-1.5 md:gap-3 min-w-0 max-w-[42%] sm:max-w-none shrink">
               <span className="text-[10px] sm:text-[11px] md:text-xs font-black truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team2.name}</span>
               <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" />
             </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-2.5 sm:p-3 md:p-8 min-w-0">
           <MatchAnalytics match={selectedMatch} category={category} gameColor={gameColor} hasDeepData={true} />
        </div>
      </div>
    );
  }

  if (viewMode === 'detail' && selectedMatch) {
    const statusStr = String(selectedMatch.status || '').toLowerCase();
    const isLive = statusStr === 'live';
    const isCompleted = statusStr === 'completed' || statusStr === 'finished' || true;

    return (
      <div className="flex-1 flex flex-col overflow-hidden overflow-x-hidden animate-fade-in transition-colors min-w-0" style={{ background: 'var(--es-bg)' }}>
        <div className="px-3 md:px-8 py-2.5 md:py-4 flex items-center border-b shrink-0 transition-colors min-w-0" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
          <button onClick={() => { setViewMode('list'); setSelectedMatch(null); setActiveVideo(null); }} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity min-w-0 max-w-full">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all shrink-0" style={{ background: 'var(--es-surface)' }}><ChevronLeft className="w-4 h-4" style={{ color: 'var(--es-text-1)' }}/></div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors truncate min-w-0" style={{ color: 'var(--es-text-1)' }}>{t.backToResults}</span>
          </button>
        </div>

        <div className="shrink-0 px-3 md:px-8 pt-3 md:pt-8 pb-0 relative overflow-hidden overflow-x-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
          <div className="relative min-w-0">
            <div className="flex items-center justify-between pb-3 md:pb-8 gap-0.5 sm:gap-1.5 md:gap-4 min-w-0 max-w-5xl mx-auto">
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-4 min-w-0 flex-1 basis-0 overflow-hidden md:w-48 md:shrink-0 md:flex-none">
                <div className="md:hidden"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="sm" /></div>
                <div className="hidden md:block"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="lg" /></div>
                <div className="text-[11px] sm:text-sm md:text-2xl font-black tracking-tight transition-colors text-center truncate w-full px-0.5 leading-tight" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team1.name}</div>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 px-0.5 sm:px-1">
                <div className="flex items-center gap-1 md:gap-1.5 px-1.5 sm:px-2 md:px-3 py-0.5 md:py-1 rounded-full mb-0.5 md:mb-1 transition-colors" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-black uppercase tracking-wider sm:tracking-widest transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-3)' }}>{t.completed}</span>
                </div>
                <div className="flex items-baseline justify-center text-xl sm:text-3xl md:text-6xl font-black tracking-tighter score-display tabular-nums leading-none mb-0.5 sm:mb-1 md:mb-2 transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-1)' }}>
                  <span>{selectedMatch.team1.score}</span>
                  <span className="mx-0.5 sm:mx-1 md:mx-2 transition-colors" style={{ color: 'var(--es-text-3)' }}>:</span>
                  <span>{selectedMatch.team2.score}</span>
                </div>
                <button onClick={() => setViewMode('analysis')} className="mt-0.5 sm:mt-1 md:mt-4 px-2.5 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black flex items-center gap-1 sm:gap-1.5 md:gap-2 uppercase tracking-wider sm:tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl whitespace-nowrap max-w-full" style={{ background: '#4D7CFE', color: 'white', boxShadow: `0 0 20px rgba(77, 124, 254, 0.4)` }}>
                  <BarChart3 className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4 shrink-0" /> {t.fullStats}
                </button>
              </div>
              <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-4 min-w-0 flex-1 basis-0 overflow-hidden md:w-48 md:shrink-0 md:flex-none">
                <div className="md:hidden"><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="sm" /></div>
                <div className="hidden md:block"><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="lg" /></div>
                <div className="text-[11px] sm:text-sm md:text-2xl font-black tracking-tight transition-colors text-center truncate w-full px-0.5 leading-tight" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team2.name}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 md:gap-8 md:justify-center border-t max-w-5xl mx-auto overflow-x-auto scrollbar-hide whitespace-nowrap pr-4 md:pr-0 min-w-0 transition-colors" style={{ borderColor: 'var(--es-border)' }}>
              {[ { id: 'overview', label: t.overview, icon: Info }, { id: 'lineups', label: t.lineups, icon: Layers3 }, { id: 'stats', label: t.statistics, icon: ListFilter } ].map(tab => (
                <button key={tab.id} onClick={() => setStandardTab(tab.id as any)} className="px-0.5 sm:px-2 md:px-4 py-2.5 sm:py-3 md:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest transition-all relative flex items-center gap-1 sm:gap-1.5 md:gap-2 hover:opacity-80 shrink-0" style={{ color: standardTab === tab.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>
                  <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {tab.label}
                  {standardTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: gameColor }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-2.5 sm:p-3 md:p-8 min-w-0">
           <div className="max-w-5xl mx-auto min-w-0">
             {standardTab === 'overview' && (
               <div className="animate-fade-in space-y-3 sm:space-y-4 md:space-y-6 min-w-0">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 md:gap-6">
                   <div className="rounded-xl p-2.5 sm:p-3 md:p-6 shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                     <h4 className="text-[11px] sm:text-xs font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}><Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: gameColor }}/> <span className="truncate">{t.matchInfo}</span></h4>
                     <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
                       <div className="flex justify-between items-start gap-2 min-w-0"><span className="text-[11px] sm:text-xs shrink-0 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.tournament}</span><span className="text-[11px] sm:text-xs font-bold truncate min-w-0 text-right transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.tournament}</span></div>
                       <div className="flex justify-between items-start gap-2 min-w-0"><span className="text-[11px] sm:text-xs shrink-0 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.date}</span><span className="text-[11px] sm:text-xs font-bold truncate min-w-0 text-right transition-colors" style={{ color: 'var(--es-text-1)' }}>{translateApiText(selectedMatch.dateKey)}, {selectedMatch.displayTime}</span></div>
                     </div>
                   </div>
                   <div className="rounded-xl p-2.5 sm:p-3 md:p-6 shadow-lg flex flex-col justify-center transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                     <h4 className="text-[11px] sm:text-xs font-bold mb-2 sm:mb-3 md:mb-4 flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: gameColor }}/> <span className="truncate">{t.teamForm}</span></h4>
                     <div className="space-y-2 sm:space-y-3 md:space-y-4">
                       <div className="flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg transition-colors min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                         <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0 flex-1 overflow-hidden">
                           <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" />
                           <span className="text-[10px] sm:text-[11px] md:text-xs font-bold truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team1.name}</span>
                         </div>
                         <div className="flex gap-0.5 sm:gap-1 md:gap-1.5 shrink-0">{['W','W','W','L','W'].map((r,i)=><div key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[7px] sm:text-[8px] md:text-[9px] font-black ${r==='W'?'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-500 border border-green-200 dark:border-green-500/30':'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500 border border-red-200 dark:border-red-500/30'}`}>{r}</div>)}</div>
                       </div>
                       <div className="flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg transition-colors min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                         <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0 flex-1 overflow-hidden">
                           <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" />
                           <span className="text-[10px] sm:text-[11px] md:text-xs font-bold truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team2.name}</span>
                         </div>
                         <div className="flex gap-0.5 sm:gap-1 md:gap-1.5 shrink-0">{['W','L','W','L','L'].map((r,i)=><div key={i} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded flex items-center justify-center text-[7px] sm:text-[8px] md:text-[9px] font-black ${r==='W'?'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-500 border border-green-200 dark:border-green-500/30':'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500 border border-red-200 dark:border-red-500/30'}`}>{r}</div>)}</div>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                   <div className="col-span-1 flex flex-col gap-2.5 sm:gap-3 md:gap-4 min-w-0">
                     <div className="rounded-xl p-2.5 sm:p-3 md:p-5 shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                       <h4 className="text-[11px] sm:text-xs font-bold mb-2 sm:mb-3 md:mb-4 flex items-center justify-between gap-2 transition-colors min-w-0">
                         <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden" style={{ color: 'var(--es-text-1)' }}>
                           {isLive ? <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 shrink-0"/> : isCompleted ? <MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-es-cyan shrink-0"/> : <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: 'var(--es-text-3)' }}/>}
                           <span className="truncate">{isLive ? t.liveStreams : isCompleted ? t.vodsAndReplays : t.broadcastChannelsSoon}</span>
                         </div>
                         {activeVideo && <span onClick={() => setActiveVideo(null)} className="text-[9px] sm:text-[10px] cursor-pointer uppercase font-black transition-colors hover:opacity-80 shrink-0" style={{ color: 'var(--es-text-3)' }}>{t.closeLabel}</span>}
                       </h4>

                       <div className="flex flex-col sm:flex-row gap-2 md:gap-4 min-w-0">
                          {!isLive && !isCompleted ? (
                             <>
                               <div className="flex-1 flex items-center justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 md:p-3 rounded-lg opacity-50 cursor-not-allowed transition-colors min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 overflow-hidden"><div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded flex items-center justify-center bg-purple-500/20 text-purple-500 shrink-0"><MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4"/></div><span className="text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>Twitch</span></div>
                                 <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest shrink-0" style={{ color: 'var(--es-text-3)' }}>{t.waiting}</span>
                               </div>
                               <div className="flex-1 flex items-center justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 md:p-3 rounded-lg opacity-50 cursor-not-allowed transition-colors min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 overflow-hidden"><div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded flex items-center justify-center bg-red-500/20 text-red-500 shrink-0"><MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4"/></div><span className="text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>YouTube</span></div>
                                 <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest shrink-0" style={{ color: 'var(--es-text-3)' }}>{t.waiting}</span>
                               </div>
                             </>
                          ) : (
                             <>
                               <button onClick={() => setActiveVideo('twitch')} className={`flex-1 flex items-center justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all border group cursor-pointer min-w-0 ${activeVideo === 'twitch' ? 'bg-purple-500/10 border-purple-500/50' : 'hover:border-purple-500/30'}`} style={{ background: activeVideo === 'twitch' ? '' : 'var(--es-surface)', borderColor: activeVideo === 'twitch' ? '' : 'var(--es-border)' }}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 overflow-hidden"><div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeVideo === 'twitch' ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-500 group-hover:bg-purple-500 group-hover:text-white'}`}><MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4"/></div><span className="text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>Twitch</span></div>
                                 {isLive ? (
                                     <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-[10px] sm:text-[11px] md:text-xs font-bold" style={{ color: 'var(--es-text-3)' }}>112K</span></div>
                                 ) : (
                                     <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-purple-500 uppercase tracking-wider sm:tracking-widest bg-purple-500/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded shrink-0 whitespace-nowrap">VOD {t.vodWatch}</span>
                                 )}
                               </button>
                               <button onClick={() => setActiveVideo('youtube')} className={`flex-1 flex items-center justify-between gap-1.5 sm:gap-2 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all border group cursor-pointer min-w-0 ${activeVideo === 'youtube' ? 'bg-red-500/10 border-red-500/50' : 'hover:border-red-500/30'}`} style={{ background: activeVideo === 'youtube' ? '' : 'var(--es-surface)', borderColor: activeVideo === 'youtube' ? '' : 'var(--es-border)' }}>
                                 <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 overflow-hidden"><div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded flex items-center justify-center transition-colors shrink-0 ${activeVideo === 'youtube' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white'}`}><MonitorPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4"/></div><span className="text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>YouTube</span></div>
                                 {isLive ? (
                                     <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-[10px] sm:text-[11px] md:text-xs font-bold" style={{ color: 'var(--es-text-3)' }}>75K</span></div>
                                 ) : (
                                     <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-red-500 uppercase tracking-wider sm:tracking-widest bg-red-500/10 px-1 sm:px-1.5 md:px-2 py-0.5 md:py-1 rounded shrink-0 whitespace-nowrap">{t.highlights}</span>
                                 )}
                               </button>
                             </>
                          )}
                       </div>
                     </div>
                     
                     {activeVideo && (
                       <div className="rounded-xl overflow-hidden shadow-2xl animate-fade-in relative pt-[56.25%] transition-colors min-w-0" style={{ background: '#000', border: '1px solid var(--es-border)' }}>
                         <div className="absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-4">
                           <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 shrink-0 ${activeVideo === 'twitch' ? 'bg-purple-500' : 'bg-red-500'}`}>
                             <MonitorPlay className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                           </div>
                           <span className="text-[10px] sm:text-xs md:text-sm font-black text-white uppercase tracking-wider sm:tracking-widest text-center px-2">
                             {isLive ? `${activeVideo} ${t.streamStarting}` : `${activeVideo} ${t.vodLoading}`}
                           </span>
                           <span className="text-[10px] sm:text-[11px] md:text-xs mt-1 sm:mt-1.5 md:mt-2 text-center px-2" style={{ color: 'var(--es-text-3)' }}>{t.awaitingConnection}</span>
                         </div>
                       </div>
                     )}
                   </div>

                   <div className="col-span-1 min-w-0">
                      <div className="w-full h-full min-h-[160px] sm:min-h-[200px] md:min-h-[250px] rounded-xl overflow-hidden shadow-lg relative flex flex-col group cursor-pointer hover:opacity-90 transition-all" style={{ background: 'var(--es-surface-2)', border: '1px solid var(--es-border)' }}>
                        <div className="absolute top-2 right-2 z-20 px-1.5 sm:px-2 py-0.5 rounded text-[7px] sm:text-[8px] font-black uppercase tracking-widest" style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>{t.sponsored}</div>
                        <div className="flex-1 flex flex-col items-center justify-center relative p-3 sm:p-4 md:p-6 text-center">
                          <div className="absolute inset-0 cyber-grid opacity-10" />
                          <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-500 mb-2 sm:mb-3 md:mb-4 animate-pulse relative z-10" />
                          <span className="text-base sm:text-lg md:text-2xl font-black tracking-tighter relative z-10 transition-colors" style={{ color: 'var(--es-text-1)' }}>REDBULL <span className="text-blue-500">GAMING</span></span>
                          <span className="text-[10px] sm:text-[11px] md:text-xs font-bold mt-1 sm:mt-1.5 md:mt-2 relative z-10 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.givesYouWings}</span>
                        </div>
                        <div className="h-8 sm:h-9 md:h-10 border-t flex items-center justify-center transition-colors" style={{ background: 'rgba(77, 124, 254, 0.1)', borderColor: 'rgba(77, 124, 254, 0.2)' }}>
                          <span className="text-[9px] sm:text-[10px] font-black text-blue-500 uppercase tracking-widest transition-colors">{t.seeMore}</span>
                        </div>
                      </div>
                   </div>
                 </div>

               </div>
             )}
             {standardTab === 'lineups' && <MatchScoreboard match={selectedMatch} gameColor={gameColor} />}
             {standardTab === 'stats' && <div className="text-center py-8 sm:py-12 md:py-20 font-black uppercase tracking-wider sm:tracking-widest animate-fade-in border border-dashed rounded-xl transition-colors px-3 text-[11px] sm:text-xs md:text-sm" style={{ color: 'var(--es-text-3)', borderColor: 'var(--es-border)' }}>{t.statsCompiling}</div>}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in transition-colors overflow-x-hidden" style={{ background: 'var(--es-bg)' }}>
      <div className="shrink-0 p-4 md:p-8 border-b relative overflow-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight mb-1 transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.resultsArchiveTitle}</h1>
              <p className="text-xs md:text-sm transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.resultsArchiveDesc}</p>
            </div>
            <div className="relative group w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--es-text-3)' }} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all focus:border-es-cyan shadow-lg" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }} />
            </div>
          </div>
          <div className="flex items-start w-full">
            <div className="flex items-center gap-2 p-1.5 rounded-xl transition-colors overflow-x-auto w-full whitespace-nowrap" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
              
              {/* 🚀 TIER 1 DÜZELTME: "TÜMÜ" Butonu Renk Optimizasyonu */}
              <button 
                onClick={() => setSelectedGame('all')} 
                className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap" 
                style={{ 
                  background: selectedGame === 'all' ? 'rgba(0, 212, 255, 0.1)' : 'transparent', 
                  color: selectedGame === 'all' ? '#00D4FF' : 'var(--es-text-3)',
                  border: selectedGame === 'all' ? '1px solid rgba(0, 212, 255, 0.2)' : '1px solid transparent'
                }}
              >
                {t.all}
              </button>

              {GAMES.filter(g => ALLOWED_GAMES.includes(g.id)).map(game => (
                <button key={game.id} onClick={() => setSelectedGame(game.id)} className="px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all flex items-center gap-1.5 md:gap-2 hover:opacity-80 whitespace-nowrap" style={{ background: selectedGame === game.id ? `${GAME_COLORS[game.id]}30` : 'transparent', color: selectedGame === game.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full" style={{ background: GAME_COLORS[game.id] }} />{game.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="flex flex-col gap-6 md:gap-10 max-w-5xl mx-auto">
          {Object.keys(groupedMatches).length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4 transition-colors" style={{ color: 'var(--es-text-3)' }}>
              <Filter className="w-12 h-12 opacity-20" />
              <div className="text-lg font-black uppercase tracking-widest">{t.noResultsFound}</div>
            </div>
          ) : (
            Object.entries(groupedMatches).map(([date, matches], index) => (
              <div key={date} className="animate-fade-in">
                {index === 1 && (
                  <div className="mb-10 p-4 md:p-5 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer transition-all group shadow-lg border-orange-500/20 hover:border-orange-500/50 gap-4" style={{ background: 'var(--es-surface-2)' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-orange-500/20 text-orange-500 shrink-0"><Flame className="w-6 h-6" /></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest mb-0.5 text-orange-500">{t.sponsoredRecommendation}</span>
                        <span className="text-sm font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.betPromoTitle}</span>
                        <span className="text-[10px] transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.betPromoDesc}</span>
                      </div>
                    </div>
                    <div className="w-full md:w-auto">
                      <div className="px-4 py-2.5 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(234,88,12,0.4)] group-hover:bg-orange-500 transition-colors text-center">{t.playNow}</div>
                    </div>
                  </div>
                )}

                <h2 className="text-xs md:text-sm font-black uppercase tracking-widest mb-3 md:mb-4 border-b pb-1.5 md:pb-2 flex items-center gap-2 transition-colors" style={{ color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                  <Calendar className="w-3 h-3 md:w-4 md:h-4" style={{ color: 'var(--es-text-3)' }} />
                  {translateApiText(date)} {t.dateResultsSuffix}
                </h2>
                
                <div className="flex flex-col gap-2 md:gap-3">
                  {matches.map(match => (
                    <div 
                      key={match.id} 
                      onClick={() => { setSelectedMatch(match); setViewMode('detail'); setStandardTab('overview'); }}
                      className="flex flex-col p-3 md:p-4 rounded-xl shadow-lg transition-all hover:scale-[1.01] group cursor-pointer hover:border-es-cyan/50 gap-2 md:gap-3" 
                      style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)', borderLeft: `4px solid ${GAME_COLORS[match.game]}` }}
                    >
                      <div className="flex flex-col gap-1 md:gap-1.5 w-full md:w-48 shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="text-[9px] md:text-[10px] font-bold flex items-center gap-1 md:gap-1.5 uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>
                            <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" /> {match.displayTime}
                          </div>
                          <span className="px-1 md:px-1.5 py-0.5 rounded text-[8px] md:text-[9px] font-black" style={{ background: `${GAME_COLORS[match.game]}20`, color: GAME_COLORS[match.game] }}>{match.game.toUpperCase()}</span>
                        </div>
                        <div className="text-[11px] md:text-xs font-bold truncate group-hover:text-es-cyan transition-colors" style={{ color: 'var(--es-text-1)' }}>{match.tournament}</div>
                        <div className="text-[9px] md:text-[10px] transition-colors" style={{ color: 'var(--es-text-3)' }}>{match.format}</div>
                      </div>

                      <div className="flex items-center justify-center gap-2 md:gap-4 md:gap-8 w-full">
                        <div className="flex items-center gap-1.5 md:gap-3 flex-1 min-w-0 justify-end">
                          <span className="text-xs md:text-sm font-black transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{match.team1.name}</span>
                          <div className="w-5 h-5 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-white text-[8px] md:text-[10px] shrink-0" style={{ background: match.team1.color }}>{match.team1.short}</div>
                        </div>
                        
                        <div className="flex flex-col items-center gap-0.5 md:gap-1 shrink-0">
                          <div className="px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-lg border flex items-center gap-1 md:gap-2 shadow-inner transition-colors">
                            <span className="text-sm md:text-lg lg:text-xl font-black tabular-nums transition-colors" style={{ color: match.team1.score > match.team2.score ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>{match.team1.score}</span>
                            <span className="font-black transition-colors" style={{ color: 'var(--es-text-3)' }}>-</span>
                            <span className="text-sm md:text-lg lg:text-xl font-black tabular-nums transition-colors" style={{ color: match.team2.score > match.team1.score ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>{match.team2.score}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 md:gap-3 flex-1 min-w-0 justify-start">
                          <div className="w-5 h-5 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-black text-white text-[8px] md:text-[10px] shrink-0" style={{ background: match.team2.color }}>{match.team2.short}</div>
                          <span className="text-xs md:text-sm font-black transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{match.team2.name}</span>
                        </div>
                      </div>

                      <div className="w-full md:w-32 shrink-0 flex justify-end">
                        <div className="w-full px-3 md:px-4 py-1.5 md:py-2.5 rounded-lg text-[9px] md:text-[10px] font-black flex items-center justify-center gap-1.5 md:gap-2 uppercase tracking-widest transition-all hover:opacity-80 group-hover:text-es-cyan" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)' }}>
                          {t.view}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}