"use client";

import { useState } from "react";
import { Search, Calendar, Filter, ChevronLeft, BarChart3, Info, Users, ListFilter, TrendingUp, Layers3 } from "lucide-react";
import { COMPLETED_MATCHES, GAMES } from "@/app/data/mockData";
import MatchScoreboard from "./MatchScoreboard"; // Veto ve Frag Tablosu
import MatchAnalytics from "./MatchAnalytics";   // Derin Grafikler (Full Stats)

const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

function TeamLogo({ name, color, size = 'sm' }: { name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' }) {
  const sizes = { xs: 'w-4 h-4 text-[7px]', sm: 'w-6 h-6 text-[9px]', md: 'w-10 h-10 text-xs', lg: 'w-16 h-16 text-base' };
  return (
    <div className={`${sizes[size]} rounded-lg flex items-center justify-center font-black text-white shrink-0`} style={{ background: color }}>
      {name.slice(0, 3).toUpperCase()}
    </div>
  );
}

const ENRICHED_MATCHES = COMPLETED_MATCHES.map((m, i) => ({
  ...m,
  dateGroup: i === 0 ? 'today' : i === 1 ? 'yesterday' : 'older',
  displayDate: i === 0 ? 'Bugün, 14:30' : i === 1 ? 'Dün, 19:00' : '15 Haz 2026, 21:00'
}));

export default function ResultsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('all');

  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'analysis'>('list');
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [standardTab, setStandardTab] = useState<'overview' | 'lineups' | 'stats'>('overview');

  const filteredMatches = ENRICHED_MATCHES.filter(match => {
    const matchesSearch = match.team1.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          match.team2.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          match.tournament.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === 'all' || match.game === selectedGame;
    const matchesDate = selectedDate === 'all' || match.dateGroup === selectedDate;
    return matchesSearch && matchesGame && matchesDate;
  });

  const gameColor = selectedMatch ? (GAME_COLORS[selectedMatch.game] || '#4D7CFE') : '#4D7CFE';

  // 🚀 3. SEVİYE: DERİN ANALİZ MODU (Full Stats - Sadece Grafikler)
  if (viewMode === 'analysis' && selectedMatch) {
    const isTier3Match = selectedMatch.team1.name === "Natus Vincere" || selectedMatch.team2.name === "Natus Vincere";
    const category = (selectedMatch.game === 'cs2' || selectedMatch.game === 'val') ? 'fps' : 'moba';

    return (
      <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in bg-es-bg">
        <div className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-es-bg-2 shrink-0">
          <button onClick={() => setViewMode('detail')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Maç Görünümüne Dön</span>
          </button>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-3"><TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="xs" /><span className="text-xs font-black text-white">{selectedMatch.team1.name}</span></div>
             <span className="px-3 py-1 bg-slate-800 rounded text-sm font-black text-white tabular-nums">{selectedMatch.team1.score} - {selectedMatch.team2.score}</span>
             <div className="flex items-center gap-3"><span className="text-xs font-black text-white">{selectedMatch.team2.name}</span><TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="xs" /></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           {/* BURADA SADECE GRAFİKLER ÇAĞRILIYOR */}
           <MatchAnalytics match={selectedMatch} category={category} gameColor={gameColor} hasDeepData={!isTier3Match} />
        </div>
      </div>
    );
  }

  // 🏠 2. SEVİYE: STANDART DETAY MODU
  if (viewMode === 'detail' && selectedMatch) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-es-bg">
        
        <div className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-es-bg-2 shrink-0">
          <button onClick={() => { setViewMode('list'); setSelectedMatch(null); }} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Arşive Dön</span>
          </button>
        </div>

        <div className="shrink-0 px-8 pt-8 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
          <div className="relative">
            <div className="flex items-center justify-between pb-8 max-w-5xl mx-auto">
              <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                <TeamLogo name={selectedMatch.team1.short} color={selectedMatch.team1.color} size="lg" />
                <div className="text-2xl font-black text-white tracking-tight">{selectedMatch.team1.name}</div>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-1" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">BİTTİ</span>
                </div>
                <div className="text-6xl font-black text-white tracking-tighter score-display tabular-nums leading-none mb-2">{selectedMatch.team1.score} <span className="text-slate-700 mx-2">:</span> {selectedMatch.team2.score}</div>
                
                {/* 🚀 FULL STATS BUTONU (Sadece Derin Grafiklere Gider) */}
                <button 
                  onClick={() => setViewMode('analysis')}
                  className="mt-4 px-6 py-2.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                  style={{ background: '#4D7CFE', color: 'white', boxShadow: `0 0 20px rgba(77, 124, 254, 0.4)` }}
                >
                  <BarChart3 className="w-4 h-4" />
                  Full Stats
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 w-48 shrink-0">
                <TeamLogo name={selectedMatch.team2.short} color={selectedMatch.team2.color} size="lg" />
                <div className="text-2xl font-black text-white tracking-tight">{selectedMatch.team2.name}</div>
              </div>
            </div>
            
            {/* Maç İçi Sekmeler */}
            <div className="flex items-center justify-center gap-8 border-t border-white/5 max-w-5xl mx-auto">
              {[ 
                { id: 'overview', label: 'Overview', icon: Info }, 
                { id: 'lineups', label: 'Lineups & Veto', icon: Layers3 }, // 🟢 İsmi Lineups & Veto yapıldı
                { id: 'stats', label: 'Statistics', icon: ListFilter } 
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setStandardTab(tab.id as any)}
                  className={`px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${standardTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}
                >
                  <tab.icon className="w-3.5 h-3.5" /> {tab.label}
                  {standardTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: gameColor }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sekme İçerikleri */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="max-w-5xl mx-auto">
             {standardTab === 'overview' && (
               <div className="grid grid-cols-2 gap-6 animate-fade-in">
                 <div className="rounded-xl p-6 shadow-lg" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                   <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><Info className="w-4 h-4" style={{ color: gameColor }}/> Maç Bilgileri</h4>
                   <div className="space-y-3">
                     <div className="flex justify-between"><span className="text-xs text-slate-400">Turnuva</span><span className="text-xs font-bold text-white">{selectedMatch.tournament}</span></div>
                     <div className="flex justify-between"><span className="text-xs text-slate-400">Aşama</span><span className="text-xs font-bold text-white">{selectedMatch.stage || "Açıklanmadı"}</span></div>
                     <div className="flex justify-between"><span className="text-xs text-slate-400">Tarih</span><span className="text-xs font-bold text-white">{selectedMatch.displayDate}</span></div>
                   </div>
                 </div>
                 <div className="rounded-xl p-6 shadow-lg flex flex-col justify-center" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                   <h4 className="text-xs font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: gameColor }}/> Takım Formu (Maç Öncesi)</h4>
                   <div className="space-y-4">
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
             )}
             
             {/* 🟢 YENİ: Veto ve Frag Tablosu Lineups Sekmesine Geldi */}
             {standardTab === 'lineups' && (
               <MatchScoreboard match={selectedMatch} gameColor={gameColor} />
             )}
             
             {standardTab === 'stats' && <div className="text-center py-20 text-slate-500 font-black uppercase tracking-widest animate-fade-in border border-dashed border-white/10 rounded-xl">Maç içi karşılaştırmalı istatistikler derleniyor...</div>}
           </div>
        </div>
      </div>
    );
  }

  // 📋 1. SEVİYE: LİSTE MODU EKRANI
  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in" style={{ background: 'var(--es-bg)' }}>
      {/* ... (ÜST BAR VE LİSTE AYNI KALIYOR) ... */}
      <div className="shrink-0 p-8 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">Maç Sonuçları Arşivi</h1>
              <p className="text-sm text-slate-400">Geçmiş tüm e-spor karşılaşmaları, detaylı istatistikler ve P&B analizleri.</p>
            </div>
            <div className="relative group w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Takım veya turnuva ara..." className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all bg-slate-900 border border-slate-700 text-white focus:border-es-cyan shadow-lg" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              <button onClick={() => setSelectedGame('all')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${selectedGame === 'all' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-white'}`}>Tümü</button>
              {GAMES.map(game => (
                <button key={game.id} onClick={() => setSelectedGame(game.id)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${selectedGame === game.id ? 'text-white shadow-lg' : 'text-slate-500 hover:text-white'}`} style={{ background: selectedGame === game.id ? `${GAME_COLORS[game.id]}30` : 'transparent' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: GAME_COLORS[game.id] }} />{game.short}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="flex flex-col gap-3 max-w-5xl mx-auto">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-20 text-slate-500">Sonuç Bulunamadı</div>
          ) : (
            filteredMatches.map(match => (
              <div key={match.id} onClick={() => { setSelectedMatch(match); setViewMode('detail'); setStandardTab('overview'); }} className="flex items-center justify-between p-4 rounded-xl shadow-lg transition-all hover:scale-[1.01] group border border-white/5 cursor-pointer hover:border-es-cyan/50" style={{ background: 'var(--es-card)', borderLeft: `4px solid ${GAME_COLORS[match.game]}` }}>
                <div className="flex flex-col gap-1.5 w-48 shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest">{match.displayDate}</div>
                  <div className="text-xs font-bold text-white truncate group-hover:text-es-cyan transition-colors">{match.tournament}</div>
                  <div className="flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded text-[9px] font-black" style={{ background: `${GAME_COLORS[match.game]}20`, color: GAME_COLORS[match.game] }}>{match.game.toUpperCase()}</span></div>
                </div>
                <div className="flex-1 flex items-center justify-center gap-8">
                  <div className="flex items-center gap-3 w-40 justify-end"><span className="text-sm font-black text-white">{match.team1.name}</span><div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-[10px]" style={{ background: match.team1.color }}>{match.team1.short}</div></div>
                  <div className="flex flex-col items-center gap-1 shrink-0"><div className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-3 shadow-inner"><span className="text-xl font-black tabular-nums text-white">{match.team1.score}</span><span className="text-slate-600 font-black">-</span><span className="text-xl font-black tabular-nums text-white">{match.team2.score}</span></div></div>
                  <div className="flex items-center gap-3 w-40 justify-start"><div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-[10px]" style={{ background: match.team2.color }}>{match.team2.short}</div><span className="text-sm font-black text-white">{match.team2.name}</span></div>
                </div>
                <div className="w-32 shrink-0 flex justify-end">
                  <div className="px-4 py-2.5 rounded-lg text-[10px] font-black flex items-center gap-2 uppercase tracking-widest transition-all bg-slate-800/50 text-slate-400 group-hover:text-es-cyan group-hover:bg-slate-800">Görüntüle</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}