"use client";

import { useState } from "react";
import { LIVE_MATCHES, UPCOMING_MATCHES, COMPLETED_MATCHES } from "@/app/data/mockData";
import RightSidebar from "./RightSidebar"; 
import NewsFeed from "./NewsFeed"; 
import MatchListSidebar from "./MatchListSidebar"; 
import MatchDetail from "./MatchDetail"; // 🚀 İŞTE YENİ BİLEŞENİMİZ!
import { useLanguage } from "./LanguageProvider";

export default function LiveDashboard() {
  const { t } = useLanguage();
  
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['Live', 'Upcoming', 'Finished']);
  
  const selectedMatch = selectedMatchId ? [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES].find(m => m.id === selectedMatchId) : null;

  const SECTIONS = [
    { label: 'Live', title: t.live, matches: LIVE_MATCHES, color: '#EF4444' },
    { label: 'Upcoming', title: t.upcoming, matches: UPCOMING_MATCHES, color: '#4D7CFE' },
    { label: 'Finished', title: t.finishedToday, matches: COMPLETED_MATCHES.slice(0, 2), color: 'var(--es-text-3)' },
  ];

  return (
    <div className="flex flex-row w-full h-full overflow-hidden" style={{ background: 'var(--es-bg)' }}>
      
      {/* 1. SOL MENÜ MODÜLÜ */}
      <MatchListSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        expandedSections={expandedSections}
        setExpandedSections={setExpandedSections}
        sections={SECTIONS}
        selectedMatchId={selectedMatchId}
        onMatchSelect={setSelectedMatchId}
      />

      {/* 2. ORTA EKRAN MODÜLÜ (Eğer maç seçiliyse MatchDetail'i, değilse Haberleri açar) */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {!selectedMatch ? (
          <NewsFeed />
        ) : (
          <MatchDetail 
            selectedMatch={selectedMatch} 
            onBack={() => setSelectedMatchId(null)} 
          />
        )}
      </div>
      
      {/* 3. SAĞ MENÜ MODÜLÜ */}
      <RightSidebar />
      
    </div>
  );
}