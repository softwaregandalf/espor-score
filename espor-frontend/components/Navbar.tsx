"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg flex items-center justify-center font-bold text-white">
              E
            </div>
            <span className="font-black text-xl tracking-wider text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500">
              ESPOR<span className="text-blue-600 dark:text-white">ARENA</span>
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-1">
              <Link href="/" className={`px-4 py-2 rounded-lg font-medium border flex items-center gap-2 transition-colors ${pathname === '/' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
                <span className={`w-2 h-2 rounded-full ${pathname === '/' ? 'bg-red-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'}`}></span> Canlı
              </Link>
              <Link href="/upcoming" className={`px-4 py-2 rounded-lg font-medium border transition-colors ${pathname === '/upcoming' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
                📅 Yaklaşan
              </Link>
              <Link href="/results" className={`px-4 py-2 rounded-lg font-medium border transition-colors ${pathname === '/results' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700' : 'text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'}`}>
                ✅ Sonuçlar
              </Link>
            </div>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent dark:border-slate-700"
                aria-label="Tema Değiştir"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}