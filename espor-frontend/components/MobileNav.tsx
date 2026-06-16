"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex justify-around py-3 pb-safe z-50 transition-colors">
      <Link href="/" className={`flex flex-col items-center transition-colors ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
        <span className="text-xl">🔴</span>
        <span className="text-[10px] font-bold mt-1">Canlı</span>
      </Link>
      <Link href="/upcoming" className={`flex flex-col items-center transition-colors ${pathname === '/upcoming' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
        <span className="text-xl">📅</span>
        <span className="text-[10px] font-medium mt-1">Yaklaşan</span>
      </Link>
      <Link href="/results" className={`flex flex-col items-center transition-colors ${pathname === '/results' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
        <span className="text-xl">✅</span>
        <span className="text-[10px] font-medium mt-1">Geçmiş</span>
      </Link>
    </div>
  );
}