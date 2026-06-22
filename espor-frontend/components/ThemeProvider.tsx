"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  // 🚀 TIER 1 DÜZELTME: useEffect ve mounted gecikmesi tamamen kaldırıldı!
  // Böylece next-themes'in script etiketi istemcide değil, sunucuda (SSR) güvenle derlenecek.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}