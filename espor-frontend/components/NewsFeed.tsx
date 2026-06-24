"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Repeat2, Heart, Share, Zap, Flame, Newspaper, CheckCircle2, ExternalLink, Sparkles } from "lucide-react";
import { GAMES } from "@/app/data/mockData";

const ALLOWED_GAMES = ['lol', 'val', 'cs2', 'dota2'];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

const MOCK_FEED = [
  { id: 1, type: 'transfer', game: 'val', author: 'Nexus Espor', handle: '@nexuspro', isVerified: true, avatar: 'NX', time: '10 dk önce', content: '🚨 FLAŞ GELİŞME: TenZ, Sentinels ile olan sözleşmesini 2026 sonuna kadar uzattı! Transfer dedikoduları böylece son bulmuş oldu.', likes: '12.4K', rts: '3.2K', comments: '845' },
  { id: 2, type: 'social', game: 'cs2', author: 's1mple', handle: '@s1mpleO', isVerified: true, avatar: 'S1', time: '1 saat önce', content: 'Yeni gelen güncellemeyle Mirage A-Site smoke mekanikleri tamamen bozulmuş. Valve lütfen turnuva öncesi buna bir el atın... 🤦‍♂️', likes: '45K', rts: '8.1K', comments: '1.2K' },
  { id: 3, type: 'news', game: 'lol', author: 'LoL Esports', handle: '@lolesports', isVerified: true, avatar: 'LE', time: '2 saat önce', content: 'LCK Yaz Mevsimi 5. Hafta mücadeleleri nefes kesen T1 vs Gen.G derbisiyle devam ediyor! Yayında buluşalım. 📺', likes: '22.1K', rts: '1.4K', comments: '320', image: true },
  { id: 4, type: 'social', game: 'val', author: 'FUT Esports', handle: '@FUTesportsgg', isVerified: true, avatar: 'FT', time: '3 saat önce', content: 'Bugün sahnede devleşen bir ekip vardı! Destekleyen tüm taraftarlarımıza teşekkürler, playofflar için hazırız! 🔴🦅 #FUTWIN', likes: '18K', rts: '2.1K', comments: '450' },
  { id: 5, type: 'transfer', game: 'cs2', author: 'HLTV.org', handle: '@HLTVorg', isVerified: true, avatar: 'HL', time: '5 saat önce', content: 'G2 Esports, m0NESY etrafında yeni bir kadro kurmak için devasa bir bütçe ayırdı. İki sürpriz ismin masada olduğu konuşuluyor. 👀', likes: '31K', rts: '4.5K', comments: '2.1K' },
];

