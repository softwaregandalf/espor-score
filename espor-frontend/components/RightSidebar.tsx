"use client";

export default function RightSidebar() {
  return (
    <div className="hidden lg:flex lg:w-3/12 xl:w-3/12 flex-col gap-4">
      {/* Reklam Alanı */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 flex flex-col items-center text-center shadow-lg">
        <span className="text-[9px] text-slate-500 mb-1 self-end">Reklam</span>
        <div className="w-full h-72 bg-gradient-to-br from-red-900/40 to-black rounded border border-red-500/30 flex flex-col items-center justify-center p-4">
          <span className="text-red-500 font-black text-2xl tracking-widest mb-2">ARENA VIP</span>
          <span className="text-white text-xs font-bold mb-4">Sponsor Alanı</span>
          <button className="bg-red-600 text-white text-xs font-bold py-2 px-6 rounded hover:bg-red-700">Siteye Git</button>
        </div>
      </div>

      {/* Mini Puan Durumu */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
          <span className="text-xs font-bold text-slate-300">Dünya Sıralaması</span>
          {/* HATA DÜZELTİLDİ: > yerine &gt; kullanıldı */}
          <span className="text-[10px] text-blue-400 cursor-pointer">Tümü &gt;</span>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { r: 1, t: "NAVI", p: "1000" },
            { r: 2, t: "FaZe", p: "950" },
            { r: 3, t: "Spirit", p: "820" },
          ].map(item => (
            <div key={item.t} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 w-3">{item.r}.</span>
                <span className="text-white font-bold">{item.t}</span>
              </div>
              <span className="text-slate-400">{item.p} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}