"use client";

import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, Database, AlertCircle, Crosshair, TrendingUp, ShieldAlert } from 'lucide-react';

// 🟢 MOCK VERİLER (Sadece Tasarımı Görmek İçin)
const MOBA_GOLD_DATA = [
  { time: '0', diff: 0 }, { time: '5', diff: 500 }, { time: '10', diff: -200 }, 
  { time: '15', diff: 1500 }, { time: '20', diff: 3200 }, { time: '25', diff: 2800 }, 
  { time: '30', diff: 5400 }, { time: '34', diff: 6100 }
];

const FPS_WIN_PROB = [
  { round: 1, t1: 50, t2: 50 }, { round: 5, t1: 65, t2: 35 }, { round: 10, t1: 40, t2: 60 }, 
  { round: 15, t1: 80, t2: 20 }, { round: 20, t1: 95, t2: 5 }, { round: 22, t1: 100, t2: 0 }
];

const FPS_TIMELINE = ['W', 'L', 'W', 'W', 'C', 'L', 'L', 'W', 'W', 'W', 'C', 'W', 'W']; // C = Clutch

export default function MatchAnalytics({ match, category, gameColor, hasDeepData = true }: { match: any, category: 'fps' | 'moba', gameColor: string, hasDeepData?: boolean }) {
  
  // 🔴 TIER 2 / TIER 3 MAÇLAR İÇİN "VERİ YOK" ANİMASYONLU EKRANI
  if (!hasDeepData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-xl relative overflow-hidden" style={{ background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
        <div className="absolute inset-0 cyber-grid opacity-10" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="relative w-20 h-20 flex items-center justify-center mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow" style={{ borderColor: `${gameColor}50` }} />
            <div className="absolute inset-2 rounded-full border-2 border-dotted animate-reverse-spin" style={{ borderColor: `${gameColor}30` }} />
            <Database className="w-8 h-8 relative z-10" style={{ color: gameColor }} />
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"><AlertCircle className="w-3 h-3 text-white" /></div>
          </div>
          <h3 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Gelişmiş Telemetri Sağlanamıyor</h3>
          <p className="text-sm text-slate-400 max-w-md">
            Bu karşılaşma (Tier 2/3) için resmi sunuculardan derin istatistik ve koordinat verisi API tarafından anlık olarak aktarılmamaktadır. Sadece temel skor tablosu mevcuttur.
          </p>
        </div>
      </div>
    );
  }

  // 🟢 FPS GRAFİKLERİ (Kazanma Olasılığı ve Round Timeline)
  if (category === 'fps') {
    return (
      <div className="grid grid-cols-2 gap-6 animate-fade-in">
        
        {/* Kazanma Olasılığı (Area Chart) */}
        <div className="rounded-xl p-5 shadow-lg flex flex-col" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h4 className="text-xs font-bold text-white mb-6 flex items-center gap-2"><Activity className="w-4 h-4" style={{ color: gameColor }}/> Kazanma Olasılığı (Zamanla)</h4>
          <div className="flex-1 w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FPS_WIN_PROB} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorT1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={match.team1.color} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={match.team1.color} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorT2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={match.team2.color} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={match.team2.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="round" stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(val) => `R${val}`} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(val) => `${val}%`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="t1" name={match.team1.short} stroke={match.team1.color} strokeWidth={3} fillOpacity={1} fill="url(#colorT1)" />
                <Area type="monotone" dataKey="t2" name={match.team2.short} stroke={match.team2.color} strokeWidth={3} fillOpacity={1} fill="url(#colorT2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Round Zaman Çizelgesi (Timeline) */}
        <div className="rounded-xl p-5 shadow-lg flex flex-col" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h4 className="text-xs font-bold text-white mb-6 flex items-center gap-2"><Crosshair className="w-4 h-4" style={{ color: gameColor }}/> Round Zaman Çizelgesi</h4>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: match.team1.color }}/>{match.team1.name} (T)</span>
                <span>{match.team1.score} R</span>
              </div>
              <div className="flex gap-1">
                {FPS_TIMELINE.map((res, i) => (
                  <div key={i} className="h-8 flex-1 rounded flex items-center justify-center group relative cursor-pointer transition-transform hover:-translate-y-1" style={{ background: res === 'W' || res === 'C' ? match.team1.color : 'rgba(255,255,255,0.05)' }}>
                    {res === 'C' && <span className="text-[8px] font-black text-white">C</span>}
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50">
                      Round {i + 1} {res === 'C' ? '- CLUTCH' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: match.team2.color }}/>{match.team2.name} (CT)</span>
                <span>{match.team2.score} R</span>
              </div>
              <div className="flex gap-1">
                {FPS_TIMELINE.map((res, i) => (
                  <div key={i} className="h-8 flex-1 rounded flex items-center justify-center group relative cursor-pointer transition-transform hover:translate-y-1" style={{ background: res === 'L' ? match.team2.color : 'rgba(255,255,255,0.05)' }}>
                     {/* Tooltip */}
                     <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-white text-[10px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-50">
                      Round {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 flex gap-4 mt-4">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-700 rounded" /> Kayıp</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 text-white flex items-center justify-center font-black text-[7px]">C</div> Clutch</span>
            </div>

          </div>
        </div>

      </div>
    );
  }

  // 🟢 MOBA GRAFİKLERİ (Altın Farkı Line Chart)
  return (
    <div className="grid grid-cols-2 gap-6 animate-fade-in">
       <div className="col-span-2 rounded-xl p-5 shadow-lg flex flex-col" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          <h4 className="text-xs font-bold text-white mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400"/> Takımlar Arası Altın Farkı (Gold Difference)</h4>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOBA_GOLD_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(val) => `${val} dk`} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(val) => val > 0 ? `+${val/1000}k` : `${val/1000}k`} />
                <RechartsTooltip 
                  formatter={(value: any) => [`${value > 0 ? '+' : ''}${value} Gold`, 'Fark']}
                  labelFormatter={(label) => `Dakika: ${label}`}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                {/* Altın farkı pozitifse Takım 1'in rengi, negatifse Takım 2'nin rengi (Recharts'ta tek çizgi çizeriz, gradient verebiliriz ama basitlik için sarı) */}
                <Line type="monotone" dataKey="diff" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#1E293B', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}