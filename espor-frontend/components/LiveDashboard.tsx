"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Search, MonitorPlay, Trophy, Clock, Star, Radio, Users, Zap, PlayCircle, ExternalLink, Info, BarChart2, TrendingUp, Swords, Shield, Target } from "lucide-react";
import { LIVE_MATCHES, UPCOMING_MATCHES, COMPLETED_MATCHES, STANDINGS, GAMES } from "@/app/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const GAME_COLORS: Record<string, string> = { lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

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
  const [selectedMatchId, setSelectedMatchId] = useState<string>(LIVE_MATCHES[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['Live', 'Upcoming', 'Finished']);

  const selectedMatch = [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES].find(m => m.id === selectedMatchId) || LIVE_MATCHES[0];
  const gameColor = selectedMatch ? GAME_COLORS[selectedMatch.game] : '#4D7CFE';

  const SECTIONS = [
    { label: 'Live', title: 'CANLI', matches: LIVE_MATCHES, color: '#EF4444' },
    { label: 'Upcoming', title: 'YAKLAŞAN', matches: UPCOMING_MATCHES, color: '#4D7CFE' },
    { label: 'Finished', title: 'BİTEN', matches: COMPLETED_MATCHES, color: 'var(--es-text-3)' },
  ];

  return (
    // İŞTE SİHRİN GERÇEKLEŞTİĞİ YER: h-full ve overflow-hidden ile ekranı kilitliyoruz.
    <div className="flex flex-row w-full h-full overflow-hidden" style={{ background: 'var(--es-bg)' }}>
      
      {/* --- 1. SOL PANEL: MAÇ LİSTESİ --- */}
      <div className="w-[280px] shrink-0 flex flex-col overflow-hidden" style={{ borderRight: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Maç veya takım ara..." className="w-full pl-8 pr-3 py-2 rounded-lg text-xs outline-none text-white" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {SECTIONS.map(({ label, title, matches, color }) => {
            const isExpanded = expandedSections.includes(label);
            return (
              <div key={label}>
                <button onClick={() => setExpandedSections(prev => prev.includes(label) ? prev.filter(s => s !== label) : [...prev, label])} className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-white/5" style={{ color }}>
                  <div className="flex items-center gap-2">
                    {label === 'Live' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                    {title} <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${color}20`, color }}>{matches.length}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                </button>
                {isExpanded && (
                  <div className="flex flex-col px-2 pb-2">
                    {matches.map(match => (
                      <button key={match.id} onClick={() => setSelectedMatchId(match.id)} className="w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all" style={{ background: selectedMatchId === match.id ? `${GAME_COLORS[match.game]}15` : 'transparent', borderLeft: selectedMatchId === match.id ? `2px solid ${GAME_COLORS[match.game]}` : '2px solid transparent' }}>
                        <div className="flex items-center justify-between mb-1.5">
                           <div className="flex items-center gap-2"><TeamLogo name={match.team1.short} color={match.team1.color} size="xs" /><span className="text-xs font-semibold text-white truncate max-w-[100px]">{match.team1.name}</span></div>
                           <span className="text-xs font-black text-white">{match.team1.score}</span>
                        </div>
                        <div className="flex items-center justify-between mb-1.5">
                           <div className="flex items-center gap-2"><TeamLogo name={match.team2.short} color={match.team2.color} size="xs" /><span className="text-xs font-semibold text-white truncate max-w-[100px]">{match.team2.name}</span></div>
                           <span className="text-xs font-black text-white">{match.team2.score}</span>
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

      {/* --- 2. ORTA PANEL: MAÇ DETAYLARI --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="shrink-0 px-8 pt-6 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
          <div className="relative">
             <div className="flex items-center justify-between pb-6">
                <div className="flex flex-col items-center gap-3 w-48">
                  <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="lg" />
                  <div className="text-2xl font-black text-white tracking-wide">{selectedMatch.team1.name}</div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-bold text-red-400">LIVE</span>
                  </div>
                  <div className="text-6xl font-black text-white tracking-tighter score-display">{selectedMatch.team1.score} <span className="text-slate-600 mx-2">:</span> {selectedMatch.team2.score}</div>
                  <span className="text-xs font-medium px-3 py-1 rounded mt-2" style={{ background: 'var(--es-surface)', color: gameColor }}>{selectedMatch.currentMap || 'BO3'}</span>
                </div>
                <div className="flex flex-col items-center gap-3 w-48">
                  <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="lg" />
                  <div className="text-2xl font-black text-white tracking-wide">{selectedMatch.team2.name}</div>
                </div>
             </div>
             <div className="flex items-center gap-6">
               <button className="px-2 py-3 text-xs font-bold text-white uppercase tracking-wider" style={{ borderBottom: `2px solid ${gameColor}` }}>Genel Bakış</button>
               <button className="px-2 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-white">İstatistikler</button>
             </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="grid grid-cols-2 gap-6">
             <div className="rounded-xl p-5 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
               <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Info className="w-4 h-4" style={{ color: gameColor }}/> Maç Bilgileri</h4>
               <div className="space-y-3">
                 <div className="flex justify-between"><span className="text-xs text-slate-400">Turnuva</span><span className="text-xs font-bold text-white">{selectedMatch.tournament}</span></div>
                 <div className="flex justify-between"><span className="text-xs text-slate-400">Aşama</span><span className="text-xs font-bold text-white">{selectedMatch.stage}</span></div>
                 <div className="flex justify-between"><span className="text-xs text-slate-400">Ödül Havuzu</span><span className="text-xs font-bold text-green-400">{selectedMatch.prizePool}</span></div>
               </div>
             </div>
             
             <div className="rounded-xl p-5 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
               <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Swords className="w-4 h-4" style={{ color: gameColor }}/> Kafa Kafaya (H2H)</h4>
               <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--es-surface)' }}>
                 <div className="text-center"><div className="text-xl font-black text-white">3</div><div className="text-[10px] text-slate-400">{selectedMatch.team1.name}</div></div>
                 <div className="text-xs text-slate-500 font-bold">Tarihi Rekor</div>
                 <div className="text-center"><div className="text-xl font-black text-white">1</div><div className="text-[10px] text-slate-400">{selectedMatch.team2.name}</div></div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* --- 3. SAĞ PANEL: TAKVİM & TRENDLER --- */}
      <div className="w-[300px] shrink-0 overflow-y-auto custom-scrollbar p-5 flex flex-col gap-6" style={{ borderLeft: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
        <div className="rounded-xl p-5 relative overflow-hidden shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <div className="absolute inset-0 cyber-grid opacity-20" />
          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /><span className="text-[10px] font-bold text-red-400">FEATURED • LIVE</span></div>
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
                <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}