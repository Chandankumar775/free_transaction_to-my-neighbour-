import React, { useState } from 'react';
import { ArrowDownUp, Settings, Sun, Wind, Waves, Zap, RefreshCw } from 'lucide-react';

/* ─────────────────── Enhanced Swap Page ─────────────────── */
const EnergySwap: React.FC = () => {
    const [fromVal, setFromVal] = useState('100');
    
    // Quick Chart Component
    const MiniChart = ({ color }: { color: string }) => (
        <svg viewBox="0 0 100 40" className="w-24 h-10 opacity-70">
            <path 
                d="M0,20 Q25,5 50,20 T100,20" 
                fill="none" stroke={color} strokeWidth="2" 
                className="animate-pulse"
            />
        </svg>
    );

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-medium text-[#EAFFD2]">Instant <span className="text-[#9FDC56]">Swap</span></h1>
                <p className="text-zinc-500 mt-2">AMM-based energy token exchange with low slippage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                
                {/* Swap Interface Card */}
                <div className="bg-[#1a1d1a] border border-[#2b2f2b] p-6 rounded-3xl shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-white">Market</span>
                        <Settings className="text-zinc-500 hover:text-white cursor-pointer" size={18} />
                    </div>

                    {/* From Input */}
                    <div className="bg-[#161815] border border-[#2b2f2b] p-4 rounded-2xl mb-2 hover:border-[#9FDC56]/30 transition-colors">
                         <div className="flex justify-between mb-2">
                             <span className="text-xs text-zinc-500 font-bold uppercase">From</span>
                             <span className="text-xs text-[#9FDC56]">Balance: 24,500</span>
                         </div>
                         <div className="flex justify-between items-center">
                             <input 
                                value={fromVal} 
                                onChange={e => setFromVal(e.target.value)}
                                className="bg-transparent text-3xl font-black text-white w-full outline-none placeholder-zinc-700" 
                            />
                             <button className="flex items-center gap-2 bg-[#2b2f2b] hover:bg-[#3a3e3a] px-3 py-1.5 rounded-xl transition-colors shrink-0">
                                <Sun size={16} className="text-yellow-500" />
                                <span className="font-bold text-sm">Solar</span>
                             </button>
                         </div>
                         <div className="text-xs text-zinc-600 mt-2">$42.00 USD</div>
                    </div>

                    {/* Flipper */}
                    <div className="flex justify-center -my-4 relative z-10">
                        <div className="bg-[#1a1d1a] border border-[#2b2f2b] p-2 rounded-xl text-[#9FDC56] hover:scale-110 transition-transform cursor-pointer">
                            <ArrowDownUp size={18} />
                        </div>
                    </div>

                    {/* To Input */}
                    <div className="bg-[#161815] border border-[#2b2f2b] p-4 rounded-2xl mt-2 hover:border-[#545FFF]/30 transition-colors">
                         <div className="flex justify-between mb-2">
                             <span className="text-xs text-zinc-500 font-bold uppercase">To (Estimate)</span>
                        </div>
                         <div className="flex justify-between items-center">
                             <input 
                                value="114.2" 
                                readOnly
                                className="bg-transparent text-3xl font-black text-[#545FFF] w-full outline-none" 
                            />
                             <button className="flex items-center gap-2 bg-[#2b2f2b] hover:bg-[#3a3e3a] px-3 py-1.5 rounded-xl transition-colors shrink-0">
                                <Wind size={16} className="text-[#545FFF]" />
                                <span className="font-bold text-sm">Wind</span>
                             </button>
                         </div>
                         <div className="text-xs text-zinc-600 mt-2">Price Impact -0.05%</div>
                    </div>

                    <button className="w-full mt-6 py-4 bg-[#9FDC56] text-[#161815] font-black text-lg rounded-2xl hover:brightness-110 shadow-[0_0_20px_rgba(159,220,86,0.3)] transition-all flex items-center justify-center gap-2">
                         Swap Energy
                    </button>
                </div>

                {/* Pool Status Side Panel */}
                <div className="space-y-4">
                    <h3 className="font-bold text-zinc-400 uppercase text-xs tracking-wider mb-4">Liquidity Pools</h3>
                    {[ 
                        { name: 'Solar', icon: <Sun />, color: '#FFD700', price: '1.02' }, 
                        { name: 'Wind', icon: <Wind />, color: '#545FFF', price: '0.98' },
                        { name: 'Hydro', icon: <Waves />, color: '#00CED1', price: '1.15' } 
                    ].map(p => (
                        <div key={p.name} className="bg-[#1a1d1a] border border-[#2b2f2b] p-4 rounded-2xl flex items-center justify-between hover:border-zinc-600 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                                    {p.icon}
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{p.name} Pool</div>
                                    <div className="text-[10px] text-zinc-500">TVL: $1.2M</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-white">{p.price} GRID</div>
                                <MiniChart color={p.color} />
                            </div>
                        </div>
                    ))}
                    
                    <div className="bg-[#1a1d1a]/50 p-4 rounded-2xl border border-[#2b2f2b] border-dashed mt-6">
                        <div className="flex gap-2 text-zinc-500 text-xs">
                            <RefreshCw className="animate-spin-slow" size={14} />
                            <span>Routing via Solar &#8594; GRID &#8594; Wind</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergySwap;