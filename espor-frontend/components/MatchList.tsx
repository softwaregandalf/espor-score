// Left Side Bar.
"use client";

import { Star } from "lucide-react";

type MatchListProps = {
  matches: any[];
  selectedGame: string;
  setSelectedGame: (game: string) => void;
  selectedMatch: any;
  setSelectedMatch: (match: any) => void;
};

export default function MatchList({ matches, selectedGame, setSelectedGame, selectedMatch, setSelectedMatch }: MatchListProps) {
  const games = [
    { label: 'Tümü', dbName: 'Tümü', icon: '🎮' },
    { label: 'CS2', dbName: 'Counter-Strike 2', icon: '🔫' },
    { label: 'Valorant', dbName: 'Valorant', icon: '🎯' },
    { label: 'LoL', dbName: 'League of Legends', icon: '🪄' },
    { label: 'DOTA 2', dbName: 'DOTA 2', icon: '🛡️' }
  ];

  return (
    <div className={`w-full lg:w-4/12 xl:w-3/12 flex-col gap-3 ${selectedMatch ? 'hidden lg:flex' : 'flex'}`}>
      
      {/* Oyun Filtreleri */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar bg-slate-800/40 p-2 rounded-lg border border-slate-700/50">
        {games.map((game) => (
          <button 
            key={game.label}
            onClick={() => { setSelectedGame(game.dbName); setSelectedMatch(null); }}
            className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              selectedGame === game.dbName 
              ? 'bg-slate-700 text-white shadow-sm' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{game.icon}</span>{game.label}
          </button>
        ))}
      </div>

      {/* Maç Kartları */}
      <div className="flex flex-col gap-3">
        {matches.length === 0 ? (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-6 text-center text-sm text-slate-400">Maç bulunamadı.</div>
        ) : (
          matches.map((match: any) => (
            <div key={match.id} className="bg-slate-800/40 rounded-lg border border-slate-700/50 overflow-hidden">
              <div className="bg-slate-800/80 px-3 py-2 border-b border-slate-700/50 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-300">{match?.tournament?.name || "Bilinmeyen Turnuva"}</span>
              </div>
              <div 
                onClick={() => setSelectedMatch(match)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-all ${
                  selectedMatch?.id === match.id ? 'bg-slate-700/50 border-l-4 border-l-blue-500' : 'hover:bg-slate-700/30 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex flex-col gap-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{match?.team1?.acronym || "TBA"}</span>
                    <span className="font-bold text-sm text-white">{match?.team1Score ?? "-"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-200">{match?.team2?.acronym || "TBA"}</span>
                    <span className="font-bold text-sm text-white">{match?.team2Score ?? "-"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between ml-4 h-full border-l border-slate-700/50 pl-3">
                  <Star size={14} className="text-slate-600 hover:text-yellow-500 transition-colors" />
                  {match?.status === "LIVE" && <span className="text-[9px] text-red-500 font-bold animate-pulse mt-2">MS</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}