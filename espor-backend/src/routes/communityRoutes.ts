import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  listThreads,
  createThread,
  getThreadById,
  addComment,
  voteThread,
  deleteComment,
  deleteThread,
} from '../services/communityService';

export default function communityRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get('/', async (_req, res) => {
    try {
      const data = await listThreads(prisma);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Konular çekilirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Topluluk verileri çekilemedi.' });
    }
  });

  router.post('/', async (req, res) => {
    const { title, content, category, gameSlug, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({ success: false, message: 'Başlık, içerik ve kullanıcı kimliği zorunludur.' });
    }

    try {
      const data = await createThread(prisma, { title, content, category, gameSlug, authorId });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Konu oluşturulurken hata:', error.message);
      res.status(500).json({ success: false, message: 'Konu oluşturulamadı.' });
    }
  });

  router.get('/:id', async (req, res) => {
    const threadId = parseInt(req.params.id);

    if (isNaN(threadId)) {
      return res.status(400).json({ success: false, message: 'Geçersiz konu ID.' });
    }

    try {
      const data = await getThreadById(prisma, threadId);
      if (!data) {
        return res.status(404).json({ success: false, message: 'Konu bulunamadı.' });
      }
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Konu detayı çekilirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Konu detayı çekilemedi.' });
    }
  });

  router.post('/:id/comments', async (req, res) => {
    const threadId = parseInt(req.params.id);
    const { content, authorId } = req.body;

    if (isNaN(threadId) || !content || !authorId) {
      return res.status(400).json({ success: false, message: 'Eksik veya geçersiz veri.' });
    }

    try {
      const data = await addComment(prisma, threadId, content, authorId);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error('Yorum eklenirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Yorum eklenemedi.' });
    }
  });

  router.post('/:id/vote', async (req, res) => {
    const threadId = parseInt(req.params.id);
    const { userId, value } = req.body;

    if (!userId || !value) {
      return res.status(400).json({ success: false, message: 'Kullanıcı ID ve Oy değeri zorunludur.' });
    }

    try {
      await voteThread(prisma, threadId, userId, value);
      res.status(200).json({ success: true, message: 'Oy işlemi başarılı.' });
    } catch (error: any) {
      console.error('Oy verme işleminde hata:', error.message);
      res.status(500).json({ success: false, message: 'Oy işlemi tamamlanamadı.' });
    }
  });

  router.delete('/:id/comments/:commentId', async (req, res) => {
    const threadId = parseInt(req.params.id);
    const commentId = parseInt(req.params.commentId);
    const { userId } = req.body;

    if (isNaN(threadId) || isNaN(commentId)) {
      return res.status(400).json({ success: false, message: 'Geçersiz konu veya yorum ID.' });
    }

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Kullanıcı kimliği doğrulanmadı.' });
    }

    try {
      await deleteComment(prisma, threadId, commentId, userId);
      res.status(200).json({ success: true, message: 'Yorum başarıyla silindi.' });
    } catch (error: any) {
      if (error.message === 'COMMENT_NOT_FOUND') {
        return res.status(404).json({ success: false, message: 'Yorum bulunamadı.' });
      }
      if (error.message === 'FORBIDDEN') {
        return res.status(403).json({ success: false, message: 'Bu yorumu silme yetkiniz yok.' });
      }
      console.error('Yorum silinirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Yorum silinemedi.' });
    }
  });

  router.delete('/:id', async (req, res) => {
    const threadId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Kullanıcı kimliği doğrulanmadı.' });
    }

    try {
      await deleteThread(prisma, threadId, userId);
      res.status(200).json({ success: true, message: 'Konu ve bağlı veriler başarıyla silindi.' });
    } catch (error: any) {
      if (error.message === 'THREAD_NOT_FOUND') {
        return res.status(404).json({ success: false, message: 'Konu bulunamadı.' });
      }
      if (error.message === 'FORBIDDEN') {
        return res.status(403).json({ success: false, message: 'Bu konuyu silme yetkiniz yok.' });
      }
      console.error('Konu silinirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Konu silinemedi.' });
    }
  });

  return router;
}
