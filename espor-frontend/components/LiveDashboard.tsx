"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LIVE_MATCHES, UPCOMING_MATCHES, COMPLETED_MATCHES } from "@/app/data/mockData";
import RightSidebar from "./RightSidebar"; 
import NewsFeed from "./NewsFeed"; 
import MatchListSidebar from "./MatchListSidebar"; 
import MatchDetail from "./MatchDetail";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { useFavoriteMatches } from "@/hooks/useFavoriteMatches";

const SWIPE_CLOSE_THRESHOLD = 72;
const MOBILE_HEADER_OFFSET = 70;
const MOBILE_PANEL_WIDTH = 'min(calc(100vw - 3rem), 100%)';

export default function LiveDashboard() {
  const { t } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { favoriteMatchIds, toggleFavorite } = useFavoriteMatches(user, isAuthLoading);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(() => {
    if (typeof window === 'undefined') return ['Live', 'Upcoming'];
    return window.matchMedia('(max-width: 1023px)').matches ? ['Live'] : ['Live', 'Upcoming'];
  });
  const [showMobileMatchList, setShowMobileMatchList] = useState(false);
  const [panelOffset, setPanelOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  
  const selectedMatch = selectedMatchId ? [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES].find(m => m.id === selectedMatchId) : null;

  const SECTIONS = [
    { label: 'Live', title: t.live, matches: LIVE_MATCHES, color: '#EF4444' },
    { label: 'Upcoming', title: t.upcoming, matches: UPCOMING_MATCHES, color: '#4D7CFE' },
    { label: 'Finished', title: t.finishedToday, matches: COMPLETED_MATCHES.slice(0, 2), color: 'var(--es-text-3)' },
  ];

  useEffect(() => {
    if (favoriteMatchIds.size > 0) {
      setExpandedSections((prev) =>
        prev.includes('Favorites') ? prev : [...prev, 'Favorites']
      );
    }
  }, [favoriteMatchIds]);

  const closeMobileMatchList = useCallback(() => {
    setShowMobileMatchList(false);
    setPanelOffset(0);
    setIsDragging(false);
    isDraggingRef.current = false;
    if (searchParams.get('showMatchList') === 'true') {
      router.replace('/', { scroll: false });
    }
  }, [router, searchParams]);

  const openMobileMatchList = useCallback(() => {
    setShowMobileMatchList(true);
    setPanelOffset(0);
  }, []);

  useEffect(() => {
    const showMatchList = searchParams.get('showMatchList') === 'true';
    setShowMobileMatchList(showMatchList);
    if (showMatchList) setPanelOffset(0);
  }, [searchParams]);

  useEffect(() => {
    const handleOpen = () => openMobileMatchList();
    window.addEventListener('open-mobile-match-list', handleOpen);
    return () => window.removeEventListener('open-mobile-match-list', handleOpen);
  }, [openMobileMatchList]);

  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    const onTouchStart = (e: TouchEvent) => {
      if (!showMobileMatchList) return;
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      isDraggingRef.current = true;
      setIsDragging(true);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !showMobileMatchList) return;
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      if (Math.abs(dx) > Math.abs(dy) && dx < 0) {
        e.preventDefault();
        setPanelOffset(dx);
      }
    };

    const onTouchEnd = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      setIsDragging(false);
      setPanelOffset((current) => {
        if (current < -SWIPE_CLOSE_THRESHOLD) {
          closeMobileMatchList();
          return 0;
        }
        return 0;
      });
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchmove', onTouchMove, { passive: false });
    panel.addEventListener('touchend', onTouchEnd);
    panel.addEventListener('touchcancel', onTouchEnd);

    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchmove', onTouchMove);
      panel.removeEventListener('touchend', onTouchEnd);
      panel.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [showMobileMatchList, closeMobileMatchList]);

  const mobilePanelTransform = showMobileMatchList
    ? `translateX(${Math.min(0, panelOffset)}px)`
    : 'translateX(-100%)';

  const handleToggleFavorite = (matchId: string) => {
    void toggleFavorite(matchId);
  };

  const sidebarProps = {
    searchQuery,
    setSearchQuery,
    expandedSections,
    setExpandedSections,
    sections: SECTIONS,
    selectedMatchId,
    favoriteMatchIds,
    onToggleFavorite: handleToggleFavorite,
  };

  return (
    <div className="flex flex-row w-full h-full overflow-hidden relative" style={{ background: 'var(--es-bg)' }}>
      
      {/* Masaüstü sol maç listesi */}
      <div className="hidden lg:block shrink-0">
        <MatchListSidebar 
          {...sidebarProps}
          onMatchSelect={(id) => setSelectedMatchId(id)}
          isMobile={false}
        />
      </div>

      {/* Orta alan — mobilde her zaman görünür (akış / maç detayı) */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10 min-w-0">
        {!selectedMatch ? (
          <NewsFeed />
        ) : (
          <MatchDetail 
            selectedMatch={selectedMatch} 
            onBack={() => setSelectedMatchId(null)} 
          />
        )}
      </div>

      {/* Mobil maç listesi + sağ tıklanabilir alan (akışa dön) */}
      <div
        className="lg:hidden fixed left-0 right-0 bottom-0 z-[35]"
        style={{
          top: MOBILE_HEADER_OFFSET,
          pointerEvents: showMobileMatchList ? 'auto' : 'none',
        }}
        aria-hidden={!showMobileMatchList}
      >
        {/* Sağdaki boşluk / arka plan — tıklanınca panel kapanır */}
        <button
          type="button"
          onClick={closeMobileMatchList}
          className="absolute inset-0 w-full h-full transition-opacity duration-300"
          style={{
            opacity: showMobileMatchList ? 1 : 0,
            background: 'rgba(0,0,0,0.25)',
          }}
          aria-label={t.swipeToCloseMatches}
          tabIndex={showMobileMatchList ? 0 : -1}
        />

        {/* Soldan kayan maç listesi paneli */}
        <div
          ref={mobilePanelRef}
          className="absolute left-0 top-0 bottom-0 z-10 flex flex-col overflow-hidden shadow-2xl"
          style={{
            width: MOBILE_PANEL_WIDTH,
            transform: mobilePanelTransform,
            transition: isDragging ? 'none' : 'transform 0.28s cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'transform',
            background: 'var(--es-bg-2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <MatchListSidebar 
            {...sidebarProps}
            onMatchSelect={(id) => {
              setSelectedMatchId(id);
              closeMobileMatchList();
            }}
            isMobile
            onClose={closeMobileMatchList}
            swipeHint={t.swipeToCloseMatches}
          />
        </div>
      </div>
      
      {/* Sağ sidebar */}
      <div className="hidden xl:block shrink-0">
        <RightSidebar />
      </div>
      
    </div>
  );
}
