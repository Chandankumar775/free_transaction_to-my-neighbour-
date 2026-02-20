import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Battery, Sun, ArrowUpRight, Thermometer, Clock, RefreshCw, Loader2, Save } from 'lucide-react';
import { getEnergyStats, upsertEnergyStats } from '../lib/supabase';
import { useWallet } from '../lib/WalletContext';

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

const WeeklyProduction = ({ weekData }: { weekData: number[] }) => (
    <div className="h-48 flex items-end justify-between gap-2 mt-4">
        {weekData.map((h, i) => (
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

const DEMO_WALLET = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const MyEnergy: React.FC = () => {
    const { address } = useWallet();
    const walletAddr = address || DEMO_WALLET;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [production, setProduction] = useState(12.5);
    const [consumption, setConsumption] = useState(4.2);
    const [batteryPct, setBatteryPct] = useState(87);
    const [batteryKwh, setBatteryKwh] = useState(12.4);
    const [panelTemp, setPanelTemp] = useState(42);
    const [efficiency, setEfficiency] = useState(98);
    const [uptimeHrs, setUptimeHrs] = useState(338);
    const [weekData, setWeekData] = useState([45, 60, 35, 70, 85, 55, 65]);

    const net = production - consumption;

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await getEnergyStats(walletAddr);
            if (data) {
                setProduction(data.production_kwh ?? 12.5);
                setConsumption(data.consumption_kwh ?? 4.2);
                setBatteryPct(data.battery_percent ?? 87);
                setBatteryKwh(data.battery_kwh ?? 12.4);
                setPanelTemp(data.panel_temp_c ?? 42);
                setEfficiency(data.efficiency_percent ?? 98);
                setUptimeHrs(data.uptime_hours ?? 338);
            }
        } catch { /* keep defaults */ }
        setLoading(false);
    }, [walletAddr]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleSave = async () => {
        setSaving(true);
        await upsertEnergyStats({
            wallet_address: walletAddr,
            production_kwh: production,
            consumption_kwh: consumption,
            battery_percent: batteryPct,
            battery_kwh: batteryKwh,
            panel_temp_c: panelTemp,
            efficiency_percent: efficiency,
            uptime_hours: uptimeHrs,
        });
        setSaving(false);
    };

    const simulateUpdate = () => {
        // Simulate IoT sensor data change
        setProduction(+(Math.random() * 15 + 5).toFixed(1));
        setConsumption(+(Math.random() * 6 + 1).toFixed(1));
        setBatteryPct(Math.floor(Math.random() * 30 + 65));
        setPanelTemp(Math.floor(Math.random() * 20 + 30));
        setEfficiency(Math.floor(Math.random() * 8 + 92));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                   <h2 className="text-2xl font-bold tracking-tight text-[#EAFFD2]">My Energy Station</h2>
                   <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Real-time monitoring of your production assets</p>
                </div>
                <div className="flex gap-2">
                     <button onClick={simulateUpdate} className="px-3 py-1.5 rounded-lg bg-[#2b2f2b] text-zinc-400 text-[11px] font-bold border border-[#3a3e3a] hover:text-white transition-colors flex items-center gap-1.5">
                        <RefreshCw className="w-3 h-3" /> Simulate IoT
                     </button>
                     <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 rounded-lg bg-[#9FDC56]/10 text-[#9FDC56] text-[11px] font-bold border border-[#9FDC56]/20 hover:bg-[#9FDC56] hover:text-[#161815] transition-colors flex items-center gap-1.5 disabled:opacity-50">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} {saving ? 'Saving...' : 'Save to DB'}
                     </button>
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
                     <p className="text-4xl font-black text-[#9FDC56] tracking-tight">{production} <span className="text-lg font-bold text-[#EAFFD2]">kW</span></p>
                     <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9FDC56]/10 text-[#9FDC56] text-[10px] font-bold">
                        <ArrowUpRight className="w-3 h-3" /> +{Math.round((production / 11.2 - 1) * 100)}% from avg
                     </div>
                </div>

                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 relative overflow-hidden group hover:border-[#3a3e3a] transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-20 h-20 text-zinc-500" /></div>
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Consumption</h3>
                     <p className="text-4xl font-black text-[#EAFFD2] tracking-tight">{consumption} <span className="text-lg font-bold text-zinc-500">kW</span></p>
                     <p className="text-xs text-zinc-500 mt-4 font-medium">Net Exporting: <span className="text-[#9FDC56] font-bold">{net.toFixed(1)} kW</span></p>
                </div>

                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 relative overflow-hidden group hover:border-[#3a3e3a] transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Battery className="w-20 h-20 text-[#545FFF]" /></div>
                     <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Battery Storage</h3>
                     <div className="flex items-baseline gap-2">
                        <p className="text-4xl font-black text-[#545FFF] tracking-tight">{batteryPct}<span className="text-xl">%</span></p>
                        <span className="text-[11px] font-bold text-zinc-500">{batteryKwh} kWh stored</span>
                     </div>
                     <div className="w-full bg-[#161815] h-1.5 rounded-full mt-5 overflow-hidden">
                        <div className="bg-[#545FFF] h-full rounded-full transition-all duration-700" style={{ width: `${batteryPct}%` }} />
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Production Chart */}
                <div className="col-span-1 lg:col-span-2 rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-[#EAFFD2]">Production History</h3>
                        <button onClick={loadData} className="text-[11px] font-bold text-[#9FDC56] hover:text-[#EAFFD2] flex items-center gap-1 transition-colors">
                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>
                    <WeeklyProduction weekData={weekData} />
                </div>

                {/* System Health Gauges */}
                <div className="col-span-1 rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                    <h3 className="text-lg font-bold text-[#EAFFD2] mb-6">System Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <GaugeChart value={panelTemp} max={60} label="Temp °C" color="#FF7366" /> 
                        <GaugeChart value={efficiency} max={100} label="Efficiency" color="#9FDC56" />
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                            <div className="flex items-center gap-2">
                                <Thermometer className="w-4 h-4 text-[#FF7366]" />
                                <span className="text-xs font-bold text-zinc-400">Panel Temp</span>
                            </div>
                            <span className="text-xs font-bold text-[#EAFFD2]">{panelTemp}°C</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#545FFF]" />
                                <span className="text-xs font-bold text-zinc-400">Uptime</span>
                            </div>
                            <span className="text-xs font-bold text-[#EAFFD2]">{Math.floor(uptimeHrs / 24)}d {uptimeHrs % 24}h</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyEnergy;