"use client";

import { useState, useEffect, useRef } from "react";
import { Settings, ChevronDown } from "lucide-react";
import { useLanguage, TranslationKeys } from "./LanguageProvider";
import { useAccentColor, ACCENT_PRESETS, AccentPresetId } from "./AccentColorProvider";

export default function SettingsPanel() {
  const { t } = useLanguage();
  const { accentId, accentColor, setAccentId } = useAccentColor();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all hover:scale-105 active:scale-95"
        style={{
          background: "var(--es-surface)",
          borderColor: isOpen ? `${accentColor}50` : "var(--es-border)",
          boxShadow: isOpen ? `0 0 12px ${accentColor}20` : "none",
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Settings className="w-4 h-4 transition-transform duration-300" style={{ color: accentColor, transform: isOpen ? "rotate(90deg)" : "none" }} />
        <span className="text-[10px] font-black uppercase tracking-widest transition-colors" style={{ color: "var(--es-text-3)" }}>
          {t.settings}
        </span>
        <ChevronDown className={`w-3 h-3 transition-all duration-300 ${isOpen ? "rotate-180" : ""}`} style={{ color: "var(--es-text-3)" }} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-64 rounded-xl shadow-xl z-50 overflow-hidden border animate-fade-in"
          style={{ background: "var(--es-card)", borderColor: "var(--es-border)" }}
        >
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--es-border)" }}>
            <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--es-text-1)" }}>
              {t.themeColor}
            </p>
            <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "var(--es-text-3)" }}>
              {t.themeColorDesc}
            </p>
          </div>

          <div className="p-2 flex flex-col gap-1">
            {ACCENT_PRESETS.map((preset) => {
              const isSelected = accentId === preset.id;
              const label = t[preset.labelKey as TranslationKeys];
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setAccentId(preset.id as AccentPresetId);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: isSelected ? `${preset.color}15` : "transparent",
                    color: isSelected ? preset.color : "var(--es-text-1)",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 transition-all"
                    style={{
                      background: preset.color,
                      boxShadow: isSelected ? `0 0 10px ${preset.color}` : "none",
                    }}
                  />
                  <span className="flex-1 text-left">{label}</span>
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: preset.color }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
