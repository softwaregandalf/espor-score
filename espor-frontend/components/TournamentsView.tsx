"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Calendar, Users, MapPin, ChevronRight, Star } from "lucide-react";

// --- TASARIM İÇİN ÖRNEK VERİLER (İleride Backend'den Gelecek) ---
const GAME_COLORS: Record<string, string> = { lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };
const GAMES = [{ id: 'lol', short: 'LoL' }, { id: 'val', short: 'VAL' }, { id: 'cs2', short: 'CS2' }];

const TOURNAMENTS = [
  { id: 'vct-masters', name: 'VCT Masters Shanghai', game: 'val', gameLabel: 'VALORANT', stage: 'Grand Finals', prizePool: '$1,000,000', startDate: 'Jun 10', endDate: 'Jun 25', location: 'Shanghai, China', teams: 12, status: 'live', featured: true },
  { id: 'worlds-2026', name: 'Worlds 2026', game: 'lol', gameLabel: 'League of Legends', stage: 'Group Stage', prizePool: '$2,225,000', startDate: 'Sep 28', endDate: 'Nov 2', location: 'Seoul, South Korea', teams: 24, status: 'upcoming', featured: true },
  { id: 'iem-dallas', name: 'IEM Dallas 2026', game: 'cs2', gameLabel: 'CS2', stage: 'Quarterfinals', prizePool: '$250,000', startDate: 'Jun 15', endDate: 'Jun 22', location: 'Dallas, USA', teams: 16, status: 'live' },
  { id: 'blast-paris', name: 'BLAST Premier Spring', game: 'cs2', gameLabel: 'CS2', stage: 'Finals', prizePool: '$500,000', startDate: 'Jun 1', endDate: 'Jun 8', location: 'Paris, France', teams: 12, status: 'completed' },
];

