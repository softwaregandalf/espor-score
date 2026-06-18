"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Trophy, MonitorPlay, Swords, Newspaper, Users, Settings, Bell, Search, 
  ChevronDown, BarChart2, Radio, Gamepad2, X, Menu,
} from "lucide-react";

// Dinamik Next.js Menü Öğeleri
const NAV_ITEMS = [
  { icon: MonitorPlay, label: "Canlı Maçlar", path: "/", accent: "#4D7CFE" },
  { icon: Trophy, label: "Turnuvalar", path: "/tournaments", accent: "#7C3AED" },
  { icon: Swords, label: "Takımlar", path: "/teams", accent: "#EF4444" },
  { icon: BarChart2, label: "Sıralama", path: "/rankings", accent: "#F59E0B" },
  { icon: Newspaper, label: "Haberler", path: "/news", accent: "#22C55E" },
  { icon: Users, label: "Topluluk", path: "/community", accent: "#00D4FF" },
];

const GAMES = [
  { id: "cs2", name: "Counter-Strike 2", short: "CS2" },
  { id: "valorant", name: "VALORANT", short: "VAL" },
  { id: "lol", name: "League of Legends", short: "LoL" },
  { id: "dota2", name: "Dota 2", short: "DOTA" }
];

const GAME_COLORS: Record<string, string> = {
  lol: '#C89B3C', valorant: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C'
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--es-bg)', color: 'var(--es-text-1)' }}>
      
      {/* 👈 SOL MENÜ (NAV SIDEBAR) */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300 relative z-20"
        style={{
          width: sidebarCollapsed ? '72px' : '240px',
          background: 'var(--es-bg-2)',
          borderRight: '1px solid var(--es-border)',
        }}
      >
        {/* Logo Alanı */}
        <div className="h-[70px] flex items-center justify-between px-4 shrink-0" style={{ borderBottom: '1px solid var(--es-border)' }}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #4D7CFE, #7C3AED)' }}>
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white font-['Rajdhani',sans-serif]">NEXUS</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase" style={{ background: 'var(--es-blue)', color: 'white' }}>PRO</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer" style={{ background: 'linear-gradient(135deg, #4D7CFE, #7C3AED)' }} onClick={() => router.push('/')}>
              <Radio className="w-4 h-4 text-white" />
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={() => setSidebarCollapsed(true)} className="p-1.5 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--es-text-3)' }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button onClick={() => setSidebarCollapsed(false)} className="mx-auto mt-4 p-2 rounded-lg transition-colors hover:bg-white/5" style={{ color: 'var(--es-text-3)' }}>
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar py-6 flex flex-col gap-8">
          {/* Canlı Maç Sayacı */}
          {!sidebarCollapsed && (
            <div className="px-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <div className="relative flex items-center justify-center w-2 h-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <span className="text-xs font-bold text-red-400 font-['Rajdhani',sans-serif] uppercase tracking-wider">3 Canlı Yayın</span>
              </div>
            </div>
          )}

          {/* Ana Navigasyon */}
          <nav className="flex flex-col gap-1 px-3">
            {!sidebarCollapsed && <div className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'var(--es-text-3)' }}>Navigasyon</div>}
            
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.label}
                  href={item.path}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${sidebarCollapsed ? 'justify-center' : ''} ${isActive ? 'text-white' : 'text-[#64748B] hover:text-white'}`}
                  style={isActive ? { background: `${item.accent}15`, color: item.accent } : {}}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: item.accent }} />}
                  <item.icon className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" style={isActive ? { color: item.accent } : {}} />
                  {!sidebarCollapsed && <span className="text-sm font-bold tracking-wide">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Oyun Filtreleri */}
          {!sidebarCollapsed && (
            <div className="flex flex-col gap-1 px-3">
              <div className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 flex justify-between items-center" style={{ color: 'var(--es-text-3)' }}>
                <span>Oyunlar</span>
                <Settings className="w-3 h-3 cursor-pointer hover:text-white transition-colors" />
              </div>
              {GAMES.map((game) => (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(selectedGame === game.id ? null : game.id)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 w-full text-left group hover:bg-white/5"
                  style={{
                    background: selectedGame === game.id ? `${GAME_COLORS[game.id]}15` : undefined,
                    color: selectedGame === game.id ? GAME_COLORS[game.id] : 'var(--es-text-3)',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: GAME_COLORS[game.id], boxShadow: selectedGame === game.id ? `0 0 8px ${GAME_COLORS[game.id]}` : undefined }} />
                  <span className="text-sm font-bold flex-1 group-hover:text-white transition-colors">{game.name}</span>
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded" style={{ background: 'var(--es-surface)', color: 'var(--es-text-3)' }}>{game.short}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kullanıcı Profili (Alt Kısım) */}
        <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--es-border)' }}>
          {!sidebarCollapsed ? (
            <button className="flex items-center gap-3 w-full hover:bg-white/5 p-2 rounded-xl transition-colors">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=64" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col text-left flex-1 min-w-0">
                <span className="text-sm font-black text-white">Yönetici</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--es-blue)' }}>Pro Üye</span>
              </div>
              <ChevronDown className="w-4 h-4 shrink-0" style={{ color: 'var(--es-text-3)' }} />
            </button>
          ) : (
            <div className="flex justify-center w-full">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700">
                <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=64" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* 📺 SAĞ BÖLÜM (MAIN AREA) */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        
        {/* Üst Arama & Bildirim Barı */}
        <header className="h-[70px] flex items-center justify-between px-8 z-30 shrink-0 glass" style={{ borderBottom: '1px solid var(--es-border)' }}>
          <div className="flex items-center gap-4 w-full max-w-md">
            <div className="relative group w-full">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: searchQuery ? 'var(--es-blue)' : 'var(--es-text-3)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Takım, turnuva veya oyuncu ara..."
                className="w-full py-2.5 pl-11 pr-4 rounded-xl text-sm outline-none transition-all placeholder:text-slate-500 font-bold"
                style={{ background: 'var(--es-surface)', border: '1px solid var(--es-border)', color: 'var(--es-text-1)' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--es-blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(77, 124, 254, 0.1)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--es-border)'; e.target.style.boxShadow = 'none'; }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1">
                <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded font-bold" style={{ background: 'var(--es-bg)', color: 'var(--es-text-3)', border: '1px solid var(--es-border)' }}>⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl transition-colors hover:bg-white/10" style={{ color: 'var(--es-text-2)' }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: 'var(--es-red)', border: '2px solid var(--es-bg-2)' }} />
            </button>
            <button className="p-2 rounded-xl transition-colors hover:bg-white/10" style={{ color: 'var(--es-text-2)' }}>
              <Gamepad2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dinamik İçerik (Orta Alan) */}
        <div className="flex-1 overflow-hidden relative flex">
          {/* Fütüristik Arka Plan Glow Efektleri */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(77, 124, 254, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          {/* Sayfaların Geleceği Ana Kapsayıcı */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-6 relative z-10">
            {children}
          </div>
        </div>
      </main>

    </div>
  );
}