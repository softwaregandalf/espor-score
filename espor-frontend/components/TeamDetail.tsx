"use client";

import { useState } from "react";
import { ChevronLeft, Trophy, Users, Crosshair, Target, History, Globe, TrendingUp, Shield } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import PlayerDetail from "./PlayerDetail"; // 🚀 YENİ OYUNCU DETAY MODÜLÜMÜZ

const generateTeamDetails = (team: any) => ({
  ...team,
  established: '2013',
  totalEarnings: '$4,250,000',
  winRate: 68,
  roster: [
    { id: 1, nickname: 'Alpha', realName: 'John Doe', role: 'IGL (Kaptan)', nationality: '🇪🇺', rating: 1.12, headshot: '45%' },
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
  const [activeTab, setActiveTab] = useState<'roster' | 'stats' | 'matches'>('roster');
  
  // 🚀 İÇ İÇE OYUNCU DETAYI YÖNETİMİ
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  
  const teamDetails = generateTeamDetails(team);

  // EĞER OYUNCU SEÇİLMİŞSE, OYUNCU PROFİLİNİ GÖSTER
  if (selectedPlayer) {
    const category = (team.game === 'cs2' || team.game === 'val') ? 'fps' : 'moba';
    return <PlayerDetail player={selectedPlayer} gameColor={gameColor} category={category} onBack={() => setSelectedPlayer(null)} />;
  }

  // STANDART TAKIM PROFİLİ GÖRÜNÜMÜ
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-es-bg relative">
      <div className="shrink-0 px-8 pt-8 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-1000" style={{ background: teamDetails.color, transform: 'translate(20%, -40%)' }} />
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group mb-6 w-fit">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Sıralamalara Dön</span>
          </button>

          <div className="flex items-center justify-between pb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center font-black text-white text-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10" style={{ background: teamDetails.color }}>
                {teamDetails.short}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-sm" style={{ background: gameColor }}>{teamDetails.game}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-900/50 px-2 py-0.5 rounded border border-white/5"><Globe className="w-3 h-3" /> {teamDetails.region.toUpperCase()}</span>
                </div>
                <h1 className="text-5xl font-black text-white tracking-tight">{teamDetails.name}</h1>
                <span className="text-sm font-bold text-slate-400">{teamDetails.country} • Kurulum: {teamDetails.established}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur px-6 py-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Global Sıra</span>
                <span className="text-3xl font-black" style={{ color: teamDetails.rank <= 3 ? '#FBBF24' : 'white' }}>#{teamDetails.rank}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur px-6 py-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Puan</span>
                <span className="text-3xl font-black text-white tabular-nums">{teamDetails.points}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 border-t border-white/5">
            {[ { id: 'roster', label: 'Aktif Kadro', icon: Users }, { id: 'stats', label: 'İstatistikler', icon: Target }, { id: 'matches', label: 'Son Maçlar', icon: History } ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`py-4 text-[11px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
                <tab.icon className="w-4 h-4" /> {tab.label}
                {activeTab === tab.id && <div className="absolute left-0 bottom-0 w-full h-0.5 rounded-t" style={{ background: teamDetails.color }} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto">
          
          {activeTab === 'roster' && (
            <div className="animate-fade-in flex flex-col gap-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 mb-2"><Shield className="w-4 h-4" style={{ color: teamDetails.color }}/> Ana Kadro (Starting Lineup)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamDetails.roster.map((player: any) => (
                  // 🔥 TIKLANINCA OYUNCU DETAYINI AÇACAK OLAN ONCLICK EVENTİ BURAYA EKLENDİ
                  <div key={player.id} onClick={() => setSelectedPlayer(player)} className="rounded-xl overflow-hidden shadow-lg border border-white/5 bg-es-bg-2 relative group hover:border-es-cyan/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)] transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -z-10 group-hover:bg-white/10 transition-colors" />
                    <div className="p-5 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-white group-hover:text-es-cyan transition-colors">{player.nickname}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{player.realName}</span>
                        </div>
                        <span className="text-2xl">{player.nationality}</span>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-slate-900 text-slate-300">{player.role}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-end"><span className="text-xs font-black text-white">{player.rating.toFixed(2)}</span><span className="text-[8px] font-bold text-slate-500 uppercase">Rating</span></div>
                          <div className="flex flex-col items-end"><span className="text-xs font-black text-white">{player.headshot}</span><span className="text-[8px] font-bold text-slate-500 uppercase">HS%</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="animate-fade-in grid grid-cols-2 gap-6">
              <div className="rounded-xl p-6 shadow-lg bg-es-bg-2 border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at center, ${teamDetails.color} 0%, transparent 70%)` }} />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 w-full text-center relative z-10">Tüm Zamanlar Kazanma Oranı</h3>
                <div className="relative w-40 h-40 flex items-center justify-center z-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                    <circle cx="80" cy="80" r="70" stroke={teamDetails.color} strokeWidth="12" fill="none" strokeDasharray="440" strokeDashoffset={440 - (440 * teamDetails.winRate) / 100} className="transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-white tabular-nums">%{teamDetails.winRate}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Kazanma Oranı</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-6 shadow-lg bg-es-bg-2 border border-white/5">
                 <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-3"><Crosshair className="w-4 h-4" style={{ color: teamDetails.color }}/> En Güçlü Haritalar</h3>
                 <div className="w-full h-48 relative">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie data={teamDetails.mapStats} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                         {teamDetails.mapStats.map((entry: any, index: number) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
                       </Pie>
                       <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ color: 'white', fontWeight: 'bold' }} formatter={(val: any) => [`%${val}`, 'Kazanma Oranı']} />
                     </PieChart>
                   </ResponsiveContainer>
                 </div>
                 <div className="flex flex-wrap justify-center gap-4 mt-2">
                   {teamDetails.mapStats.map((entry: any, index: number) => (
                     <div key={index} className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} /><span className="text-[10px] font-bold text-slate-300 uppercase">{entry.name}</span></div>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'matches' && (
            <div className="animate-fade-in flex flex-col gap-3">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" style={{ color: teamDetails.color }}/> Son Karşılaşmalar</h3>
               {teamDetails.recentMatches.map((match: any) => (
                 <div key={match.id} className="flex items-center justify-between p-4 rounded-xl bg-es-bg-2 border border-white/5 hover:bg-white/5 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-white text-lg shadow-inner ${match.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {match.result}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{match.tournament}</span>
                        <span className="text-lg font-black text-white">vs {match.opponent}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-sm font-bold text-slate-500 mb-1">Skor</span>
                       <span className="text-xl font-black text-white tabular-nums bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">{match.score}</span>
                    </div>
                 </div>
               ))}
               <button className="mt-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-colors">
                  Tüm Maç Geçmişini Gör
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}