// --- ALT BİLEŞEN: TURNUVA KARTI ---
function TournamentCard({ tournament, featured }: { tournament: any; featured?: boolean }) {
  const router = useRouter();
  const color = GAME_COLORS[tournament.game] || '#A0AEC0';
  const isLive = tournament.status === 'live';

  return (
    <div
      className={`rounded-2xl overflow-hidden cursor-pointer transition-all hover:brightness-110 hover:scale-[1.01] ${featured ? 'lg:col-span-2' : ''}`}
      style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}
      onClick={() => router.push('/')} // Tıklayınca ana sayfadaki maç detayına atar
    >
      <div className="relative p-5 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}20, var(--es-surface))`, borderBottom: '1px solid var(--es-border)', minHeight: featured ? '140px' : '100px' }}>
        <div className="absolute inset-0 cyber-grid opacity-20" />
        <div className="relative flex items-start justify-between">
          <div className="flex flex-col gap-2">
            {isLive && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400">CANLI YAYIN</span>
              </div>
            )}
            {tournament.featured && !isLive && (
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3" style={{ color: '#F59E0B' }} />
                <span className="text-[10px] font-bold" style={{ color: '#F59E0B' }}>ÖNE ÇIKAN</span>
              </div>
            )}
            <h3 className={`font-black text-white ${featured ? 'text-xl' : 'text-base'}`}>{tournament.name}</h3>
            {featured && <p className="text-sm" style={{ color: 'var(--es-text-3)' }}>{tournament.stage}</p>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-[10px] font-bold px-2 py-1 rounded" style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>{tournament.gameLabel}</span>
            <span className="text-[10px] font-semibold px-2 py-1 rounded" style={{
              background: tournament.status === 'live' ? 'rgba(239,68,68,0.15)' : tournament.status === 'upcoming' ? 'rgba(77,124,254,0.15)' : 'var(--es-surface)',
              color: tournament.status === 'live' ? '#EF4444' : tournament.status === 'upcoming' ? '#4D7CFE' : 'var(--es-text-3)',
            }}>
              {tournament.status === 'live' ? 'DEVAM EDİYOR' : tournament.status === 'upcoming' ? 'YAKLAŞAN' : 'BİTTİ'}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 shrink-0" style={{ color: '#F59E0B' }} />
            <div>
              <div className="text-[10px]" style={{ color: 'var(--es-text-3)' }}>Ödül Havuzu</div>
              <div className="text-xs font-bold text-white">{tournament.prizePool}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 shrink-0" style={{ color: color }} />
            <div>
              <div className="text-[10px]" style={{ color: 'var(--es-text-3)' }}>Takımlar</div>
              <div className="text-xs font-bold text-white">{tournament.teams}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--es-blue)' }} />
            <div>
              <div className="text-[10px]" style={{ color: 'var(--es-text-3)' }}>Tarih</div>
              <div className="text-xs font-bold text-white">{tournament.startDate} — {tournament.endDate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#22C55E' }} />
            <div>
              <div className="text-[10px]" style={{ color: 'var(--es-text-3)' }}>Konum</div>
              <div className="text-xs font-bold text-white truncate max-w-[100px]">{tournament.location}</div>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:brightness-110" style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}>
          Detayları Gör <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// --- ANA BİLEŞEN ---
export default function TournamentsView() {
  const [activeGame, setActiveGame] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');

  const filteredTournaments = TOURNAMENTS.filter(t => {
    const gameMatch = activeGame === 'all' || t.game === activeGame;
    const statusMatch = activeStatus === 'all' || t.status === activeStatus;
    return gameMatch && statusMatch;
  });

  const featuredTournaments = filteredTournaments.filter(t => t.featured);
  const regularTournaments = filteredTournaments.filter(t => !t.featured);

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
            <Trophy className="w-6 h-6" style={{ color: '#F59E0B' }} />
            Turnuvalar
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--es-text-3)' }}>
            {TOURNAMENTS.filter(t => t.status === 'live').length} canlı • {TOURNAMENTS.filter(t => t.status === 'upcoming').length} yaklaşan
          </p>
        </div>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex items-center rounded-xl p-1 gap-1" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'live', label: '🔴 Canlı' },
            { value: 'upcoming', label: 'Yaklaşan' },
            { value: 'completed', label: 'Biten' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveStatus(value)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={activeStatus === value ? { background: 'var(--es-blue)', color: 'white' } : { color: 'var(--es-text-3)' }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveGame('all')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={activeGame === 'all' ? { background: 'rgba(77, 124, 254, 0.2)', color: '#4D7CFE', border: '1px solid rgba(77, 124, 254, 0.3)' } : { background: 'var(--es-card)', color: 'var(--es-text-3)', border: '1px solid var(--es-border)' }}
          >
            Tüm Oyunlar
          </button>
          {GAMES.map((game) => {
            const color = GAME_COLORS[game.id];
            const isActive = activeGame === game.id;
            return (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={isActive ? { background: `${color}20`, color, border: `1px solid ${color}40` } : { background: 'var(--es-card)', color: 'var(--es-text-3)', border: '1px solid var(--es-border)' }}
              >
                {game.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Öne Çıkan Turnuvalar */}
      {featuredTournaments.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Öne Çıkan Turnuvalar</h3>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {featuredTournaments.map((t, i) => (
              <TournamentCard key={t.id} tournament={t} featured={i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Tüm Turnuvalar */}
      {regularTournaments.length > 0 && (
        <section className="pb-10">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">
            {activeStatus === 'all' ? 'Diğer Turnuvalar' : activeStatus === 'live' ? 'Devam Edenler' : activeStatus === 'upcoming' ? 'Yaklaşanlar' : 'Sonuçlananlar'}
          </h3>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {regularTournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        </section>
      )}

      {filteredTournaments.length === 0 && (
        <div className="flex items-center justify-center py-20" style={{ color: 'var(--es-text-3)' }}>
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Seçilen filtrelere uygun turnuva bulunamadı.</p>
          </div>
        </div>
      )}
    </div>
  );
}