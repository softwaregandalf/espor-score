import { PrismaClient } from '@prisma/client';
import { ensureUser, UserProfileInput } from './userService';

function assertMatchId(matchId: string) {
  if (!matchId || typeof matchId !== 'string') {
    throw new Error('INVALID_MATCH_ID');
  }
}

export async function getFavoriteMatchIds(
  prisma: PrismaClient,
  userId: string
): Promise<string[]> {
  const favorites = await prisma.matchFavorite.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { matchId: true },
  });
  return favorites.map((f) => f.matchId);
}

export async function toggleFavoriteMatch(
  prisma: PrismaClient,
  userId: string,
  matchId: string,
  profile?: UserProfileInput
) {
  assertMatchId(matchId);

  const user = await ensureUser(prisma, userId, profile);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const existing = await prisma.matchFavorite.findUnique({
    where: { userId_matchId: { userId, matchId } },
  });

  if (existing) {
    await prisma.matchFavorite.delete({ where: { id: existing.id } });
    const matchIds = await getFavoriteMatchIds(prisma, userId);
    return { favorited: false, matchIds };
  }

  await prisma.matchFavorite.create({
    data: { userId, matchId },
  });

  const matchIds = await getFavoriteMatchIds(prisma, userId);
  return { favorited: true, matchIds };
}

export async function mergeLocalFavoritesToUser(
  prisma: PrismaClient,
  userId: string,
  matchIds: string[],
  profile?: UserProfileInput
) {
  const user = await ensureUser(prisma, userId, profile);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const uniqueIds = [...new Set(matchIds.filter((id) => typeof id === 'string' && id.length > 0))];

  if (uniqueIds.length === 0) {
    const existing = await getFavoriteMatchIds(prisma, userId);
    return { matchIds: existing, mergedCount: 0 };
  }

  await prisma.$transaction(async (tx) => {
    for (const matchId of uniqueIds) {
      await tx.matchFavorite.upsert({
        where: { userId_matchId: { userId, matchId } },
        create: { userId, matchId },
        update: {},
      });
    }
  });

  const merged = await getFavoriteMatchIds(prisma, userId);
  return { matchIds: merged, mergedCount: uniqueIds.length };
}
