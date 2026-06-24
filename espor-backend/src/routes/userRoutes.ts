import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { getUserProfile } from '../services/profileService';

export default function userRoutes(prisma: PrismaClient) {
  const router = Router();

  router.get('/:id/profile', async (req, res) => {
    const userId = req.params.id;

    try {
      const data = await getUserProfile(prisma, userId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error('Profil verileri çekilirken hata:', error.message);
      res.status(500).json({ success: false, message: 'Profil istatistikleri çekilemedi.' });
    }
  });

  return router;
}
