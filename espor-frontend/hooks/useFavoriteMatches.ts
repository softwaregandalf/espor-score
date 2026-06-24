"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import {
  clearGuestFavoriteMatchIds,
  getGuestFavoriteMatchIds,
  hasGuestFavoriteMatchIds,
  toggleGuestFavoriteMatchId,
} from "@/lib/guestFavorites";
import {
  fetchFavoriteMatchIds,
  mergeLocalFavoritesToUser,
  toggleFavoriteMatch,
} from "@/services/favoriteMatchesService";

function getUserProfile(user: User) {
  const nickname =
    (user.user_metadata?.nickname as string | undefined) ||
    user.email?.split("@")[0] ||
    "player";

  return {
    email: user.email || `${user.id}@nexus.local`,
    nickname,
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
  };
}

export function useFavoriteMatches(user: User | null, isAuthLoading: boolean) {
  const [favoriteMatchIds, setFavoriteMatchIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    let cancelled = false;

    const loadFavorites = async () => {
      if (!user) {
        setFavoriteMatchIds(new Set(getGuestFavoriteMatchIds()));
        return;
      }

      setIsLoading(true);
      try {
        const localIds = getGuestFavoriteMatchIds();
        const matchIds =
          localIds.length > 0
            ? await mergeLocalFavoritesToUser(user.id, localIds, getUserProfile(user))
            : await fetchFavoriteMatchIds(user.id);

        if (localIds.length > 0) {
          clearGuestFavoriteMatchIds();
        }

        if (!cancelled) {
          setFavoriteMatchIds(new Set(matchIds));
        }
      } catch (error) {
        console.error("Favori maçlar yüklenemedi:", error);
        if (!cancelled) {
          const fallback = hasGuestFavoriteMatchIds()
            ? getGuestFavoriteMatchIds()
            : [];
          setFavoriteMatchIds(new Set(fallback));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, [user, isAuthLoading]);

  const toggleFavorite = useCallback(
    async (matchId: string): Promise<boolean> => {
      const previous = new Set(favoriteMatchIds);
      const optimistic = new Set(favoriteMatchIds);
      if (optimistic.has(matchId)) optimistic.delete(matchId);
      else optimistic.add(matchId);
      setFavoriteMatchIds(optimistic);

      if (!user) {
        const matchIds = toggleGuestFavoriteMatchId(matchId);
        setFavoriteMatchIds(new Set(matchIds));
        return true;
      }

      setIsToggling(true);
      try {
        const result = await toggleFavoriteMatch(user.id, matchId, getUserProfile(user));
        setFavoriteMatchIds(new Set(result.matchIds));
        return true;
      } catch (error) {
        console.error("Favori güncellenemedi:", error);
        setFavoriteMatchIds(previous);
        return false;
      } finally {
        setIsToggling(false);
      }
    },
    [user, favoriteMatchIds]
  );

  return {
    favoriteMatchIds,
    isLoading,
    isToggling,
    toggleFavorite,
  };
}
