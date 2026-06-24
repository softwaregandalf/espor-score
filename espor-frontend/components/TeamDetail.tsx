"use client";

import { useState } from "react";
import { ChevronLeft, Trophy, Users, Crosshair, Target, History, Globe, TrendingUp, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import PlayerDetail from "./PlayerDetail"; 
import { useLanguage } from "./LanguageProvider"; // 🚀 DİL BEYNİ EKLENDİ

// 🚀 VERİTABANI KURALI: Tüm veriler (roller vs) Global İngilizce yapıldı.
const generateTeamDetails = (team: any) => ({
  ...team,
  established: '2013',
  totalEarnings: '$4,250,000',
  winRate: 68,
  roster: [
    { id: 1, nickname: 'Alpha', realName: 'John Doe', role: 'IGL', nationality: '🇪🇺', rating: 1.12, headshot: '45%' },
    { id: 2, nickname: 'SnipeZ', realName: 'Jane Smith', role: 'Sniper', nationality: '🇫🇷', rating: 1.35, headshot: '30%' },
    { id: 3, nickname: 'EntryFragger', realName: 'Ali Yılmaz', role: 'Entry', nationality: '🇹🇷', rating: 1.18, headshot: '55%' },
    { id: 4, nickname: 'SupportKing', realName: 'Lars Müller', role: 'Support', nationality: '🇩🇪', rating: 1.05, headshot: '40%' },
    { id: 5, nickname: 'ClutchGod', realName: 'Kim Min-Jae', role: 'Lurker', nationality: '🇰🇷', rating: 1.20, headshot: '48%' },
  ],
  recentMatches: [
    { id: 1, opponent: 'FNATIC', result: 'W', score: '2-0', tournament: 'VCT Masters' },
    { id: 2, opponent: 'NRG', result: 'L', score: '1-2', tournament: 'VCT Masters' },
    { id: 3, opponent: 'LOUD', result: 'W', score: '2-1', tournament: 'Global Kickoff' },
  ],
  mapStats: [
    { name: 'Bind / Dust2', value: 75, color: '#22C55E' },
    { name: 'Split / Mirage', value: 60, color: '#3B82F6' },
    { name: 'Ascent / Inferno', value: 45, color: '#F59E0B' },
  ]
});

export default function TeamDetail({ team, gameColor, onBack }: { team: any, gameColor: string, onBack: () => void }) {
  const { t, translateApiText, language } = useLanguage(); 
  const [activeTab, setActiveTab] = useState<'roster' | 'stats' | 'matches'>('roster');
  
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const teamDetails = generateTeamDetails(team);

  if (selectedPlayer) {
    const category = (team.game === 'cs2' || team.game === 'val') ? 'fps' : 'moba';
    return <PlayerDetail player={selectedPlayer} gameColor={gameColor} category={category} onBack={() => setSelectedPlayer(null)} />;
  }

  // 🏠 STANDART TAKIM PROFİLİ GÖRÜNÜMÜ
  return (
    <div className="flex-1 flex flex-col overflow-hidden overflow-x-hidden animate-fade-in transition-colors relative min-w-0" style={{ background: 'var(--es-bg)' }}>
      <div className="shrink-0 px-3 md:px-8 pt-3 md:pt-8 pb-0 relative overflow-hidden overflow-x-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000" style={{ background: teamDetails.color, transform: 'translate(20%, -40%)' }} />
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto min-w-0">
          <button onClick={onBack} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-colors group mb-3 md:mb-6 w-fit max-w-full min-w-0" style={{ color: 'var(--es-text-3)' }}>
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center transition-all shrink-0" style={{ background: 'var(--es-surface)' }}><ChevronLeft className="w-4 h-4" style={{ color: 'var(--es-text-1)' }} /></div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors truncate min-w-0" style={{ color: 'var(--es-text-1)' }}>{t.backToRankings}</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start md:items-center sm:justify-between gap-3 sm:gap-4 md:gap-0 pb-3 md:pb-8 min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0 flex-1">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-white text-xl sm:text-2xl md:text-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border transition-colors shrink-0" style={{ background: teamDetails.color, borderColor: 'var(--es-border)' }}>
                {teamDetails.short}
              </div>
              <div className="flex flex-col gap-1 sm:gap-1.5 md:gap-2 min-w-0 flex-1 overflow-hidden">
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2">
                  <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest text-white shadow-sm shrink-0" style={{ background: gameColor }}>{teamDetails.game}</span>
                  <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest px-1.5 sm:px-2 py-0.5 rounded border transition-colors shrink-0 max-w-full" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}><Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" /> <span className="truncate">{translateApiText(teamDetails.region).toUpperCase()}</span></span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight transition-colors truncate leading-tight" style={{ color: 'var(--es-text-1)' }}>{teamDetails.name}</h1>
                <span className="text-[11px] sm:text-xs md:text-sm font-bold transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{translateApiText(teamDetails.country)} • {t.founded} {teamDetails.established}</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 md:gap-4 shrink-0 self-stretch sm:self-auto w-full sm:w-auto">
              <div className="flex flex-1 sm:flex-none flex-col items-center justify-center backdrop-blur px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border transition-colors min-w-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-3)' }}>{t.globalRank}</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black transition-colors tabular-nums" style={{ color: teamDetails.rank <= 3 ? '#FBBF24' : 'var(--es-text-1)' }}>#{teamDetails.rank}</span>
              </div>
              <div className="flex flex-1 sm:flex-none flex-col items-center justify-center backdrop-blur px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl border transition-colors min-w-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest mb-0.5 sm:mb-1 transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-3)' }}>{t.teamPoints}</span>
                <span className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{teamDetails.points}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 border-t overflow-x-auto scrollbar-hide whitespace-nowrap pr-4 md:pr-0 min-w-0 transition-colors" style={{ borderColor: 'var(--es-border)' }}>
            {[ { id: 'roster', label: t.activeRoster, icon: Users }, { id: 'stats', label: t.teamStats, icon: Target }, { id: 'matches', label: t.recentMatchesTitle, icon: History } ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className="py-2.5 sm:py-3 md:py-4 text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-wider sm:tracking-widest transition-all relative flex items-center gap-1 sm:gap-1.5 md:gap-2 hover:opacity-80 shrink-0" style={{ color: activeTab === tab.id ? 'var(--es-text-1)' : 'var(--es-text-3)' }}>
                <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 shrink-0" /> {tab.label}
                {activeTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: teamDetails.color }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-2.5 sm:p-3 md:p-8 min-w-0">
        <div className="max-w-5xl mx-auto min-w-0">
          
          {activeTab === 'roster' && (
            <div className="animate-fade-in flex flex-col gap-3 sm:gap-4 md:gap-6 min-w-0">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 sm:gap-2 mb-0 sm:mb-1 md:mb-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}><Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: teamDetails.color }}/> <span className="truncate">{t.startingLineup}</span></h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                {teamDetails.roster.map((player: any) => (
                  <div key={player.id} onClick={() => setSelectedPlayer(player)} className="rounded-xl overflow-hidden shadow-lg border relative group hover:border-es-cyan/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all cursor-pointer min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full -z-10 transition-colors opacity-10" style={{ background: 'var(--es-text-1)' }} />
                    <div className="p-3 sm:p-4 md:p-5 flex flex-col h-full min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-3 sm:mb-4 min-w-0">
                        <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                          <span className="text-lg sm:text-xl md:text-2xl font-black group-hover:text-es-cyan transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{player.nickname}</span>
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{player.realName}</span>
                        </div>
                        <span className="text-xl sm:text-2xl shrink-0">{player.nationality}</span>
                      </div>
                      
                      <div className="mt-auto pt-3 sm:pt-4 border-t flex items-center justify-between gap-2 transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider sm:tracking-widest px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors shrink-0 truncate max-w-[40%]" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)' }}>{translateApiText(player.role)}</span>
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <div className="flex flex-col items-end"><span className="text-[11px] sm:text-xs font-black transition-colors tabular-nums" style={{ color: 'var(--es-text-1)' }}>{player.rating.toFixed(2)}</span><span className="text-[7px] sm:text-[8px] font-bold uppercase transition-colors" style={{ color: 'var(--es-text-3)' }}>Rating</span></div>
                          <div className="flex flex-col items-end"><span className="text-[11px] sm:text-xs font-black transition-colors" style={{ color: 'var(--es-text-1)' }}>{player.headshot}</span><span className="text-[7px] sm:text-[8px] font-bold uppercase transition-colors" style={{ color: 'var(--es-text-3)' }}>HS%</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 min-w-0">
              <div className="rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border flex flex-col justify-center items-center relative overflow-hidden transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${teamDetails.color} 0%, transparent 70%)` }} />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest mb-4 sm:mb-5 md:mb-6 w-full text-center relative z-10 transition-colors px-2" style={{ color: 'var(--es-text-1)' }}>{t.allTimeWinRate}</h3>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex items-center justify-center z-10">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke={teamDetails.color} strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * teamDetails.winRate) / 100} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>%{teamDetails.winRate}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.winRate}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-3 sm:p-4 md:p-6 shadow-lg border transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                 <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest mb-4 sm:mb-5 md:mb-6 flex items-center gap-1.5 sm:gap-2 border-b pb-2 sm:pb-3 transition-colors min-w-0" style={{ color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}><Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: teamDetails.color }}/> <span className="truncate">{t.strongestMaps}</span></h3>
                 <div className="w-full h-40 sm:h-44 md:h-48 relative min-w-0">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={teamDetails.mapStats} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">
                         {teamDetails.mapStats.map((entry: any, index: number) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
                       </Pie>
                       <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: 'white', fontWeight: 'bold' }} formatter={(val: any) => [`%${val}`, t.winRate]} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 sm:gap-4 mt-2 min-w-0">
                   {teamDetails.mapStats.map((entry: any, index: number) => (
                     <div key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0 max-w-full"><div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ background: entry.color }} /><span className="text-[9px] sm:text-[10px] font-bold uppercase transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{entry.name}</span></div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="animate-fade-in flex flex-col gap-2 sm:gap-2.5 md:gap-3 min-w-0">
               <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest mb-0 sm:mb-1 md:mb-2 flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}><TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: teamDetails.color }}/> <span className="truncate">{t.recentMatchesTitle}</span></h3>
               {teamDetails.recentMatches.map((match: any) => (
                 <div key={match.id} className="flex items-center justify-between gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-4 rounded-xl border hover:opacity-80 transition-colors group cursor-pointer shadow-sm min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1 overflow-hidden">
                      <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-black text-sm sm:text-base md:text-lg shadow-inner shrink-0 ${match.result === 'W' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                        {match.result}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{match.tournament}</span>
                        <span className="text-sm sm:text-base md:text-lg font-black transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{t.vsStr} {match.opponent}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                       <span className="text-[10px] sm:text-xs md:text-sm font-bold mb-0.5 sm:mb-1 transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-3)' }}>{t.scoreStr}</span>
                       <span className="text-base sm:text-lg md:text-xl font-black tabular-nums px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-lg border transition-colors whitespace-nowrap" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>{match.score}</span>
                    </div>
                 </div>
               ))}
               <button className="mt-2 sm:mt-3 md:mt-4 py-2.5 sm:py-3 rounded-xl border text-[10px] sm:text-xs font-black uppercase tracking-wider sm:tracking-widest hover:opacity-80 transition-colors w-full sm:w-auto" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>
                 {t.seeAllMatchHistory}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
