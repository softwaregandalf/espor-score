"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, DollarSign, Trophy, Users, Shield, ArrowRight, PlayCircle } from "lucide-react";
import TournamentDetail from "./TournamentDetail"; // 🚀 YENİ DETAY BİLEŞENİ

// --- 🟢 API SİMÜLASYONU ---
const MOCK_TOURNAMENTS = [
  { id: 't1', name: 'VCT 2026: Masters Shanghai', game: 'val', tier: 'S-Tier', location: 'Shanghai, China', prizePool: '$1,000,000', startDate: '23 Mayıs', endDate: '9 Haz 2026', status: 'live', teamsCount: 12 },
  { id: 't2', name: 'LCK Summer 2026', game: 'lol', tier: 'A-Tier', location: 'Seoul, South Korea', prizePool: '$300,000', startDate: '12 Haz', endDate: '8 Eyl 2026', status: 'live', teamsCount: 10 },
  { id: 't3', name: 'IEM Dallas 2026', game: 'cs2', tier: 'S-Tier', location: 'Dallas, USA', prizePool: '$250,000', startDate: '27 Mayıs', endDate: '2 Haz 2026', status: 'completed', teamsCount: 16, 
    results: { winner: { name: 'NRG', short: 'NRG', color: '#FF4655', prize: '$100,000' }, runnerUp: { name: 'Cloud9', short: 'C9', color: '#00D4FF', prize: '$42,000' } } 
  },
  { id: 't4', name: 'LEC Spring 2026', game: 'lol', tier: 'A-Tier', location: 'Berlin, Germany', prizePool: '€80,000', startDate: '9 Mar', endDate: '14 Nis 2026', status: 'completed', teamsCount: 10, 
    results: { winner: { name: 'G2 Esports', short: 'G2', color: '#1E293B', prize: '€40,000' }, runnerUp: { name: 'Fnatic', short: 'FNC', color: '#F97316', prize: '€20,000' } } 
  },
  { id: 't5', name: 'The International 2026', game: 'dota2', tier: 'S-Tier', location: 'Seattle, USA', prizePool: 'TBD (Kitle Fonlaması)', startDate: '15 Eki', endDate: '29 Eki 2026', status: 'upcoming', teamsCount: 20 },
  { id: 't6', name: 'VALORANT Champions 2026', game: 'val', tier: 'S-Tier', location: 'Paris, Germany', prizePool: '$2,250,000', startDate: '1 Ağu', endDate: '25 Ağu 2026', status: 'upcoming', teamsCount: 16 },
];

const GAMES = [ { id: 'lol', short: 'LoL' }, { id: 'val', short: 'VAL' }, { id: 'cs2', short: 'CS2' }, { id: 'dota2', short: 'DOTA' } ];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

