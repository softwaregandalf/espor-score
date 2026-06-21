"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Language = 'tr' | 'en';

export const translations = {
  en: {
    liveMatches: "Live Matches",
    results: "Results",
    tournaments: "Tournaments",
    teams: "Teams",
    topPlayer: "Top Player",
    news: "News",
    community: "Community",
    games: "Games",
    menu: "Menu",
    adminUser: "Admin User",
    proMember: "PRO Member",
    searchPlaceholder: "Search team, tournament or player...",
    searchMatch: "Search match or team...",
    communityForum: "COMMUNITY (FORUM)",
    sponsored: "SPONSORED",
    seeMore: "SEE MORE",
    live: "LIVE",
    upcoming: "UPCOMING",
    finishedToday: "FINISHED TODAY",
    favorites: "FAVORITES",
    favoriteMatchesTitle: "Favorite Matches", // 🚀 YENİ
    notification: "NOTIFICATION",
    now: "NOW",
    backToMain: "BACK TO MAIN FEED",
    overview: "OVERVIEW",
    lineups: "LINEUPS & VETO",
    statistics: "STATISTICS",
    matchInfo: "Match Information",
    tournament: "Tournament",
    stage: "Stage",
    format: "Format",
    location: "Location",
    prizePool: "Prize Pool",
    teamForm: "Team Form (Last 5)",
    liveStreams: "Live Streams",
    officialStream: "Official Stream",
    dayOn: "Day: ON",
    nightOn: "Night: ON",
    // 🚀 TABLO VE SEÇİM EKRANI İÇİN YENİLER
    picks: "Picks",
    gameStr: "Game",
    completed: "COMPLETED",
    player: "PLAYER",
    champion: "CHAMPION",
    gold: "GOLD",
    vision: "VISION"
  },
  tr: {
    liveMatches: "Canlı Maçlar",
    results: "Sonuçlar",
    tournaments: "Turnuvalar",
    teams: "Takımlar",
    topPlayer: "Top Player",
    news: "Haberler",
    community: "Topluluk",
    games: "Oyunlar",
    menu: "Menü",
    adminUser: "Admin User",
    proMember: "PRO Üye",
    searchPlaceholder: "Takım, turnuva veya oyuncu ara...",
    searchMatch: "Maç veya takım ara...",
    communityForum: "TOPLULUK (FORUM)",
    sponsored: "SPONSORLU",
    seeMore: "DAHA FAZLA BİLGİ",
    live: "CANLI",
    upcoming: "YAKLAŞAN",
    finishedToday: "BUGÜN BİTENLER",
    favorites: "FAVORİLER",
    favoriteMatchesTitle: "Favori Maçlarım", // 🚀 YENİ
    notification: "BİLDİRİMİ",
    now: "ŞİMDİ",
    backToMain: "ANA AKIŞA DÖN",
    overview: "GENEL BAKIŞ",
    lineups: "KADROLAR & VETO",
    statistics: "İSTATİSTİKLER",
    matchInfo: "Maç Bilgileri",
    tournament: "Turnuva",
    stage: "Aşama",
    format: "Format",
    location: "Konum",
    prizePool: "Ödül Havuzu",
    teamForm: "Takım Formu (Son 5)",
    liveStreams: "Canlı Yayınlar",
    officialStream: "Resmi Yayın",
    dayOn: "Gündüz: AÇIK",
    nightOn: "Gece: AÇIK",
    // 🚀 TABLO VE SEÇİM EKRANI İÇİN YENİLER
    picks: "Seçimleri",
    gameStr: "Oyun",
    completed: "TAMAMLANDI",
    player: "OYUNCU",
    champion: "ŞAMPİYON",
    gold: "ALTIN",
    vision: "GÖRÜŞ"
  }
};

const apiTermDictionary: Record<string, string> = {
  "Regular Season": "Normal Sezon",
  "Group Stage": "Grup Aşaması",
  "Playoffs": "Playofflar",
  "Quarterfinals": "Çeyrek Final",
  "Semifinals": "Yarı Final",
  "Grand Final": "Büyük Final",
  "Week": "Hafta",
  "Day": "Gün",
  "Qualifier": "Elemeler",
  "Global (Online)": "Global (Çevrimiçi)"
};

export type TranslationKeys = keyof typeof translations.en;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  translateApiText: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  translateApiText: (text) => text,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('nexus-lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.toLowerCase();
      setLanguageState(browserLang.startsWith('tr') ? 'tr' : 'en');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nexus-lang', lang);
  };

  const translateApiText = useCallback((text: string | undefined) => {
    if (!text) return "";
    if (language === 'en') return text;
    
    let translatedText = text;
    Object.keys(apiTermDictionary).forEach(term => {
      const regex = new RegExp(term, "gi");
      translatedText = translatedText.replace(regex, apiTermDictionary[term]);
    });
    return translatedText;
  }, [language]);

  if (!mounted) return <div style={{ visibility: 'hidden' }}>{children}</div>;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], translateApiText }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);