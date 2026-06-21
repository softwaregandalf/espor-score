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

  const filteredMatches = matches.filter((match: any) => {
    if (selectedGame === "Tümü") return statusFilter ? match.status === statusFilter : true;
    
    const target = selectedGame.toLowerCase().trim();
    let mappedTarget = target;
    
    if (target.includes("cs") || target.includes("counter")) mappedTarget = "cs2";
    if (target.includes("lol") || target.includes("league")) mappedTarget = "lol";
    if (target.includes("val")) mappedTarget = "valorant";

    const matchType = match.gameDetails?.type?.toLowerCase() || "";
    const gameMatch = matchType === mappedTarget;
    
    const statusMatch = statusFilter ? match.status === statusFilter : true;
    return gameMatch && statusMatch;
  });

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full max-w-[1800px] mx-auto h-auto xl:h-[calc(100vh-100px)] min-h-0">
      <div className="w-full xl:w-[320px] flex-shrink-0 flex flex-col min-h-[500px] xl:min-h-0">
        <MatchList 
          matches={filteredMatches} 
          selectedGame={selectedGame} 
          setSelectedGame={setSelectedGame}
          selectedMatch={selectedMatch}
          setSelectedMatch={setSelectedMatch} 
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 min-h-[600px] xl:min-h-0">
        <MatchDetail 
          selectedMatch={selectedMatch} 
          setSelectedMatch={setSelectedMatch} 
        />
      </div>

      <div className="w-full xl:w-[300px] flex-shrink-0 flex-col min-h-0 hidden xl:flex">
        <RightSidebar rankings={rankings} />
      </div>
    </div>
  );
}