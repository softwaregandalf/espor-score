"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Trophy, MonitorPlay, Swords, Newspaper, Users,
  Bell, Search, ChevronDown, BarChart2, Radio, X, Menu, History, Sun, Moon, LogIn, LogOut, User
} from "lucide-react";
import LiveEventToast from "./LiveEventToast";
import { useLanguage, TranslationKeys } from "./LanguageProvider";
import { LANGUAGES } from "@/i18n";
import FlagIcon from "./FlagIcon";
import { useAccentColor } from "./AccentColorProvider";
import SettingsPanel from "./SettingsPanel";

import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

const NAV_ITEMS = [
  { id: "liveMatches", icon: MonitorPlay, path: "/", accent: "#4D7CFE" },
  { id: "results", icon: History, path: "/results", accent: "#F43F5E" }, 
  { id: "tournaments", icon: Trophy, path: "/tournaments", accent: "#7C3AED" },
  { id: "teams", icon: Swords, path: "/teams", accent: "#EF4444" },
  { id: "topPlayer", icon: BarChart2, path: "/rankings", accent: "#F59E0B" },
  { id: "news", icon: Newspaper, path: "/news", accent: "#22C55E" },
  { id: "community", icon: Users, path: "/community", accent: "#00D4FF" },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const { theme, setTheme, systemTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage(); 
  
  // 🚀 GERÇEK KULLANICI VERİSİ VE ÇIKIŞ YAPMA FONKSİYONU
  const { user, isLoading, signOut } = useAuth();
  const { accentColor } = useAccentColor();

  const [mounted, setMounted] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // 🚀 PROFİL AÇILIR MENÜSÜ İÇİN STATE
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  const themeColor = accentColor;

  const handleLogoClick = () => {
    if (pathname === '/') {
      window.location.href = '/';
    } else {
      router.push('/');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden transition-colors duration-500" style={{ background: 'var(--es-bg)' }}>
      <aside className="flex flex-col shrink-0 transition-all duration-300 relative z-20" style={{ width: sidebarCollapsed ? '64px' : '240px', background: 'var(--es-bg-2)', borderRight: '1px solid var(--es-border)' }}>
        <div className="h-[70px] flex items-center justify-between px-5 shrink-0 border-b border-white/5">
          {!sidebarCollapsed ? (
            <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleLogoClick}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-700" style={{ background: themeColor }}>
                <Radio className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">NEXUS</span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded transition-colors duration-700" style={{ background: `${themeColor}20`, color: themeColor }}>PRO</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto cursor-pointer transition-all duration-700 hover:opacity-80 hover:scale-105" style={{ background: themeColor }} onClick={handleLogoClick}>
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
          <nav className="flex flex-col gap-1 px-3">
            {!sidebarCollapsed && <div className="text-[10px] font-bold uppercase tracking-widest px-2 mb-2 text-slate-500">{t.menu}</div>}
            
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.path;
              const label = t[item.id as TranslationKeys];
              
              const handleNavClick = (e: React.MouseEvent) => {
                if (isActive) {
                  e.preventDefault();
                  window.location.href = item.path;
                }
              };

              return (
                <Link key={item.id} href={item.path} onClick={handleNavClick} title={sidebarCollapsed ? label : undefined} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${sidebarCollapsed ? 'justify-center' : ''} ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`} style={isActive ? { background: `${themeColor}15`, color: themeColor } : {}}>
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full transition-colors duration-700" style={{ background: themeColor }} />}
                  <item.icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" style={isActive ? { color: themeColor } : {}} />
                  {!sidebarCollapsed && <span className="text-sm font-semibold">{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 🚀 DİNAMİK KULLANICI PROFİLİ VE AÇILIR MENÜ */}
        <div className="p-4 border-t transition-colors relative" style={{ borderColor: 'var(--es-border)' }}>
          {isLoading ? (
            <div className="animate-pulse flex items-center gap-3 w-full p-2">
              <div className="w-9 h-9 rounded-full bg-slate-700/50" />
              {!sidebarCollapsed && (
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3 w-20 bg-slate-700/50 rounded" />
                  <div className="h-2 w-12 bg-slate-700/50 rounded" />
                </div>
              )}
            </div>
          ) : user ? (
            !sidebarCollapsed ? (
              <div className="relative">
                
                {/* 🚀 AÇILIR MENÜ (DROPDOWN) */}
                {isProfileMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl shadow-xl overflow-hidden border z-50 animate-fade-in" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                    <button onClick={() => { setIsProfileMenuOpen(false); router.push('/profile'); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--es-text-1)' }}>
                      <User className="w-4 h-4" /> {/* Dil sözlüğünde profil yoksa default olarak Profile yazacak */}
                      {(t as any).profile || 'Profile'} 
                    </button>
                    <button onClick={() => { setIsProfileMenuOpen(false); signOut(); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors text-red-500 hover:bg-red-500/10">
                      <LogOut className="w-4 h-4" /> 
                      {(t as any).logout || 'Log Out'}
                    </button>
                  </div>
                )}

                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-3 w-full hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-xl transition-colors">
                  <div className="w-9 h-9 rounded-full bg-es-cyan/20 border border-es-cyan/50 flex items-center justify-center font-black text-es-cyan">
                    {user.user_metadata?.avatar_url || user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col text-left flex-1 min-w-0">
                    <span className="text-sm font-bold truncate transition-colors" style={{ color: 'var(--es-text-1)' }}>
                      {user.user_metadata?.nickname || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[10px] font-bold text-es-cyan">{t.proMember || 'PRO ÜYE'}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-all duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--es-text-3)' }} />
                </button>
              </div>
            ) : (
              <div className="relative group">
                <div onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 mx-auto rounded-full bg-es-cyan/20 border border-es-cyan/50 flex items-center justify-center font-black text-es-cyan cursor-pointer hover:bg-es-cyan/30 transition-colors" title={user.user_metadata?.nickname}>
                  {user.user_metadata?.avatar_url || user.email?.charAt(0).toUpperCase()}
                </div>
                {/* 🚀 YANDAN ÇIKAN KÜÇÜK MENÜ (Sidebar kapalıyken) */}
                {isProfileMenuOpen && (
                  <div className="absolute bottom-0 left-full ml-2 w-32 rounded-xl shadow-xl overflow-hidden border z-50 animate-fade-in" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                    <button onClick={() => { setIsProfileMenuOpen(false); router.push('/profile'); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--es-text-1)' }}>
                      <User className="w-4 h-4" /> {(t as any).profile || 'Profile'}
                    </button>
                    <button onClick={() => { setIsProfileMenuOpen(false); signOut(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold transition-colors text-red-500 hover:bg-red-500/10">
                      <LogOut className="w-4 h-4" /> {(t as any).logout || 'Log Out'}
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className={`flex items-center justify-center gap-2 w-full bg-es-cyan hover:bg-white text-black p-2.5 rounded-xl transition-all font-black text-xs tracking-widest shadow-lg shadow-es-cyan/20 ${sidebarCollapsed ? 'px-0' : 'uppercase'}`}
            >
              <LogIn className="w-4 h-4" />
              {!sidebarCollapsed && t.login}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-colors duration-500">
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full pointer-events-none transition-colors duration-1000 ease-in-out opacity-40" style={{ background: `radial-gradient(circle, ${themeColor}20 0%, transparent 60%)`, filter: 'blur(60px)' }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full pointer-events-none transition-colors duration-1000 ease-in-out delay-75 opacity-30" style={{ background: `radial-gradient(circle, ${themeColor}15 0%, transparent 60%)`, filter: 'blur(50px)' }} />

        <header className="h-[70px] flex items-center justify-between px-8 z-30 shrink-0 border-b border-white/5 bg-slate-900/50 backdrop-blur-md transition-colors" style={{ borderColor: 'var(--es-border)' }}>
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative group w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--es-text-3)' }} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full py-2.5 pl-10 pr-4 rounded-xl text-sm outline-none transition-all shadow-sm" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', color: 'var(--es-text-1)' }} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mounted && <SettingsPanel />}

            {mounted && (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:scale-105" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                  <FlagIcon language={language} />
                  <span className="text-[10px] font-black uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>
                    {LANGUAGES.find((l) => l.id === language)?.label ?? language.toUpperCase()}
                  </span>
                  <ChevronDown className="w-3 h-3 transition-colors" style={{ color: 'var(--es-text-3)' }} />
                </button>

                <div className="absolute right-0 top-full mt-2 w-40 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden border" style={{ background: 'var(--es-card)', borderColor: 'var(--es-border)' }}>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguage(lang.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors ${language === lang.id ? 'bg-es-cyan/10 text-es-cyan' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                      style={{ color: language === lang.id ? '' : 'var(--es-text-1)' }}
                    >
                      <FlagIcon language={lang.id} className="w-5 h-3.5" />
                      <span className="font-black uppercase tracking-widest">{lang.label}</span>
                      <span className="text-[10px] font-semibold opacity-70">{lang.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mounted && (
              <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95 group" style={{ background: 'var(--es-surface)', borderColor: 'var(--es-border)', boxShadow: isDark ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                {isDark ? <Moon className="w-4 h-4 text-es-cyan group-hover:-rotate-12 transition-transform" /> : <Sun className="w-4 h-4 text-orange-500 group-hover:rotate-45 transition-transform" />}
                <span className="text-[10px] font-black uppercase tracking-widest transition-colors" style={{ color: 'var(--es-text-3)' }}>
                  {isDark ? t.nightOn : t.dayOn}
                </span>
              </button>
            )}

            <button className="p-2 rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-white/10 relative" style={{ color: 'var(--es-text-3)' }}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2" style={{ borderColor: 'var(--es-bg)' }} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col relative z-10">
          {children}
        </div>
        
        <LiveEventToast />
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}