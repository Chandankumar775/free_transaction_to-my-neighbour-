
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-24 px-8 md:px-16 border-t border-zinc-900 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-default">
              <svg viewBox="0 0 100 100" className="w-9 h-9 text-white fill-current">
                <path d="M50 5 L95 85 L5 85 Z" fill="none" stroke="currentColor" strokeWidth="6" />
                <path d="M50 25 L75 70 L25 70 Z" fill="currentColor" />
              </svg>
              <span className="text-2xl font-black tracking-tighter uppercase italic">Grid Matrix</span>
            </div>
            <p className="text-zinc-500 max-w-xs mb-10 text-base leading-relaxed font-medium">
              The world's first open-source P2P energy settlement protocol. Scaling microgrids for a resilient future.
            </p>
            <div className="flex gap-4">
              {['X', 'Dis', 'Tel', 'Git'].map(social => (
                <a key={social} href="#" className="w-12 h-12 rounded-2xl glass flex items-center justify-center border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900 transition-all text-sm font-black text-zinc-500 hover:text-white uppercase tracking-tighter">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Network</h4>
            <ul className="space-y-4 text-zinc-500 text-sm font-bold uppercase tracking-tight">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Nodes</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Wallets</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Governance</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Explorer</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Devs</h4>
            <ul className="space-y-4 text-zinc-500 text-sm font-bold uppercase tracking-tight">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Audits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-zinc-400">Project</h4>
            <ul className="space-y-4 text-zinc-500 text-sm font-bold uppercase tracking-tight">
              <li><a href="#" className="hover:text-orange-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Grants</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Media</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <div className="p-6 glass rounded-3xl border-orange-500/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-2">Live Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-white uppercase tracking-widest">Mainnet Alpha</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2024 Grid Matrix Foundation — All Systems Operational
          </p>
          <div className="flex gap-10 text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">SLA</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
