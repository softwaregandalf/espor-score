"use client";

import { useState } from "react";
import { ChevronLeft, Crosshair, Target, History, Globe, TrendingUp, Trophy, Calendar, Sword } from "lucide-react";

// --- 🟢 API SİMÜLASYONU: Seçilen oyuncunun detaylı profilini getirir ---
const generatePlayerStats = (player: any, category: 'fps' | 'moba') => {
  const isFPS = category === 'fps';
  
  return {
    ...player,
    teamName: 'Team Vitality', // Gerçekte API'den gelecek
    joinedDate: 'Eylül 2023',
    totalWinnings: '$277,392',
    socials: { twitter: '@' + player.nickname.toLowerCase() },
    // FPS ve MOBA için farklılaşan Ajan/Şampiyon istatistikleri
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
      { id: 1, tournament: 'VCT Masters 2026', stage: 'Playoffs - UBF', opponent: 'Paper Rex', result: 'L', score: '1:2', date: '2026/06/19' },
      { id: 2, tournament: 'VCT Masters 2026', stage: 'Playoffs - UBSF', opponent: 'Sentinels', result: 'W', score: '2:1', date: '2026/06/15' },
      { id: 3, tournament: 'VCT EMEA Stage 2', stage: 'Grand Finals', opponent: 'FNATIC', result: 'W', score: '3:1', date: '2026/05/10' },
    ],
    career: [
      { year: '2026', event: 'VCT Masters Shanghai', placement: '1st', prize: '$100,000' },
      { year: '2025', event: 'Valorant Champions', placement: '3rd-4th', prize: '$25,000' },
      { year: '2024', event: 'EMEA Kickoff', placement: '1st', prize: '$15,000' },
    ],
    pastTeams: [
      { name: 'Acend', left: 'Ağustos 2023' },
      { name: 'G2 Esports', left: 'Ocak 2022' },
    ]
  };
};

