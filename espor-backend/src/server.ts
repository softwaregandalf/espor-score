import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { createServer } from 'http';
import { Server } from 'socket.io';
import axios from 'axios'; // Dışarıdan veri çekmek için eklendi
import userRoutes from './routes/userRoutes';
import communityRoutes from './routes/communityRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// PandaScore API Ayarları
const PANDASCORE_API = 'https://api.pandascore.co';
const TOKEN = process.env.PANDASCORE_TOKEN;

// HTTP ve Socket.io Sunucu Kurulumu
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes(prisma));
app.use('/api/users/:userId/favorites', favoriteRoutes(prisma));
app.use('/api/community', communityRoutes(prisma));

// WebSockets Bağlantı Dinleyicisi
io.on("connection", (socket) => {
  console.log("🟢 Yeni bir istemci (tarayıcı) bağlandı:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔴 İstemci ayrıldı:", socket.id);
  });
});

// Temel Sağlık Testi
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'E-Spor Global API çalışıyor.' });
});

// 🏆 TÜM MAÇLARI GETİREN API UÇ NOKTASI
app.get('/api/matches', async (req, res) => {
  try {
    const matches = await prisma.match.findMany({
      orderBy: { startTime: 'asc' }, 
      include: {
        team1: { include: { players: true } },
        team2: { include: { players: true } },
        tournament: { include: { game: true } }
      }
    });
    res.status(200).json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Veriler çekilemedi.' });
  }
});

// 🏆 DÜNYA SIRALAMASI API UÇ NOKTASI
app.get('/api/rankings', async (req, res) => {
  try {
    const teams = await prisma.team.findMany({ take: 5 });
    const rankedTeams = teams.map((team, index) => ({
      rank: index + 1,
      name: team.name,
      acronym: team.acronym,
      points: 1000 - (index * 50)
    }));
    res.status(200).json({ success: true, data: rankedTeams });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Sıralama çekilemedi.' });
  }
});

// 🤖 GERÇEK CANLI SKOR BOTU (CRON JOB)
// Her 60 saniyede (60000 ms) bir PandaScore'u kontrol eder
setInterval(async () => {
  try {
    // Sadece "Live" (canlı oynanan) maçları PandaScore'dan çekiyoruz
    const response = await axios.get(`${PANDASCORE_API}/csgo/matches`, {
      params: { 'filter[status]': 'running' },
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    const liveMatches = response.data;

    // Gelen canlı maçları kendi veritabanımızla karşılaştırıyoruz
    for (const match of liveMatches) {
      const existingMatch = await prisma.match.findUnique({ where: { id: match.id } });

      if (existingMatch) {
        const newTeam1Score = match.results[0]?.score || 0;
        const newTeam2Score = match.results[1]?.score || 0;

        // Eğer PandaScore'daki skor, bizim veritabanımızdaki skordan farklıysa (skor değişmişse)
        if (existingMatch.team1Score !== newTeam1Score || existingMatch.team2Score !== newTeam2Score) {
          
          // 1. Veritabanını güncelle
          const updatedMatch = await prisma.match.update({
            where: { id: match.id },
            data: { team1Score: newTeam1Score, team2Score: newTeam2Score }
          });

          // 2. Arayüze WebSockets ile anında bildir
          io.emit("scoreUpdate", { 
            matchId: updatedMatch.id, 
            team1Score: updatedMatch.team1Score, 
            team2Score: updatedMatch.team2Score 
          });
          
          console.log(`📢 GERÇEK Skor Güncellendi: Maç ID ${updatedMatch.id} | ${updatedMatch.team1Score} - ${updatedMatch.team2Score}`);
        }
      }
    }
  } catch (error: any) {
    console.error("Gerçek canlı skor kontrolünde hata:", error?.message);
  }
}, 60000); // Ücretsiz API limitlerine takılmamak için 60 saniyede bir kontrol ediyoruz

const portNumber = Number(PORT);
httpServer.listen(portNumber, '0.0.0.0', () => {
  console.log(`🚀 Sunucu ${portNumber} portunda başarıyla ayağa kalktı. (Gerçek Veri Botu Aktif)`);
});