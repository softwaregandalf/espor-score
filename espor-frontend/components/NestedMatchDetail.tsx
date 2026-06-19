"use client";

import { useState } from "react";
import { ChevronLeft, Info, Layers3, ListFilter, BarChart3, TrendingUp } from "lucide-react";
import MatchScoreboard from "./MatchScoreboard"; 
import MatchAnalytics from "./MatchAnalytics";   

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0`} style={{ background: color }}>{name.slice(0, 3).toUpperCase()}</div>;
}

export default function NestedMatchDetail({ match, gameColor, category, onBack }: { match: any, gameColor: string, category: 'fps'|'moba', onBack: () => void }) {
  const [viewMode, setViewMode] = useState<'detail' | 'analysis'>('detail');
  const [standardTab, setStandardTab] = useState<'overview' | 'lineups' | 'stats'>('overview');

  // 🚀 Derin Analiz Modu (Full Stats tıklandığında)
  if (viewMode === 'analysis') {
    return (
      <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in bg-es-bg">
        <div className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-es-bg-2 shrink-0">
          <button onClick={() => setViewMode('detail')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Maç Görünümüne Dön</span>
          </button>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3"><TeamLogo name={match.team1.short} color={match.team1.color} size="xs" /><span className="text-xs font-black text-white">{match.team1.name}</span></div>
             <span className="px-3 py-1 bg-slate-800 rounded text-sm font-black text-white tabular-nums">{match.team1.score} - {match.team2.score}</span>
             <div className="flex items-center gap-3"><span className="text-xs font-black text-white">{match.team2.name}</span><TeamLogo name={match.team2.short} color={match.team2.color} size="xs" /></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <MatchAnalytics match={match} category={category} gameColor={gameColor} hasDeepData={true} />
        </div>
      </div>
    );
  }

  // 🏠 Standart Maç Görünümü (Şemadan tıklandığında açılan)
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-es-bg">
      <div className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-es-bg-2 shrink-0">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
          <span className="text-xs font-black uppercase tracking-widest">Şemaya (Bracket) Dön</span>
        </button>
      </div>

      <div className="shrink-0 px-8 pt-8 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
        <div className="relative">
          <div className="flex items-center justify-between pb-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center gap-4 w-48 shrink-0">
              <TeamLogo name={match.team1.short} color={match.team1.color} size="lg" />
              <div className="text-2xl font-black text-white tracking-tight">{match.team1.name}</div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-1" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">{match.status === 'completed' ? 'BİTTİ' : 'YAKLAŞAN'}</span>
              </div>
              <div className="text-6xl font-black text-white tracking-tighter score-display tabular-nums leading-none mb-2">{match.team1.score} <span className="text-slate-700 mx-2">:</span> {match.team2.score}</div>
              
              <button onClick={() => setViewMode('analysis')} className="mt-4 px-6 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl" style={{ background: '#4D7CFE', color: 'white', boxShadow: `0 0 20px rgba(77, 124, 254, 0.4)` }}>
                <BarChart3 className="w-4 h-4" /> Full Stats
              </button>
            </div>

            <div className="flex flex-col items-center gap-4 w-48 shrink-0">
              <TeamLogo name={match.team2.short} color={match.team2.color} size="lg" />
              <div className="text-2xl font-black text-white tracking-tight">{match.team2.name}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 border-t border-white/5 max-w-5xl mx-auto">
            {[ { id: 'overview', label: 'Overview', icon: Info }, { id: 'lineups', label: 'Lineups & Veto', icon: Layers3 }, { id: 'stats', label: 'Statistics', icon: ListFilter } ].map(tab => (
              <button key={tab.id} onClick={() => setStandardTab(tab.id as any)} className={`px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${standardTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                {standardTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: gameColor }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-5xl mx-auto">
           {standardTab === 'overview' && (
             <div className="grid grid-cols-2 gap-6 animate-fade-in">
               <div className="rounded-xl p-6 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                 <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Info className="w-4 h-4" style={{ color: gameColor }}/> Maç Bilgileri</h4>
                 <div className="space-y-3">
                   <div className="flex justify-between"><span className="text-xs text-slate-400">Turnuva</span><span className="text-xs font-bold text-white">{match.tournament}</span></div>
                   <div className="flex justify-between"><span className="text-xs text-slate-400">Aşama</span><span className="text-xs font-bold text-white">{match.stage}</span></div>
                 </div>
               </div>
               <div className="rounded-xl p-6 shadow-lg flex flex-col justify-center" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                 <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: gameColor }}/> Takım Formu</h4>
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-2 rounded-lg bg-es-surface border border-white/5"><div className="flex items-center gap-2"><TeamLogo name={match.team1.short} color={match.team1.color} size="xs" /><span className="text-xs font-bold text-white">{match.team1.name}</span></div><div className="flex gap-1.5">{['W','W','W','L','W'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{r}</div>)}</div></div>
                   <div className="flex items-center justify-between p-2 rounded-lg bg-es-surface border border-white/5"><div className="flex items-center gap-2"><TeamLogo name={match.team2.short} color={match.team2.color} size="xs" /><span className="text-xs font-bold text-white">{match.team2.name}</span></div><div className="flex gap-1.5">{['W','L','W','L','L'].map((r,i)=><div key={i} className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black ${r==='W'?'bg-green-500/20 text-green-400 border border-green-500/30':'bg-red-500/20 text-red-400 border border-red-500/30'}`}>{r}</div>)}</div></div>
                 </div>
               </div>
             </div>
           )}
           {standardTab === 'lineups' && <MatchScoreboard match={match} gameColor={gameColor} />}
           {standardTab === 'stats' && <div className="text-center py-20 text-slate-500 font-black uppercase tracking-widest animate-fade-in border border-dashed border-white/10 rounded-xl">Temel maç istatistikleri derleniyor...</div>}
         </div>
      </div>
    </div>
  );
}