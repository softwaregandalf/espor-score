import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  getFavoriteMatchIds,
  toggleFavoriteMatch,
  mergeLocalFavoritesToUser,
} from '../services/favoriteMatchesService';

export default function favoriteRoutes(prisma: PrismaClient) {
  const router = Router({ mergeParams: true });

  // GET /api/users/:userId/favorites
  router.get('/', async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Kullanıcı kimliği zorunludur.' });
    }

    try {
      const matchIds = await getFavoriteMatchIds(prisma, userId);
      res.status(200).json({ success: true, data: { matchIds } });
    } catch (error: any) {
      console.error('Favori maçlar çekilirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Favori maçlar çekilemedi.' });
    }
  });

  // POST /api/users/:userId/favorites/toggle
  router.post('/toggle', async (req, res) => {
    const userId = req.params.userId;
    const { matchId, email, nickname, avatarUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Kullanıcı kimliği zorunludur.' });
    }

    if (!matchId) {
      return res.status(400).json({ success: false, message: 'Maç kimliği zorunludur.' });
    }

    try {
      const result = await toggleFavoriteMatch(
        prisma,
        userId,
        matchId,
        { email, nickname, avatarUrl }
      );
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }
      if (error.message === 'INVALID_MATCH_ID') {
        return res.status(400).json({ success: false, message: 'Geçersiz maç kimliği.' });
      }
      console.error('Favori maç güncellenirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Favori maç güncellenemedi.' });
    }
  });

  // POST /api/users/:userId/favorites/merge — tarayıcıdaki misafir favorilerini birleştirir
  router.post('/merge', async (req, res) => {
    const userId = req.params.userId;
    const { matchIds, email, nickname, avatarUrl } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Kullanıcı kimliği zorunludur.' });
    }

    if (!Array.isArray(matchIds)) {
      return res.status(400).json({ success: false, message: 'Geçersiz favori listesi.' });
    }

    try {
      const result = await mergeLocalFavoritesToUser(
        prisma,
        userId,
        matchIds,
        { email, nickname, avatarUrl }
      );
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      if (error.message === 'USER_NOT_FOUND') {
        return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı.' });
      }
      console.error('Misafir favorileri birleştirilirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Favoriler birleştirilemedi.' });
    }
  });

  return router;
}
