"use client";

import { Coins, ShieldBan, CheckCircle2 } from "lucide-react";

const GAME_CATEGORIES: Record<string, 'fps' | 'moba'> = { lol: 'moba', val: 'fps', cs2: 'fps', dota2: 'moba' };

// 🟢 API SİMÜLASYONU (Veto ve Frag Verileri)
const DEFAULT_FPS_STATS = {
  veto: [ { team: "Team 1", action: "Banned", map: "Nuke" }, { team: "Team 2", action: "Banned", map: "Vertigo" }, { team: "Team 1", action: "Picked", map: "Mirage" }, { team: "Team 2", action: "Picked", map: "Inferno" }, { team: "Auto", action: "Left", map: "Ancient" } ],
  maps: { map1: { name: "Mirage", score: "13 - 9", team1Players: [ { name: "EntryKing", champ: "Jett / AK-47", kills: 24, deaths: 12, assists: 4, adr: 105, hs: 55, rating: 1.45 }, { name: "SupportGod", champ: "Omen / M4A4", kills: 16, deaths: 14, assists: 9, adr: 82, hs: 48, rating: 1.12 }, { name: "ClutchMst", champ: "Killjoy / AWP", kills: 14, deaths: 15, assists: 3, adr: 75, hs: 40, rating: 1.05 }, { name: "Flicker", champ: "Sova / AK-47", kills: 12, deaths: 16, assists: 7, adr: 70, hs: 60, rating: 0.95 }, { name: "Anchor", champ: "Cypher / AUG", kills: 9, deaths: 18, assists: 5, adr: 65, hs: 45, rating: 0.85 } ], team2Players: [ { name: "StarPlayer", champ: "Raze / AK-47", kills: 22, deaths: 16, assists: 5, adr: 95, hs: 50, rating: 1.25 }, { name: "IGL", champ: "Breach / M4A1", kills: 15, deaths: 15, assists: 11, adr: 78, hs: 42, rating: 1.08 }, { name: "Lurker", champ: "Viper / Galil", kills: 14, deaths: 14, assists: 6, adr: 74, hs: 52, rating: 1.02 }, { name: "Flex", champ: "Kayo / AWP", kills: 13, deaths: 15, assists: 4, adr: 69, hs: 38, rating: 0.92 }, { name: "Rookie", champ: "Skye / MAC-10", kills: 11, deaths: 15, assists: 8, adr: 66, hs: 47, rating: 0.88 } ] } }
};
const DEFAULT_MOBA_STATS = {
  veto: { team1Bans: ["Ashe", "Sejuani", "Maokai", "Rell", "Jax"], team1Picks: ["Aatrox", "Vi", "Azir", "Varus", "Nautilus"], team2Bans: ["Kalista", "Orianna", "Lucian", "Renekton", "Syndra"], team2Picks: ["Gragas", "Xin Zhao", "Tristana", "Xayah", "Rakan"] },
  maps: { game1: { name: "1. Oyun", score: "Kırmızı Taraf Kazandı (34:12)", team1Players: [ { name: "TopLaner", champ: "Aatrox", kills: 5, deaths: 2, assists: 6, cs: 280, nw: 14500, vision: 32 }, { name: "Jungler", champ: "Vi", kills: 3, deaths: 4, assists: 12, cs: 190, nw: 11200, vision: 65 }, { name: "MidLaner", champ: "Azir", kills: 8, deaths: 1, assists: 7, cs: 310, nw: 16100, vision: 38 }, { name: "ADC", champ: "Varus", kills: 6, deaths: 2, assists: 8, cs: 330, nw: 15800, vision: 25 }, { name: "Support", champ: "Nautilus", kills: 1, deaths: 5, assists: 18, cs: 45, nw: 7800, vision: 85 } ], team2Players: [ { name: "TopLaner", champ: "Gragas", kills: 2, deaths: 5, assists: 4, cs: 240, nw: 12500, vision: 29 }, { name: "Jungler", champ: "Xin Zhao", kills: 4, deaths: 6, assists: 6, cs: 175, nw: 10800, vision: 58 }, { name: "MidLaner", champ: "Tristana", kills: 5, deaths: 4, assists: 5, cs: 290, nw: 14200, vision: 34 }, { name: "ADC", champ: "Xayah", kills: 3, deaths: 3, assists: 4, cs: 300, nw: 13500, vision: 28 }, { name: "Support", champ: "Rakan", kills: 0, deaths: 5, assists: 11, cs: 35, nw: 7200, vision: 76 } ] } }
};

