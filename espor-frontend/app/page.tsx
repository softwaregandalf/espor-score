import MatchFeed from "@/components/MatchFeed";
import { Suspense } from "react";

// Server-Side Fetch: Backend'den Maçları Çekiyoruz
async function getMatches() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/matches", { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("API'ye bağlanılamadı:", error);
    return [];
  }
}

// Server-Side Fetch: Backend'den Sıralamayı Çekiyoruz
async function getRankings() {
  try {
    const res = await fetch("http://127.0.0.1:5000/api/rankings", { 
      cache: "no-store" 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Sıralama API'ye bağlanılamadı:", error);
    return [];
  }
}

export default async function Home() {
  const matches = await getMatches();
  const rankings = await getRankings();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] pt-6 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Client Component içerisindeki URL okuma işlemleri için Suspense şarttır */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-64 text-slate-400 font-bold">
          E-Spor Arenası Yükleniyor...
        </div>
      }>
        <MatchFeed initialMatches={matches} rankings={rankings} />
      </Suspense>
    </main>
  );
}