export type GameId = 'lol' | 'val' | 'cs2' | 'dota2' | 'r6' | 'rl' | 'mlbb' | 'pubg';

export interface Game {
  id: GameId;
  name: string;
  short: string;
  color: string;
  accent: string;
  bg: string;
}

export const GAMES: Game[] = [
  { id: 'lol', name: 'League of Legends', short: 'LoL', color: '#C89B3C', accent: '#0BC4E3', bg: '#0A1628' },
  { id: 'val', name: 'VALORANT', short: 'VAL', color: '#FF4655', accent: '#ECE8E1', bg: '#1F1C23' },
  { id: 'cs2', name: 'Counter-Strike 2', short: 'CS2', color: '#F59E0B', accent: '#FDBA74', bg: '#1A1200' },
  { id: 'dota2', name: 'Dota 2', short: 'DOTA', color: '#B9202C', accent: '#F98637', bg: '#1A0800' },
  { id: 'r6', name: 'Rainbow Six Siege', short: 'R6', color: '#009BDE', accent: '#B3E5FC', bg: '#001D2F' },
  { id: 'rl', name: 'Rocket League', short: 'RL', color: '#2979FF', accent: '#82B1FF', bg: '#0A1030' },
  { id: 'mlbb', name: 'Mobile Legends', short: 'ML', color: '#F5A623', accent: '#FFD54F', bg: '#1A0A00' },
  { id: 'pubg', name: 'PUBG', short: 'PBG', color: '#F2A900', accent: '#FFD740', bg: '#1A1000' },
];

export interface Team {
  id: string;
  name: string;
  short: string;
  color: string;
  region: string;
  logo?: string;
}

export interface MapResult {
  name: string;
  score1: number;
  score2: number;
  winner: 1 | 2;
  duration?: string;
}

export interface Match {
  id: string;
  game: GameId;
  tournament: string;
  tournamentShort: string;
  stage: string;
  format: 'BO1' | 'BO3' | 'BO5';
  team1: Team & { score: number; maps?: MapResult[] };
  team2: Team & { score: number; maps?: MapResult[] };
  status: 'live' | 'upcoming' | 'completed';
  scheduledTime: string;
  viewers?: string;
  duration?: string;
  mvp?: string;
  gameTime?: string;
  currentMap?: string;
  currentRound?: number;
  prizePool?: string;
  venue?: string;
  streams?: { platform: string; viewers: string }[];
}

export const TEAMS: Team[] = [
  { id: 't1', name: 'T1', short: 'T1', color: '#E84057', region: 'KR' },
  { id: 'geng', name: 'Gen.G', short: 'GEN', color: '#C8A96A', region: 'KR' },
  { id: 'hle', name: 'Hanwha Life', short: 'HLE', color: '#FF6B1C', region: 'KR' },
  { id: 'dk', name: 'Dplus KIA', short: 'DK', color: '#00A3FF', region: 'KR' },
  { id: 'g2', name: 'G2 Esports', short: 'G2', color: '#6BFF57', region: 'EU' },
  { id: 'fnc', name: 'Fnatic', short: 'FNC', color: '#FF7B00', region: 'EU' },
  { id: 'kc', name: 'Karmine Corp', short: 'KC', color: '#4DBBFF', region: 'EU' },
  { id: 'sen', name: 'Sentinels', short: 'SEN', color: '#AC323F', region: 'NA' },
  { id: 'nrg', name: 'NRG', short: 'NRG', color: '#FF4500', region: 'NA' },
  { id: 'c9', name: 'Cloud9', short: 'C9', color: '#3BA3DC', region: 'NA' },
  { id: 'navi', name: 'Natus Vincere', short: 'NAVI', color: '#F5CF00', region: 'EU' },
  { id: 'faze', name: 'FaZe Clan', short: 'FAZ', color: '#CF3517', region: 'EU' },
  { id: 'spirit', name: 'Team Spirit', short: 'SPR', color: '#00BFFF', region: 'EU' },
  { id: 'vit', name: 'Vitality', short: 'VIT', color: '#FFD60A', region: 'EU' },
  { id: 'prx', name: 'Paper Rex', short: 'PRX', color: '#00FFCC', region: 'APAC' },
  { id: 'loud', name: 'LOUD', short: 'LOU', color: '#66FF00', region: 'SA' },
];

