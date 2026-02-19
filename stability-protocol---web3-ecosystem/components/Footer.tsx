import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 pt-32 pb-16 border-t border-white/[0.03] bg-black">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2">
                 <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <span className="cyber-font text-lg font-black tracking-widest">Stability</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Architecting the future of decentralized finance with precision-engineered consensus layers and secure wallet infrastructure.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Discord', 'Github'].map(platform => (
                <a key={platform} href="#" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-tighter">
                  {platform[0]}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Ecosystem</h4>
            <ul className="space-y-4">
              {['Operators', 'AVS Registry', 'Delegation', 'Staking Hub'].map(link => (
                <li key={link}><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Developers</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Grants Program', 'Status'].map(link => (
                <li key={link}><a href="#" className="text-sm text-white/40 hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Newsletter</h4>
            <p className="text-white/30 text-sm">Stay updated with our latest protocol developments.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="EMAIL ADDRESS" 
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-6 py-4 text-[10px] font-black tracking-widest text-white placeholder:text-white/10 outline-none focus:border-white/20 transition-all" 
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black text-[9px] font-black rounded-lg uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/[0.03] gap-8">
          <div className="flex items-center gap-6 opacity-40">
             <span className="text-[10px] font-black tracking-[0.3em] text-white">© 2025 STABILITY LABS</span>
             <div className="w-[1px] h-4 bg-white/10"></div>
             <span className="text-[9px] font-black text-white/40">V2.5.3-STABLE</span>
          </div>
          
          <div className="flex gap-10 text-[10px] font-black tracking-widest text-white/20 uppercase">
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
