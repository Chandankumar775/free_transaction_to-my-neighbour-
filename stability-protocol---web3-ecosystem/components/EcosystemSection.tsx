import React from 'react';

export const EcosystemSection: React.FC = () => {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto z-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        
        {/* Left Column: Robot Illustration */}
        <div className="relative order-2 lg:order-1 h-[500px] md:h-[600px] flex items-center justify-center">
          
          {/* Orbiting Rings */}
          <div className="absolute w-[350px] h-[350px] md:w-[450px] md:h-[450px] border border-emerald-500/10 rounded-full animate-spin-slow"></div>
          <div className="absolute w-[450px] h-[450px] md:w-[550px] md:h-[550px] border border-emerald-500/5 rounded-full animate-reverse-spin"></div>
          
          {/* The Robot (Styled CSS/SVG mix) */}
          <div className="relative z-10 flex flex-col items-center token-float">
            
            {/* Robot Head */}
            <div className="w-32 h-28 md:w-40 md:h-36 bg-zinc-900 border-4 border-emerald-500/40 rounded-3xl relative shadow-[0_0_50px_rgba(16,185,129,0.2)] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-2 bg-black rounded-xl p-3 flex flex-col gap-1.5 font-mono text-[8px] md:text-[10px] text-emerald-400 opacity-80 leading-tight">
                <span className="animate-pulse">01010011</span>
                <span>01110000</span>
                <span className="text-white/40">01110100</span>
                <div className="mt-auto flex justify-between">
                   <div className="w-4 h-1 bg-emerald-500/40 rounded-full"></div>
                   <div className="w-2 h-1 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Robot Neck */}
            <div className="w-6 h-4 bg-zinc-800 -mt-1"></div>

            {/* Robot Body */}
            <div className="w-36 h-36 md:w-44 md:h-44 bg-zinc-900 border-4 border-emerald-500/30 rounded-[2.5rem] relative flex items-center justify-center shadow-2xl">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black border-2 border-emerald-500/20 flex items-center justify-center">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute w-12 h-12 md:w-14 md:h-14 border border-emerald-500/40 rounded-full animate-spin"></div>
              </div>
              
              {/* Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>

            {/* Robot Limbs (Floating) */}
            <div className="absolute -left-12 top-1/2 w-10 h-20 md:w-14 md:h-28 bg-zinc-800/80 rounded-full border border-white/5 shadow-lg transform -rotate-12 translate-y-4"></div>
            <div className="absolute -right-12 top-1/2 w-10 h-20 md:w-14 md:h-28 bg-zinc-800/80 rounded-full border border-white/5 shadow-lg transform rotate-12 translate-y-4"></div>
          </div>

          {/* Floating Icons around Robot */}
          {/* Controller */}
          <div className="absolute top-10 left-10 md:top-20 md:left-20 w-16 h-16 md:w-20 md:h-20 bg-emerald-500/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center rotate-12 animate-bounce transition-all hover:scale-125 cursor-pointer">
             <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 12h.01M9 12h.01M15 12h.01M18 12h.01M4 15a8 8 0 1 0 16 0c0-2-1-3.5-3-4.5V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2.5C5 11.5 4 13 4 15z" /></svg>
          </div>

          {/* Gems */}
          <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-14 h-14 md:w-16 md:h-16 bg-blue-500/10 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center -rotate-12 animate-pulse transition-all hover:scale-125 cursor-pointer">
             <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3h12l4 5-10 13L2 8l4-5z" /></svg>
          </div>

          {/* Coins Cluster */}
          <div className="absolute top-1/2 right-4 translate-y-20 flex flex-col gap-2">
            <div className="w-10 h-10 bg-yellow-500/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center animate-bounce transition-all hover:scale-110">
              <span className="text-yellow-400 text-[10px] font-black">STB</span>
            </div>
            <div className="w-8 h-8 bg-pink-500/20 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center animate-bounce delay-150 transition-all hover:scale-110">
              <span className="text-pink-400 text-[8px] font-black">X</span>
            </div>
          </div>

        </div>

        {/* Right Column: Text Content */}
        <div className="order-1 lg:order-2 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
               <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protocol Intelligence Layer</span>
            </div>
            <h2 className="cyber-font text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
              AI-Augmented <br />
              <span className="text-emerald-500">Security Auditors</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-light leading-relaxed max-w-xl">
              Our proprietary Stability Intelligence Core monitors every transaction in real-time, preventing malicious exploits before they reach consensus.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Autonomous Defense</h4>
              <p className="text-white/30 text-xs">Self-healing node architecture that responds to attacks instantly.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="text-white font-black uppercase text-xs tracking-widest">Lightning Speed</h4>
              <p className="text-white/30 text-xs">Sub-second transaction finality optimized for high-frequency trading.</p>
            </div>
          </div>

          <div className="pt-6">
            <button className="px-10 py-5 glass-card bg-white/5 border-emerald-500/20 text-emerald-400 font-black text-sm uppercase tracking-widest hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all rounded-2xl">
              View Audit Reports
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};