export const LIVE_MATCHES: Match[] = [
  {
    id: 'lck-t1-geng-1',
    game: 'lol',
    tournament: 'LCK Summer 2026',
    tournamentShort: 'LCK',
    stage: 'Regular Season — Week 5',
    format: 'BO3',
    team1: { ...TEAMS[0], score: 1, maps: [{ name: 'Game 1', score1: 1, score2: 0, winner: 1, duration: '28:43' }] },
    team2: { ...TEAMS[1], score: 0 },
    status: 'live',
    scheduledTime: 'LIVE',
    viewers: '187K',
    gameTime: '34:21',
    currentMap: 'Game 2',
    prizePool: '$400,000',
    venue: 'LoL Park, Seoul',
    streams: [{ platform: 'Twitch', viewers: '112K' }, { platform: 'YouTube', viewers: '75K' }],
  },
  {
    id: 'vct-sen-fnc-1',
    game: 'val',
    tournament: 'VCT Masters Shanghai',
    tournamentShort: 'VCT',
    stage: 'Grand Finals',
    format: 'BO5',
    team1: { ...TEAMS[7], score: 2, maps: [
      { name: 'Ascent', score1: 13, score2: 7, winner: 1 },
      { name: 'Bind', score1: 10, score2: 13, winner: 2 },
      { name: 'Haven', score1: 1, score2: 0, winner: 1, duration: 'Live' }
    ] },
    team2: { ...TEAMS[5], score: 1 },
    status: 'live',
    scheduledTime: 'LIVE',
    viewers: '214K',
    currentMap: 'Haven',
    currentRound: 17,
    prizePool: '$1,000,000',
    venue: 'QIZHONG Arena, Shanghai',
    streams: [{ platform: 'Twitch', viewers: '140K' }, { platform: 'YouTube', viewers: '74K' }],
  },
  {
    id: 'cs2-navi-faze-1',
    game: 'cs2',
    tournament: 'IEM Dallas 2026',
    tournamentShort: 'IEM',
    stage: 'Quarterfinals',
    format: 'BO3',
    team1: { ...TEAMS[10], score: 0 },
    team2: { ...TEAMS[11], score: 1, maps: [{ name: 'Mirage', score1: 8, score2: 16, winner: 2, duration: '48:15' }] },
    status: 'live',
    scheduledTime: 'LIVE',
    viewers: '98K',
    currentMap: 'Ancient',
    currentRound: 22,
    prizePool: '$250,000',
    venue: 'Kay Bailey, Dallas',
    streams: [{ platform: 'Twitch', viewers: '98K' }],
  },
];

export const UPCOMING_MATCHES: Match[] = [
  {
    id: 'lck-hle-dk-1',
    game: 'lol',
    tournament: 'LCK Summer 2026',
    tournamentShort: 'LCK',
    stage: 'Regular Season — Week 5',
    format: 'BO3',
    team1: { ...TEAMS[2], score: 0 },
    team2: { ...TEAMS[3], score: 0 },
    status: 'upcoming',
    scheduledTime: '18:00',
    prizePool: '$400,000',
    venue: 'LoL Park, Seoul',
  },
  {
    id: 'vct-prx-loud-1',
    game: 'val',
    tournament: 'VCT Masters Shanghai',
    tournamentShort: 'VCT',
    stage: 'Semifinals',
    format: 'BO5',
    team1: { ...TEAMS[14], score: 0 },
    team2: { ...TEAMS[15], score: 0 },
    status: 'upcoming',
    scheduledTime: '20:30',
    prizePool: '$1,000,000',
    venue: 'QIZHONG Arena, Shanghai',
  },
  {
    id: 'cs2-spirit-vit-1',
    game: 'cs2',
    tournament: 'IEM Dallas 2026',
    tournamentShort: 'IEM',
    stage: 'Semifinals',
    format: 'BO3',
    team1: { ...TEAMS[12], score: 0 },
    team2: { ...TEAMS[13], score: 0 },
    status: 'upcoming',
    scheduledTime: '22:00',
    prizePool: '$250,000',
    venue: 'Kay Bailey, Dallas',
  },
  {
    id: 'lol-g2-kc-1',
    game: 'lol',
    tournament: 'LEC Summer 2026',
    tournamentShort: 'LEC',
    stage: 'Playoffs R1',
    format: 'BO5',
    team1: { ...TEAMS[4], score: 0 },
    team2: { ...TEAMS[6], score: 0 },
    status: 'upcoming',
    scheduledTime: '23:00',
    prizePool: '$200,000',
    venue: 'Berlin Arena',
  },
];

