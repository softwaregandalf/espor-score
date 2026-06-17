import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PANDASCORE_API = 'https://api.pandascore.co';
const TOKEN = process.env.PANDASCORE_TOKEN;

// Gerçekçi isim havuzları
const cs2Maps = ["Mirage", "Inferno", "Nuke", "Overpass", "Vertigo", "Ancient", "Anubis"];
const valoMaps = ["Ascent", "Bind", "Haven", "Split", "Icebox", "Breeze", "Lotus"];
const lolChamps = ["Ahri", "Lee Sin", "Jinx", "Thresh", "Yasuo", "Aatrox", "Sylas"];

async function syncTeamPlayers(teamId: number, gameId: number) {
  try {
    const res = await axios.get(`${PANDASCORE_API}/teams/${teamId}`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const players = res.data.players || [];
    for (const p of players) {
      await prisma.player.upsert({
        where: { id: p.id }, update: { imageUrl: p.image_url },
        create: { id: p.id, teamId: teamId, gameId: gameId, nickname: p.name, firstName: p.first_name, lastName: p.last_name, nationality: p.nationality, imageUrl: p.image_url }
      });
    }
    return players;
  } catch (error) { return []; }
}

async function syncTargetedMatches() {
  try {
    console.log('📡 GÖRSEL TEST MODU: 3 Oyun için Gerçekçi Detaylar Çekiliyor...');

    const gamesToFetch = ['csgo', 'valorant', 'lol']; 
    
    for (const apiSlug of gamesToFetch) {
      const res = await axios.get(`${PANDASCORE_API}/${apiSlug}/matches`, {
        params: { 'filter[status]': 'finished', 'sort': '-end_at', 'per_page': 3 },
        headers: { Authorization: `Bearer ${TOKEN}` }
      });

      for (const match of res.data) {
        if (!match.opponents || match.opponents.length < 2) continue;

        let dbSlug = apiSlug;
        let dbName = match.videogame.name;
        if (apiSlug === 'csgo') { dbSlug = 'cs2'; dbName = 'CS2'; }
        if (apiSlug === 'lol') { dbSlug = 'LoL'; dbName = 'LoL'; }
        if (apiSlug === 'valorant') { dbSlug = 'Valorant'; dbName = 'Valorant'; }

        const game = await prisma.game.upsert({
          where: { slug: dbSlug }, update: {}, create: { name: dbName, slug: dbSlug }
        });

        const team1Data = match.opponents[0].opponent;
        const team2Data = match.opponents[1].opponent;

        const team1 = await prisma.team.upsert({
          where: { id: team1Data.id }, update: { logoUrl: team1Data.image_url, name: team1Data.name },
          create: { id: team1Data.id, gameId: game.id, name: team1Data.name, acronym: team1Data.acronym || team1Data.name.substring(0, 3).toUpperCase(), logoUrl: team1Data.image_url }
        });

        const team2 = await prisma.team.upsert({
          where: { id: team2Data.id }, update: { logoUrl: team2Data.image_url, name: team2Data.name },
          create: { id: team2Data.id, gameId: game.id, name: team2Data.name, acronym: team2Data.acronym || team2Data.name.substring(0, 3).toUpperCase(), logoUrl: team2Data.image_url }
        });

        const tournament = await prisma.tournament.upsert({
          where: { id: match.league.id }, update: { status: 'Finished' },
          create: {
            id: match.league.id, gameId: game.id, name: `${match.league.name} ${match.serie?.name || ''}`.trim(),
            startDate: new Date(match.begin_at || new Date()), endDate: new Date(match.end_at || new Date()), status: 'Finished'
          }
        });

        const team1Players = await syncTeamPlayers(team1.id, game.id);
        const team2Players = await syncTeamPlayers(team2.id, game.id);

        let matchGameDetails = { type: dbSlug, data: {} as any };

        // 🏆 HİPER-GERÇEKÇİ TEST VERİSİ ÜRETİMİ
        if (dbSlug === 'cs2') {
          matchGameDetails.data = {
            maps: [1, 2, 3].slice(0, Math.floor(Math.random() * 2) + 2).map((_, i) => ({ 
              mapName: cs2Maps[Math.floor(Math.random() * cs2Maps.length)], 
              team1Score: Math.floor(Math.random() * 5) + 13, 
              team2Score: Math.floor(Math.random() * 11) 
            }))
          };
        } 
        else if (dbSlug === 'Valorant') {
          matchGameDetails.data = {
            maps: [1, 2, 3].slice(0, Math.floor(Math.random() * 2) + 2).map((_, i) => ({ 
              mapName: valoMaps[Math.floor(Math.random() * valoMaps.length)], 
              team1Score: Math.floor(Math.random() * 5) + 13, 
              team2Score: Math.floor(Math.random() * 11) 
            })),
            topFragger: { 
              nickname: team1Players[0]?.nickname || "TenZ", 
              agent: ["Jett", "Raze", "Reyna", "Omen"][Math.floor(Math.random() * 4)], 
              kda: `${Math.floor(Math.random() * 10) + 18}/${Math.floor(Math.random() * 8) + 8}/${Math.floor(Math.random() * 8) + 3}`, 
              combatScore: Math.floor(Math.random() * 80) + 220 
            }
          };
        } 
        else if (dbSlug === 'LoL') {
          matchGameDetails.data = {
            matchDuration: `${Math.floor(Math.random() * 15) + 25}:${Math.floor(Math.random() * 50) + 10}`,
            team1Stats: { gold: `${(Math.random() * 20 + 50).toFixed(1)}k`, towers: Math.floor(Math.random() * 5) + 6, dragons: Math.floor(Math.random() * 3) + 2, barons: Math.floor(Math.random() * 2) },
            team2Stats: { gold: `${(Math.random() * 20 + 40).toFixed(1)}k`, towers: Math.floor(Math.random() * 4), dragons: Math.floor(Math.random() * 2), barons: 0 },
            mvpPlayer: { 
              nickname: team1Players[0]?.nickname || "Faker", 
              champion: lolChamps[Math.floor(Math.random() * lolChamps.length)], 
              kda: `${Math.floor(Math.random() * 8) + 6}/${Math.floor(Math.random() * 3) + 1}/${Math.floor(Math.random() * 10) + 6}` 
            }
          };
        }

        await prisma.match.upsert({
          where: { id: match.id },
          update: { gameDetails: matchGameDetails },
          create: {
            id: match.id, tournamentId: tournament.id, team1Id: team1.id, team2Id: team2.id,
            status: 'Finished', team1Score: match.results[0]?.score || 0, team2Score: match.results[1]?.score || 0,
            startTime: new Date(match.begin_at || new Date()),
            mvpNickname: team1Players[0]?.nickname || "Belirlenmedi",
            mvpRating: parseFloat((Math.random() * (1.45 - 1.05) + 1.05).toFixed(2)),
            gameDetails: matchGameDetails
          }
        });
      }
    }
    console.log('🎉 Bütün oyunlar harika test verileriyle güncellendi!');
  } catch (error) { console.error('❌ Hata:', error); } finally { await prisma.$disconnect(); }
}

syncTargetedMatches();