"use client";

import { useState, useEffect } from "react";
import { Trophy, Target, Shield, Swords, X } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import type { TranslationKeys } from "@/i18n";

const FAKE_EVENTS = [
  {
    id: 1, game: "CS2", icon: Target, color: "#F59E0B",
    titleKey: "eventMap1Halftime" as TranslationKeys,
    desc: "G2 Esports  7 - 5  FaZe Clan (Mirage)",
  },
  {
    id: 2, game: "LoL", icon: Trophy, color: "#22C55E",
    titleKey: "eventMatchResult" as TranslationKeys,
    desc: "T1  2 - 0  Gen.G",
  },
  {
    id: 3, game: "VAL", icon: Shield, color: "#FF4655",
    titleKey: "eventMap1Result" as TranslationKeys,
    desc: "Sentinels  13 - 9  Fnatic (Haven)",
  },
  {
    id: 4, game: "DOTA2", icon: Swords, color: "#B9202C",
    titleKey: "eventGameResult" as TranslationKeys,
    desc: "Team Spirit  1 - 0  Team Liquid",
  },
];

export default function LiveEventToast() {
  const { t } = useLanguage();

  const [currentEvent, setCurrentEvent] = useState<(typeof FAKE_EVENTS)[number] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let eventIndex = 0;
    const interval = setInterval(() => {
      setCurrentEvent(FAKE_EVENTS[eventIndex]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 6000);
      eventIndex = (eventIndex + 1) % FAKE_EVENTS.length;
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!currentEvent) return null;

  return (
    <div className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] transition-all duration-700 ease-out transform ${isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}`}>
      <div
        className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl shadow-2xl relative overflow-hidden w-[calc(100vw-2rem)] md:w-[340px] max-w-[340px] group cursor-pointer bg-slate-950 border border-white/10 transition-colors duration-300"
        style={{ borderLeft: `4px solid ${currentEvent.color}`, boxShadow: `0 10px 40px -10px ${currentEvent.color}50` }}
      >
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none transition-opacity" />
        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-transform group-hover:scale-110" style={{ background: `${currentEvent.color}20` }}>
          <currentEvent.icon className="w-5 h-5" style={{ color: currentEvent.color }} />
        </div>
        <div className="flex flex-col flex-1 relative z-10 mt-0.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5" style={{ color: currentEvent.color }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: currentEvent.color }} />
              {currentEvent.game} {t.notification}
            </span>
            <span className="text-[10px] text-slate-400 font-mono transition-colors">{t.now}</span>
          </div>

          <h4 className="text-sm font-black text-white leading-tight mb-1 tracking-wide transition-colors">
            {t[currentEvent.titleKey]}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed font-medium transition-colors">
            {currentEvent.desc}
          </p>
        </div>
        <button onClick={() => setIsVisible(false)} className="absolute top-3 right-3 p-1 text-slate-400 hover:text-white transition-colors z-10 bg-white/5 hover:bg-white/10 rounded-md">
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
