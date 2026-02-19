import React, { useState } from 'react';
import {
    Activity, Zap, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Battery, Sun, Wallet, ChevronRight, Settings,
    Wind, CloudRain, Leaf
} from 'lucide-react';

/* ─────────────────── Enhanced SVG Components ─────────────────── */
const AreaChart = () => (
    <div className="relative h-64 w-full overflow-hidden group">
        <svg viewBox="0 0 800 200" className="w-full h-full text-[#9FDC56]" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#9FDC56" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#9FDC56" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path 
                d="M0,150 C100,120 200,80 300,110 C400,140 500,60 600,80 C700,100 750,40 800,60 V200 H0 Z" 
                fill="url(#chartGradient)" 
                className="transition-all duration-1000 ease-in-out group-hover:opacity-80"
            />
            <path 
                d="M0,150 C100,120 200,80 300,110 C400,140 500,60 600,80 C700,100 750,40 800,60" 
                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" 
                className="drop-shadow-[0_0_10px_rgba(159,220,86,0.5)]"
            />
        </svg>
        
        {/* Interactive Hover Line */}
        <div className="absolute top-0 bottom-0 left-[60%] w-px bg-gradient-to-b from-transparent via-[#9FDC56]/50 to-transparent border-r border-dashed border-[#9FDC56]/30 pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity">
            <div className="absolute top-[40%] -left-[6px] w-3 h-3 bg-[#161815] rounded-full border-2 border-[#9FDC56] shadow-[0_0_15px_#9FDC56] animate-pulse"></div>
            <div className="absolute top-[10%] left-4 bg-[#161815]/90 backdrop-blur-xl border border-[#9FDC56]/30 p-3 rounded-xl shadow-2xl animate-fade-in-up">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Current Output</div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">452</span>
                    <span className="text-xs font-bold text-[#9FDC56]">kWh</span>
                </div>
            </div>
        </div>
    </div>
);

const SourceCard = ({ icon: Icon, label, value, sub, color }: any) => (
    <div className="relative overflow-hidden rounded-[20px] bg-[#1a1d1a] border border-[#2b2f2b] p-5 group hover:border-[#9FDC56]/30 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} color={color} />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 shadow-lg" style={{ backgroundColor: `${color}15`, color: color }}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-black text-white mb-1">{value}</h3>
                <p className="text-[10px] font-bold" style={{ color: color }}>{sub}</p>
            </div>
        </div>
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2b2f2b]">
            <div className="h-full transition-all duration-1000" style={{ width: '65%', backgroundColor: color }}></div>
        </div>
    </div>
);

