import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Prisma 7 Sürücü Adaptörü Kurulumu
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(helmet());
app.use(cors());
app.use(express.json());

// Temel Sağlık Testi
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'E-Spor Global API çalışıyor.' });
});

// 🏆 CANLI MAÇLARI GETİREN API UÇ NOKTASI
app.get('/api/matches/live', async (req, res) => {
  try {
    const liveMatches = await prisma.match.findMany({
      where: { status: 'Live' },
      include: {
        team1: true,
        team2: true,
        tournament: {
          include: { game: true }
        }
      }
    });
    
    res.status(200).json({ success: true, data: liveMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Veriler çekilemedi.' });
  }
});

const portNumber = Number(PORT);
app.listen(portNumber, '0.0.0.0', () => {
  console.log(`🚀 Sunucu ${portNumber} portunda başarıyla ayağa kalktı.`);
});