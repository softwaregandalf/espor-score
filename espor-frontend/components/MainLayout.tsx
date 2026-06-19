"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trophy, MonitorPlay, Swords, Newspaper, Users, Settings,
  Bell, Search, ChevronDown, BarChart2, Radio, Gamepad2, X, Menu, History
} from "lucide-react";
import LiveEventToast from "./LiveEventToast";

// --- SABİT VERİLER (NAVİGASYON BURADAN YÖNETİLİYOR) ---
const NAV_ITEMS = [
  { icon: MonitorPlay, label: "Canlı Maçlar", path: "/", accent: "#4D7CFE" },
  // 🚀 YENİ EKLENEN "SONUÇLAR" SEKMESİ
  { icon: History, label: "Sonuçlar", path: "/results", accent: "#F43F5E" }, 
  { icon: Trophy, label: "Turnuvalar", path: "/tournaments", accent: "#7C3AED" },
  { icon: Swords, label: "Takımlar", path: "/teams", accent: "#EF4444" },
  { icon: BarChart2, label: "Sıralama", path: "/rankings", accent: "#F59E0B" },
  { icon: Newspaper, label: "Haberler", path: "/news", accent: "#22C55E" },
  { icon: Users, label: "Topluluk", path: "/community", accent: "#00D4FF" },
];

const GAMES = [
  { id: 'lol', name: 'League of Legends', short: 'LoL' },
  { id: 'val', name: 'VALORANT', short: 'VAL' },
  { id: 'cs2', name: 'Counter-Strike 2', short: 'CS2' },
  { id: 'dota2', name: 'Dota 2', short: 'DOTA' },
];

// OYUNLARA ÖZEL RENK PALETİ
const GAME_COLORS: Record<string, string> = {
  lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C', default: '#4D7CFE'
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const themeColor = selectedGame ? GAME_COLORS[selectedGame] : GAME_COLORS.default;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--es-bg)' }}>
      
      {/* --- SOL NAVİGASYON (SIDEBAR) --- */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 relative z-20"
        style={{
          width: sidebarCollapsed ? '64px' : '240px',
          background: 'var(--es-bg-2)',
          borderRight: '1px solid var(--es-border)',
        }}
      >
        {/* Logo Alanı */}
        <div className="h-[70px] flex items-center justify-between px-5 shrink-0 border-b border-white/5">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-700" style={{ background: themeColor }}>
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">NEXUS</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors duration-700" style={{ background: `${themeColor}20`, color: themeColor }}>PRO</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer transition-colors duration-700" style={{ background: themeColor }} onClick={() => router.push('/')}>
              <Radio className="w-4 h-4 text-white" />
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(true)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button onClick={() => setSidebarCollapsed(false)} className="mx-auto mt-4 p-2 rounded-lg transition-colors hover:bg-white/5 text-slate-500">
            <Menu className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar py-4 flex flex-col gap-6">
          {/* Menü Linkleri */}
          <nav className="flex flex-col gap-1 px-3">
            {!sidebarCollapsed && <div className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 text-slate-500">Menü</div>}
            
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${sidebarCollapsed ? 'justify-center' : ''} ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                  style={isActive ? { background: `${themeColor}15`, color: themeColor } : {}}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full transition-colors duration-700" style={{ background: themeColor }} />}
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" style={isActive ? { color: themeColor } : {}} />
                  {!sidebarCollapsed && <span className="text-sm font-semibold">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* E-Spor Oyunları (Tema Değiştiriciler) */}
          {!sidebarCollapsed && (
            <div className="flex flex-col gap-1 px-3">
              <div className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 flex justify-between items-center text-slate-500">
                <span>Oyunlar</span>
                <Settings className="w-3 h-3 cursor-pointer hover:text-white transition-colors" />
              </div>
              {GAMES.map((game) => {
                const isSelected = selectedGame === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(isSelected ? null : game.id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 w-full text-left group"
                    style={{
                      background: isSelected ? `${GAME_COLORS[game.id]}15` : 'transparent',
                      color: isSelected ? GAME_COLORS[game.id] : 'var(--es-text-3)',
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-full shrink-0 transition-all duration-500"
                      style={{ background: GAME_COLORS[game.id], boxShadow: isSelected ? `0 0 10px ${GAME_COLORS[game.id]}` : 'none' }}
                    />
                    <span className="text-sm font-semibold flex-1 group-hover:text-white transition-colors">{game.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Profil Alanı */}
        <div className="p-4 border-t border-white/5">
          {!sidebarCollapsed ? (
            <button className="flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-xl transition-colors">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
                AD
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-sm font-bold text-white">Admin User</span>
                <span className="text-[10px] font-semibold text-slate-400">PRO Üye</span>
              </div>
              <ChevronDown className="w-4 h-4 shrink-0 text-slate-500" />
            </button>
          ) : (
            <div className="w-9 h-9 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white">
              AD
            </div>
          )}
        </div>
      </aside>

      {/* --- SAĞ TARAF (ANA İÇERİK VE ÜST BAR) --- */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* DİNAMİK AMBİYANS IŞIKLARI */}
        <div
          className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none transition-colors duration-1000 ease-in-out opacity-40"
          style={{ background: `radial-gradient(circle, ${themeColor}20 0%, transparent 60%)`, filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none transition-colors duration-1000 ease-in-out delay-75 opacity-30"
          style={{ background: `radial-gradient(circle, ${themeColor}15 0%, transparent 60%)`, filter: 'blur(50px)' }}
        />

        {/* Üst Header */}
        <header className="h-[70px] flex items-center justify-between px-8 z-30 shrink-0 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative group w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Takım, turnuva veya oyuncu ara..."
                className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500"
                onFocus={(e) => {
                  e.target.style.borderColor = themeColor;
                  e.target.style.boxShadow = `0 0 0 3px ${themeColor}25`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-red-400">3 CANLI</span>
            </div>
            <button className="p-2 rounded-xl transition-colors hover:bg-white/10 text-slate-400 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-slate-900" />
            </button>
            <button className="p-2 rounded-xl transition-colors hover:bg-white/10 text-slate-400">
              <Gamepad2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dinamik Değişen Sayfa İçeriği - SADECE BİR KERE YAZILMALI */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-10">
          {children}
        </div>
        
        {/* 🚀 CANLI OLAY BİLDİRİMLERİ */}
        <LiveEventToast />

      </main>
    </div>
  );
}