export default function NewsFeed() {
  const [selectedGame, setSelectedGame] = useState<string>('all');

  const filteredFeed = useMemo(() => {
    if (selectedGame === 'all') return MOCK_FEED;
    return MOCK_FEED.filter(post => post.game === selectedGame);
  }, [selectedGame]);

  return (
    <div className="flex-1 flex flex-col h-full bg-es-bg animate-fade-in">
      
      {/* ÜST HEADER & FİLTRELER */}
      <div className="shrink-0 px-4 md:px-8 py-6 border-b border-white/5 bg-es-bg-2 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 max-w-3xl mx-auto">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-es-cyan" /> Espor Gündemi
            </h1>
            <p className="text-xs text-slate-400 mt-1">En sıcak transferler, oyuncu tepkileri ve resmi duyurular.</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            <button onClick={() => setSelectedGame('all')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedGame === 'all' ? 'bg-white text-black shadow-lg' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'}`}>Tümü</button>
            {GAMES.filter(g => ALLOWED_GAMES.includes(g.id)).map(game => (
              <button key={game.id} onClick={() => setSelectedGame(game.id)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${selectedGame === game.id ? 'text-white shadow-lg border' : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'}`} style={{ backgroundColor: selectedGame === game.id ? `${GAME_COLORS[game.id]}20` : '', borderColor: selectedGame === game.id ? GAME_COLORS[game.id] : '' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: GAME_COLORS[game.id] }} />{game.short}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AKIŞ (FEED) ALANI */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-4">
          
          {/* Yeni Gönderi Giriş Alanı */}
          <div className="bg-slate-900/50 p-3 md:p-4 rounded-xl border border-white/5 flex gap-3 md:gap-4 mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0 border border-slate-700 text-[10px] md:text-xs">AD</div>
            <div className="flex-1 flex flex-col gap-3">
              <input type="text" placeholder="Espor dünyasında neler oluyor?" className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-slate-500 mt-2" />
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex gap-4 text-slate-500"><Flame className="w-4 h-4 cursor-pointer hover:text-es-cyan transition-colors" /></div>
                <button className="px-4 py-1.5 bg-es-cyan text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-white transition-colors">Paylaş</button>
              </div>
            </div>
          </div>

          {/* Gönderiler ve Doğal Reklam Enjeksiyonu */}
          {filteredFeed.map((post, index) => (
            <div key={`post-wrapper-${post.id}`} className="flex flex-col gap-4">
              
              {/* Normal Gönderi */}
              <div className="bg-es-bg-2 p-3 md:p-5 rounded-xl border border-white/5 shadow-sm hover:border-white/10 transition-colors group">
                {post.type === 'transfer' && <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1.5 mb-3 pl-12"><Repeat2 className="w-3 h-3" /> Transfer Sızıntısı</div>}
                {post.type === 'news' && <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5 mb-3 pl-12"><Newspaper className="w-3 h-3" /> Resmi Duyuru</div>}

                <div className="flex gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-white shrink-0 shadow-md" style={{ background: GAME_COLORS[post.game] || '#334155' }}>{post.avatar}</div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white truncate">{post.author}</span>
                      {post.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      <span className="text-xs text-slate-500 truncate">{post.handle}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{post.time}</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed mb-3">{post.content}</p>
                    {post.image && (
                      <div className="w-full h-48 bg-slate-900 rounded-lg border border-white/5 mb-3 flex items-center justify-center relative overflow-hidden group-hover:border-es-cyan/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent z-10" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest relative z-20">Medya Yükleniyor...</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-500 mt-1 gap-2 md:gap-4">
                      <button className="flex items-center gap-1 md:gap-2 text-xs font-semibold hover:text-blue-400 transition-colors group/btn"><MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:bg-blue-400/10 p-0.5 rounded" /> {post.comments}</button>
                      <button className="flex items-center gap-1 md:gap-2 text-xs font-semibold hover:text-green-400 transition-colors group/btn"><Repeat2 className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:bg-green-400/10 p-0.5 rounded" /> {post.rts}</button>
                      <button className="flex items-center gap-1 md:gap-2 text-xs font-semibold hover:text-red-400 transition-colors group/btn"><Heart className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:bg-red-400/10 p-0.5 rounded" /> {post.likes}</button>
                      <button className="flex items-center gap-1 md:gap-2 text-xs font-semibold hover:text-es-cyan transition-colors group/btn"><Share className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover/btn:bg-es-cyan/10 p-0.5 rounded" /></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🚀 NATIVE IN-FEED REKLAM (Sadece 2. gönderiden sonra çıkar) */}
              {index === 1 && (
                <div className="bg-gradient-to-r from-blue-900/30 to-slate-900 p-5 rounded-xl border border-blue-500/20 shadow-lg hover:border-blue-500/40 transition-all group cursor-pointer relative overflow-hidden">
                  <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                  
                  {/* Sponsor Etiketi */}
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><ExternalLink className="w-3 h-3" /> Sponsorlu İçerik</span>
                     <span className="text-[10px] text-slate-500 hover:text-white transition-colors">Gizle</span>
                  </div>

                  <div className="flex gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-sm font-black text-white mb-1 group-hover:text-blue-400 transition-colors">Oyunculara Özel Lansman İndirimi</span>
                      <p className="text-xs text-slate-300 leading-relaxed mb-3">Tepki süreni sıfıra indir, reflekslerini zirveye taşı. NexusGear Pro serisi ekipmanlarda bu hafta sonuna özel %25 indirim seni bekliyor.</p>
                      
                      {/* Reklam Görseli / Banner */}
                      <div className="w-full h-32 bg-slate-950 rounded-lg border border-white/5 mb-3 flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                         <span className="text-2xl font-black text-white tracking-tighter">NEXUS<span className="text-blue-500">GEAR</span></span>
                      </div>
                      
                      <div className="flex justify-end mt-1">
                        <button className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">Hemen İncele</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}