export default function TournamentsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'completed'>('live');

  // 🟢 YENİ: Görünüm Modu ve Seçili Turnuva
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedTournament, setSelectedTournament] = useState<any>(null);

  const filteredTournaments = MOCK_TOURNAMENTS.filter(tournament => {
    const matchSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGame = selectedGame === 'all' || tournament.game === selectedGame;
    const matchTab = tournament.status === activeTab;
    return matchSearch && matchGame && matchTab;
  });

  // 🚀 DETAY EKRANI RENDERI
  if (viewMode === 'detail' && selectedTournament) {
    return <TournamentDetail tournament={selectedTournament} onBack={() => { setViewMode('list'); setSelectedTournament(null); }} />;
  }

  // 🏠 LİSTE EKRANI RENDERI (Önceki Halinin Aynısı)
  return (
    <div className="flex flex-col w-full h-full overflow-hidden animate-fade-in bg-es-bg">
      <div className="shrink-0 p-8 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-1">E-Spor Turnuvaları</h1>
              <p className="text-sm text-slate-400">Dünya çapındaki resmi ligleri, şampiyonaları ve eleme aşamalarını takip edin.</p>
            </div>
            <div className="relative group w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-es-cyan transition-colors" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Turnuva ara (Örn: VCT, IEM)..." className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all bg-slate-900 border border-slate-700 text-white focus:border-es-cyan shadow-lg" />
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
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800">
              {[ { id: 'live', label: 'Devam Edenler', icon: PlayCircle, color: '#EF4444' }, { id: 'upcoming', label: 'Yaklaşanlar', icon: Calendar, color: '#4D7CFE' }, { id: 'completed', label: 'Sonuçlananlar', icon: Trophy, color: '#F59E0B' } ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'text-white shadow-lg' : 'text-slate-500 hover:text-white'}`} style={{ background: activeTab === tab.id ? `${tab.color}20` : 'transparent', color: activeTab === tab.id ? tab.color : '' }}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-7xl mx-auto">
          {filteredTournaments.length === 0 ? (
             <div className="text-center py-32 flex flex-col items-center justify-center opacity-50">
               <Shield className="w-16 h-16 text-slate-500 mb-4" />
               <h3 className="text-xl font-black text-white uppercase tracking-widest">Turnuva Bulunamadı</h3>
               <p className="text-slate-400 mt-2">Bu kriterlere uygun bir etkinlik veritabanında yer almıyor.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTournaments.map(tournament => {
                const color = GAME_COLORS[tournament.game];
                return (
                  <div key={tournament.id} className="rounded-2xl overflow-hidden flex flex-col shadow-xl transition-transform hover:-translate-y-1 group" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
                    <div className="h-24 p-5 relative overflow-hidden flex flex-col justify-between" style={{ background: `${color}15`, borderBottom: `1px solid ${color}30` }}>
                      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl opacity-40" style={{ background: color }} />
                      <div className="flex items-center justify-between relative z-10">
                        <span className="px-2.5 py-1 rounded text-[10px] font-black tracking-widest text-white shadow-sm" style={{ background: color }}>{tournament.game.toUpperCase()}</span>
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-900/50 px-2 py-1 rounded border border-white/10"><Shield className="w-3 h-3" style={{ color }}/> {tournament.tier}</span>
                      </div>
                      <h3 className="text-lg font-black text-white truncate relative z-10">{tournament.name}</h3>
                    </div>
                    <div className="p-5 flex-1 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><MapPin className="w-3 h-3"/> Konum</span><span className="text-xs font-semibold text-white truncate">{tournament.location}</span></div>
                        <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Tarih</span><span className="text-xs font-semibold text-white truncate">{tournament.startDate} - {tournament.endDate}</span></div>
                        <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><DollarSign className="w-3 h-3 text-green-500"/> Ödül Havuzu</span><span className="text-xs font-bold text-green-400 truncate">{tournament.prizePool}</span></div>
                        <div className="flex flex-col gap-1"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1"><Users className="w-3 h-3"/> Takım Sayısı</span><span className="text-xs font-semibold text-white truncate">{tournament.teamsCount} Takım</span></div>
                      </div>
                      {activeTab === 'completed' && tournament.results && (
                        <div className="mt-2 pt-4 border-t border-dashed border-white/10 space-y-2">
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Podyum Dağılımı</div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                            <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /><div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white" style={{ background: tournament.results.winner.color }}>{tournament.results.winner.short}</div><span className="text-xs font-bold text-white">{tournament.results.winner.name}</span></div>
                            <span className="text-xs font-black text-yellow-500">{tournament.results.winner.prize}</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800 border border-slate-700">
                            <div className="flex items-center gap-2"><span className="w-4 h-4 flex items-center justify-center text-[10px] font-black text-slate-400">2.</span><div className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white" style={{ background: tournament.results.runnerUp.color }}>{tournament.results.runnerUp.short}</div><span className="text-xs font-bold text-white">{tournament.results.runnerUp.name}</span></div>
                            <span className="text-xs font-black text-slate-400">{tournament.results.runnerUp.prize}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-white/5 bg-slate-900/30">
                       {/* 🚀 BUTONA TIKLAMA OLAYI EKLENDİ */}
                       <button onClick={() => { setSelectedTournament(tournament); setViewMode('detail'); }} className="w-full py-2.5 rounded-lg text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white group-hover:border-es-cyan/50 border border-transparent">
                         Turnuva Detayları <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}