/* ─────────────────── Main Dashboard ─────────────────── */
const Dashboard: React.FC = () => {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#2b2f2b]">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-medium text-[#EAFFD2] tracking-tight">
                        Grid <span className="font-serif italic text-[#9FDC56]">Overview</span>
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-[#1a1d1a] px-3 py-1 rounded-full border border-[#2b2f2b]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9FDC56] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9FDC56]"></span>
                            </span>
                            Live Connection
                        </span>
                        <span className="text-xs text-zinc-500">Last updated: Just now</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="h-11 px-6 rounded-xl border border-[#2b2f2b] bg-[#1a1d1a] text-zinc-400 text-sm font-bold hover:text-white hover:border-zinc-500 transition-all flex items-center gap-2">
                        <Settings size={16} /> Customize
                    </button>
                    <button className="h-11 px-6 rounded-xl bg-[#9FDC56] text-[#161815] text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(159,220,86,0.3)]">
                        <Zap size={16} className="fill-current" /> Auto-Trade: ON
                    </button>
                </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Main Production Card */}
                <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9FDC56]/20 to-transparent opacity-50 transition-opacity group-hover:opacity-70"></div>
                 
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className="bg-[#161815]/40 backdrop-blur-md p-3 rounded-2xl border border-[#9FDC56]/20">
                                <Zap className="text-[#9FDC56] fill-[#9FDC56]" size={24} />
                            </div>
                            <span className="px-3 py-1 rounded-lg bg-[#9FDC56] text-[#161815] text-xs font-bold flex items-center gap-1 shadow-[0_0_10px_#9FDC56]">
                                <TrendingUp size={12} /> +12.4%
                            </span>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                                452.8 <span className="text-2xl text-[#9FDC56] font-medium font-serif italic opacity-80">kWh</span>
                            </h3>
                            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
                                Total Production <span className="w-1 h-1 rounded-full bg-zinc-500"></span> Today
                            </p>
                        </div>
                    </div>
                    {/* Decorative Background Chart */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
                         <svg viewBox="0 0 400 100" className="w-full h-full text-[#9FDC56] fill-current" preserveAspectRatio="none">
                            <path d="M0,100 C150,80 200,20 400,60 V100 H0 Z" />
                         </svg>
                    </div>
                </div>

                {/* 2. Wallet Balance */}
                <div className="rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] p-6 flex flex-col justify-between group hover:border-[#9FDC56]/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start z-10">
                        <div>
                             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Wallet Balance</p>
                             <h3 className="text-3xl font-black text-white">2.458 <span className="text-lg text-zinc-600 font-medium">ETH</span></h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#2b2f2b] flex items-center justify-center text-zinc-400 group-hover:bg-[#9FDC56] group-hover:text-[#161815] transition-colors shadow-lg">
                            <Wallet size={18} />
                        </div>
                    </div>
                     <div className="flex gap-2 mt-auto z-10 w-full">
                        <button className="flex-1 py-3 rounded-xl bg-[#9FDC56]/10 text-[#9FDC56] text-xs font-bold hover:bg-[#9FDC56] hover:text-[#161815] transition-all border border-[#9FDC56]/20">Deposit</button>
                        <button className="flex-1 py-3 rounded-xl bg-[#2b2f2b] text-zinc-400 text-xs font-bold hover:text-white hover:bg-[#3a3e3a] transition-all">Withdraw</button>
                     </div>
                </div>

                {/* 3. Efficiency Ring */}
                <div className="rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] p-6 relative overflow-hidden group">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 relative z-10">Grid Efficiency</p>
                    <div className="relative z-10 flex items-center gap-4 mt-2">
                        <div className="relative w-24 h-24">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="#2b2f2b" strokeWidth="8" fill="transparent" />
                                <circle cx="48" cy="48" r="40" stroke="#9FDC56" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="5" strokeLinecap="round" className="animate-[dash_1.5s_ease-out_forwards]" />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-white">98%</span>
                             </div>
                        </div>
                        <div className="space-y-1">
                             <p className="text-sm font-bold text-white">Excellent</p>
                             <p className="text-[10px] text-zinc-500 leading-tight">System performing optimally. No outages.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Viz & Energy Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* Large Chart Section */}
                <div className="col-span-1 lg:col-span-2 rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] p-1 shadow-2xl">
                    <div className="bg-[#161815] rounded-[22px] p-8 h-full">
                        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Production Forecast <span className="px-2 py-0.5 rounded text-[10px] bg-[#9FDC56]/10 text-[#9FDC56] border border-[#9FDC56]/20">AI Model v2</span>
                                </h3>
                            </div>
                            <div className="flex bg-[#1a1d1a] rounded-xl p-1 border border-[#2b2f2b]">
                                {['1H', '24H', '1W', '1M'].map((t, i) => (
                                    <button key={t} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${i === 1 ? 'bg-[#9FDC56] text-[#161815] shadow-lg' : 'text-zinc-500 hover:text-white'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <AreaChart />
                        <div className="flex justify-between mt-6 pt-6 border-t border-[#2b2f2b]">
                            {[
                                { label: 'Peak Output', value: '520 kWh', sub: '12:00 PM' },
                                { label: 'Lowest Output', value: '45 kWh', sub: '04:00 AM' },
                                { label: 'Avg. Price', value: '$0.14', sub: 'per kWh' }
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{s.label}</p>
                                    <p className="text-lg font-black text-white">{s.value}</p>
                                    <p className="text-[10px] text-zinc-600">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vertical Energy Sources Mix */}
                <div className="col-span-1 space-y-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white text-lg">Energy Mix</h3>
                        <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#9FDC56]"></span>
                            <span className="w-2 h-2 rounded-full bg-[#545FFF]"></span>
                        </div>
                    </div>
                    
                    <div className="flex-1 grid grid-rows-3 gap-4">
                        <SourceCard 
                            icon={Sun} label="Solar Arrays" 
                            value="284.5 kWh" sub="62% of total" 
                            color="#FFD700" 
                        />
                        <SourceCard 
                            icon={Wind} label="Wind Turbines" 
                            value="128.2 kWh" sub="28% of total" 
                            color="#545FFF" 
                        />
                        <SourceCard 
                            icon={CloudRain} label="Hydro / Other" 
                            value="42.1 kWh" sub="10% of total" 
                            color="#9FDC56" 
                        />
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;