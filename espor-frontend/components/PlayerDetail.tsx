"use client";

import { useState } from "react";
import { ChevronLeft, Crosshair, Target, History, Globe, TrendingUp, Trophy, Calendar, Sword } from "lucide-react";
import { useLanguage } from "./LanguageProvider"; 

const generatePlayerStats = (player: any, category: 'fps' | 'moba') => {
  const isFPS = category === 'fps';
  
  return {
    ...player,
    teamName: player.teamName || 'Team Vitality', 
    joinedDate: 'September 2023',
    totalWinnings: '$277,392',
    socials: { twitter: '@' + player.nickname.toLowerCase() },
    characters: isFPS ? [
      { name: 'Jett', useRate: '43%', matches: 184, rating: 1.22, acs: 254.7, kd: 1.34, adr: 168.8, kast: '72%', hs: '32%' },
      { name: 'Raze', useRate: '33%', matches: 148, rating: 1.15, acs: 242.1, kd: 1.21, adr: 155.2, kast: '69%', hs: '28%' },
      { name: 'Chamber', useRate: '24%', matches: 110, rating: 1.08, acs: 210.5, kd: 1.10, adr: 142.3, kast: '75%', hs: '35%' },
    ] : [
      { name: 'Ahri', useRate: '35%', matches: 120, winRate: '68%', kda: '4.2', csm: 9.5, kp: '72%', dpm: 680, goldM: 420 },
      { name: 'Azir', useRate: '25%', matches: 85, winRate: '62%', kda: '3.8', csm: 9.8, kp: '65%', dpm: 710, goldM: 435 },
      { name: 'Sylas', useRate: '15%', matches: 50, winRate: '55%', kda: '3.1', csm: 8.9, kp: '60%', dpm: 590, goldM: 390 },
    ],
    recentMatches: [
      { id: 1, tournament: 'VCT Masters 2026', stage: 'Playoffs', opponent: 'Paper Rex', result: 'L', score: '1:2', date: '2026/06/19' },
      { id: 2, tournament: 'VCT Masters 2026', stage: 'Playoffs', opponent: 'Sentinels', result: 'W', score: '2:1', date: '2026/06/15' },
      { id: 3, tournament: 'VCT EMEA Stage 2', stage: 'Grand Final', opponent: 'FNATIC', result: 'W', score: '3:1', date: '2026/05/10' },
    ],
    career: [
      { year: '2026', event: 'VCT Masters Shanghai', placement: '1st', prize: '$100,000' },
      { year: '2025', event: 'Valorant Champions', placement: '3rd-4th', prize: '$25,000' },
      { year: '2024', event: 'EMEA Kickoff', placement: '1st', prize: '$15,000' },
    ],
    pastTeams: [
      { name: 'Acend', left: 'August 2023' }, 
      { name: 'G2 Esports', left: 'January 2022' }, 
    ]
  };
};

