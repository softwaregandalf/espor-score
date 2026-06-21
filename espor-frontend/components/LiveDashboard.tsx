"use client";

import { useState } from "react";
import { Info, Radio, MonitorPlay, TrendingUp, ChevronLeft, BarChart3, ListFilter, Layers3, Flame, Clock } from "lucide-react";
import { LIVE_MATCHES, UPCOMING_MATCHES, COMPLETED_MATCHES } from "@/app/data/mockData";
import MatchScoreboard from "./MatchScoreboard"; 
import MatchAnalytics from "./MatchAnalytics";   
import RightSidebar from "./RightSidebar"; 
import NewsFeed from "./NewsFeed"; 
import MatchListSidebar from "./MatchListSidebar"; 
import { useLanguage } from "./LanguageProvider"; // 🚀 DİL BEYNİ EKLENDİ

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0 shadow-lg`} style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function LiveDashboard() {
  const { t, translateApiText } = useLanguage(); // 🚀 DİL BEYNİ BAĞLANDI

  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['Live', 'Upcoming', 'Finished']);
  
  const [viewMode, setViewMode] = useState<'standard' | 'analysis'>('standard');
  const [standardTab, setStandardTab] = useState<'overview' | 'lineups' | 'stats'>('overview');
  const [activeVideo, setActiveVideo] = useState<'twitch' | 'youtube' | null>(null);

  const selectedMatch = selectedMatchId ? [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES].find(m => m.id === selectedMatchId) : null;
  const gameColor = selectedMatch ? GAME_COLORS[selectedMatch.game] : '#4D7CFE';

  // 🚀 BAŞLIKLAR SÖZLÜĞE BAĞLANDI
  const SECTIONS = [
    { label: 'Live', title: t.live, matches: LIVE_MATCHES, color: '#EF4444' },
    { label: 'Upcoming', title: t.upcoming, matches: UPCOMING_MATCHES, color: '#4D7CFE' },
    { label: 'Finished', title: t.finishedToday, matches: COMPLETED_MATCHES.slice(0, 2), color: 'var(--es-text-3)' },
  ];

  const handleMatchSelect = (id: string) => {
    setSelectedMatchId(id);
    setViewMode('standard');
    setStandardTab('overview');
    setActiveVideo(null);
  };

  return (
    <div className="flex flex-row w-full h-full overflow-hidden" style={{ background: 'var(--es-bg)' }}>
      
      {/* 1. SOL PANEL */}
      <MatchListSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        sections={SECTIONS}
        selectedMatchId={selectedMatchId}
        onMatchSelect={handleMatchSelect}
      />

      {/* 2. ORTA PANEL: ANA İÇERİK ALANI */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {!selectedMatch ? (
          <NewsFeed />
        ) : (
          <>
            {viewMode === 'analysis' ? (
              <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-es-bg">
                <div className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-es-bg-2">
                  <button onClick={() => setViewMode('standard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-cyan group-hover:text-black transition-all"><ChevronLeft className="w-4 h-4" /></div>
                    {/* 🚀 ANA AKIŞA DÖN */}
                    <span className="text-xs font-black uppercase tracking-widest">{t.backToMain}</span>
                  </button>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center gap-3"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-black text-white">{selectedMatch.team1.name}</span></div>
                     <span className="text-sm font-black text-slate-500">vs</span>
                     <div className="flex items-center gap-3"><span className="text-xs font-black text-white">{selectedMatch.team2.name}</span><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /></div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                   <MatchAnalytics match={selectedMatch} category={(selectedMatch.game === 'cs2' || selectedMatch.game === 'val') ? 'fps' : 'moba'} gameColor={gameColor} hasDeepData={!(selectedMatch.team1.name === "Natus Vincere" || selectedMatch.team2.name === "Natus Vincere")} />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                <div className="shrink-0 px-8 pt-6 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
                  
                  <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
                  
                  <div className="relative z-20">
                    
                    <button onClick={() => setSelectedMatchId(null)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-6 w-fit">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-cyan group-hover:text-black transition-all">
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                      {/* 🚀 ANA AKIŞA DÖN */}
                      <span className="text-xs font-black uppercase tracking-widest">{t.backToMain}</span>
                    </button>

                    <div className="flex items-center justify-between pb-8">
                      <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                        <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="lg" />
                        <div className="text-2xl font-black text-white tracking-tight">{selectedMatch.team1.name}</div>
                      </div>
                      
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-1" style={{ background: selectedMatch.status === 'live' ? 'rgba(239, 68, 68, 0.15)' : 'var(--es-surface)', border: selectedMatch.status === 'live' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--es-border)' }}>
                          {selectedMatch.status === 'live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                          {/* 🚀 LIVE / UPCOMING / FINISHED */}
                          <span className="text-xs font-black uppercase tracking-widest" style={{ color: selectedMatch.status === 'live' ? '#F87171' : 'var(--es-text-3)' }}>
                            {selectedMatch.status === 'live' ? t.live : selectedMatch.status === 'completed' ? t.results : t.upcoming}
                          </span>
                        </div>
                        <div className="text-6xl font-black text-white tracking-tighter score-display tabular-nums leading-none mb-2">{selectedMatch.team1.score} <span className="text-slate-700 mx-2">:</span> {selectedMatch.team2.score}</div>
                        
                        {selectedMatch.status === 'completed' && (
                          <button onClick={() => setViewMode('analysis')} className="mt-2 px-6 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl" style={{ background: '#4D7CFE', color: 'white', boxShadow: `0 0 20px rgba(77, 124, 254, 0.4)` }}>
                            <BarChart3 className="w-4 h-4" /> Full Stats
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                        <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="lg" />
                        <div className="text-2xl font-black text-white tracking-tight">{selectedMatch.team2.name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 border-t border-white/5">
                      {/* 🚀 TAB İSİMLERİ SÖZLÜĞE BAĞLANDI */}
                      {[ { id: 'overview', label: t.overview, icon: Info }, { id: 'lineups', label: t.lineups, icon: Layers3 }, { id: 'stats', label: t.statistics, icon: ListFilter } ].map(tab => (
                        <button key={tab.id} onClick={() => setStandardTab(tab.id as any)} className={`px-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${standardTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
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
                           {/* 🚀 MAÇ BİLGİLERİ KUTUSU */}
                           <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Info className="w-4 h-4" style={{ color: gameColor }}/> {t.matchInfo}</h4>
                           <div className="space-y-3">
                             <div className="flex justify-between"><span className="text-xs text-slate-400">{t.tournament}</span><span className="text-xs font-bold text-white truncate max-w-[180px]">{selectedMatch.tournament || selectedMatch.tournamentShort}</span></div>
                             <div className="flex justify-between"><span className="text-xs text-slate-400">{t.stage}</span><span className="text-xs font-bold text-white">{translateApiText(selectedMatch.stage || "Normal Sezon")}</span></div>
                             <div className="flex justify-between"><span className="text-xs text-slate-400">{t.prizePool}</span><span className="text-xs font-bold text-green-400">{selectedMatch.prizePool || "Açıklanmadı"}</span></div>
                           </div>
                         </div>
                         <div className="rounded-xl p-5 shadow-lg flex flex-col justify-center" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                           {/* 🚀 TAKIM FORMU KUTUSU */}
                           <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: gameColor }}/> {t.teamForm}</h4>
                           <div className="space-y-4 flex-1 flex flex-col justify-center">
                             <div className="flex items-center justify-between p-2 rounded-lg bg-es-surface border border-white/5"><div className="flex items-center gap-2"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-bold text-white truncate max-w-[80px]">{selectedMatch.team1.name}</span></div><div className="flex gap-1.5">{['W','W','W','L','W'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{r}</div>)}</div></div>
                             <div className="flex items-center justify-between p-2 rounded-lg bg-es-surface border border-white/5"><div className="flex items-center gap-2"><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /><span className="text-xs font-bold text-white truncate max-w-[80px]">{selectedMatch.team2.name}</span></div><div className="flex gap-1.5">{['W','L','W','L','L'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{r}</div>)}</div></div>
                           </div>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div className="col-span-1 flex flex-col gap-4">
                           <div className="rounded-xl p-5 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                             <h4 className="text-xs font-bold text-white mb-4 flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 {selectedMatch.status === 'live' ? <Radio className="w-4 h-4 text-red-500"/> :
                                  selectedMatch.status === 'completed' ? <MonitorPlay className="w-4 h-4 text-es-cyan"/> :
                                  <Clock className="w-4 h-4 text-slate-500"/>}
                                 {/* 🚀 CANLI YAYINLAR KUTUSU */}
                                 {selectedMatch.status === 'live' ? t.liveStreams :
                                  selectedMatch.status === 'completed' ? 'Özetler & Tekrarlar' :
                                  'Yayın Kanalları (Yakında)'}
                               </div>
                               {activeVideo && <span onClick={() => setActiveVideo(null)} className="text-[10px] text-slate-500 hover:text-white cursor-pointer uppercase font-black">Kapat</span>}
                             </h4>

                             <div className="flex gap-4">
                                {selectedMatch.status === 'upcoming' ? (
                                   <>
                                     <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5 opacity-50 cursor-not-allowed">
                                       <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-purple-600/20 flex items-center justify-center text-purple-500"><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold text-white">Twitch</span></div>
                                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bekleniyor</span>
                                     </div>
                                     <div className="flex-1 flex items-center justify-between p-3 rounded-lg bg-slate-900/50 border border-white/5 opacity-50 cursor-not-allowed">
                                       <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-red-600/20 flex items-center justify-center text-red-500"><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold text-white">YouTube</span></div>
                                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Bekleniyor</span>
                                     </div>
                                   </>
                                ) : (
                                   <>
                                     <button onClick={() => setActiveVideo('twitch')} className={`flex-1 flex items-center justify-between p-3 rounded-lg transition-all border group cursor-pointer ${activeVideo === 'twitch' ? 'bg-purple-600/10 border-purple-500' : 'bg-es-surface border-transparent hover:border-purple-500/30'}`}>
                                       <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${activeVideo === 'twitch' ? 'bg-purple-600 text-white' : 'bg-purple-600/20 text-purple-500 group-hover:bg-purple-600 group-hover:text-white'}`}><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold text-white">Twitch</span></div>
                                       {selectedMatch.status === 'live' ? (
                                           <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-xs font-bold text-slate-400">112K</span></div>
                                       ) : (
                                           <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-1 rounded">VOD İzle</span>
                                       )}
                                     </button>
                                     <button onClick={() => setActiveVideo('youtube')} className={`flex-1 flex items-center justify-between p-3 rounded-lg transition-all border group cursor-pointer ${activeVideo === 'youtube' ? 'bg-red-600/10 border-red-500' : 'bg-es-surface border-transparent hover:border-red-500/30'}`}>
                                       <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded flex items-center justify-center transition-colors ${activeVideo === 'youtube' ? 'bg-red-600 text-white' : 'bg-red-600/20 text-red-500 group-hover:bg-red-600 group-hover:text-white'}`}><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold text-white">YouTube</span></div>
                                       {selectedMatch.status === 'live' ? (
                                           <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-xs font-bold text-slate-400">75K</span></div>
                                       ) : (
                                           <span className="text-[10px] font-black text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded">Özet İzle</span>
                                       )}
                                     </button>
                                   </>
                                )}
                             </div>
                           </div>
                           
                           {activeVideo && (
                             <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black animate-fade-in relative pt-[56.25%]">
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${activeVideo === 'twitch' ? 'bg-purple-600' : 'bg-red-600'}`}>
                                   <MonitorPlay className="w-8 h-8 text-white" />
                                 </div>
                                 <span className="text-sm font-black text-white uppercase tracking-widest">
                                   {selectedMatch.status === 'live' ? `${activeVideo} Yayını Başlatılıyor...` : `${activeVideo} Özeti Yükleniyor...`}
                                 </span>
                                 <span className="text-xs text-slate-500 mt-2">Bağlantı bekleniyor</span>
                               </div>
                             </div>
                           )}
                         </div>

                         <div className="col-span-1">
                            <div className="w-full h-full min-h-[250px] rounded-xl overflow-hidden shadow-lg border border-white/5 bg-gradient-to-br from-slate-900 to-black relative flex flex-col group cursor-pointer hover:border-blue-500/50 transition-all">
                              <div className="absolute top-2 right-2 z-20 bg-black/60 px-2 py-0.5 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/10">Sponsorlu</div>
                              <div className="flex-1 flex flex-col items-center justify-center relative p-6 text-center">
                                <div className="absolute inset-0 cyber-grid opacity-10" />
                                <Flame className="w-12 h-12 text-blue-500 mb-4 animate-pulse relative z-10" />
                                <span className="text-2xl font-black text-white tracking-tighter relative z-10">REDBULL <span className="text-blue-500">GAMING</span></span>
                                <span className="text-xs font-bold text-slate-400 mt-2 relative z-10">Kanatlandırır.</span>
                              </div>
                              <div className="h-10 bg-blue-600/10 border-t border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Daha Fazla Bilgi</span>
                              </div>
                            </div>
                         </div>
                       </div>
                     </div>
                   )}
                   
                   {standardTab === 'lineups' && <MatchScoreboard match={selectedMatch} gameColor={gameColor} />}
                   {standardTab === 'stats' && <div className="text-center py-20 text-slate-500 font-black uppercase tracking-widest animate-fade-in border border-dashed border-white/10 rounded-xl">Maç içi istatistikler derleniyor...</div>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* 3. SAĞ PANEL (Sidebar) */}
      <RightSidebar />
      
    </div>
  );
}