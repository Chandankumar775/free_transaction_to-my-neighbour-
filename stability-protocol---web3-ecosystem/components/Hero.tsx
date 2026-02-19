import React from 'react';
import { APP_CONFIG, TOKEN_LIST, WALLET_CARDS } from '../constants';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col pt-48 md:pt-56 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto z-10 overflow-hidden">

      {/* Background Lighting */}
      <div className="hero-spotlight"></div>

      {/* Floating Interactive Tokens */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {TOKEN_LIST.map((token, idx) => {
          const saferPos = {
            ...token.pos,
            left: token.pos.left ? (parseInt(token.pos.left) < 15 ? token.pos.left : '5%') : undefined,
            right: token.pos.right ? (parseInt(token.pos.right) < 15 ? token.pos.right : '5%') : undefined,
          };

          return (
            <div
              key={token.name}
              className="absolute token-float hidden xl:flex items-center gap-5 glass-card px-6 py-4 rounded-[2.2rem] border-white/[0.03]"
              style={{
                top: saferPos.top,
                left: saferPos.left,
                right: saferPos.right,
                animationDelay: `${idx * 3}s`,
                animationDuration: '12s',
                opacity: 0.7,
                boxShadow: `0 10px 40px -15px ${token.color}22`
              }}
            >
              <div
                className="p-2.5 rounded-xl border border-white/5 shadow-inner"
                style={{ backgroundColor: `${token.color}10` }}
              >
                <img src={token.icon} className="w-6 h-6 object-contain" alt={token.name} />
              </div>
              <div className="flex flex-col">
                <span className="cyber-font text-[10px] font-bold text-white/90 tracking-[0.25em]">{token.name}</span>
                <span className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black mt-0.5">Verified Asset</span>
              </div>
              <div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: token.color, boxShadow: `0 0 12px ${token.color}` }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Hero Content Section */}
      <div className="flex-grow flex flex-col items-center justify-center text-center z-10 py-12 md:py-20 relative" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 4px 40px rgba(0,0,0,0.6)' }}>
        <div className="inline-flex items-center gap-4 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.01] mb-12 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_#ff4d00]"></span>
          <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.4em]">Protocol V2.5.3 Stability</span>
        </div>

        <h1 className="cyber-font text-gradient text-4xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.02] mb-12 max-w-6xl mx-auto tracking-[-0.02em]" style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)' }}>
          Exploring the Types of <br className="hidden md:block" />
          <span className="text-white/40 italic">Wallets</span> in the Web3 space
        </h1>

        <p className="text-base md:text-xl text-white/70 max-w-2xl mx-auto mb-16 font-light leading-relaxed tracking-tight px-4" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8)' }}>
          {APP_CONFIG.hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-14 mb-24 md:mb-32">
          <button className="shimmer-btn flex items-center gap-6 bg-white text-black px-12 py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white transition-all active:scale-95 shadow-2xl group border-none">
            <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center group-hover:bg-white transition-all">
              <svg className="w-4 h-4 text-white group-hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
            Get Started Now
          </button>

          <div className="flex items-center gap-8 glass-card px-8 py-5 rounded-[2.2rem] border-white/10 group cursor-pointer hover:border-white/30">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden bg-zinc-900 transition-transform group-hover:-translate-y-1">
                  <img src={`https://i.pravatar.cc/100?u=${i + 120}`} alt="user" className="opacity-80 grayscale group-hover:grayscale-0 transition-all" />
                </div>
              ))}
            </div>
            <div className="text-left border-l border-white/10 pl-8">
              <p className="text-[16px] font-black text-white leading-none mb-1.5 tracking-tight">42.8K+</p>
              <p className="text-[9px] text-white/20 uppercase tracking-[0.3em] font-black">Consensus Nodes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid - Modern spacing and better alignment */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 pb-32 z-20 relative">
        {WALLET_CARDS.map((card, idx) => (
          <div
            key={idx}
            className={`glass-card p-10 md:p-12 rounded-[3rem] group flex flex-col h-full border-white/[0.05]
              ${card.isFeatured ? 'featured-card ring-1 ring-orange-500/10' : ''}`}
          >
            <div className="flex items-start justify-between mb-12">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border border-white/5 transition-transform group-hover:rotate-6
                ${card.isFeatured ? 'bg-orange-600 shadow-[0_15px_40px_rgba(255,77,0,0.3)]' : 'bg-white/5 shadow-inner'}`}>
                <img src={card.icon} className="w-8 h-8 filter brightness-200" alt="icon" />
              </div>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/10 group-hover:text-black group-hover:bg-white transition-all duration-500 shadow-sm">
                <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="cyber-font text-xl md:text-2xl font-black text-white/90 mb-6 tracking-tight">{card.title}</h3>
              <p className="text-white/30 text-base leading-relaxed font-light">
                {card.description}
              </p>
            </div>

            <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Integrated Module {idx + 1}</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-700 ${i <= (idx + 2) ? 'bg-orange-500 shadow-[0_0_8px_#ff4d00]' : 'bg-white/5'}`}></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};