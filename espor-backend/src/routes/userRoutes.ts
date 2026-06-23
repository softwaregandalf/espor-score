import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

export default function userRoutes(prisma: PrismaClient) {
  const router = Router();

  // GET /api/users/:id/profile
  router.get('/:id/profile', async (req, res) => {
    const userId = req.params.id;

    try {
      const threadsCount = await prisma.thread.count({ where: { authorId: userId } });
      const commentsCount = await prisma.comment.count({ where: { authorId: userId } });

      const upvotesData = await prisma.vote.aggregate({
        where: { thread: { authorId: userId }, value: 1 },
        _sum: { value: true }
      });
      const totalUpvotes = upvotesData._sum.value || 0;

      const recentThreads = await prisma.thread.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { votes: { where: { value: 1 } } } 
      });

      const recentComments = await prisma.comment.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: { thread: { select: { title: true } } } 
      });

      const activities = [
        ...recentThreads.map(t => ({
          id: `t_${t.id}`,
          threadId: t.id, // 🚀 DÜZELTME: Tıklanınca gidilecek konu ID'si eklendi
          type: 'thread',
          title: t.title,
          createdAt: t.createdAt,
          time: new Date(t.createdAt).toLocaleDateString(), 
          upvotes: t.votes.length 
        })),
        ...recentComments.map(c => ({
          id: `c_${c.id}`,
          threadId: c.threadId, // 🚀 DÜZELTME: Yorumun ait olduğu konu ID'si eklendi
          type: 'comment',
          title: `Re: ${c.thread.title}`,
          createdAt: c.createdAt,
          time: new Date(c.createdAt).toLocaleDateString(),
          upvotes: 0 
        }))
      ];

      activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      const top3Activities = activities.slice(0, 3);

      res.status(200).json({
        success: true,
        data: {
          stats: {
            threads: threadsCount,
            comments: commentsCount,
            upvotes: totalUpvotes
          },
          recentActivity: top3Activities
        }
      });

    } catch (error: any) {
      console.error("Profil verileri çekilirken hata:", error.message);
      res.status(500).json({ success: false, message: 'Profil istatistikleri çekilemedi.' });
    }
  });

  return router;
}