function ScoreTeamLogo({ name, color }: { name: string; color: string }) {
  return <div className="w-6 h-6 text-[9px] rounded-lg flex items-center justify-center font-black text-white shrink-0" style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function MatchScoreboard({ match, gameColor }: { match: any, gameColor: string }) {
  if (!match) return null;

  const category = GAME_CATEGORIES[match.game] || 'fps';
  const matchData = category === 'fps' ? DEFAULT_FPS_STATS : DEFAULT_MOBA_STATS;

  // 🔴 VETO AŞAMASI (FPS / MOBA AYRIMLI)
  const renderPickBan = () => {
    if (category === 'fps') {
      return (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-4 rounded-xl" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
          <div className="text-xs font-black text-white uppercase tracking-widest mr-4 flex items-center gap-2"><ShieldBan className="w-4 h-4 text-slate-400"/> Veto Aşaması</div>
          {(matchData.veto as any[]).map((v, i) => (
            <span key={i} className={`px-2.5 py-1 text-[10px] font-bold rounded flex items-center gap-1.5 ${v.action === 'Banned' ? 'text-red-400 bg-red-500/10 border border-red-500/20' : v.action === 'Picked' ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-slate-400 bg-slate-500/10 border border-slate-500/20'}`}>
               {v.action === 'Banned' ? <ShieldBan className="w-3 h-3"/> : v.action === 'Picked' ? <CheckCircle2 className="w-3 h-3"/> : null}
               {v.team === 'Team 1' ? match.team1.short : v.team === 'Team 2' ? match.team2.short : v.team} {v.action} {v.map}
            </span>
          ))}
        </div>
      );
    } else {
      const veto = matchData.veto as any;
      return (
        <div className="grid grid-cols-2 gap-6 mb-6 p-4 rounded-xl" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
           <div>
             <div className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2"><ScoreTeamLogo name={match.team1.short} color={match.team1.color}/> {match.team1.name} Seçimleri</div>
             <div className="flex gap-2 mb-2">{veto.team1Bans.map((ban: string, i: number) => <div key={`b1-${i}`} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold rounded">{ban}</div>)}</div>
             <div className="flex gap-2">{veto.team1Picks.map((pick: string, i: number) => <div key={`p1-${i}`} className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold rounded">{pick}</div>)}</div>
           </div>
           <div>
             <div className="text-[10px] font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2"><ScoreTeamLogo name={match.team2.short} color={match.team2.color}/> {match.team2.name} Seçimleri</div>
             <div className="flex gap-2 mb-2">{veto.team2Bans.map((ban: string, i: number) => <div key={`b2-${i}`} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 text-[9px] font-bold rounded">{ban}</div>)}</div>
             <div className="flex gap-2">{veto.team2Picks.map((pick: string, i: number) => <div key={`p2-${i}`} className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-bold rounded">{pick}</div>)}</div>
           </div>
        </div>
      );
    }
  };

  // 🔴 FRAG / OYUNCU TABLOSU
  const renderTable = (players: any[], color: string, teamName: string, teamShort: string) => {
    return (
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--es-border)', background: 'var(--es-card)' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--es-border)', background: `${color}15` }}>
          <ScoreTeamLogo name={teamShort} color={color} />
          <span className="text-xs font-black text-white uppercase tracking-wider">{teamName}</span>
        </div>
        <div className="grid grid-cols-12 gap-1 px-4 py-2 text-[10px] font-black tracking-wider uppercase bg-slate-900/50" style={{ borderBottom: '1px solid var(--es-border)' }}>
          <div className="col-span-3 text-slate-400">Oyuncu</div>
          <div className="col-span-2 text-slate-400">{category === 'fps' ? 'Ajan/Silah' : 'Şampiyon'}</div>
          <div className="col-span-2 text-center text-slate-400">K / D / A</div>
          {category === 'fps' ? ( <><div className="col-span-2 text-center text-slate-400">ADR</div><div className="col-span-1 text-center text-slate-400">HS%</div><div className="col-span-2 text-right text-slate-400">Rating</div></> ) : ( <><div className="col-span-2 text-right text-slate-400">CS / M</div><div className="col-span-2 text-right text-slate-400">Altın</div><div className="col-span-1 text-right text-slate-400">Görüş</div></> )}
        </div>
        <div className="p-1 space-y-0.5">
          {players.map((p: any, i: number) => {
            const kdDiff = p.kills - p.deaths;
            const kdColor = kdDiff > 0 ? 'text-green-400' : kdDiff < 0 ? 'text-red-400' : 'text-slate-400';
            return (
              <div key={i} className="grid grid-cols-12 gap-1 items-center px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                <div className="col-span-3 flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded flex items-center justify-center font-bold text-[9px] text-white shrink-0" style={{ background: `${color}40` }}>{p.name.slice(0, 2).toUpperCase()}</div>
                  <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                </div>
                <div className="col-span-2 text-[10px] text-slate-400 font-medium">{p.champ}</div>
                <div className="col-span-2 text-center text-[11px] font-mono tabular-nums text-white">{p.kills} <span className="text-slate-600">/</span> {p.deaths} <span className="text-slate-600">/</span> {p.assists} <span className={`ml-1.5 text-[9px] font-bold ${kdColor}`}>({kdDiff > 0 ? `+${kdDiff}` : kdDiff})</span></div>
                {category === 'fps' ? ( <><div className="col-span-2 text-center text-[11px] text-slate-300 tabular-nums">{p.adr}</div><div className="col-span-1 text-center text-[11px] text-slate-400 tabular-nums">{p.hs}%</div><div className="col-span-2 text-right text-xs font-black tabular-nums" style={{ color: p.rating >= 1.2 ? '#22C55E' : p.rating >= 1.0 ? 'white' : '#EF4444' }}>{p.rating.toFixed(2)}</div></> ) : ( <><div className="col-span-2 text-right text-[11px] text-slate-300 tabular-nums">{p.cs} <span className="text-[9px] text-slate-500">/ 9.5</span></div><div className="col-span-2 text-right text-[11px] font-bold text-orange-400 tabular-nums flex items-center gap-1.5 justify-end"><Coins className="w-3.5 h-3.5" /> {p.nw.toLocaleString('tr-TR')}</div><div className="col-span-1 text-right text-[11px] font-bold text-blue-400 tabular-nums">{p.vision}</div></> )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in space-y-6">
      {renderPickBan()}
      {Object.entries(matchData.maps).map(([key, mapData]: any) => (
        <div key={key} className="space-y-4 rounded-xl p-6 shadow-xl" style={{ border: '1px solid var(--es-border)', background: 'var(--es-bg-2)' }}>
          <div className="flex items-center justify-between border-b pb-4 border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-800 border-2" style={{ borderColor: `${gameColor}30` }}></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{category === 'fps' ? 'HARİTA' : 'OYUN'}</span>
                <div className="text-xl font-black text-white">{mapData.name}</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-white tracking-tighter score-display tabular-nums">{mapData.score}</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tamamlandı</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 pt-2">
             {renderTable(mapData.team1Players, match.team1.color, match.team1.name, match.team1.short)}
             {renderTable(mapData.team2Players, match.team2.color, match.team2.name, match.team2.short)}
          </div>
        </div>
      ))}
    </div>
  );
}