import React from 'react';
import { DASHBOARD_STATS, OPERATOR_DATA } from '../constants';

export const Operators: React.FC = () => {
  return (
    <section id="operators" className="relative py-24 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto z-20">
      
      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {DASHBOARD_STATS.map((stat, idx) => (
          <div key={idx} className="glass-card p-12 rounded-[3rem] relative overflow-hidden group border-white/[0.03]">
            <div className="flex flex-col gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{stat.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_#ff4d00]"></span>
              </div>
              <div className="flex items-baseline gap-5 mt-2">
                <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">{stat.value}</h2>
                <div className="flex items-center gap-1.5 mb-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="4">
                    <path d="M12 19V5M12 5L5 12M12 5L19 12" />
                  </svg>
                  <span className="text-[12px] font-black" style={{ color: stat.color }}>{stat.change}</span>
                </div>
              </div>
            </div>
            
            {/* Sparkline chart with improved visual weight */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 group-hover:opacity-70 transition-all duration-1000">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <filter id={`glow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id={`grad-${idx}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={stat.color} stopOpacity="0.5" />
                    <stop offset="100%" stopColor={stat.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path 
                  d={stat.chartData} 
                  fill="none" 
                  stroke={stat.color} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  filter={`url(#glow-${idx})`}
                  className="transition-all duration-700"
                />
                <path d={`${stat.chartData} L100 40 L0 40 Z`} fill={`url(#grad-${idx})`} />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Banner Section */}
      <div className="relative glass-card rounded-[4rem] p-16 lg:p-28 overflow-hidden mb-20 group bg-gradient-to-br from-white/[0.03] via-transparent to-orange-500/[0.01] border-white/[0.04]">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-orange-600/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-orange-500/5 blur-[120px] rounded-full animate-pulse"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex px-5 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-10">
              Identity Verification
            </div>
            <h2 className="cyber-font text-5xl lg:text-7xl font-black text-white mb-12 leading-[1.05] tracking-tight">
              Access Verified <br /><span className="text-white/10 italic">Consensus</span> Rewards
            </h2>
            <p className="text-white/20 text-lg lg:text-xl font-light leading-relaxed mb-16">
              Professional node infrastructure for high-yield staking. Automate your due diligence with Stability Protocol.
            </p>
            <div className="flex flex-wrap gap-8">
              <button className="bg-white hover:bg-[#ccff00] text-black px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl active:scale-95 shimmer-btn">
                Connect Wallet
              </button>
              <button className="px-10 py-6 rounded-2xl border border-white/5 text-white/30 hover:text-white hover:bg-white/5 transition-all font-black text-sm uppercase tracking-[0.2em]">
                Registry Docs
              </button>
            </div>
          </div>

          {/* Token Visualizer */}
          <div className="relative h-[450px] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[420px] h-[420px] rounded-full border border-white/[0.02] animate-spin-slow"></div>
              <div className="absolute w-[320px] h-[320px] rounded-full border border-white/[0.03] animate-reverse-spin"></div>
            </div>
            
            <div className="grid grid-cols-4 gap-6 p-8">
               {[
                 {c: 'bg-[#ff3b30]', t: 'OP', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.svg'},
                 {c: 'bg-[#627eea]', t: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'},
                 {c: 'bg-[#f7931a]', t: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg'},
                 {c: 'bg-[#14f195]', t: 'SOL', icon: 'https://cryptologos.cc/logos/solana-sol-logo.svg'},
                 {c: 'bg-[#8247e5]', t: 'POL', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.svg'},
                 {c: 'bg-[#26a17b]', t: 'USDT', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg'},
                 {c: 'bg-[#f0b90b]', t: 'BNB', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg'},
                 {c: 'bg-[#2775ca]', t: 'USDC', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg'},
                 {c: 'bg-[#e84142]', t: 'AVAX', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg'},
                 {c: 'bg-[#000000]', t: 'L2', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg'},
                 {c: 'bg-[#6b71d6]', t: 'DAI', icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg'},
                 {c: 'bg-[#00a3ff]', t: 'ARB', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.svg'}
               ].map((token, i) => (
                 <div 
                    key={i} 
                    className="w-20 h-20 rounded-2xl bg-black border border-white/5 p-4 flex items-center justify-center shadow-2xl transition-all hover:scale-125 hover:-translate-y-3 cursor-pointer group/token hover:border-white/20"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                   <img src={token.icon} className="w-full h-full object-contain filter brightness-75 group-hover/token:brightness-110 grayscale group-hover/token:grayscale-0 transition-all duration-500" alt={token.t} />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operators Table */}
      <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/[0.04] bg-black/40 shadow-3xl">
        <div className="p-12 border-b border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-8 bg-white/[0.005]">
          <div className="flex flex-col gap-2">
            <h3 className="cyber-font text-xl font-black text-white tracking-[0.2em]">Operator Ecosystem</h3>
            <p className="text-[10px] text-white/10 uppercase tracking-[0.4em] font-black">Scanning 428 Live Decentralized Nodes</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.02] rounded-2xl border border-white/5 text-[11px] font-black text-white/30 cursor-pointer hover:text-white hover:bg-white/5 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                FILTER SYSTEM
             </div>
             <div className="w-12 h-12 rounded-2xl bg-[#ccff00] flex items-center justify-center text-black cursor-pointer hover:rotate-12 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><path d="M12 5v14M5 12h14"/></svg>
             </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="border-b border-white/[0.02] text-[11px] font-black text-white/20 uppercase tracking-[0.3em] bg-white/[0.003]">
                <th className="px-12 py-10">#</th>
                <th className="px-12 py-10">ENTITY</th>
                <th className="px-12 py-10">TOTAL TVL</th>
                <th className="px-12 py-10">NET APY</th>
                <th className="px-12 py-10">CLUSTERS</th>
                <th className="px-12 py-10">PARTICIPANTS</th>
                <th className="px-12 py-10 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {OPERATOR_DATA.map((op, idx) => (
                <tr key={op.id} className="hover:bg-white/[0.015] transition-all group cursor-pointer">
                  <td className="px-12 py-10">
                    <span className={`text-[12px] font-black ${idx < 3 ? 'text-orange-600' : 'text-white/10'}`}>0{op.id}</span>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-all duration-500 group-hover:border-orange-500/40">
                        <img src={op.icon} className="w-7 h-7 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] grayscale group-hover:grayscale-0 transition-all" alt="icon" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/90 font-black tracking-tight text-lg mb-0.5">{op.name}</span>
                        <span className="text-[10px] text-white/10 uppercase tracking-[0.2em] font-black">{Math.random().toString(36).substr(2, 4).toUpperCase()} ID</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex flex-col">
                      <span className="text-white font-black text-xl tracking-tight">{op.tvl}</span>
                      <span className="text-[10px] text-green-500/60 font-black mt-1 uppercase tracking-widest">+1.4% D</span>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-2.5">
                       <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#00ff00]"></div>
                       <span className="text-green-400 font-black text-xl tracking-tighter">{op.apy}</span>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <span className="text-white/60 font-black text-lg">{op.avsCount}</span>
                  </td>
                  <td className="px-12 py-10">
                    <span className="text-white/40 font-black text-lg">{op.stakers}</span>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end gap-5">
                      <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all
                        ${op.status === 'Verified' ? 'bg-orange-600/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(255,77,0,0.1)]' : 'bg-white/5 text-white/20 border-white/5'}`}>
                        {op.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};