"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import MatchList from "./MatchList";
import MatchDetail from "./MatchDetail";
import RightSidebar from "./RightSidebar";

export default function MatchFeed({ initialMatches, rankings }: { initialMatches: any[], rankings: any[] }) {
  const [matches, setMatches] = useState(initialMatches);
  const [selectedGame, setSelectedGame] = useState("Tümü");
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000");
    socket.on("connect", () => console.log("🟢 WebSockets bağlandı!"));
    socket.on("scoreUpdate", (data) => {
      setMatches((prev) => prev.map((m) => m.id === data.matchId ? { ...m, team1Score: data.team1Score, team2Score: data.team2Score } : m));
      setSelectedMatch((prev: any) => (prev && prev.id === data.matchId) ? { ...prev, team1Score: data.team1Score, team2Score: data.team2Score } : prev);
    });
    return () => { socket.disconnect(); };
  }, []);

  // 🚀 AKILLI FİLTRELEME: Buton ismi ne olursa olsun doğru veritabanı tipini bulur
  const filteredMatches = matches.filter((match: any) => {
    if (selectedGame === "Tümü") return statusFilter ? match.status === statusFilter : true;
    
    const target = selectedGame.toLowerCase().trim();
    let mappedTarget = target;
    
    // UI'dan "CS:GO", "CS 2", "Counter" ne gelirse gelsin 'cs2' ile eşleştir
    if (target.includes("cs") || target.includes("counter")) mappedTarget = "cs2";
    // UI'dan "League of Legends", "LoL" ne gelirse gelsin 'lol' ile eşleştir
    if (target.includes("lol") || target.includes("league")) mappedTarget = "lol";
    // Valorant eşleştirmesi
    if (target.includes("val")) mappedTarget = "valorant";

    const matchType = match.gameDetails?.type?.toLowerCase() || "";
    const gameMatch = matchType === mappedTarget;
    
    const statusMatch = statusFilter ? match.status === statusFilter : true;
    return gameMatch && statusMatch;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 max-w-[1600px] mx-auto">
      <MatchList 
        matches={filteredMatches} 
        selectedGame={selectedGame} 
        setSelectedGame={setSelectedGame}
        selectedMatch={selectedMatch}
        setSelectedMatch={setSelectedMatch}
      />
      <MatchDetail selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} />
      <RightSidebar rankings={rankings} />
    </div>
  );
}