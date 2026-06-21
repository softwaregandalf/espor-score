"use client";

import { useState } from "react";
import { ChevronRight, PlayCircle, Radio, BarChart2, Star, MonitorPlay, Info, Swords, ExternalLink, TrendingUp, Shield, Target, Trophy, ChevronLeft } from "lucide-react";
import { useLanguage } from "./LanguageProvider"; // 🚀 DİL BEYNİ EKLENDİ

const GAME_COLORS: Record<string, string> = { lol: '#C89B3C', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

function TeamLogo({ logoUrl, name, color, size = 'sm' }: { logoUrl?: string, name: string; color: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizePx = size === 'xs' ? '16px' : size === 'sm' ? '24px' : size === 'md' ? '40px' : size === 'lg' ? '64px' : '80px';
  return (
    <div className="rounded-2xl flex items-center justify-center font-black text-white shrink-0 overflow-hidden bg-slate-900 border border-slate-800" style={{ width: sizePx, height: sizePx, minWidth: sizePx, minHeight: sizePx, background: color, boxShadow: `0 0 15px ${color}40` }}>
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
  const { t, translateApiText, language } = useLanguage(); // 🚀 DİL BEYNİ BAĞLANDI
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'stats' | 'predictions'>('overview');

  if (!selectedMatch) {
    return (
      <div className="flex-1 flex items-center justify-center h-full rounded-xl" style={{ color: 'var(--es-text-3)', background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
        <div className="text-center">
          <MonitorPlay className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>{language === 'tr' ? "Detayları görmek için sol menüden bir maç seçiniz." : "Select a match from the left menu to view details."}</p>
        </div>
      </div>
    );
  }

  const gameType = selectedMatch.gameDetails?.type?.toLowerCase() || 'cs2';
  const gameColor = GAME_COLORS[gameType] || '#A0AEC0';
  const isLive = selectedMatch.status === 'Live';
  const isCompleted = selectedMatch.status === 'Finished';

  const T1_FORM = ['W', 'W', 'W', 'L', 'W'];
  const T2_FORM = ['W', 'L', 'W', 'W', 'L'];

  return (
    <div className="flex-1 flex flex-col h-full rounded-xl overflow-hidden" style={{ background: 'var(--es-bg-2)', border: '1px solid var(--es-border)' }}>
      <div className="shrink-0 px-6 pt-5 pb-0 relative overflow-hidden" style={{ background: 'var(--es-bg-2)', borderBottom: '1px solid var(--es-border)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${gameColor}15 0%, transparent 70%)` }} />
        
        <div className="relative">
          {/* 🚀 ANA AKIŞA DÖN */}
          <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-6 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg w-fit">
            <ChevronLeft className="w-3.5 h-3.5" /> {t.backToMain}
          </button>

          <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--es-text-3)' }}>
            <span>{selectedMatch.tournament?.name}</span>
            <ChevronRight className="w-3 h-3" />
            <span>{translateApiText(selectedMatch.tournament?.stage || "Group Stage")}</span>
            <div className="ml-auto flex items-center gap-2">
              <GameBadge gameType={gameType} />
              <span className="font-semibold">BO3</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-3 w-32 md:w-48">
              <TeamLogo logoUrl={selectedMatch.team1?.logoUrl} name={selectedMatch.team1?.name} color={gameColor} size="lg" />
              <div className="text-center">
                <div className="font-black text-slate-900 dark:text-white text-lg tracking-tight transition-colors">{selectedMatch.team1?.name}</div>
              </div>
              <div className="flex items-center gap-1">
                {T1_FORM.map((r, i) => <div key={i} className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: r === 'W' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r === 'W' ? '#22C55E' : '#EF4444', border: `1px solid ${r === 'W' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>{r}</div>)}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              {isLive && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {/* 🚀 LİVE (ORTADAKİ KUTU) */}
                  <span className="text-xs font-bold text-red-400">{t.live}</span>
                </div>
              )}
              {isCompleted && (
                <span className="text-xs font-bold px-3 py-1 rounded-full uppercase" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)' }}>{t.results}</span>
              )}
              
              <div className="text-5xl font-black score-display mt-2 text-slate-900 dark:text-white transition-colors" style={{ letterSpacing: '-2px' }}>
                {selectedMatch.team1Score} <span className="mx-3 text-slate-400 dark:text-slate-500">:</span> {selectedMatch.team2Score}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 w-32 md:w-48">
              <TeamLogo logoUrl={selectedMatch.team2?.logoUrl} name={selectedMatch.team2?.name} color={gameColor} size="lg" />
              <div className="text-center">
                <div className="font-black text-slate-900 dark:text-white text-lg tracking-tight transition-colors">{selectedMatch.team2?.name}</div>
              </div>
              <div className="flex items-center gap-1">
                {T2_FORM.map((r, i) => <div key={i} className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold" style={{ background: r === 'W' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r === 'W' ? '#22C55E' : '#EF4444', border: `1px solid ${r === 'W' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>{r}</div>)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8 border-b border-transparent">
            {/* 🚀 TAB MENÜSÜ */}
            {[
              {id: 'overview', label: t.overview}, 
              {id: 'lineups', label: t.lineups}, 
              {id: 'stats', label: t.statistics}, 
              {id: 'predictions', label: language === 'tr' ? 'Tahminler' : 'Predictions'}
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="px-4 py-2.5 text-xs font-semibold transition-all relative"
                style={{ color: activeTab === tab.id ? 'var(--es-text-1)' : 'var(--es-text-3)', borderBottom: activeTab === tab.id ? `2px solid ${gameColor}` : '2px solid transparent' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            <div className="rounded-xl p-4" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              {/* 🚀 MAÇ BİLGİLERİ */}
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
                <Info className="w-3.5 h-3.5" style={{ color: gameColor }} /> {t.matchInfo}
              </h4>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.tournament}</span><span className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[150px] transition-colors">{selectedMatch.tournament?.name}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.stage}</span><span className="text-xs font-semibold text-slate-800 dark:text-white transition-colors">{translateApiText(selectedMatch.tournament?.stage || "Group Stage")}</span></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.format}</span><span className="text-xs font-semibold text-slate-800 dark:text-white transition-colors">Best of 3 (BO3)</span></div>
                <div className="flex items-center justify-between"><span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.prizePool}</span><span className="text-xs font-semibold text-green-500 transition-colors">{selectedMatch.tournament?.prizePool || "$400,000"}</span></div>
              </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
               {/* 🚀 TAKIM FORMU */}
               <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
                 <TrendingUp className="w-3.5 h-3.5" style={{ color: gameColor }} /> {t.teamForm}
               </h4>
               <div className="flex flex-col gap-3">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <TeamLogo logoUrl={selectedMatch.team1?.logoUrl} name={selectedMatch.team1?.name} color={gameColor} size="xs" />
                       <span className="text-xs font-semibold text-slate-800 dark:text-white transition-colors">{selectedMatch.team1?.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {T1_FORM.map((r, i) => <div key={i} className="w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center" style={{ background: r === 'W' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r === 'W' ? '#22C55E' : '#EF4444' }}>{r}</div>)}
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <TeamLogo logoUrl={selectedMatch.team2?.logoUrl} name={selectedMatch.team2?.name} color={gameColor} size="xs" />
                       <span className="text-xs font-semibold text-slate-800 dark:text-white transition-colors">{selectedMatch.team2?.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {T2_FORM.map((r, i) => <div key={i} className="w-4 h-4 rounded text-[8px] font-bold flex items-center justify-center" style={{ background: r === 'W' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: r === 'W' ? '#22C55E' : '#EF4444' }}>{r}</div>)}
                    </div>
                 </div>
               </div>
            </div>

            <div className="rounded-xl p-4" style={{ background: 'var(--es-card)', border: '1px solid var(--es-border)' }}>
              {/* 🚀 CANLI YAYINLAR */}
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 transition-colors">
                <Radio className="w-3.5 h-3.5" style={{ color: gameColor }} /> {t.liveStreams}
              </h4>
              <div className="flex flex-col gap-2">
                <button className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-all hover:brightness-95 dark:hover:brightness-110" style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)' }}>
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" style={{ color: gameColor }} />
                    <span className="text-xs font-semibold text-slate-800 dark:text-white transition-colors">Twitch.tv</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--es-text-3)' }}>{t.officialStream}</span>
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
               <p className="text-sm">{language === 'tr' ? "Bu bölümdeki gelişmiş istatistikler yakında aktif edilecektir." : "Advanced statistics for this section will be active soon."}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}