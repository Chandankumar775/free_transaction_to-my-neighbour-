import React from 'react';
import { Zap, Battery, Sun, ArrowUpRight, Thermometer, Clock, RefreshCw } from 'lucide-react';

const GaugeChart = ({ value, max, label, color = '#9FDC56' }: { value: number; max: number; label: string; color?: string }) => {
    const percentage = (value / max) * 100;
    const strokeDasharray = 251.2; // 2 * pi * 40
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <div className="relative w-32 h-32 flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="rotate-[-90deg] w-full h-full">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2b2f2b" strokeWidth="8" />
                <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[#EAFFD2]">{value}</span>
                <span className="text-[10px] font-medium text-zinc-500 uppercase">{label}</span>
            </div>
        </div>
    );
};

const WeeklyProduction = () => (
    <div className="h-48 flex items-end justify-between gap-2 mt-4">
        {[45, 60, 35, 70, 85, 55, 65].map((h, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div 
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#9FDC56]/20 to-[#9FDC56] opacity-80 group-hover:opacity-100 transition-all duration-300 relative" 
                    style={{ height: `${h}%` }}
                >
                     <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#EAFFD2] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {h} kW
                     </div>
                </div>
                <span className="text-[10px] font-bold text-zinc-600 uppercase">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
            </div>
        ))}
    </div>
);

const MyEnergy: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold tracking-tight text-[#EAFFD2]">My Energy Station</h2>
                   <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Real-time monitoring of your production assets</p>
                </div>
                <div className="flex gap-2">
                     <span className="px-3 py-1.5 rounded-lg bg-[#9FDC56]/10 text-[#9FDC56] text-[11px] font-bold border border-[#9FDC56]/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9FDC56] animate-pulse" /> System Online
                     </span>
                </div>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#9FDC56]/[0.06] border border-[#9FDC56]/10 p-6 relative overflow-hidden group hover:border-[#9FDC56]/30 transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Sun className="w-20 h-20 text-[#9FDC56]" /></div>
                     <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-1">Current Production</h3>
                     <p className="text-4xl font-black text-[#9FDC56] tracking-tight">12.5 <span className="text-lg font-bold text-[#EAFFD2]">kW</span></p>
                     <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9FDC56]/10 text-[#9FDC56] text-[10px] font-bold">
                        <ArrowUpRight className="w-3 h-3" /> +12% from avg
                     </div>
                </div>

                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 relative overflow-hidden group hover:border-[#3a3e3a] transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-20 h-20 text-zinc-500" /></div>
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Consumption</h3>
                     <p className="text-4xl font-black text-[#EAFFD2] tracking-tight">4.2 <span className="text-lg font-bold text-zinc-500">kW</span></p>
                     <p className="text-xs text-zinc-500 mt-4 font-medium">Net Exporting: <span className="text-[#9FDC56] font-bold">8.3 kW</span></p>
                </div>

                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 relative overflow-hidden group hover:border-[#3a3e3a] transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Battery className="w-20 h-20 text-[#545FFF]" /></div>
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Battery Storage</h3>
                     <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-[#545FFF] tracking-tight">87<span className="text-xl">%</span></p>
                        <span className="text-[11px] font-bold text-zinc-500">12.4 kWh stored</span>
                     </div>
                     <div className="w-full bg-[#161815] h-1.5 rounded-full mt-5 overflow-hidden">
                        <div className="bg-[#545FFF] h-full rounded-full" style={{ width: '87%' }} />
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Production Chart */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-[#EAFFD2]">Production History</h3>
                        <button className="text-[11px] font-bold text-[#9FDC56] hover:text-[#EAFFD2] flex items-center gap-1 transition-colors">
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>
                    <WeeklyProduction />
                </div>

                {/* System Health Gauges */}
                <div className="col-span-1 rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                    <h3 className="text-lg font-bold text-[#EAFFD2] mb-6">System Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <GaugeChart value={42} max={60} label="Temp °C" color="#FF7366" /> 
                        <GaugeChart value={98} max={100} label="Efficiency" color="#9FDC56" />
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                            <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-[#FF7366]" />
                                <span className="text-xs font-bold text-zinc-400">Panel Temp</span>
                            </div>
                            <span className="text-xs font-bold text-[#EAFFD2]">42°C</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#545FFF]" />
                                <span className="text-xs font-bold text-zinc-400">Uptime</span>
                            </div>
                            <span className="text-xs font-bold text-[#EAFFD2]">14d 2h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEnergy;