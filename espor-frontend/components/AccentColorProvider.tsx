"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export const ACCENT_PRESETS = [
  { id: "default", color: "#4D7CFE", labelKey: "colorDefault" as const },
  { id: "lol", color: "#22C55E", labelKey: "colorGreen" as const },
  { id: "val", color: "#FF4655", labelKey: "colorRed" as const },
  { id: "cs2", color: "#F59E0B", labelKey: "colorOrange" as const },
  { id: "dota2", color: "#B9202C", labelKey: "colorCrimson" as const },
] as const;

export type AccentPresetId = (typeof ACCENT_PRESETS)[number]["id"];

const STORAGE_KEY = "nexus-accent-color";
const DEFAULT_ID: AccentPresetId = "default";

type AccentColorContextType = {
  accentId: AccentPresetId;
  accentColor: string;
  setAccentId: (id: AccentPresetId) => void;
};

const AccentColorContext = createContext<AccentColorContextType>({
  accentId: DEFAULT_ID,
  accentColor: ACCENT_PRESETS[0].color,
  setAccentId: () => {},
});

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
  const [accentId, setAccentIdState] = useState<AccentPresetId>(DEFAULT_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(STORAGE_KEY) as AccentPresetId | null;
    if (saved && ACCENT_PRESETS.some((p) => p.id === saved)) {
      setAccentIdState(saved);
    }
  }, []);

  const setAccentId = useCallback((id: AccentPresetId) => {
    setAccentIdState(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const preset = ACCENT_PRESETS.find((p) => p.id === accentId) ?? ACCENT_PRESETS[0];
  const accentColor = mounted ? preset.color : ACCENT_PRESETS[0].color;

  return (
    <AccentColorContext.Provider value={{ accentId, accentColor, setAccentId }}>
      {children}
    </AccentColorContext.Provider>
  );
}

export function useAccentColor() {
  return useContext(AccentColorContext);
}
