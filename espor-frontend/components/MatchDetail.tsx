"use client";

import { useState } from "react";
import { ChevronLeft, Info, Radio, MonitorPlay, TrendingUp, BarChart3, ListFilter, Layers3, Flame, Clock } from "lucide-react";
import MatchScoreboard from "./MatchScoreboard"; 
import MatchAnalytics from "./MatchAnalytics";
import { useLanguage } from "./LanguageProvider";

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-lg`} style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function MatchDetail({ selectedMatch, onBack }: { selectedMatch: any, onBack: () => void }) {
  const { t, translateApiText } = useLanguage();
  const [viewMode, setViewMode] = useState<'standard' | 'analysis'>('standard');
  const [standardTab, setStandardTab] = useState<'overview' | 'lineups' | 'stats'>('overview');
  
  // 🚀 VİDEO OYNATICI STATE'İ GERİ GELDİ
  const [activeVideo, setActiveVideo] = useState<'twitch' | 'youtube' | null>(null);

  const gameType = selectedMatch.gameDetails?.type?.toLowerCase() || selectedMatch.game?.toLowerCase() || 'cs2';
  const gameColor = GAME_COLORS[gameType] || '#4D7CFE';

  const tournamentName = typeof selectedMatch.tournament === 'object' ? selectedMatch.tournament?.name : (selectedMatch.tournament || selectedMatch.tournamentShort || '');
  const matchStage = selectedMatch.stage || selectedMatch.tournament?.stage || "Group Stage";
  const matchPrize = selectedMatch.prizePool || selectedMatch.tournament?.prizePool || "Açıklanmadı";

  const statusStr = String(selectedMatch.status || '').toLowerCase();
  const isLive = statusStr === 'live';
  const isCompleted = statusStr === 'completed' || statusStr === 'finished';

  if (viewMode === 'analysis') {
    return (
      <div className="flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ background: 'var(--es-bg)' }}>
        <div className="px-8 py-4 flex items-center justify-between border-b" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
          <button onClick={() => setViewMode('standard')} className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: 'var(--es-text-3)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: 'var(--es-surface)', color: 'var(--es-text-1)' }}><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--es-text-1)' }}>{t.backToMain}</span>
          </button>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-black" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team1.name}</span></div>
             <span className="text-sm font-black" style={{ color: 'var(--es-text-3)' }}>vs</span>
             <div className="flex items-center gap-3"><span className="text-xs font-black" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team2.name}</span><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <MatchAnalytics match={selectedMatch} category={(gameType === 'cs2' || gameType === 'val') ? 'fps' : 'moba'} gameColor={gameColor} hasDeepData={!(selectedMatch.team1.name === "Natus Vincere" || selectedMatch.team2.name === "Natus Vincere")} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
      <div className="shrink-0 px-8 pt-6 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
        <div className="relative z-20">
          
          <button onClick={onBack} className="flex items-center gap-2 transition-colors mb-6 w-fit px-3 py-1.5 rounded-lg hover:opacity-80" style={{ background: 'var(--es-surface)' }}>
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--es-text-1)' }} />
            <span className="text-xs font-black uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-1)' }}>{t.backToMain}</span>
          </button>

          <div className="flex items-center justify-between pb-8">
            <div className="flex flex-col items-center gap-4 w-48 shrink-0">
              <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="lg" />
              <div className="text-2xl font-black tracking-tight transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team1.name}</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-1" style={{ background: isLive ? 'rgba(239, 68, 68, 0.15)' : 'var(--es-surface)', border: isLive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--es-border)' }}>
                {isLive && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                <span className="text-xs font-black uppercase tracking-widest transition-colors" style={{ color: isLive ? '#F87171' : 'var(--es-text-3)' }}>
                  {isLive ? t.live : isCompleted ? t.results : t.upcoming}
                </span>
              </div>
              <div className="text-6xl font-black tracking-tighter score-display tabular-nums leading-none mb-2 transition-colors" style={{ color: 'var(--es-text-1)' }}>
                {selectedMatch.team1Score ?? selectedMatch.team1?.score ?? '-'} 
                <span className="mx-2 transition-colors" style={{ color: 'var(--es-text-3)' }}>:</span> 
                {selectedMatch.team2Score ?? selectedMatch.team2?.score ?? '-'}
              </div>
              
              {isCompleted && (
                <button onClick={() => setViewMode('analysis')} className="mt-2 px-6 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl" style={{ background: gameColor, color: 'white', boxShadow: `0 0 20px ${gameColor}40` }}>
                  <BarChart3 className="w-4 h-4" /> Full Stats
                </button>
              )}
            </div>

            <div className="flex flex-col items-center gap-4 w-48 shrink-0">
              <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="lg" />
              <div className="text-2xl font-black tracking-tight transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team2.name}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-8 border-t" style={{ borderColor: 'var(--es-border)' }}>
            {[ { id: 'overview', label: t.overview, icon: Info }, { id: 'lineups', label: t.lineups, icon: Layers3 }, { id: 'stats', label: t.statistics, icon: ListFilter } ].map(tab => (
              <button key={tab.id} onClick={() => setStandardTab(tab.id as any)} className="px-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 hover:opacity-80" style={{ color: standardTab === tab.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                {standardTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: gameColor }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         {standardTab === 'overview' && (
           <div className="animate-fade-in space-y-6">
             <div className="grid grid-cols-2 gap-6">
               <div className="rounded-xl p-5 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                 <h4 className="text-xs font-bold mb-4 flex items-center gap-2 transition-colors" style={{ color: 'var(--es-text-1)' }}><Info className="w-4 h-4" style={{ color: gameColor }}/> {t.matchInfo}</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.tournament}</span><span className="text-xs font-bold truncate max-w-[180px] transition-colors" style={{ color: 'var(--es-text-1)' }}>{tournamentName}</span></div>
                   <div className="flex justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.stage}</span><span className="text-xs font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>{translateApiText(matchStage)}</span></div>
                   <div className="flex justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.prizePool}</span><span className="text-xs font-bold text-green-500">{matchPrize}</span></div>
                 </div>
               </div>
               <div className="rounded-xl p-5 shadow-lg flex flex-col justify-center" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                 <h4 className="text-xs font-bold mb-4 flex items-center gap-2 transition-colors" style={{ color: 'var(--es-text-1)' }}><TrendingUp className="w-4 h-4" style={{ color: gameColor }}/> {t.teamForm}</h4>
                 <div className="space-y-4 flex-1 flex flex-col justify-center">
                   <div className="flex items-center justify-between p-2 rounded-lg transition-colors" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}><div className="flex items-center gap-2"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-bold truncate max-w-[80px] transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team1.name}</span></div><div className="flex gap-1.5">{['W','W','W','L','W'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-500 border border-green-200 dark:border-green-500/30':'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500 border border-red-200 dark:border-red-500/30'}`}>{r}</div>)}</div></div>
                   <div className="flex items-center justify-between p-2 rounded-lg transition-colors" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}><div className="flex items-center gap-2"><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /><span className="text-xs font-bold truncate max-w-[80px] transition-colors" style={{ color: 'var(--es-text-1)' }}>{selectedMatch.team2.name}</span></div><div className="flex gap-1.5">{['W','L','W','L','L'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-500 border border-green-200 dark:border-green-500/30':'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-500 border border-red-200 dark:border-red-500/30'}`}>{r}</div>)}</div></div>
                 </div>
               </div>
             </div>

             {/* 🚀 EKSİK OLAN YAYIN VE REKLAM BÖLÜMÜ GERİ GELDİ */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="col-span-1 flex flex-col gap-4">
                 <div className="rounded-xl p-5 shadow-lg transition-colors" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                   <h4 className="text-xs font-bold mb-4 flex items-center justify-between transition-colors">
                     <div className="flex items-center gap-2" style={{ color: 'var(--es-text-1)' }}>
                       {isLive ? <Radio className="w-4 h-4 text-red-500"/> : isCompleted ? <MonitorPlay className="w-4 h-4 text-es-cyan"/> : <Clock className="w-4 h-4" style={{ color: 'var(--es-text-3)' }}/>}
                       {isLive ? t.liveStreams : isCompleted ? t.vodsAndReplays : t.broadcastChannelsSoon}
                     </div>
                     {activeVideo && <span onClick={() => setActiveVideo(null)} className="text-[10px] cursor-pointer uppercase font-black transition-colors hover:opacity-80" style={{ color: 'var(--es-text-3)' }}>{t.closeLabel}</span>}
                   </h4>

                   <div className="flex gap-4">
                      {!isLive && !isCompleted ? (
                         <>
                           <div className="flex-1 flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed transition-colors" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                             <div className="flex items-center gap-3"><div className="w-8 h-8 rounded flex items-center justify-center bg-purple-500/20 text-purple-500"><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>Twitch</span></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--es-text-3)' }}>{t.waiting}</span>
                           </div>
                           <div className="flex-1 flex items-center justify-between p-3 rounded-lg opacity-50 cursor-not-allowed transition-colors" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                             <div className="flex items-center gap-3"><div className="w-8 h-8 rounded flex items-center justify-center bg-red-500/20 text-red-500"><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>YouTube</span></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--es-text-3)' }}>{t.waiting}</span>
                           </div>
                         </>
                      ) : (
                         <>
                           <button onClick={() => setActiveVideo('twitch')} className={`flex-1 flex items-center justify-between p-3 rounded-lg transition-all border group cursor-pointer ${activeVideo === 'twitch' ? 'bg-purple-500/10 border-purple-500/50' : 'hover:border-purple-500/30'}`} style={{ background: activeVideo === 'twitch' ? '' : 'var(--es-surface)', borderColor: activeVideo === 'twitch' ? '' : 'var(--es-border)' }}>
                             <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${activeVideo === 'twitch' ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-500 group-hover:bg-purple-500 group-hover:text-white'}`}><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>Twitch</span></div>
                             {isLive ? (
                                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-xs font-bold" style={{ color: 'var(--es-text-3)' }}>112K</span></div>
                             ) : (
                                 <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded">VOD {t.vodWatch}</span>
                             )}
                           </button>
                           <button onClick={() => setActiveVideo('youtube')} className={`flex-1 flex items-center justify-between p-3 rounded-lg transition-all border group cursor-pointer ${activeVideo === 'youtube' ? 'bg-red-500/10 border-red-500/50' : 'hover:border-red-500/30'}`} style={{ background: activeVideo === 'youtube' ? '' : 'var(--es-surface)', borderColor: activeVideo === 'youtube' ? '' : 'var(--es-border)' }}>
                             <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${activeVideo === 'youtube' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white'}`}><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold transition-colors" style={{ color: 'var(--es-text-1)' }}>YouTube</span></div>
                             {isLive ? (
                                 <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-xs font-bold" style={{ color: 'var(--es-text-3)' }}>75K</span></div>
                             ) : (
                                 <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">{t.highlights}</span>
                             )}
                           </button>
                         </>
                      )}
                   </div>
                 </div>
                 
                 {activeVideo && (
                   <div className="rounded-xl overflow-hidden shadow-2xl animate-fade-in relative pt-[56.25%] transition-colors" style={{ background: '#000', border: '1px solid var(--es-border)' }}>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${activeVideo === 'twitch' ? 'bg-purple-500' : 'bg-red-500'}`}>
                         <MonitorPlay className="w-8 h-8 text-white" />
                       </div>
                       <span className="text-sm font-black text-white uppercase tracking-widest">
                         {isLive ? `${activeVideo} ${t.streamStarting}` : `${activeVideo} ${t.vodLoading}`}
                       </span>
                       <span className="text-xs mt-2" style={{ color: 'var(--es-text-3)' }}>{t.awaitingConnection}</span>
                     </div>
                   </div>
                 )}
               </div>

               <div className="col-span-1">
                  <div className="w-full h-full min-h-[250px] rounded-xl overflow-hidden shadow-lg relative flex flex-col group cursor-pointer hover:opacity-90 transition-all" style={{ background: 'var(--es-surface-2)', border: '1px solid var(--es-border)' }}>
                    <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest" style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>{t.sponsored}</div>
                    <div className="flex-1 flex flex-col items-center justify-center relative p-6 text-center">
                      <div className="absolute inset-0 cyber-grid opacity-10" />
                      <Flame className="w-12 h-12 text-blue-500 mb-4 animate-pulse relative z-10" />
                      <span className="text-2xl font-black tracking-tighter relative z-10 transition-colors" style={{ color: 'var(--es-text-1)' }}>REDBULL <span className="text-blue-500">GAMING</span></span>
                      <span className="text-xs font-bold mt-2 relative z-10 transition-colors" style={{ color: 'var(--es-text-3)' }}>Kanatlandırır.</span>
                    </div>
                    <div className="h-10 border-t flex items-center justify-center transition-colors" style={{ background: 'rgba(77, 124, 254, 0.1)', borderColor: 'rgba(77, 124, 254, 0.2)' }}>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest transition-colors">{t.seeMore}</span>
                    </div>
                  </div>
               </div>
             </div>
             {/* 🚀 YAYIN VE REKLAM BÖLÜMÜ SONU */}

           </div>
         )}
         
         {standardTab === 'lineups' && <MatchScoreboard match={selectedMatch} gameColor={gameColor} />}
         {standardTab === 'stats' && <div className="text-center py-20 font-black uppercase tracking-widest animate-fade-in border border-dashed rounded-xl transition-colors" style={{ color: 'var(--es-text-3)', borderColor: 'var(--es-border)' }}>Maç içi istatistikler derleniyor...</div>}
      </div>
    </div>
  );
}