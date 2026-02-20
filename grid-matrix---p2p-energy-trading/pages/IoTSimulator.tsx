import React, { useState, useEffect } from 'react';
import { Battery, Sun, Thermometer, Gauge, Wifi, WifiOff, Zap, Wind, CloudRain, Activity } from 'lucide-react';

const randBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const GaugeRing = ({ value, max, color, label, unit }: { value: number; max: number; color: string; label: string; unit: string }) => {
    const pct = Math.min(value / max, 1);
    const circumference = 2 * Math.PI * 42;
    const offset = circumference * (1 - pct * 0.75);
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-36">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-[135deg]">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#2b2f2b" strokeWidth="6" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeLinecap="round" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} strokeDashoffset={offset} strokeLinecap="round"
                        style={{ filter: `drop-shadow(0 0 6px ${color}80)`, transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#EAFFD2]">{value.toFixed(1)}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{unit}</span>
                </div>
            </div>
            <span className="text-xs font-bold text-zinc-400 mt-2">{label}</span>
        </div>
    );
};

const IoTSimulator: React.FC = () => {
    const [data, setData] = useState({
        solarOutput: 11.2, windOutput: 3.8, batteryLevel: 78, batteryCharging: true,
        temperature: 34.2, inverterEff: 97.5, gridFreq: 50.02, voltage: 232.4,
        humidity: 45, consumption: 4.2, exported: 7.8, co2Saved: 12.4,
    });
    const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'warn' | 'success' }[]>([
        { time: '14:23:01', msg: 'Solar panel output optimal', type: 'success' },
        { time: '14:22:45', msg: 'Battery charging at 2.4 kW', type: 'info' },
        { time: '14:22:30', msg: 'Wind turbine speed: 12 m/s', type: 'info' },
        { time: '14:21:55', msg: 'Grid export: 7.8 kWh today', type: 'success' },
        { time: '14:21:10', msg: 'Temperature warning: 34.2C', type: 'warn' },
    ]);
    const [online, setOnline] = useState(true);

    useEffect(() => {
        if (!online) return; // Stop simulation when offline
        const interval = setInterval(() => {
            setData(prev => ({
                solarOutput: Math.max(0, prev.solarOutput + randBetween(-0.5, 0.5)),
                windOutput: Math.max(0, prev.windOutput + randBetween(-0.3, 0.3)),
                batteryLevel: Math.min(100, Math.max(0, prev.batteryLevel + randBetween(-0.5, 0.8))),
                batteryCharging: prev.batteryLevel < 95,
                temperature: prev.temperature + randBetween(-0.3, 0.3),
                inverterEff: Math.min(99.9, Math.max(90.0, prev.inverterEff + randBetween(-0.2, 0.2))),
                gridFreq: 50 + randBetween(-0.05, 0.05),
                voltage: 230 + randBetween(-3, 3),
                humidity: Math.min(100, Math.max(20, prev.humidity + randBetween(-1, 1))),
                consumption: Math.max(0.5, prev.consumption + randBetween(-0.3, 0.3)),
                exported: prev.exported + randBetween(0, 0.02),
                co2Saved: prev.co2Saved + randBetween(0, 0.01),
            }));
            // Generate live log entries
            const now = new Date().toLocaleTimeString('en-US', { hour12: false });
            const logMsgs = [
                { msg: `Solar output: ${(11 + Math.random() * 3).toFixed(1)} kW`, type: 'success' as const },
                { msg: `Battery charging at ${(1.5 + Math.random() * 2).toFixed(1)} kW`, type: 'info' as const },
                { msg: `Grid frequency: ${(49.97 + Math.random() * 0.06).toFixed(2)} Hz`, type: 'info' as const },
                { msg: `Exported ${(7 + Math.random() * 2).toFixed(1)} kWh today`, type: 'success' as const },
                { msg: `Temperature: ${(33 + Math.random() * 4).toFixed(1)}°C`, type: Math.random() > 0.5 ? 'warn' as const : 'info' as const },
            ];
            const pick = logMsgs[Math.floor(Math.random() * logMsgs.length)];
            setLogs(prev => [{ time: now, ...pick }, ...prev.slice(0, 9)]);
        }, 2000);
        return () => clearInterval(interval);
    }, [online]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#EAFFD2]">IoT Simulator</h1>
                    <p className="text-zinc-500 text-sm mt-1">Real-time device telemetry & energy monitoring</p>
                </div>
                <button onClick={() => setOnline(o => !o)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${online ? 'bg-[#9FDC56]/10 text-[#9FDC56] border border-[#9FDC56]/20' : 'bg-[#FF7366]/10 text-[#FF7366] border border-[#FF7366]/20'}`}>
                    {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    {online ? 'System Online' : 'System Offline'}
                </button>
            </div>

            {/* Gauges Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 flex justify-center">
                    <GaugeRing value={data.solarOutput} max={15} color="#9FDC56" label="Solar Output" unit="kW" />
                </div>
                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 flex justify-center">
                    <GaugeRing value={data.windOutput} max={8} color="#545FFF" label="Wind Output" unit="kW" />
                </div>
                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 flex justify-center">
                    <GaugeRing value={data.batteryLevel} max={100} color={data.batteryLevel > 20 ? '#9FDC56' : '#FF7366'} label="Battery" unit="%" />
                </div>
                <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 flex justify-center">
                    <GaugeRing value={data.inverterEff} max={100} color="#EAFFD2" label="Inverter Eff." unit="%" />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { icon: <Thermometer className="w-4 h-4" />, label: 'Temperature', val: `${data.temperature.toFixed(1)}°C`, color: data.temperature > 35 ? '#FF7366' : '#EAFFD2' },
                    { icon: <Activity className="w-4 h-4" />, label: 'Grid Frequency', val: `${data.gridFreq.toFixed(2)} Hz`, color: '#9FDC56' },
                    { icon: <Zap className="w-4 h-4" />, label: 'Voltage', val: `${data.voltage.toFixed(1)} V`, color: '#545FFF' },
                    { icon: <CloudRain className="w-4 h-4" />, label: 'Humidity', val: `${data.humidity.toFixed(0)}%`, color: '#EAFFD2' },
                    { icon: <Zap className="w-4 h-4" />, label: 'Consumption', val: `${data.consumption.toFixed(1)} kW`, color: '#FF7366' },
                    { icon: <Sun className="w-4 h-4" />, label: 'Exported Today', val: `${data.exported.toFixed(1)} kWh`, color: '#9FDC56' },
                    { icon: <Wind className="w-4 h-4" />, label: 'CO2 Saved', val: `${data.co2Saved.toFixed(1)} kg`, color: '#9FDC56' },
                    { icon: <Battery className="w-4 h-4" />, label: 'Battery Status', val: data.batteryCharging ? 'Charging' : 'Full', color: data.batteryCharging ? '#545FFF' : '#9FDC56' },
                ].map((m, i) => (
                    <div key={i} className="rounded-xl bg-[#1a1d1a] border border-[#2b2f2b] p-4 hover:border-[#3a3e3a] transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <span style={{ color: m.color }}>{m.icon}</span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{m.label}</span>
                        </div>
                        <span className="text-lg font-bold" style={{ color: m.color }}>{m.val}</span>
                    </div>
                ))}
            </div>

            {/* System Logs */}
            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                <h3 className="text-sm font-bold text-[#EAFFD2] mb-4">System Logs</h3>
                <div className="space-y-2 font-mono text-xs">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#161815] border border-[#2b2f2b]">
                            <span className="text-zinc-600">{log.time}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${log.type === 'success' ? 'bg-[#9FDC56]' : log.type === 'warn' ? 'bg-[#FF7366]' : 'bg-[#545FFF]'}`}></span>
                            <span className="text-zinc-400">{log.msg}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IoTSimulator;