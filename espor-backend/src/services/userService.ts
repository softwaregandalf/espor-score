import { PrismaClient } from '@prisma/client';

export type UserProfileInput = {
  email: string;
  nickname: string;
  avatarUrl?: string | null;
};

export async function ensureUser(
  prisma: PrismaClient,
  userId: string,
  profile?: Partial<UserProfileInput>
) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (existing) return existing;

  if (!profile?.email || !profile?.nickname) {
    return null;
  }

  return prisma.user.create({
    data: {
      id: userId,
      email: profile.email,
      nickname: profile.nickname,
      avatarUrl: profile.avatarUrl ?? null,
    },
  });
}