export default function PlayerDetail({ player, gameColor, category, onBack }: { player: any, gameColor: string, category: 'fps'|'moba', onBack: () => void }) {
  const [timeFilter, setTimeFilter] = useState<'30d' | '60d' | '90d' | 'all'>('all');
  const stats = generatePlayerStats(player, category);
  const isFPS = category === 'fps';

  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-fade-in bg-es-bg relative z-20">
      
      {/* 🌟 KAHRAMAN ALANI (Üst Profil) */}
      <div className="shrink-0 px-8 py-6 border-b border-white/5 bg-slate-900/50 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: gameColor, transform: 'translate(30%, -50%)' }} />
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-6">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group w-fit">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-es-blue group-hover:text-white transition-all"><ChevronLeft className="w-4 h-4" /></div>
            <span className="text-xs font-black uppercase tracking-widest">Takıma Dön</span>
          </button>

          <div className="flex items-end justify-between">
            <div className="flex items-center gap-6">
              {/* Oyuncu Fotoğrafı / Placeholder */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden relative">
                 <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                 <span className="text-4xl font-black text-slate-600">{stats.nickname.slice(0,1)}</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{stats.nationality}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-800 border border-white/5">{stats.role}</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">{stats.nickname} <span className="text-xl text-slate-500 font-bold tracking-normal ml-2">{stats.realName}</span></h1>
                <a href="#" className="text-xs font-bold text-es-cyan hover:underline mt-1">{stats.socials.twitter}</a>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 bg-slate-900/80 p-4 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-[10px] font-black text-white">{stats.teamName.slice(0,3).toUpperCase()}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white">{stats.teamName}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Katılım: {stats.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 İÇERİK ALANI (2 Sütunlu VLR.gg Düzeni) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* SOL SÜTUN (Karakterler ve Son Maçlar - Geniş Alan) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* KARAKTER/AJAN İSTATİSTİKLERİ */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <Sword className="w-4 h-4" style={{ color: gameColor }}/> 
                  {isFPS ? 'En Çok Oynanan Ajanlar' : 'En Çok Oynanan Şampiyonlar'}
                </h3>
                <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-1 border border-white/5">
                  {['30d', '60d', '90d', 'all'].map(t => (
                    <button key={t} onClick={() => setTimeFilter(t as any)} className={`px-3 py-1 text-[10px] font-black uppercase rounded transition-colors ${timeFilter === t ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-es-bg-2 rounded-xl border border-white/5 overflow-x-auto custom-scrollbar shadow-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/5">
                      <th className="p-4 whitespace-nowrap">{isFPS ? 'Ajan' : 'Şampiyon'}</th>
                      <th className="p-4 text-center whitespace-nowrap">Seçim %</th>
                      <th className="p-4 text-center whitespace-nowrap">Maç</th>
                      {isFPS ? (
                        <>
                          <th className="p-4 text-center whitespace-nowrap text-es-cyan">Rating</th>
                          <th className="p-4 text-center whitespace-nowrap">ACS</th>
                          <th className="p-4 text-center whitespace-nowrap">K:D</th>
                          <th className="p-4 text-center whitespace-nowrap">ADR</th>
                          <th className="p-4 text-center whitespace-nowrap">KAST</th>
                          <th className="p-4 text-center whitespace-nowrap">HS %</th>
                        </>
                      ) : (
                        <>
                          <th className="p-4 text-center whitespace-nowrap text-es-cyan">Win %</th>
                          <th className="p-4 text-center whitespace-nowrap">KDA</th>
                          <th className="p-4 text-center whitespace-nowrap">CS/M</th>
                          <th className="p-4 text-center whitespace-nowrap">KP %</th>
                          <th className="p-4 text-center whitespace-nowrap">DPM</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-slate-300">
                    {stats.characters.map((c: any, i: number) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-bold">{c.name}</td>
                        <td className="p-4 text-center text-slate-400">{c.useRate}</td>
                        <td className="p-4 text-center tabular-nums">{c.matches}</td>
                        {isFPS ? (
                          <>
                            <td className="p-4 text-center text-white font-black tabular-nums">{c.rating}</td>
                            <td className="p-4 text-center tabular-nums">{c.acs}</td>
                            <td className="p-4 text-center tabular-nums">{c.kd}</td>
                            <td className="p-4 text-center tabular-nums">{c.adr}</td>
                            <td className="p-4 text-center tabular-nums text-slate-400">{c.kast}</td>
                            <td className="p-4 text-center tabular-nums text-slate-400">{c.hs}</td>
                          </>
                        ) : (
                          <>
                            <td className="p-4 text-center text-white font-black tabular-nums">{c.winRate}</td>
                            <td className="p-4 text-center tabular-nums">{c.kda}</td>
                            <td className="p-4 text-center tabular-nums">{c.csm}</td>
                            <td className="p-4 text-center tabular-nums text-slate-400">{c.kp}</td>
                            <td className="p-4 text-center tabular-nums text-slate-400">{c.dpm}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SON MAÇLAR */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-2">
                <History className="w-4 h-4" style={{ color: gameColor }}/> Oyuncunun Son Maçları
              </h3>
              <div className="flex flex-col gap-2">
                {stats.recentMatches.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between p-3.5 rounded-xl bg-es-bg-2 border border-white/5 hover:border-es-cyan/30 transition-colors group cursor-pointer shadow-sm">
                    <div className="flex items-center gap-4 w-1/2">
                      <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-black text-sm ${m.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{m.result}</div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white truncate group-hover:text-es-cyan transition-colors">{m.tournament}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{m.stage}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-400">vs</span>
                        <span className="text-sm font-bold text-white w-24 text-right truncate">{m.opponent}</span>
                      </div>
                      <span className="text-sm font-black text-white bg-slate-900 px-3 py-1 rounded border border-white/5 tabular-nums">{m.score}</span>
                      <span className="text-[10px] font-bold text-slate-500 w-20 text-right">{m.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SAĞ SÜTUN (Kariyer, Ödüller, Geçmiş Takımlar - Dar Alan) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            
            {/* TOPLAM KAZANÇ */}
            <div className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden flex flex-col items-center text-center group cursor-default">
              <div className="absolute inset-0 bg-es-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tahmini Toplam Kazanç</span>
              <span className="text-4xl font-black text-green-400 tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">{stats.totalWinnings}</span>
            </div>

            {/* KARİYER BAŞARILARI (Event Placements) */}
            <div className="bg-es-bg-2 rounded-xl border border-white/5 shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 bg-slate-900/50">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><Trophy className="w-3.5 h-3.5 text-yellow-500"/> Kariyer Başarıları</h3>
              </div>
              <div className="flex flex-col p-2">
                {stats.career.map((c: any, i: number) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-xs font-bold text-white leading-tight">{c.event}</span>
                      <span className="text-[10px] font-black text-slate-500">{c.year}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${c.placement.includes('1st') ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                        {c.placement}
                      </span>
                      <span className="text-[10px] font-black text-green-400">{c.prize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* GEÇMİŞ TAKIMLAR */}
            <div className="bg-es-bg-2 rounded-xl border border-white/5 shadow-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/5 bg-slate-900/50">
                <h3 className="text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-2"><History className="w-3.5 h-3.5 text-slate-400"/> Geçmiş Takımlar</h3>
              </div>
              <div className="flex flex-col p-2">
                {stats.pastTeams.map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[8px] font-black text-white border border-slate-700">{t.name.slice(0,3).toUpperCase()}</div>
                      <span className="text-xs font-bold text-white group-hover:text-es-cyan transition-colors">{t.name}</span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Ayrıldı: {t.left}</span>
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