import MatchFeed from "@/components/MatchFeed";

async function getLiveMatches() {
  try {
    const res = await fetch('http://localhost:5000/api/matches/live', { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()).data;
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const matches = await getLiveMatches();

  return (
    <div className="min-h-screen pb-20 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <MatchFeed initialMatches={matches} />
      </main>
    </div>
  );
}