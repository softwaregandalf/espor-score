"use client";

import { Coins, ShieldBan, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { formatTranslation } from "@/i18n";

const GAME_CATEGORIES: Record<string, 'fps' | 'moba'> = { lol: 'moba', val: 'fps', cs2: 'fps', dota2: 'moba' };

const DEFAULT_FPS_STATS = {
  veto: [ { team: "Team 1", action: "Banned", map: "Nuke" }, { team: "Team 2", action: "Banned", map: "Vertigo" }, { team: "Team 1", action: "Picked", map: "Mirage" }, { team: "Team 2", action: "Picked", map: "Inferno" }, { team: "Auto", action: "Left", map: "Ancient" } ],
  maps: { map1: { name: "Mirage", score: "13 - 9", team1Players: [ { name: "EntryKing", champ: "Jett / AK-47", kills: 24, deaths: 12, assists: 4, adr: 105, hs: 55, rating: 1.45 }, { name: "SupportGod", champ: "Omen / M4A4", kills: 16, deaths: 14, assists: 9, adr: 82, hs: 48, rating: 1.12 }, { name: "ClutchMst", champ: "Killjoy / AWP", kills: 14, deaths: 15, assists: 3, adr: 75, hs: 40, rating: 1.05 }, { name: "Flicker", champ: "Sova / AK-47", kills: 12, deaths: 16, assists: 7, adr: 70, hs: 60, rating: 0.95 }, { name: "Anchor", champ: "Cypher / AUG", kills: 9, deaths: 18, assists: 5, adr: 65, hs: 45, rating: 0.85 } ], team2Players: [ { name: "StarPlayer", champ: "Raze / AK-47", kills: 22, deaths: 16, assists: 5, adr: 95, hs: 50, rating: 1.25 }, { name: "IGL", champ: "Breach / M4A1", kills: 15, deaths: 15, assists: 11, adr: 78, hs: 42, rating: 1.08 }, { name: "Lurker", champ: "Viper / Galil", kills: 14, deaths: 14, assists: 6, adr: 74, hs: 52, rating: 1.02 }, { name: "Flex", champ: "Kayo / AWP", kills: 13, deaths: 15, assists: 4, adr: 69, hs: 38, rating: 0.92 }, { name: "Rookie", champ: "Skye / MAC-10", kills: 11, deaths: 15, assists: 8, adr: 66, hs: 47, rating: 0.88 } ] } }
};
const DEFAULT_MOBA_STATS = {
  veto: { team1Bans: ["Ashe", "Sejuani", "Maokai", "Rell", "Jax"], team1Picks: ["Aatrox", "Vi", "Azir", "Varus", "Nautilus"], team2Bans: ["Kalista", "Orianna", "Lucian", "Renekton", "Syndra"], team2Picks: ["Gragas", "Xin Zhao", "Tristana", "Xayah", "Rakan"] },
  maps: { game1: { name: "1", score: "34 - 12", team1Players: [ { name: "TopLaner", champ: "Aatrox", kills: 5, deaths: 2, assists: 6, cs: 280, nw: 14500, vision: 32 }, { name: "Jungler", champ: "Vi", kills: 3, deaths: 4, assists: 12, cs: 190, nw: 11200, vision: 65 }, { name: "MidLaner", champ: "Azir", kills: 8, deaths: 1, assists: 7, cs: 310, nw: 16100, vision: 38 }, { name: "ADC", champ: "Varus", kills: 6, deaths: 2, assists: 8, cs: 330, nw: 15800, vision: 25 }, { name: "Support", champ: "Nautilus", kills: 1, deaths: 5, assists: 18, cs: 45, nw: 7800, vision: 85 } ], team2Players: [ { name: "TopLaner", champ: "Gragas", kills: 2, deaths: 5, assists: 4, cs: 240, nw: 12500, vision: 29 }, { name: "Jungler", champ: "Xin Zhao", kills: 4, deaths: 6, assists: 6, cs: 175, nw: 10800, vision: 58 }, { name: "MidLaner", champ: "Tristana", kills: 5, deaths: 4, assists: 5, cs: 290, nw: 14200, vision: 34 }, { name: "ADC", champ: "Xayah", kills: 3, deaths: 3, assists: 4, cs: 300, nw: 13500, vision: 28 }, { name: "Support", champ: "Rakan", kills: 0, deaths: 5, assists: 11, cs: 35, nw: 7200, vision: 76 } ] } }
};

function ScoreTeamLogo({ name, color }: { name: string; color: string }) {
  return <div className="w-5 h-5 md:w-6 md:h-6 text-[8px] md:text-[9px] rounded-lg flex items-center justify-center font-black text-white shrink-0" style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function MatchScoreboard({ match, gameColor }: { match: any, gameColor: string }) {
  const { t, language } = useLanguage();

  if (!match) return null;

  const category = GAME_CATEGORIES[match.game] || 'fps';
  const matchData = category === 'fps' ? DEFAULT_FPS_STATS : DEFAULT_MOBA_STATS;

  const getRoleHeader = () => {
    switch(match.game) {
      case 'val': return t.agent;
      case 'cs2': return t.role;
      case 'dota2': return t.hero;
      case 'lol': return t.champion;
      default: return t.champion;
    }
  };

  const renderPickBan = () => {
    if (category === 'fps') {
      return (
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-4 md:mb-6 p-3 md:p-4 rounded-xl min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
          <div className="text-[11px] md:text-xs font-black uppercase tracking-widest w-full md:w-auto md:mr-2 flex items-center gap-2 transition-colors shrink-0" style={{ color: 'var(--es-text-1)' }}>
            <ShieldBan className="w-3.5 md:w-4 h-3.5 md:h-4 shrink-0" style={{ color: 'var(--es-text-3)' }}/> {t.vetoStage}
          </div>
          {(matchData.veto as any[]).map((v, i) => {
            const actionText = v.action === 'Banned' ? t.banned : v.action === 'Picked' ? t.picked : t.left;
            const teamName = v.team === 'Team 1' ? match.team1.short : v.team === 'Team 2' ? match.team2.short : v.team;
            return (
              <span key={i} className={`px-2 md:px-2.5 py-0.5 md:py-1 text-[9px] md:text-[10px] font-bold rounded flex items-center gap-1 md:gap-1.5 shrink-0 ${v.action === 'Banned' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500 border border-red-200 dark:border-red-500/20' : v.action === 'Picked' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-500 border border-green-200 dark:border-green-500/20' : 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200 dark:border-slate-500/20'}`}>
                 {v.action === 'Banned' ? <ShieldBan className="w-3 h-3 shrink-0"/> : v.action === 'Picked' ? <CheckCircle2 className="w-3 h-3 shrink-0"/> : null}
                 <span className="whitespace-normal md:whitespace-nowrap">{formatTranslation(language === 'tr' ? t.vetoLogTr : t.vetoLogDefault, { team: teamName, map: v.map, action: actionText })}</span>
              </span>
            );
          })}
        </div>
      );
    } else {
      const veto = matchData.veto as any;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6 p-3 md:p-4 rounded-xl min-w-0" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
           <div className="min-w-0">
             <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
               <ScoreTeamLogo name={match.team1.short} color={match.team1.color}/>
               <span className="truncate min-w-0">{match.team1.name} {t.picks}</span>
             </div>
             <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">{veto.team1Bans.map((ban: string, i: number) => <div key={`b1-${i}`} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500 border border-red-200 dark:border-red-500/20 text-[9px] font-bold rounded shrink-0">{ban}</div>)}</div>
             <div className="flex flex-wrap gap-1.5 md:gap-2">{veto.team1Picks.map((pick: string, i: number) => <div key={`p1-${i}`} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20 text-[9px] font-bold rounded shrink-0">{pick}</div>)}</div>
           </div>
           <div className="min-w-0">
             <div className="text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2 transition-colors min-w-0" style={{ color: 'var(--es-text-1)' }}>
               <ScoreTeamLogo name={match.team2.short} color={match.team2.color}/>
               <span className="truncate min-w-0">{match.team2.name} {t.picks}</span>
             </div>
             <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">{veto.team2Bans.map((ban: string, i: number) => <div key={`b2-${i}`} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-500 border border-red-200 dark:border-red-500/20 text-[9px] font-bold rounded shrink-0">{ban}</div>)}</div>
             <div className="flex flex-wrap gap-1.5 md:gap-2">{veto.team2Picks.map((pick: string, i: number) => <div key={`p2-${i}`} className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-500 border border-blue-200 dark:border-blue-500/20 text-[9px] font-bold rounded shrink-0">{pick}</div>)}</div>
           </div>
        </div>
      );
    }
  };

  const renderTable = (players: any[], color: string, teamName: string, teamShort: string) => {
    return (
      <div className="rounded-xl overflow-hidden min-w-0" style={{ border: '1px solid var(--es-border)', background: 'var(--es-card)' }}>
        <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 min-w-0" style={{ borderBottom: '1px solid var(--es-border)', background: `${color}15` }}>
          <ScoreTeamLogo name={teamShort} color={color} />
          <span className="text-[11px] md:text-xs font-black uppercase tracking-wider truncate min-w-0 flex-1 transition-colors" style={{ color: 'var(--es-text-1)' }}>{teamName}</span>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[580px]">
            <div className="grid grid-cols-12 gap-1 px-3 md:px-4 py-2 text-[9px] md:text-[10px] font-black tracking-wider uppercase transition-colors" style={{ borderBottom: '1px solid var(--es-border)', background: 'var(--es-surface)' }}>
              <div className="col-span-3" style={{ color: 'var(--es-text-3)' }}>{t.player}</div>
              <div className="col-span-2" style={{ color: 'var(--es-text-3)' }}>{getRoleHeader()}</div>
              <div className="col-span-2 text-center" style={{ color: 'var(--es-text-3)' }}>K / D / A</div>
              {category === 'fps' ? (
                <>
                  <div className="col-span-2 text-center" style={{ color: 'var(--es-text-3)' }}>ADR</div>
                  <div className="col-span-1 text-center" style={{ color: 'var(--es-text-3)' }}>HS%</div>
                  <div className="col-span-2 text-right" style={{ color: 'var(--es-text-3)' }}>Rating</div>
                </>
              ) : (
                <>
                  <div className="col-span-2 text-right" style={{ color: 'var(--es-text-3)' }}>CS / M</div>
                  <div className="col-span-2 text-right" style={{ color: 'var(--es-text-3)' }}>{t.gold}</div>
                  <div className="col-span-1 text-right" style={{ color: 'var(--es-text-3)' }}>{t.vision}</div>
                </>
              )}
            </div>
            <div className="p-1 space-y-0.5">
              {players.map((p: any, i: number) => {
                const kdDiff = p.kills - p.deaths;
                const kdColor = kdDiff > 0 ? 'text-green-600 dark:text-green-500' : kdDiff < 0 ? 'text-red-600 dark:text-red-500' : 'text-slate-500';
                return (
                  <div key={i} className="grid grid-cols-12 gap-1 items-center px-2 md:px-3 py-1.5 md:py-2 rounded-lg hover:opacity-80 transition-opacity cursor-default">
                    <div className="col-span-3 flex items-center gap-1.5 md:gap-2.5 min-w-0">
                      <div className="w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] text-white shrink-0" style={{ background: `${color}40` }}>{p.name.slice(0, 2).toUpperCase()}</div>
                      <span className="text-[11px] md:text-xs font-semibold truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-1)' }}>{p.name}</span>
                    </div>
                    <div className="col-span-2 text-[10px] font-medium truncate min-w-0 transition-colors" style={{ color: 'var(--es-text-3)' }}>{p.champ}</div>
                    <div className="col-span-2 text-center text-[10px] md:text-[11px] font-mono tabular-nums transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-1)' }}>
                      {p.kills} <span style={{ color: 'var(--es-text-3)' }}>/</span> {p.deaths} <span style={{ color: 'var(--es-text-3)' }}>/</span> {p.assists} <span className={`ml-1 text-[8px] md:text-[9px] font-bold ${kdColor}`}>({kdDiff > 0 ? `+${kdDiff}` : kdDiff})</span>
                    </div>
                    {category === 'fps' ? (
                      <>
                        <div className="col-span-2 text-center text-[10px] md:text-[11px] tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{p.adr}</div>
                        <div className="col-span-1 text-center text-[10px] md:text-[11px] tabular-nums transition-colors" style={{ color: 'var(--es-text-3)' }}>{p.hs}%</div>
                        <div className="col-span-2 text-right text-[11px] md:text-xs font-black tabular-nums transition-colors" style={{ color: p.rating >= 1.2 ? '#22C55E' : p.rating >= 1.0 ? 'var(--es-text-1)' : '#EF4444' }}>{p.rating.toFixed(2)}</div>
                      </>
                    ) : (
                      <>
                        <div className="col-span-2 text-right text-[10px] md:text-[11px] tabular-nums transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-3)' }}>{p.cs} <span className="text-[9px] opacity-70" style={{ color: 'var(--es-text-3)' }}>/ 9.5</span></div>
                        <div className="col-span-2 text-right text-[10px] md:text-[11px] font-bold tabular-nums flex items-center gap-1 md:gap-1.5 justify-end whitespace-nowrap" style={{ color: '#F59E0B' }}>
                          <Coins className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" /> {p.nw.toLocaleString('tr-TR')}
                        </div>
                        <div className="col-span-1 text-right text-[10px] md:text-[11px] font-bold tabular-nums" style={{ color: '#4D7CFE' }}>{p.vision}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6 overflow-x-hidden min-w-0">
      {renderPickBan()}
      {Object.entries(matchData.maps).map(([key, mapData]: any) => (
        <div key={key} className="space-y-3 md:space-y-4 rounded-xl p-3 md:p-6 shadow-xl transition-colors min-w-0" style={{ border: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
          <div className="flex items-center justify-between gap-3 border-b pb-3 md:pb-4 transition-colors min-w-0" style={{ borderColor: 'var(--es-border)' }}>
            <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 transition-colors shrink-0" style={{ background: 'var(--es-surface)', borderColor: `${gameColor}30` }}></div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>{category === 'fps' ? t.map : t.gameStr}</span>
                <div className="text-base md:text-xl font-black truncate transition-colors" style={{ color: 'var(--es-text-1)' }}>{category === 'fps' ? mapData.name : `${mapData.name}. ${t.gameStr}`}</div>
              </div>
            </div>
            <div className="text-center shrink-0">
              <div className="text-xl md:text-3xl font-black tracking-tighter score-display tabular-nums transition-colors whitespace-nowrap" style={{ color: 'var(--es-text-1)' }}>{mapData.score}</div>
              <span className="text-[10px] font-bold uppercase transition-colors" style={{ color: 'var(--es-text-3)' }}>{t.completed}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:gap-6 pt-1 md:pt-2">
             {renderTable(mapData.team1Players, match.team1.color, match.team1.name, match.team1.short)}
             {renderTable(mapData.team2Players, match.team2.color, match.team2.name, match.team2.short)}
          </div>
        </div>
      ))}
    </div>
  );
}
