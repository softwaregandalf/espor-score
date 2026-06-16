import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

// Prisma 7 Sürücü Adaptörü Kurulumu
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Veritabanına test verileri ekleniyor...');

  // 1. Oyunları Ekle
  const cs2 = await prisma.game.create({
    data: { name: 'Counter-Strike 2', slug: 'cs2' }
  });

  await prisma.game.create({
    data: { name: 'Valorant', slug: 'valorant' }
  });

  // 2. Takımları Ekle
  const team1 = await prisma.team.create({
    data: { gameId: cs2.id, name: 'Natus Vincere', acronym: 'NAVI', logoUrl: 'navi.png' }
  });
  
  const team2 = await prisma.team.create({
    data: { gameId: cs2.id, name: 'FaZe Clan', acronym: 'FAZE', logoUrl: 'faze.png' }
  });

  // 3. Turnuva Ekle
  const tournament = await prisma.tournament.create({
    data: {
      gameId: cs2.id,
      name: 'PGL Major 2026',
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 
      status: 'Live'
    }
  });

  // 4. Canlı Bir Maç Ekle
  await prisma.match.create({
    data: {
      tournamentId: tournament.id,
      team1Id: team1.id,
      team2Id: team2.id,
      status: 'Live',
      team1Score: 11,
      team2Score: 9,
      startTime: new Date()
    }
  });

  console.log('✅ Test verileri (CS2 Maçı) başarıyla eklendi!');
}

main()
  .catch((e) => {
    console.error('Hata oluştu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });