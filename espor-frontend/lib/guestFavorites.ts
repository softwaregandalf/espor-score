const STORAGE_KEY = 'nexus_guest_favorite_matches';

function readIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === 'string' && id.length > 0);
  } catch {
    return [];
  }
}

export function getGuestFavoriteMatchIds(): string[] {
  return readIds();
}

export function setGuestFavoriteMatchIds(matchIds: string[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...new Set(matchIds)]));
}

export function toggleGuestFavoriteMatchId(matchId: string): string[] {
  const next = new Set(readIds());
  if (next.has(matchId)) next.delete(matchId);
  else next.add(matchId);
  const ids = [...next];
  setGuestFavoriteMatchIds(ids);
  return ids;
}

export function clearGuestFavoriteMatchIds(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function hasGuestFavoriteMatchIds(): boolean {
  return readIds().length > 0;
}
