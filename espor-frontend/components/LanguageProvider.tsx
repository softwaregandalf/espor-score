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
    favoriteMatchesTitle: "Favorite Matches",
    notification: "NOTIFICATION",
    now: "NOW",
    backToMain: "BACK TO MAIN FEED",
    backToResults: "BACK TO RESULTS",
    overview: "OVERVIEW",
    lineups: "LINEUPS & VETO",
    statistics: "STATISTICS",
    matchInfo: "Match Information",
    tournament: "Tournament",
    stage: "Stage",
    format: "Format",
    location: "LOCATION",
    prizePool: "PRIZE POOL",
    teamForm: "Team Form (Last 5)",
    liveStreams: "Live Streams",
    officialStream: "Official Stream",
    dayOn: "Day: ON",
    nightOn: "Night: ON",
    picks: "Picks",
    gameStr: "Game",
    completed: "COMPLETED",
    player: "PLAYER",
    champion: "CHAMPION",
    gold: "GOLD",
    vision: "VISION",
    resultsArchiveTitle: "Match Results Archive",
    resultsArchiveDesc: "All past esports matches, detailed statistics, and P&B analysis.",
    all: "ALL",
    view: "VIEW",
    sponsoredRecommendation: "SPONSORED RECOMMENDATION",
    betPromoTitle: "Join BetArena for Betting Odds and Live Analysis!",
    betPromoDesc: "A special 1000 TL welcome bonus awaits new members.",
    playNow: "PLAY NOW",
    vetoStage: "VETO STAGE",
    map: "MAP",
    agent: "AGENT",
    role: "ROLE",
    hero: "HERO",
    banned: "Banned",
    picked: "Picked",
    left: "Left",
    statsCompiling: "In-match comparative statistics are being compiled...",
    tournamentsTitle: "Esports Tournaments",
    tournamentsDesc: "Follow official leagues, championships, and qualifiers worldwide.",
    ongoingTourneys: "ONGOING",
    upcomingTourneys: "UPCOMING",
    completedTourneys: "CONCLUDED",
    date: "DATE",
    teamCount: "TEAMS",
    tournamentDetails: "TOURNAMENT DETAILS",
    teamsText: "Teams"
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
    favoriteMatchesTitle: "Favori Maçlarım",
    notification: "BİLDİRİMİ",
    now: "ŞİMDİ",
    backToMain: "ANA AKIŞA DÖN",
    backToResults: "SONUÇLARA DÖN",
    overview: "GENEL BAKIŞ",
    lineups: "KADROLAR & VETO",
    statistics: "İSTATİSTİKLER",
    matchInfo: "Maç Bilgileri",
    tournament: "Turnuva",
    stage: "Aşama",
    format: "Format",
    location: "KONUM",
    prizePool: "ÖDÜL HAVUZU",
    teamForm: "Takım Formu (Son 5)",
    liveStreams: "Canlı Yayınlar",
    officialStream: "Resmi Yayın",
    dayOn: "Gündüz: AÇIK",
    nightOn: "Gece: AÇIK",
    picks: "Seçimleri",
    gameStr: "Oyun",
    completed: "TAMAMLANDI",
    player: "OYUNCU",
    champion: "ŞAMPİYON",
    gold: "ALTIN",
    vision: "GÖRÜŞ",
    resultsArchiveTitle: "Maç Sonuçları Arşivi",
    resultsArchiveDesc: "Geçmiş tüm e-spor karşılaşmaları, detaylı istatistikler ve P&B analizleri.",
    all: "TÜMÜ",
    view: "GÖRÜNTÜLE",
    sponsoredRecommendation: "SPONSORLU TAVSİYE",
    betPromoTitle: "Bahis Oranları ve Canlı Analizler için BetArena'ya Katıl!",
    betPromoDesc: "Yeni üyelere özel 1000 TL hoşgeldin bonusu seni bekliyor.",
    playNow: "ŞİMDİ OYNA",
    vetoStage: "VETO AŞAMASI",
    map: "HARİTA",
    agent: "AJAN",
    role: "ROL",
    hero: "KAHRAMAN",
    banned: "Yasakladı",
    picked: "Seçti",
    left: "Kaldı",
    statsCompiling: "Maç içi karşılaştırmalı istatistikler derleniyor...",
    tournamentsTitle: "E-Spor Turnuvaları",
    tournamentsDesc: "Dünya çapındaki resmi ligleri, şampiyonaları ve eleme aşamalarını takip edin.",
    ongoingTourneys: "DEVAM EDENLER",
    upcomingTourneys: "YAKLAŞANLAR",
    completedTourneys: "SONUÇLANANLAR",
    date: "TARİH",
    teamCount: "TAKIM SAYISI",
    tournamentDetails: "TURNUVA DETAYLARI",
    teamsText: "Takım"
  }
};

const apiTermDictionary: Record<string, string> = {
  "Regular Season": "Normal Sezon",
  "Group Stage": "Grup Aşaması",
  "Playoffs": "Playofflar",
  "Qualifier": "Elemeler",
  "Global (Online)": "Global (Çevrimiçi)",
  "Tier": "Seviye", 
  
  // 🚀 TURNUVA AŞAMALARI (BRACKET) EKLENDİ
  "Quarterfinal": "Çeyrek Final",
  "Quarterfinals": "Çeyrek Final",
  "Çeyrek Final": "Çeyrek Final", // Mock veride Türkçe yazılmış olabilir diye koruma
  "Semifinal": "Yarı Final",
  "Semifinals": "Yarı Final",
  "Yarı Final": "Yarı Final",
  "Grand Final": "Büyük Final",
  "Grand Finals": "Büyük Final",
  "Büyük Final": "Büyük Final",
  
  "January": "Ocak", "February": "Şubat", "March": "Mart", "April": "Nisan", 
  "May": "Mayıs", "June": "Haziran", "July": "Temmuz", "August": "Ağustos", 
  "September": "Eylül", "October": "Ekim", "November": "Kasım", "December": "Aralık",
  "Jan": "Oca", "Feb": "Şub", "Mar": "Mar", "Apr": "Nis", "Jun": "Haz", 
  "Jul": "Tem", "Aug": "Ağu", "Sep": "Eyl", "Oct": "Eki", "Nov": "Kas", "Dec": "Ara"
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
    // Çakışmaları önlemek için uzun kelimeleri önce çeviriyoruz
    const terms = Object.keys(apiTermDictionary).sort((a, b) => b.length - a.length);
    terms.forEach(term => {
      const regex = new RegExp(`\\b${term}\\b`, "gi"); 
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