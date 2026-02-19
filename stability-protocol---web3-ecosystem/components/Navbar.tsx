
import React from 'react';
import { NAV_LINKS } from '../constants';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-6 px-6 md:px-12 lg:px-24 glass-nav border-b border-white/10">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Enhanced Brand Logo */}
          <div className="flex items-center gap-5 cursor-pointer group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative w-9 h-9 bg-white rounded-xl flex items-center justify-center p-2.5 shadow-2xl transition-all group-hover:rotate-12 group-hover:scale-110">
                 <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="cyber-font text-[14px] font-black tracking-[0.25em] leading-none mb-1">Stability</span>
              <span className="text-[7px] text-white/30 uppercase tracking-[0.3em] font-black">Lite Mode / Advanced</span>
            </div>
          </div>

          {/* Nav Items */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.id} 
                href={link.href}
                className="text-[11px] font-black text-white/40 hover:text-white transition-all uppercase tracking-widest relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-[#ccff00] transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>

        {/* Action Elements */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-lg">
            <button className="px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-white/10 text-white">Lite</button>
            <button className="px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors">Advanced</button>
          </div>
          
          <button className="flex items-center gap-4 px-6 py-3 bg-white text-black rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-[#ccff00] transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};
