import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

export default function communityRoutes(prisma: PrismaClient) {
  const router = Router();

  // 🌍 1. TÜM KONULARI GETİR (Community Hub Listesi İçin)
  // GET /api/community
  router.get('/', async (req, res) => {
    try {
      const threads = await prisma.thread.findMany({
        orderBy: { createdAt: 'desc' }, 
        include: {
          author: { select: { nickname: true, avatarUrl: true, role: true } },
          _count: { select: { comments: true } },
          votes: true 
        }
      });

      const formattedThreads = threads.map(thread => ({
        id: thread.id,
        title: thread.title,
        content: thread.content,
        category: thread.category,
        gameSlug: thread.gameSlug,
        createdAt: thread.createdAt,
        timeAgo: new Date(thread.createdAt).toLocaleDateString(), 
        author: thread.author,
        commentCount: thread._count.comments,
        upvotes: thread.votes.reduce((total, vote) => total + vote.value, 0)
      }));

      res.status(200).json({ success: true, data: formattedThreads });
    } catch (error: any) {
      console.error("Konular çekilirken hata:", error.message);
      res.status(500).json({ success: false, message: 'Topluluk verileri çekilemedi.' });
    }
  });

  // ✍️ 2. YENİ KONU OLUŞTUR
  // POST /api/community
  router.post('/', async (req, res) => {
    const { title, content, category, gameSlug, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ success: false, message: 'Başlık, içerik ve kullanıcı kimliği zorunludur.' });
    }

    try {
      const newThread = await prisma.thread.create({
        data: {
          title,
          content,
          category: category || 'general', 
          gameSlug: gameSlug || 'all',     
          authorId: authorId,
        }
      });

      await prisma.vote.create({
        data: { value: 1, threadId: newThread.id, userId: authorId }
      });

      res.status(201).json({ success: true, data: newThread });
    } catch (error: any) {
      console.error("Konu oluşturulurken hata:", error.message);
      res.status(500).json({ success: false, message: 'Konu oluşturulamadı.' });
    }
  });

  // 📖 3. TEK BİR KONUYU VE YORUMLARINI GETİR (Konu Detay Sayfası İçin) YENİ! 🚀
  // GET /api/community/:id
  router.get('/:id', async (req, res) => {
    const threadId = parseInt(req.params.id);

    if (isNaN(threadId)) {
      return res.status(400).json({ success: false, message: 'Geçersiz konu ID.' });
    }

    try {
      const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        include: {
          author: { select: { nickname: true, avatarUrl: true, role: true } },
          votes: true,
          comments: {
            orderBy: { createdAt: 'asc' }, // Eski yorumlar üstte (geleneksel forum mantığı)
            include: {
              author: { select: { nickname: true, avatarUrl: true, role: true } }
            }
          }
        }
      });

      if (!thread) {
        return res.status(404).json({ success: false, message: 'Konu bulunamadı.' });
      }

      // Frontend'in okuyacağı şık formata çeviriyoruz
      const formattedThread = {
        id: thread.id,
        title: thread.title,
        content: thread.content,
        category: thread.category,
        gameSlug: thread.gameSlug,
        createdAt: thread.createdAt,
        timeAgo: new Date(thread.createdAt).toLocaleDateString(),
        author: thread.author,
        upvotes: thread.votes.reduce((total, vote) => total + vote.value, 0),
        comments: thread.comments.map(c => ({
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          timeAgo: new Date(c.createdAt).toLocaleDateString(),
          author: c.author
        }))
      };

      res.status(200).json({ success: true, data: formattedThread });
    } catch (error: any) {
      console.error("Konu detayı çekilirken hata:", error.message);
      res.status(500).json({ success: false, message: 'Konu detayı çekilemedi.' });
    }
  });

  // 💬 4. KONUYA YENİ YORUM EKLE YENİ! 🚀
  // POST /api/community/:id/comments
  router.post('/:id/comments', async (req, res) => {
    const threadId = parseInt(req.params.id);
    const { content, authorId } = req.body;

    if (isNaN(threadId) || !content || !authorId) {
      return res.status(400).json({ success: false, message: 'Eksik veya geçersiz veri.' });
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          content,
          threadId,
          authorId
        },
        include: {
          author: { select: { nickname: true, avatarUrl: true, role: true } }
        }
      });

      // Yorum eklendikten sonra anında ekrana basılması için formatlanmış haliyle geri dönüyoruz
      const formattedComment = {
        id: newComment.id,
        content: newComment.content,
        createdAt: newComment.createdAt,
        timeAgo: new Date(newComment.createdAt).toLocaleDateString(),
        author: newComment.author
      };

      res.status(201).json({ success: true, data: formattedComment });
    } catch (error: any) {
      console.error("Yorum eklenirken hata:", error.message);
      res.status(500).json({ success: false, message: 'Yorum eklenemedi.' });
    }
  });

  // ⬆️⬇️ 5. OY KULLANMA (UPVOTE / DOWNVOTE)
  // POST /api/community/:id/vote
  router.post('/:id/vote', async (req, res) => {
    const threadId = parseInt(req.params.id);
    const { userId, value } = req.body; 

    if (!userId || !value) {
      return res.status(400).json({ success: false, message: 'Kullanıcı ID ve Oy değeri zorunludur.' });
    }

    try {
      const existingVote = await prisma.vote.findUnique({
        where: { threadId_userId: { threadId, userId } }
      });

      if (existingVote) {
        if (existingVote.value === value) {
          await prisma.vote.delete({ where: { id: existingVote.id } });
        } else {
          await prisma.vote.update({
            where: { id: existingVote.id },
            data: { value }
          });
        }
      } else {
        await prisma.vote.create({
          data: { value, threadId, userId }
        });
      }

      res.status(200).json({ success: true, message: 'Oy işlemi başarılı.' });
    } catch (error: any) {
      console.error("Oy verme işleminde hata:", error.message);
      res.status(500).json({ success: false, message: 'Oy işlemi tamamlanamadı.' });
    }
  });

  return router;
}