import { PrismaClient } from '@prisma/client';

export async function getUserProfile(prisma: PrismaClient, userId: string) {
  const threadsCount = await prisma.thread.count({ where: { authorId: userId } });
  const commentsCount = await prisma.comment.count({ where: { authorId: userId } });

  const upvotesData = await prisma.vote.aggregate({
    where: { thread: { authorId: userId }, value: 1 },
    _sum: { value: true },
  });
  const totalUpvotes = upvotesData._sum.value || 0;

  const recentThreads = await prisma.thread.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { votes: { where: { value: 1 } } },
  });

  const recentComments = await prisma.comment.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: { thread: { select: { title: true } } },
  });

  const activities = [
    ...recentThreads.map((t) => ({
      id: `t_${t.id}`,
      threadId: t.id,
      type: 'thread' as const,
      title: t.title,
      createdAt: t.createdAt,
      time: new Date(t.createdAt).toLocaleDateString(),
      upvotes: t.votes.length,
    })),
    ...recentComments.map((c) => ({
      id: `c_${c.id}`,
      threadId: c.threadId,
      type: 'comment' as const,
      title: `Re: ${c.thread.title}`,
      createdAt: c.createdAt,
      time: new Date(c.createdAt).toLocaleDateString(),
      upvotes: 0,
    })),
  ];

  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    stats: {
      threads: threadsCount,
      comments: commentsCount,
      upvotes: totalUpvotes,
    },
    recentActivity: activities.slice(0, 3),
  };
}