export const COMPLETED_MATCHES: Match[] = [
  {
    id: 'cs2-nrg-c9-fin',
    game: 'cs2',
    tournament: 'IEM Dallas 2026',
    tournamentShort: 'IEM',
    stage: 'Round of 16',
    format: 'BO3',
    team1: { ...TEAMS[8], score: 2, maps: [
      { name: 'Dust2', score1: 16, score2: 11, winner: 1, duration: '45:12' },
      { name: 'Mirage', score1: 8, score2: 16, winner: 2, duration: '42:38' },
      { name: 'Nuke', score1: 16, score2: 13, winner: 1, duration: '51:22' },
    ]},
    team2: { ...TEAMS[9], score: 1, maps: [] },
    status: 'completed',
    scheduledTime: 'Finished',
    duration: '2:19:12',
    mvp: 'ropz',
  },
  {
    id: 'val-g2-kc-fin',
    game: 'val',
    tournament: 'VCT EMEA 2026',
    tournamentShort: 'VCT',
    stage: 'Upper Bracket Finals',
    format: 'BO3',
    team1: { ...TEAMS[4], score: 2 },
    team2: { ...TEAMS[6], score: 0 },
    status: 'completed',
    scheduledTime: 'Finished',
    duration: '1:45:33',
    mvp: 'nukkye',
  },
  {
    id: 'lol-t1-hle-fin',
    game: 'lol',
    tournament: 'LCK Summer 2026',
    tournamentShort: 'LCK',
    stage: 'Regular Season',
    format: 'BO3',
    team1: { ...TEAMS[0], score: 2 },
    team2: { ...TEAMS[2], score: 1 },
    status: 'completed',
    scheduledTime: 'Finished',
    duration: '1:52:18',
    mvp: 'Faker',
  },
];

export const ALL_MATCHES = [...LIVE_MATCHES, ...UPCOMING_MATCHES, ...COMPLETED_MATCHES];

export interface Tournament {
  id: string;
  name: string;
  short: string;
  game: GameId;
  gameLabel: string;
  stage: string;
  prizePool: string;
  startDate: string;
  endDate: string;
  location: string;
  teams: number;
  status: 'live' | 'upcoming' | 'completed';
  featured?: boolean;
}

export const TOURNAMENTS: Tournament[] = [
  { id: 'worlds-2026', name: 'Worlds 2026', short: 'WORLDS', game: 'lol', gameLabel: 'League of Legends', stage: 'Group Stage', prizePool: '$2,225,000', startDate: 'Sep 28', endDate: 'Nov 2', location: 'Seoul, South Korea', teams: 24, status: 'upcoming', featured: true },
  { id: 'vct-masters-shanghai', name: 'VCT Masters Shanghai', short: 'VCT MST', game: 'val', gameLabel: 'VALORANT', stage: 'Grand Finals', prizePool: '$1,000,000', startDate: 'Jun 10', endDate: 'Jun 25', location: 'Shanghai, China', teams: 12, status: 'live', featured: true },
  { id: 'iem-dallas', name: 'IEM Dallas 2026', short: 'IEM', game: 'cs2', gameLabel: 'CS2', stage: 'Quarterfinals', prizePool: '$250,000', startDate: 'Jun 15', endDate: 'Jun 22', location: 'Dallas, USA', teams: 16, status: 'live' },
  { id: 'ti-2026', name: 'The International 2026', short: 'TI26', game: 'dota2', gameLabel: 'Dota 2', stage: 'Qualifiers', prizePool: '$15,000,000+', startDate: 'Oct 5', endDate: 'Oct 20', location: 'Singapore', teams: 18, status: 'upcoming', featured: true },
  { id: 'blast-paris', name: 'BLAST Premier Spring', short: 'BLAST', game: 'cs2', gameLabel: 'CS2', stage: 'Finals', prizePool: '$500,000', startDate: 'Jun 1', endDate: 'Jun 8', location: 'Paris, France', teams: 12, status: 'completed' },
  { id: 'lck-summer', name: 'LCK Summer Split', short: 'LCK', game: 'lol', gameLabel: 'League of Legends', stage: 'Week 5', prizePool: '$400,000', startDate: 'May 15', endDate: 'Aug 18', location: 'Seoul, South Korea', teams: 10, status: 'live' },
  { id: 'vct-emea', name: 'VCT EMEA 2026', short: 'VCT EMEA', game: 'val', gameLabel: 'VALORANT', stage: 'Upper Bracket Finals', prizePool: '$300,000', startDate: 'Apr 1', endDate: 'Jul 15', location: 'Berlin, Germany', teams: 10, status: 'live' },
  { id: 'esl-pro', name: 'ESL Pro League S21', short: 'EPL', game: 'cs2', gameLabel: 'CS2', stage: 'Playoffs', prizePool: '$750,000', startDate: 'Aug 1', endDate: 'Sep 1', location: 'Cologne, Germany', teams: 24, status: 'upcoming' },
];