export default function PlayerDetail({ player, gameColor, category, onBack }: { player: any, gameColor: string, category: 'fps'|'moba', onBack: () => void }) {
  const { t, translateApiText, language } = useLanguage(); 
  const [timeFilter, setTimeFilter] = useState<'30d' | '60d' | '90d' | 'all'>('all');
  const stats = generatePlayerStats(player, category);
  const isFPS = category === 'fps';
  const game = player.game; 

  return (
    <div className="flex-1 flex flex-col overflow-hidden overflow-x-hidden min-w-0 animate-fade-in transition-colors relative z-20" style={{ background: 'var(--es-bg)' }}>
      
      <div className="shrink-0 px-3 sm:px-4 md:px-8 py-3 sm:py-4 md:py-6 border-b relative overflow-hidden transition-colors" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: gameColor, transform: 'translate(30%, -50%)' }} />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-3 sm:gap-4 md:gap-6 min-w-0">
          <button onClick={onBack} className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-colors group w-fit max-w-full min-w-0" style={{ color: 'var(--es-text-3)' }}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all shrink-0" style={{ background: 'var(--es-surface)' }}><ChevronLeft className="w-4 h-4" style={{ color: 'var(--es-text-1)' }} /></div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors truncate min-w-0" style={{ color: 'var(--es-text-1)' }}>{t.backToTopPlayers}</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 min-w-0">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl border flex items-center justify-center shadow-2xl overflow-hidden relative transition-colors shrink-0" style={{ background: 'var(--es-surface-2)', borderColor: 'var(--es-border)' }}>
                 <span className="text-2xl sm:text-3xl md:text-4xl font-black transition-colors" style={{ color: 'var(--es-text-3)' }}>{stats.nickname.slice(0,1)}</span>
              </div>
              
              <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                  <span className="text-base sm:text-lg shrink-0">{stats.nationality}</span>
                  <span className="px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-widest border transition-colors shrink-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-3)' }}>{translateApiText(stats.role)}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
                  <span className="truncate block sm:inline">{stats.nickname}</span>
                  <span className="block sm:inline text-base sm:text-xl font-bold tracking-normal sm:ml-2 transition-colors whitespace-normal" style={{ color: 'var(--es-text-3)' }}>{stats.realName}</span>
                </h1>
                <a href="#" className="text-[10px] sm:text-xs font-bold text-es-cyan hover:opacity-80 mt-0.5 sm:mt-1 truncate">{stats.socials.twitter}</a>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border transition-colors w-full md:w-auto shrink-0 min-w-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 w-full md:w-auto">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-[9px] sm:text-[10px] font-black text-white shrink-0" style={{ background: player.teamColor || '#4D7CFE' }}>{stats.teamName.slice(0,3).toUpperCase()}</div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-black transition-colors truncate" style={{ color: 'var(--es-text-1)' }}>{stats.teamName}</span>
                  <span className="text-[9px] sm:text-[10px] font-bold transition-colors whitespace-normal" style={{ color: 'var(--es-text-3)' }}>{t.joinedTeam} {translateApiText(stats.joinedDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 sm:p-4 md:p-8 min-w-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 min-w-0">
          
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 md:gap-8 min-w-0">
            <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-b pb-2 transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
                  <Sword className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: gameColor }}/> 
                  <span className="truncate">{game === 'val' ? t.mostPlayedAgents : game === 'cs2' ? t.mostPlayedRoles : t.mostPlayedChampions}</span>
                </h3>
                <div className="flex items-center gap-0.5 sm:gap-1 rounded-lg p-0.5 sm:p-1 border transition-colors overflow-x-auto scrollbar-hide whitespace-nowrap shrink-0 self-start sm:self-auto" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                  {[{id:'30d', label: t.days30}, {id:'60d', label: t.days60}, {id:'90d', label: t.days90}, {id:'all', label: t.allLabel}].map(tObj => (
                    <button key={tObj.id} onClick={() => setTimeFilter(tObj.id as any)} className={`px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-black uppercase rounded transition-all shrink-0`} style={{ background: timeFilter === tObj.id ? 'var(--es-text-1)' : 'transparent', color: timeFilter === tObj.id ? 'var(--es-bg)' : 'var(--es-text-3)' }}>
                      {tObj.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border overflow-hidden shadow-lg transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                <div className="overflow-x-auto scrollbar-hide md:overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed md:table-auto md:min-w-[640px]">
                  <thead>
                    <tr className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-b transition-colors" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)', borderColor: 'var(--es-border)' }}>
                      <th className="p-2 sm:p-3 md:p-4 min-w-0">{game === 'val' ? t.agent : game === 'cs2' ? t.role : t.champion}</th>
                      <th className="p-2 sm:p-3 md:p-4 text-center whitespace-nowrap">{t.pickRate}</th>
                      <th className="p-2 sm:p-3 md:p-4 text-center whitespace-nowrap">{t.matches}</th>
                      {isFPS ? (
                        <>
                          <th className="p-2 sm:p-3 md:p-4 text-center whitespace-nowrap text-es-cyan">Rating</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">ACS</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">K:D</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">ADR</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">KAST</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">HS %</th>
                        </>
                      ) : (
                        <>
                          <th className="p-2 sm:p-3 md:p-4 text-center whitespace-nowrap text-es-cyan">Win %</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">KDA</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">CS/M</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">KP %</th>
                          <th className="hidden md:table-cell p-4 text-center whitespace-nowrap">DPM</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm font-semibold transition-colors" style={{ color: 'var(--es-text-1)' }}>
                    {stats.characters.map((c: any, i: number) => (
                      <tr key={i} className="border-b transition-colors hover:opacity-80" style={{ borderColor: 'var(--es-border)' }}>
                        <td className="p-2 sm:p-3 md:p-4 font-bold transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
                          <span className="truncate block">{c.name}</span>
                          {/* Mobil: ek istatistik özeti */}
                          <span className="md:hidden text-[9px] font-bold tabular-nums mt-0.5 block" style={{ color: 'var(--es-text-3)' }}>
                            {isFPS ? `${c.acs} ACS · ${c.kd} K:D` : `${c.kda} KDA · ${c.kp}`}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 md:p-4 text-center transition-colors tabular-nums" style={{ color: 'var(--es-text-3)' }}>{c.useRate}</td>
                        <td className="p-2 sm:p-3 md:p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.matches}</td>
                        {isFPS ? (
                          <>
                            <td className="p-2 sm:p-3 md:p-4 text-center font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.rating}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.acs}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.kd}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.adr}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{c.kast}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{c.hs}</td>
                          </>
                        ) : (
                          <>
                            <td className="p-2 sm:p-3 md:p-4 text-center font-black tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.winRate}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.kda}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-1)' }}>{c.csm}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{c.kp}</td>
                            <td className="hidden md:table-cell p-4 text-center tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{c.dpm}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:gap-4 min-w-0">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 border-b pb-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)', borderColor: 'var(--es-border)' }}>
                <History className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" style={{ color: gameColor }}/> {t.recentMatchesTitle}
              </h3>
              <div className="flex flex-col gap-2 min-w-0">
                {stats.recentMatches.map((m: any) => (
                  <div key={m.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-xl border hover:opacity-80 transition-colors group cursor-pointer shadow-sm min-w-0" style={{ background: 'var(--es-bg-2)', borderColor: 'var(--es-border)' }}>
                    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded shrink-0 flex items-center justify-center font-black text-xs sm:text-sm ${m.result === 'W' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>{m.result}</div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[11px] sm:text-xs font-bold truncate group-hover:text-es-cyan transition-colors" style={{ color: 'var(--es-text-1)' }}>{m.tournament}</span>
                        <span className="text-[9px] sm:text-[10px] font-semibold transition-colors truncate" style={{ color: 'var(--es-text-3)' }}>{translateApiText(m.stage)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 md:gap-6 pl-9 sm:pl-0 min-w-0 shrink-0">
                      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
                        <span className="text-[10px] sm:text-xs font-black transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }}>{t.vsStr}</span>
                        <span className="text-xs sm:text-sm font-bold truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{m.opponent}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black px-2 sm:px-3 py-0.5 sm:py-1 rounded border tabular-nums transition-colors shrink-0" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }}>{m.score}</span>
                      <span className="text-[9px] sm:text-[10px] font-bold shrink-0 transition-colors" style={{ color: 'var(--es-text-3)' }}>{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-6 min-w-0">
            
            <div className="p-4 sm:p-5 md:p-6 rounded-xl border shadow-lg relative overflow-hidden flex flex-col items-center text-center group cursor-default transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
              <div className="absolute inset-0 bg-es-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5 sm:mb-2 transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.estTotalWinnings}</span>
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-green-500 tracking-tighter tabular-nums">{stats.totalWinnings}</span>
            </div>

            <div className="rounded-xl border shadow-lg overflow-hidden flex flex-col transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
              <div className="p-3 sm:p-4 border-b transition-colors" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}><Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 shrink-0"/> <span className="truncate">{t.careerSuccess}</span></h3>
              </div>
              <div className="flex flex-col p-1.5 sm:p-2">
                {stats.career.map((c: any, i: number) => (
                  <div className="flex flex-col gap-1 p-2 sm:p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-w-0" key={i}>
                    <div className="flex items-start justify-between gap-2 sm:gap-4 min-w-0">
                      <span className="text-[11px] sm:text-xs font-bold leading-tight transition-colors min-w-0 flex-1 whitespace-normal" style={{ color: 'var(--es-text-1)' }}>{c.event}</span>
                      <span className="text-[9px] sm:text-[10px] font-black transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }}>{c.year}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5 sm:mt-1 gap-2 min-w-0">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded transition-colors shrink-0 ${c.placement.includes('1st') ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : ''}`} style={{ background: c.placement.includes('1st') ? '' : 'var(--es-surface)', borderColor: c.placement.includes('1st') ? '' : 'var(--es-border)', color: c.placement.includes('1st') ? '' : 'var(--es-text-3)' }}>
                        {c.placement}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-black text-green-500 shrink-0">{c.prize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border shadow-lg overflow-hidden flex flex-col transition-colors min-w-0" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
              <div className="p-3 sm:p-4 border-b transition-colors" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)' }}>
                <h3 className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}><History className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors shrink-0" style={{ color: 'var(--es-text-3)' }}/> <span className="truncate">{t.pastTeams}</span></h3>
              </div>
              <div className="flex flex-col p-1.5 sm:p-2">
                {stats.pastTeams.map((tObj: any, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-2 p-2 sm:p-3 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors group cursor-default min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-[7px] sm:text-[8px] font-black text-white border transition-colors shrink-0" style={{ background: 'var(--es-bg)', borderColor: 'var(--es-border)' }}>{tObj.name.slice(0,3).toUpperCase()}</div>
                      <span className="text-[11px] sm:text-xs font-bold group-hover:text-es-cyan transition-colors truncate min-w-0" style={{ color: 'var(--es-text-1)' }}>{tObj.name}</span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase transition-colors shrink-0 text-right whitespace-normal max-w-[45%]" style={{ color: 'var(--es-text-3)' }}>{t.leftTeam} {translateApiText(tObj.left)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}