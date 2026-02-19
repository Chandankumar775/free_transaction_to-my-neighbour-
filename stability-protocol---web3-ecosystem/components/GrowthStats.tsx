import React from 'react';

export const GrowthStats: React.FC = () => {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto z-20">
      <div className="text-center mb-20 space-y-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Driving Growth. Verifying Stability.
        </h2>
        <p className="text-white/40 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
          We scale with efficiency, verify with consensus protocols, and prove it with immutable on-chain data.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
        {/* Left Column: Metrics Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="glass-card bg-[#111] p-10 rounded-[2rem] flex flex-col justify-between min-h-[280px] hover:bg-zinc-900/50">
            <h3 className="text-6xl font-black text-white tracking-tighter">0.8s</h3>
            <div>
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">Average Block Time</p>
            </div>
          </div>
          {/* Card 2 */}
          <div className="glass-card bg-[#111] p-10 rounded-[2rem] flex flex-col justify-between min-h-[280px] hover:bg-zinc-900/50">
            <h3 className="text-6xl font-black text-white tracking-tighter">100k+</h3>
            <div>
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">TPS Capacity</p>
            </div>
          </div>
          {/* Card 3 */}
          <div className="glass-card bg-[#111] p-10 rounded-[2rem] flex flex-col justify-between min-h-[280px] hover:bg-zinc-900/50">
            <h3 className="text-6xl font-black text-white tracking-tighter">12:1</h3>
            <div>
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">Consensus Ratio</p>
            </div>
          </div>
          {/* Card 4 */}
          <div className="glass-card bg-[#111] p-10 rounded-[2rem] flex flex-col justify-between min-h-[280px] hover:bg-zinc-900/50">
            <h3 className="text-6xl font-black text-white tracking-tighter">99.9%</h3>
            <div>
              <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em]">Uptime Reliability</p>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Metric Card */}
        <div className="md:col-span-5 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-blue-900/20 to-black p-12 min-h-[400px] border border-white/5 flex flex-col justify-between group">
          <div className="relative z-10">
            <h3 className="text-7xl font-black text-white tracking-tighter mb-4">50M+</h3>
            <div className="space-y-1">
              <p className="text-white font-bold text-lg">Transactions</p>
              <p className="text-white/40 text-sm">processed globally across mainnet</p>
            </div>
          </div>

          {/* 3D Visual Tokens Stack (Simulated with SVG and CSS) */}
          <div className="absolute bottom-[-10%] right-[-10%] w-full h-full flex flex-col items-end pointer-events-none opacity-80 group-hover:scale-105 transition-transform duration-700">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="w-48 h-48 rounded-full border-[10px] border-white/10 bg-gradient-to-tr from-zinc-800 to-black/20 backdrop-blur-md shadow-2xl flex items-center justify-center -mb-28"
                style={{ 
                  transform: `rotateX(60deg) rotateZ(-15deg) translateY(${i * -20}px)`,
                  zIndex: 10 - i 
                }}
              >
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <button className="px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full text-white font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 mx-auto shadow-2xl shadow-blue-500/20">
          Start Building 
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>
    </section>
  );
};