export const NEWS_ITEMS = [
  {
    id: 1,
    title: "Faker Renews Contract with T1 Through 2028, Eyes Record-Breaking 5th World Championship",
    excerpt: "The legendary mid laner has signed a contract extension that will keep him at T1 through the 2028 season, making him the longest-tenured player in esports history.",
    category: "LoL",
    game: "lol" as GameId,
    time: "2 hours ago",
    author: "James Chen",
    readTime: "3 min read",
    featured: true,
    imageQuery: "esports stadium crowd",
  },
  {
    id: 2,
    title: "Sentinels Defeat FNATIC in Stunning Grand Finals Comeback to Win VCT Masters Shanghai",
    excerpt: "In one of the most dramatic finals in VALORANT history, SEN came back from a 1-2 map deficit to take the series 3-2 and claim the $500,000 grand prize.",
    category: "VAL",
    game: "val" as GameId,
    time: "4 hours ago",
    author: "Sarah Kim",
    readTime: "5 min read",
    featured: false,
    imageQuery: "gaming competition tournament",
  },
  {
    id: 3,
    title: "s1mple Returns to Competitive Play with New Superteam, Sending Shockwaves Through CS2 Scene",
    excerpt: "The Ukrainian superstar is set to compete at IEM Dallas after an 18-month hiatus, joining a newly formed roster that includes four other top-ranked players.",
    category: "CS2",
    game: "cs2" as GameId,
    time: "5 hours ago",
    author: "Marcus Weber",
    readTime: "4 min read",
    featured: false,
    imageQuery: "counter strike gaming",
  },
  {
    id: 4,
    title: "The International 2026 Prize Pool Surges Past $15 Million After Record Compendium Sales",
    excerpt: "Valve's annual Dota 2 championship continues its tradition of massive community-funded prize pools, with this year's edition surpassing all previous records.",
    category: "DOTA",
    game: "dota2" as GameId,
    time: "8 hours ago",
    author: "Alex Torres",
    readTime: "2 min read",
    featured: false,
    imageQuery: "esports arena",
  },
  {
    id: 5,
    title: "Riot Games Reveals VALORANT's New Agent: Meet 'Phantom', the Reality-Bending Controller",
    excerpt: "The new agent's kit includes a devastating ultimate that reverses time for enemies, forcing them back to their positions from 5 seconds ago.",
    category: "VAL",
    game: "val" as GameId,
    time: "10 hours ago",
    author: "Lily Park",
    readTime: "3 min read",
    featured: false,
    imageQuery: "valorant game",
  },
  {
    id: 6,
    title: "G2 Esports Acquires Three-Time World Champion Roster for $20M in Historic Esports Deal",
    excerpt: "The Spanish organization makes the largest single roster acquisition in esports history, poaching the entire Worlds 2025 champion lineup.",
    category: "LoL",
    game: "lol" as GameId,
    time: "12 hours ago",
    author: "David Müller",
    readTime: "6 min read",
    featured: false,
    imageQuery: "league of legends esports",
  },
];

