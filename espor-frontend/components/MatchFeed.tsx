"use client";

import { useState } from "react";
import MatchList from "./MatchList";
import MatchDetail from "./MatchDetail";
import RightSidebar from "./RightSidebar";

export default function MatchFeed({ initialMatches }: { initialMatches: any[] }) {
  // Bütün state (hafıza) yönetimi ana bileşende durur, parçalara buradan dağıtılır.
  const [selectedGame, setSelectedGame] = useState("Tümü");
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  // Veriyi burada filtreliyoruz, sadece filtrelenmiş veriyi sol listeye gönderiyoruz.
  const filteredMatches = selectedGame === "Tümü" 
    ? initialMatches 
    : initialMatches.filter((match) => match?.tournament?.game?.name === selectedGame);

  return (
    <div className="flex flex-col lg:flex-row gap-4 max-w-[1600px] mx-auto">
      
      {/* 1. SOL SÜTUN */}
      <MatchList 
        matches={filteredMatches} 
        selectedGame={selectedGame} 
        setSelectedGame={setSelectedGame}
        selectedMatch={selectedMatch}
        setSelectedMatch={setSelectedMatch}
      />

      {/* 2. ORTA SÜTUN */}
      <MatchDetail 
        selectedMatch={selectedMatch} 
        setSelectedMatch={setSelectedMatch} 
      />

      {/* 3. SAĞ SÜTUN */}
      <RightSidebar />

    </div>
  );
}