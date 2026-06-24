import { apiFetch } from '@/lib/api';

type FavoritesResponse = {
  success: true;
  data: { matchIds: string[] };
};

type ToggleFavoriteResponse = {
  success: true;
  data: { favorited: boolean; matchIds: string[] };
};

type MergeFavoritesResponse = {
  success: true;
  data: { matchIds: string[]; mergedCount: number };
};

export type UserFavoriteProfile = {
  email: string;
  nickname: string;
  avatarUrl?: string | null;
};

export async function fetchFavoriteMatchIds(userId: string): Promise<string[]> {
  const res = await apiFetch<FavoritesResponse>(`/api/users/${userId}/favorites`);
  return res.data.matchIds;
}

export async function toggleFavoriteMatch(
  userId: string,
  matchId: string,
  profile: UserFavoriteProfile
): Promise<{ favorited: boolean; matchIds: string[] }> {
  const res = await apiFetch<ToggleFavoriteResponse>(`/api/users/${userId}/favorites/toggle`, {
    method: 'POST',
    body: JSON.stringify({ matchId, ...profile }),
  });
  return res.data;
}

export async function mergeLocalFavoritesToUser(
  userId: string,
  matchIds: string[],
  profile: UserFavoriteProfile
): Promise<string[]> {
  if (matchIds.length === 0) {
    return fetchFavoriteMatchIds(userId);
  }

  const res = await apiFetch<MergeFavoritesResponse>(`/api/users/${userId}/favorites/merge`, {
    method: 'POST',
    body: JSON.stringify({ matchIds, ...profile }),
  });
  return res.data.matchIds;
}