export const PLAYER_STATS = [
  { player: 'Faker', champion: 'Azir', kda: '8/2/11', kdaRatio: '9.5', cs: '312', cspm: '9.2', dmg: '28,420', gold: '18,750', mvp: true, side: 'blue' },
  { player: 'Gumayusi', champion: 'Zeri', kda: '6/3/9', kdaRatio: '5.0', cs: '289', cspm: '8.5', dmg: '32,180', gold: '17,200', mvp: false, side: 'blue' },
  { player: 'Keria', champion: 'Thresh', kda: '1/4/18', kdaRatio: '4.75', cs: '42', cspm: '1.2', dmg: '8,320', gold: '10,800', mvp: false, side: 'blue' },
  { player: 'Zeus', champion: 'Gnar', kda: '4/2/7', kdaRatio: '5.5', cs: '278', cspm: '8.2', dmg: '18,650', gold: '15,400', mvp: false, side: 'blue' },
  { player: 'Oner', champion: 'Vi', kda: '5/1/14', kdaRatio: '19.0', cs: '195', cspm: '5.7', dmg: '14,280', gold: '13,200', mvp: false, side: 'blue' },
  { player: 'Chovy', champion: 'Viktor', kda: '7/3/5', kdaRatio: '4.0', cs: '305', cspm: '9.0', dmg: '25,100', gold: '17,800', mvp: false, side: 'red' },
  { player: 'Peyz', champion: 'Jinx', kda: '5/4/7', kdaRatio: '3.0', cs: '280', cspm: '8.2', dmg: '27,300', gold: '16,200', mvp: false, side: 'red' },
  { player: 'Lehends', champion: 'Lulu', kda: '0/3/16', kdaRatio: '5.33', cs: '38', cspm: '1.1', dmg: '7,100', gold: '10,100', mvp: false, side: 'red' },
  { player: 'Doran', champion: 'Renekton', kda: '3/5/4', kdaRatio: '1.4', cs: '265', cspm: '7.8', dmg: '17,400', gold: '14,500', mvp: false, side: 'red' },
  { player: 'Canyon', champion: 'Lee Sin', kda: '4/3/9', kdaRatio: '4.33', cs: '188', cspm: '5.5', dmg: '12,900', gold: '12,800', mvp: false, side: 'red' },
];

export const TEAM_COMPARISON_DATA = [
  { stat: 'Kills', t1: 24, t2: 17, label: 'Total Kills' },
  { stat: 'Deaths', t1: 11, t2: 24, label: 'Deaths' },
  { stat: 'Assists', t1: 64, t2: 45, label: 'Assists' },
  { stat: 'Gold', t1: 75350, t2: 67400, label: 'Total Gold' },
  { stat: 'Damage', t1: 101650, t2: 89800, label: 'Team Damage' },
  { stat: 'Towers', t1: 9, t2: 4, label: 'Towers' },
  { stat: 'Dragons', t1: 4, t2: 2, label: 'Dragons' },
  { stat: 'Barons', t1: 2, t2: 0, label: 'Barons' },
];

export const WIN_PROBABILITY_DATA = [
  { time: '0', t1: 50, t2: 50 }, { time: '5', t1: 52, t2: 48 },
  { time: '10', t1: 48, t2: 52 }, { time: '15', t1: 55, t2: 45 },
  { time: '20', t1: 61, t2: 39 }, { time: '25', t1: 58, t2: 42 },
  { time: '30', t1: 67, t2: 33 }, { time: '35', t1: 71, t2: 29 },
  { time: '38', t1: 80, t2: 20 },
];

export const ROUND_DATA = [
  { round: 1, winner: 'SEN', type: 'pistol', side: 'atk', economy: 'eco' },
  { round: 2, winner: 'SEN', type: 'normal', side: 'atk', economy: 'half' },
  { round: 3, winner: 'FNC', type: 'normal', side: 'def', economy: 'full' },
  { round: 4, winner: 'FNC', type: 'normal', side: 'def', economy: 'full' },
  { round: 5, winner: 'SEN', type: 'normal', side: 'atk', economy: 'full' },
  { round: 6, winner: 'SEN', type: 'clutch', side: 'atk', economy: 'full' },
  { round: 7, winner: 'FNC', type: 'normal', side: 'def', economy: 'full' },
  { round: 8, winner: 'SEN', type: 'normal', side: 'atk', economy: 'full' },
  { round: 9, winner: 'FNC', type: 'pistol', side: 'def', economy: 'eco' },
  { round: 10, winner: 'FNC', type: 'normal', side: 'def', economy: 'half' },
  { round: 11, winner: 'SEN', type: 'normal', side: 'atk', economy: 'full' },
  { round: 12, winner: 'SEN', type: 'normal', side: 'atk', economy: 'full' },
  { round: 13, winner: 'FNC', type: 'normal', side: 'def', economy: 'full' },
  { round: 14, winner: 'SEN', type: 'normal', side: 'atk', economy: 'full' },
  { round: 15, winner: 'FNC', type: 'ace', side: 'def', economy: 'full' },
  { round: 16, winner: 'FNC', type: 'pistol', side: 'atk', economy: 'eco' },
  { round: 17, winner: 'SEN', type: 'normal', side: 'def', economy: 'full' },
  { round: 18, winner: 'SEN', type: 'clutch', side: 'def', economy: 'full' },
  { round: 19, winner: 'FNC', type: 'normal', side: 'atk', economy: 'full' },
  { round: 20, winner: 'SEN', type: 'normal', side: 'def', economy: 'full' },
  { round: 21, winner: 'SEN', type: 'normal', side: 'def', economy: 'full' },
  { round: 22, winner: 'FNC', type: 'normal', side: 'atk', economy: 'full' },
  { round: 23, winner: 'SEN', type: 'normal', side: 'def', economy: 'full' },
  { round: 24, winner: 'SEN', type: 'normal', side: 'def', economy: 'full' },
  { round: 25, winner: 'SEN', type: 'normal', side: 'def', economy: 'full' },
];

