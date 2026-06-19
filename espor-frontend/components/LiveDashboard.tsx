"use client";

import { useState } from "react";
import { ChevronDown, Search, Clock, Users, Info, Radio, MonitorPlay, TrendingUp, ChevronLeft, BarChart3, ListFilter, Layers3 } from "lucide-react";
import { LIVE_MATCHES, UPCOMING_MATCHES, COMPLETED_MATCHES, GAMES } from "@/app/data/mockData";
import MatchScoreboard from "./MatchScoreboard"; // 🚀 VETO VE FRAG TABLOSU
import MatchAnalytics from "./MatchAnalytics";   // 🚀 DERİN GRAFİKLER

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
  return (
    <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0`} style={{ background: color }}>
      {name.slice(0, 3).toUpperCase()}
    </div>
  );
}

export default function LiveDashboard() {
  const [selectedMatchId, setSelectedMatchId] = useState<string>(LIVE_MATCHES[0]?.id || COMPLETED_MATCHES[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['Live', 'Upcoming', 'Finished']);
  
  const [viewMode, setViewMode] = useState<'standard' | 'analysis'>('standard');
  const [standardTab, setStandardTab] = useState<'overview' | 'lineups' | 'stats'>('overview');

  const selectedMatch = [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES].find(m => m.id === selectedMatchId) || LIVE_MATCHES[0];
  const gameColor = selectedMatch ? GAME_COLORS[selectedMatch.game] : '#4D7CFE';

  const SECTIONS = [
    { label: 'Live', title: 'CANLI', matches: LIVE_MATCHES, color: '#EF4444' },
    { label: 'Upcoming', title: 'YAKLAŞAN', matches: UPCOMING_MATCHES, color: '#4D7CFE' },
    { label: 'Finished', title: 'BUGÜN BİTENLER', matches: COMPLETED_MATCHES.slice(0, 2), color: 'var(--es-text-3)' },
  ];

  return (
    <div className="flex flex-row w-full h-full overflow-hidden" style={{ background: 'var(--es-bg)' }}>
      
      {/* 1. SOL PANEL: MAÇ LİSTESİ */}
      <div className="w-[280px] shrink-0 flex flex-col overflow-hidden transition-all duration-300" style={{ borderRight: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
        <div className="p-3 border-b border-white/5">
          <div className="relative group">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Maç veya takım ara..." className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none text-white transition-all bg-es-surface border border-es-border focus:border-es-cyan" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {SECTIONS.map(({ label, title, matches, color }) => {
            const isExpanded = expandedSections.includes(label);
            return (
              <div key={label}>
                <button onClick={() => setExpandedSections(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label])} className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-white/5" style={{ color }}>
                  <div className="flex items-center gap-2">
                    {label === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {title} <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${color}15`, color }}>{matches.length}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                </button>
                {isExpanded && (
                  <div className="flex flex-col px-2 pb-2">
                    {matches.map(match => (
                      <button key={match.id} onClick={() => { setSelectedMatchId(match.id); setViewMode('standard'); setStandardTab('overview'); }} className="w-full text-left px-3 py-2.5 rounded-xl mb-1 transition-all group relative overflow-hidden" style={{ background: selectedMatchId === match.id ? `${GAME_COLORS[match.game]}10` : 'transparent', borderLeft: selectedMatchId === match.id ? `2px solid ${GAME_COLORS[match.game]}` : '2px solid transparent' }}>
                        <div className="flex items-center justify-between mb-1.5">
                           <div className="flex items-center gap-2"><TeamLogo name={match.team1.short} color={match.team1.color} size="xs" /><span className="text-xs font-semibold text-white truncate max-w-[100px] group-hover:text-es-cyan transition-colors">{match.team1.name}</span></div>
                           <span className="text-xs font-black text-white score-display tabular-nums">{match.team1.score}</span>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                           <div className="flex items-center gap-2"><TeamLogo name={match.team2.short} color={match.team2.color} size="xs" /><span className="text-xs font-semibold text-white truncate max-w-[100px] group-hover:text-es-cyan transition-colors">{match.team2.name}</span></div>
                           <span className="text-xs font-black text-white score-display tabular-nums">{match.team2.score}</span>
                        </div>
                        <div className="flex items-center gap-1.5"><GameBadge gameId={match.game} small /><span className="text-[9px] text-slate-500 truncate">{match.tournamentShort}</span></div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. ORTA PANEL: ANA İÇERİK ALANI */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* 🚀 ANALİZ MODU: FULL STATS GRAFİKLERİ */}
        {viewMode === 'analysis' ? (
          <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-es-bg">
            <div className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-es-bg-2">
              <button onClick={() => setViewMode('standard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
                <span className="text-xs font-black uppercase tracking-widest">Maç Görünümüne Dön</span>
              </button>
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-3"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-black text-white">{selectedMatch.team1.name}</span></div>
                 <span className="text-sm font-black text-slate-500">vs</span>
                 <div className="flex items-center gap-3"><span className="text-xs font-black text-white">{selectedMatch.team2.name}</span><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               {/* SADECE GRAFİKLER BURADA ÇAĞRILIR */}
               <MatchAnalytics 
                 match={selectedMatch} 
                 category={(selectedMatch.game === 'cs2' || selectedMatch.game === 'val') ? 'fps' : 'moba'} 
                 gameColor={gameColor} 
                 hasDeepData={!(selectedMatch.team1.name === "Natus Vincere" || selectedMatch.team2.name === "Natus Vincere")} 
               />
            </div>
          </div>
        ) : (
          /* 🏠 STANDART MOD: MAÇ GÖRÜNÜMÜ */
          <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
            <div className="shrink-0 px-8 pt-8 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
              <div className="relative">
                <div className="flex items-center justify-between pb-8">
                  <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                    <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="lg" />
                    <div className="text-2xl font-black text-white tracking-tight">{selectedMatch.team1.name}</div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-1" style={{ background: selectedMatch.status === 'live' ? 'rgba(239, 68, 68, 0.15)' : 'var(--es-surface)', border: selectedMatch.status === 'live' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--es-border)' }}>
                      {selectedMatch.status === 'live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      <span className="text-xs font-black uppercase tracking-widest" style={{ color: selectedMatch.status === 'live' ? '#F87171' : 'var(--es-text-3)' }}>
                        {selectedMatch.status === 'live' ? 'LIVE' : selectedMatch.status === 'completed' ? 'BİTTİ' : 'YAKLAŞAN'}
                      </span>
                    </div>
                    <div className="text-6xl font-black text-white tracking-tighter score-display tabular-nums leading-none mb-2">{selectedMatch.team1.score} <span className="text-slate-700 mx-2">:</span> {selectedMatch.team2.score}</div>
                    
                    {/* FULL STATS BUTONU (Grafiklere Gider) */}
                    {selectedMatch.status === 'completed' && (
                      <button 
                        onClick={() => setViewMode('analysis')}
                        className="mt-2 px-6 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                        style={{ background: '#4D7CFE', color: 'white', boxShadow: `0 0 20px rgba(77, 124, 254, 0.4)` }}
                      >
                        <BarChart3 className="w-4 h-4" /> Full Stats
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                    <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="lg" />
                    <div className="text-2xl font-black text-white tracking-tight">{selectedMatch.team2.name}</div>
                  </div>
                </div>
                
                {/* 🔴 SEKMELER (Lineups & Veto Olarak Güncellendi) */}
                <div className="flex items-center gap-8 border-t border-white/5">
                  {[
                    { id: 'overview', label: 'Overview', icon: Info },
                    { id: 'lineups', label: 'Lineups & Veto', icon: Layers3 }, // 🚀 YENİLENDİ
                    { id: 'stats', label: 'Statistics', icon: ListFilter },
                  ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setStandardTab(tab.id as any)}
                      className={`px-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${standardTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                    >
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
                       <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Info className="w-4 h-4" style={{ color: gameColor }}/> Maç Bilgileri</h4>
                       <div className="space-y-3">
                         <div className="flex justify-between"><span className="text-xs text-slate-400">Turnuva</span><span className="text-xs font-bold text-white truncate max-w-[180px]">{selectedMatch.tournament || selectedMatch.tournamentShort}</span></div>
                         <div className="flex justify-between"><span className="text-xs text-slate-400">Aşama</span><span className="text-xs font-bold text-white">{selectedMatch.stage || "Normal Sezon"}</span></div>
                         <div className="flex justify-between"><span className="text-xs text-slate-400">Ödül Havuzu</span><span className="text-xs font-bold text-green-400">{selectedMatch.prizePool || "Açıklanmadı"}</span></div>
                       </div>
                     </div>
                     <div className="rounded-xl p-5 shadow-lg flex flex-col justify-center" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                       <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: gameColor }}/> Takım Formu (Son 5)</h4>
                       <div className="space-y-4 flex-1 flex flex-col justify-center">
                         <div className="flex items-center justify-between p-2 rounded-lg bg-es-surface border border-white/5">
                           <div className="flex items-center gap-2"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-bold text-white truncate max-w-[80px]">{selectedMatch.team1.name}</span></div>
                           <div className="flex gap-1.5">{['W','W','W','L','W'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{r}</div>)}</div>
                         </div>
                         <div className="flex items-center justify-between p-2 rounded-lg bg-es-surface border border-white/5">
                           <div className="flex items-center gap-2"><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /><span className="text-xs font-bold text-white truncate max-w-[80px]">{selectedMatch.team2.name}</span></div>
                           <div className="flex gap-1.5">{['W','L','W','L','L'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{r}</div>)}</div>
                         </div>
                       </div>
                     </div>
                   </div>

                   {selectedMatch.status === 'live' && (
                     <div className="grid grid-cols-2 gap-6">
                       <div className="col-span-2 rounded-xl p-5 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                         <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Radio className="w-4 h-4 text-red-500"/> Canlı Yayınlar</h4>
                         <div className="grid grid-cols-2 gap-4">
                           <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-purple-500/30 group cursor-pointer bg-es-surface">
                             <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-purple-600/20 flex items-center justify-center text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-colors"><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold text-white">Twitch</span></div>
                             <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-xs font-bold text-slate-400">112K İzleyici</span></div>
                           </button>
                           <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-red-500/30 group cursor-pointer bg-es-surface">
                              <div className="flex items-center gap-3"><div className="w-8 h-8 rounded bg-red-600/20 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors"><MonitorPlay className="w-4 h-4"/></div><span className="text-sm font-bold text-white">YouTube</span></div>
                              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/><span className="text-xs font-bold text-slate-400">75K İzleyici</span></div>
                           </button>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               )}
               
               {/* 🚀 YENİ: VETO VE KADRO (Lineups) BURADA ÇAĞRILIYOR */}
               {standardTab === 'lineups' && (
                 <MatchScoreboard match={selectedMatch} gameColor={gameColor} />
               )}
               
               {standardTab === 'stats' && <div className="text-center py-20 text-slate-500 font-black uppercase tracking-widest animate-fade-in border border-dashed border-white/10 rounded-xl">Maç içi istatistikler derleniyor...</div>}
            </div>
          </div>
        )}
      </div>
      
      {/* 3. SAĞ PANEL */}
      <div className="w-[300px] shrink-0 border-l border-white/5 bg-es-bg-2 p-5 overflow-y-auto custom-scrollbar">
        <div className="rounded-xl p-5 relative overflow-hidden shadow-lg mb-6" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Öne Çıkan</span></div>
            <div className="text-base font-black text-white mb-1">VCT Masters Shanghai</div>
            <div className="text-xs text-slate-400">Grand Finals • SEN vs FNC</div>
            <div className="mt-4 text-xs font-bold flex items-center gap-1 text-red-400"><Users className="w-3.5 h-3.5" /> 214K İzleyici</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3"><Clock className="w-4 h-4 text-blue-400" /><span className="text-xs font-bold text-white uppercase tracking-widest">Sıradaki Maçlar</span></div>
          <div className="flex flex-col gap-2">
            {UPCOMING_MATCHES.slice(0, 3).map((match, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5 cursor-pointer" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1.5"><GameBadge gameId={match.game} small /><span className="text-[10px] text-slate-400 font-bold">{match.scheduledTime}</span></div>
                  <span className="text-xs font-bold text-white truncate block">{match.team1.name} vs {match.team2.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}