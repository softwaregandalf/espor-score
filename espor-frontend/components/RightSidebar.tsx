"use client";

import { ExternalLink, Sparkles, MessageSquare, Zap, Flame } from "lucide-react";
import { useLanguage } from "./LanguageProvider"; // 🚀 DİL BEYNİ EKLENDİ

const COMMUNITY_POSTS = [
  { id: 1, title: 's1mple: "NAVI 2021 was the peak"', replies: 161, game: 'cs2', isHot: true },
  { id: 2, title: 'TenZ bu sezon sonu bırakıyor mu?', replies: 89, game: 'val', isHot: false },
  { id: 3, title: 'Faker yine Ahri kilitledi...', replies: 45, game: 'lol', isHot: false },
  { id: 4, title: 'Mirage A-Site güncel smoke rehberi', replies: 132, game: 'cs2', isHot: false },
  { id: 5, title: 'Yeni yama notları turnuvayı nasıl etkiler?', replies: 67, game: 'val', isHot: false },
];
const GAME_COLORS: Record<string, string> = { lol: '#22C55E', val: '#FF4655', cs2: '#F59E0B', dota2: '#B9202C' };

function SponsorWidget({ title, subtitle, badge, type, gradient, inspectText }: { title: React.ReactNode, subtitle: string, badge: string, type: 'gear' | 'supplement', gradient: string, inspectText: string }) {
  return (
    <div className="relative w-full h-[280px] rounded-xl overflow-hidden shadow-lg group cursor-pointer mb-6 border border-white/5 bg-slate-900 transition-all hover:border-es-cyan/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.15)] flex flex-col shrink-0">
      <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest border border-white/10 flex items-center gap-1">
        {badge} <ExternalLink className="w-2 h-2" />
      </div>
      <div className={`flex-1 relative overflow-hidden bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-3 transform transition-transform duration-500 group-hover:scale-105">
           {type === 'gear' ? <Sparkles className="w-10 h-10 text-es-cyan mb-1 animate-pulse" /> : <Zap className="w-10 h-10 text-orange-400 mb-1 animate-pulse" />}
           <span className="text-2xl font-black text-white tracking-tighter text-center leading-tight">{title}</span>
           <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center px-4">{subtitle}</span>
        </div>
      </div>
      <div className="h-12 bg-slate-800/80 backdrop-blur border-t border-white/10 flex items-center justify-between px-4 transition-colors group-hover:bg-slate-800">
        <span className="text-[10px] font-bold text-slate-400">Google Ads / Sponsor</span>
        <span className="text-[10px] font-black text-white bg-es-cyan/20 text-es-cyan px-3 py-1.5 rounded border border-es-cyan/30 uppercase tracking-widest">{inspectText}</span>
      </div>
    </div>
  );
}

function CommunityFeed() {
  const { t, language } = useLanguage(); // 🚀 DİL BEYNİ ÇAĞRILDI
  return (
    <div className="mb-6 flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-es-cyan" /><span className="text-xs font-bold text-white uppercase tracking-widest">{t.communityForum}</span></div>
        <span className="text-[10px] font-black text-slate-500 hover:text-white cursor-pointer transition-colors">{t.allLabel}</span>
      </div>
      <div className="flex flex-col gap-1 bg-slate-900/50 rounded-xl border border-white/5 overflow-hidden flex-1">
        {COMMUNITY_POSTS.map((post, i) => (
          <div key={post.id} className={`flex items-center justify-between p-4 transition-colors hover:bg-white/5 cursor-pointer ${i !== COMMUNITY_POSTS.length - 1 ? 'border-b border-white/5' : ''}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-1.5 h-4 rounded-full shrink-0" style={{ background: GAME_COLORS[post.game] || '#fff' }} />
              <span className={`text-xs font-semibold truncate ${post.isHot ? 'text-white' : 'text-slate-300'}`}>{post.title}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <span className="text-[10px] font-black text-slate-500">{post.replies}</span>
              {post.isHot ? <Flame className="w-3.5 h-3.5 text-orange-500" /> : <MessageSquare className="w-3.5 h-3.5 text-slate-600" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RightSidebar({ rankings }: { rankings?: any[] }) {
  const { t, language } = useLanguage(); 
//...
  
  return (
    <aside className="w-[300px] shrink-0 border-l border-white/5 bg-es-bg-2 p-5 overflow-y-auto custom-scrollbar relative flex flex-col">
      <SponsorWidget 
        type="gear" 
        title={<>NEXUS<span className="text-es-cyan">GEAR</span> PRO</>} 
        subtitle={t.designedForAthletes} 
        badge={t.sponsored} 
        gradient="from-indigo-900 via-slate-900 to-black"
        inspectText={t.review}
      />
      <CommunityFeed />
      <SponsorWidget 
        type="supplement" 
        title={<>NEXUS <span className="text-orange-400">FOCUS+</span></>} 
        subtitle={t.performancePeak} 
        badge={t.sponsored} 
        gradient="from-orange-900/40 via-slate-900 to-black" 
        inspectText={t.review}
      />
    </aside>
  );
}