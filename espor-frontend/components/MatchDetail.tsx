"use client";

import { useState } from "react";
import { ChevronRight, PlayCircle, Radio, BarChart2, Star, MonitorPlay, Info, Swords, ExternalLink, TrendingUp, Shield, Target, Trophy } from "lucide-react";

const GAME_COLORS: Record<string, string> = {
  lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C'
};

function TeamLogo({ logoUrl, name, color, size = 'sm' }: { logoUrl?: string, name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizePx = size === 'xs' ? '16px' : size === 'sm' ? '24px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '80px';
  return (
    <div 
      className="rounded-2xl flex items-center justify-center font-black text-white shrink-0 overflow-hidden bg-slate-900 border border-slate-800" 
      style={{ 
        width: sizePx, height: sizePx, 
        minWidth: sizePx, minHeight: sizePx,
        background: color,
        boxShadow: `0 0 15px ${color}40`
      }}
    >
      {logoUrl ? <img src={logoUrl} alt={name} className="w-full h-full object-contain p-1" /> : <span style={{ fontSize: size === 'lg' || size === 'xl' ? '16px' : '10px' }}>{name?.slice(0, 3).toUpperCase()}</span>}
    </div>
  );
}

function GameBadge({ gameType }: { gameType: string }) {
  const color = GAME_COLORS[gameType.toLowerCase()] || '#A0AEC0';
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}>
      {gameType.toUpperCase()}
    </span>
  );
}

export default function MatchDetail({ selectedMatch }: { selectedMatch: any, setSelectedMatch: any }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'stats' | 'predictions'>('overview');

  if (!selectedMatch) {
    return (
      <div className="flex-1 flex items-center justify-center h-full rounded-xl" style={{ color: 'var(--es-text-3)', background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
        <div className="text-center">
          <MonitorPlay className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Detayları görmek için sol menüden bir maç seçiniz.</p>
        </div>
      </div>
    );
  }

  const gameType = selectedMatch.gameDetails?.type?.toLowerCase() || 'cs2';
  const gameColor = GAME_COLORS[gameType] || '#A0AEC0';
  const isLive = selectedMatch.status === 'Live';
  const isCompleted = selectedMatch.status === 'Finished';

  // Sahte Form Verisi (İleride DB'den gelecek)
  const T1_FORM = ['W', 'W', 'W', 'L', 'W'];
  const T2_FORM = ['W', 'L', 'W', 'W', 'L'];

  return (
    <div className="flex-1 flex flex-col h-full rounded-xl overflow-hidden" style={{ background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
      {/* 👑 Üst Kısım (Header) */}
      <div className="shrink-0 px-6 pt-5 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
        
        <div className="relative">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--es-text-3)' }}>
            <span>{selectedMatch.tournament?.name}</span>
            <ChevronRight className="w-3 h-3" />
            <span>Genel Aşama</span>
            <div className="ml-auto flex items-center gap-2">
              <GameBadge gameType={gameType} />
              <span className="font-semibold">BO3</span>
            </div>
          </div>

          {/* Teams & Score */}
          <div className="flex items-center justify-between">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-3 w-32 md:w-48">
              <TeamLogo logoUrl={selectedMatch.team1?.logoUrl} name={selectedMatch.team1?.name} color={gameColor} size="lg" />
              <div className="text-center">
                <div className="font-black text-white text-lg tracking-tight">{selectedMatch.team1?.name}</div>
              </div>
              <div className="flex items-center gap-1">
                {T1_FORM.map((r, i) => (
                  <div key={i} className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: r === 'W' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r === 'W' ? '#22C55E' : '#EF4444', border: `1px solid ${r === 'W' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Score Center */}
            <div className="flex flex-col items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400">CANLI YAYIN</span>
                </div>
              )}
              {isCompleted && (
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)' }}>Bitti</span>
              )}
              <div className="text-5xl font-black score-display mt-2" style={{ color: 'white', letterSpacing: '-2px' }}>
                {selectedMatch.team1Score} <span className="mx-3" style={{ color: 'var(--es-text-3)' }}>:</span> {selectedMatch.team2Score}
              </div>
              {isLive && <span className="text-xs font-medium mt-1" style={{ color: gameColor }}>Map 1 • Skor Güncelleniyor</span>}
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center gap-3 w-32 md:w-48">
              <TeamLogo logoUrl={selectedMatch.team2?.logoUrl} name={selectedMatch.team2?.name} color={gameColor} size="lg" />
              <div className="text-center">
                <div className="font-black text-white text-lg tracking-tight">{selectedMatch.team2?.name}</div>
              </div>
              <div className="flex items-center gap-1">
                {T2_FORM.map((r, i) => (
                  <div key={i} className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: r === 'W' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r === 'W' ? '#22C55E' : '#EF4444', border: `1px solid ${r === 'W' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                    {r}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sekmeler */}
          <div className="flex items-center gap-2 mt-8 border-b border-transparent">
            {[{id: 'overview', label: 'Genel Bakış'}, {id: 'lineups', label: 'Kadrolar'}, {id: 'stats', label: 'İstatistikler'}, {id: 'predictions', label: 'Tahminler'}].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-4 py-2.5 text-xs font-semibold transition-all relative"
                style={{ color: activeTab === tab.id ? 'white' : 'var(--es-text-3)', borderBottom: activeTab === tab.id ? `2px solid ${gameColor}` : '2px solid transparent' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 📦 Alt İçerik */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            {/* Maç Bilgisi */}
            <div className="rounded-xl p-4" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" style={{ color: gameColor }} /> Maç Detayları
              </h4>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>Turnuva</span><span className="text-xs font-semibold text-white truncate max-w-[150px]">{selectedMatch.tournament?.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>Aşama</span><span className="text-xs font-semibold text-white">Grup Aşaması</span></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>Format</span><span className="text-xs font-semibold text-white">Best of 3 (BO3)</span></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>Konum</span><span className="text-xs font-semibold text-white">Global (Online)</span></div>
              </div>
            </div>

            {/* İzleme Linkleri */}
            <div className="rounded-xl p-4" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" style={{ color: gameColor }} /> Canlı Yayınlar
              </h4>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:brightness-110" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" style={{ color: gameColor }} />
                    <span className="text-xs font-semibold text-white">Twitch.tv</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--es-text-3)' }}>Resmi Yayın</span>
                    <ExternalLink className="w-3 h-3" style={{ color: 'var(--es-text-3)' }} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'lineups' || activeTab === 'stats' || activeTab === 'predictions') && (
          <div className="flex-1 flex items-center justify-center py-20" style={{ color: 'var(--es-text-3)' }}>
             <div className="text-center">
               <Shield className="w-10 h-10 mx-auto mb-3 opacity-20" />
               <p className="text-sm">Bu bölümdeki gelişmiş istatistikler yakında aktif edilecektir.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}