export const VAL_PLAYER_STATS = [
  { player: 'TenZ', agent: 'Jett', acs: 312, kda: '32/18/5', adr: 178, hs: '38%', econ: 82, fk: 8, fd: 3, clutches: '2/3', rating: 1.42, mvp: true },
  { player: 'Zekken', agent: 'Neon', acs: 287, kda: '28/20/8', adr: 165, hs: '29%', econ: 78, fk: 5, fd: 5, clutches: '1/2', rating: 1.28, mvp: false },
  { player: 'Sacy', agent: 'Viper', acs: 245, kda: '22/15/14', adr: 148, hs: '22%', econ: 71, fk: 3, fd: 4, clutches: '0/1', rating: 1.18, mvp: false },
  { player: 'pancada', agent: 'Sova', acs: 198, kda: '18/17/18', adr: 132, hs: '18%', econ: 68, fk: 2, fd: 6, clutches: '1/2', rating: 1.02, mvp: false },
  { player: 'jawgemo', agent: 'Omen', acs: 162, kda: '14/14/22', adr: 115, hs: '16%', econ: 65, fk: 2, fd: 5, clutches: '0/1', rating: 0.94, mvp: false },
  { player: 'DERKE', agent: 'Reyna', acs: 295, kda: '29/22/6', adr: 172, hs: '41%', econ: 80, fk: 7, fd: 4, clutches: '1/2', rating: 1.31, mvp: false },
  { player: 'Alfajer', agent: 'Raze', acs: 268, kda: '26/24/7', adr: 158, hs: '35%', econ: 74, fk: 6, fd: 6, clutches: '0/2', rating: 1.14, mvp: false },
  { player: 'Boaster', agent: 'Skye', acs: 210, kda: '20/19/16', adr: 140, hs: '24%', econ: 70, fk: 4, fd: 5, clutches: '0/1', rating: 1.05, mvp: false },
  { player: 'Mistic', agent: 'Harbor', acs: 185, kda: '17/18/19', adr: 128, hs: '19%', econ: 66, fk: 3, fd: 6, clutches: '0/0', rating: 0.98, mvp: false },
  { player: 'Leo', agent: 'Killjoy', acs: 172, kda: '16/16/21', adr: 118, hs: '17%', econ: 63, fk: 2, fd: 7, clutches: '1/3', rating: 0.91, mvp: false },
];

export const STANDINGS = {
  lck: [
    { rank: 1, team: 'T1', color: '#E84057', w: 14, l: 2, streak: 'W3' },
    { rank: 2, team: 'Gen.G', color: '#C8A96A', w: 13, l: 3, streak: 'L1' },
    { rank: 3, team: 'HLE', color: '#FF6B1C', w: 11, l: 5, streak: 'W2' },
    { rank: 4, team: 'DK', color: '#00A3FF', w: 9, l: 7, streak: 'W1' },
    { rank: 5, team: 'BRO', color: '#9B59B6', w: 7, l: 9, streak: 'L2' },
  ],
  vct: [
    { rank: 1, team: 'SEN', color: '#AC323F', w: 8, l: 1, streak: 'W5' },
    { rank: 2, team: 'FNC', color: '#FF7B00', w: 7, l: 2, streak: 'W3' },
    { rank: 3, team: 'PRX', color: '#00FFCC', w: 6, l: 3, streak: 'L1' },
    { rank: 4, team: 'LOUD', color: '#66FF00', w: 5, l: 4, streak: 'W1' },
    { rank: 5, team: 'NRG', color: '#FF4500', w: 4, l: 5, streak: 'L2' },
  ],
};
