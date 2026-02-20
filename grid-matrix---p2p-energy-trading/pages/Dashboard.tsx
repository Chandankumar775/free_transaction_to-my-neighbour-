import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Zap, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Battery, Sun, Wallet, ChevronRight, Settings,
    Wind, CloudRain, Leaf, Loader2, ShoppingCart, BarChart3,
    X, Eye, EyeOff
} from 'lucide-react';
import { getEnergyStats, upsertEnergyStats } from '../lib/supabase';
import { useWallet } from '../lib/WalletContext';

/* ─────────────────── Helpers ─────────────────── */
const jitter = (base: number, delta: number) =>
    Math.max(0, +(base + (Math.random() * 2 - 1) * delta).toFixed(2));
const fmtClock = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const CHART_POINTS = 40;

/* ─────────────────── Dynamic Area Chart ─────────────────── */
const DynamicAreaChart: React.FC<{ data: number[] }> = ({ data }) => {
    const [hoverIdx, setHoverIdx] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    if (data.length < 2) return null;
    const maxVal = Math.max(...data) * 1.1 || 1;
    const minVal = Math.min(...data) * 0.9;
    const range = maxVal - minVal || 1;
    const toX = (i: number) => (i / (data.length - 1)) * 800;
    const toY = (v: number) => 200 - ((v - minVal) / range) * 180;
    const pathD = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(v)}`).join(' ');
    const areaD = pathD + ` V200 H0 Z`;
    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 800;
        const idx = Math.round((x / 800) * (data.length - 1));
        setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
    };
    return (
        <div className="relative h-64 w-full overflow-hidden group">
            <svg ref={svgRef} viewBox="0 0 800 200" className="w-full h-full text-[#9FDC56] cursor-crosshair" preserveAspectRatio="none"
                onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIdx(null)}>
                <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#9FDC56" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#9FDC56" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill="url(#chartGradient)" className="transition-all duration-300" />
                <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(159,220,86,0.5)]" />
                {hoverIdx !== null && (
                    <>
                        <line x1={toX(hoverIdx)} y1={0} x2={toX(hoverIdx)} y2={200} stroke="#9FDC56" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                        <circle cx={toX(hoverIdx)} cy={toY(data[hoverIdx])} r="5" fill="#161815" stroke="#9FDC56" strokeWidth="2.5" />
                    </>
                )}
            </svg>
            {hoverIdx !== null && (
                <div className="absolute bg-[#161815]/95 backdrop-blur-xl border border-[#9FDC56]/30 p-3 rounded-xl shadow-2xl pointer-events-none z-10"
                    style={{ left: `${Math.min(80, Math.max(5, (hoverIdx / (data.length - 1)) * 100))}%`, top: '8px' }}>
                    <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Output</div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">{data[hoverIdx].toFixed(1)}</span>
                        <span className="text-xs font-bold text-[#9FDC56]">kWh</span>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ─────────────────── Customize Modal ─────────────────── */
const CustomizeModal: React.FC<{ visible: Record<string, boolean>; onToggle: (k: string) => void; onClose: () => void }> = ({ visible, onToggle, onClose }) => {
    const widgets = [
        { key: 'mainCard', label: 'Main Stats Card' },
        { key: 'wallet', label: 'Wallet Balance' },
        { key: 'efficiency', label: 'Grid Efficiency' },
        { key: 'chart', label: 'Production Chart' },
        { key: 'sources', label: 'Energy Sources' },
    ];
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-[#EAFFD2]">Customize Dashboard</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <p className="text-xs text-zinc-500 mb-4">Toggle which sections are visible on your dashboard.</p>
                <div className="space-y-2">
                    {widgets.map(w => (
                        <button key={w.key} onClick={() => onToggle(w.key)}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[#2b2f2b] hover:border-[#3a3e3a] transition-all">
                            <span className="text-sm font-medium text-[#EAFFD2]">{w.label}</span>
                            {visible[w.key] ? <Eye size={16} className="text-[#9FDC56]" /> : <EyeOff size={16} className="text-zinc-600" />}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-5 w-full py-3 bg-[#9FDC56] text-[#161815] rounded-xl font-bold text-sm hover:bg-[#8cc34b] transition-all">Done</button>
            </div>
        </div>
    );
};

/* ─────────────────── Wallet Deposit/Withdraw Modal ─────────────────── */
const WalletModal: React.FC<{ mode: 'deposit' | 'withdraw'; walletEth: number; onClose: () => void }> = ({ mode, walletEth, onClose }) => {
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleAction = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setProcessing(true);
        try {
            if (!(window as any).ethereum) throw new Error('MetaMask not found');
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
            const weiHex = '0x' + Math.floor(parseFloat(amount) * 1e18).toString(16);
            await (window as any).ethereum.request({
                method: 'eth_sendTransaction',
                params: [{ from: accounts[0], to: accounts[0], value: weiHex }],
            });
            setSuccess(true);
            setTimeout(() => { setSuccess(false); onClose(); }, 1500);
        } catch (e) { console.error(e); }
        setProcessing(false);
    };
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-[#EAFFD2]">{mode === 'deposit' ? 'Deposit ETH' : 'Withdraw ETH'}</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-colors"><X size={18} /></button>
                </div>
                <p className="text-xs text-zinc-500 mb-4">{mode === 'deposit' ? 'Add ETH to your wallet via MetaMask.' : `Available: ${walletEth.toFixed(4)} ETH`}</p>
                <input type="number" step="0.001" min="0" placeholder="0.00 ETH" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-[#161815] border border-[#2b2f2b] rounded-xl text-lg font-bold text-[#EAFFD2] placeholder-zinc-700 focus:outline-none focus:border-[#9FDC56]/50 mb-4" />
                {success ? (
                    <div className="py-3 text-center text-[#9FDC56] font-bold text-sm">Transaction sent!</div>
                ) : (
                    <button onClick={handleAction} disabled={processing || !amount}
                        className="w-full py-3 bg-[#9FDC56] text-[#161815] rounded-xl font-bold text-sm hover:bg-[#8cc34b] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {processing ? <><Loader2 size={16} className="animate-spin" /> Confirming...</> : mode === 'deposit' ? 'Deposit via MetaMask' : 'Withdraw via MetaMask'}
                    </button>
                )}
            </div>
        </div>
    );
};

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
const DEMO_WALLET = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { role, address } = useWallet();
    const isProducer = role === 'producer';
    const isConsumer = role === 'consumer';
    const walletAddr = address || DEMO_WALLET;

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        production_kwh: 452.8, consumption_kwh: 178.4, battery_percent: 87,
        battery_kwh: 12.4, panel_temp_c: 42, efficiency_percent: 98,
        solar_kwh: 284.5, wind_kwh: 128.2, hydro_kwh: 42.1, wallet_eth: 2.458,
    });

    // UI state
    const [timePeriod, setTimePeriod] = useState('24H');
    const [autoTradeOn, setAutoTradeOn] = useState(true);
    const [showCustomize, setShowCustomize] = useState(false);
    const [walletModal, setWalletModal] = useState<'deposit' | 'withdraw' | null>(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [chartData, setChartData] = useState<number[]>([]);
    const [widgetVis, setWidgetVis] = useState<Record<string, boolean>>({
        mainCard: true, wallet: true, efficiency: true, chart: true, sources: true,
    });

    // Derived
    const totalProd = stats.solar_kwh + stats.wind_kwh + stats.hydro_kwh;
    const solarPct = totalProd ? Math.round((stats.solar_kwh / totalProd) * 100) : 62;
    const windPct = totalProd ? Math.round((stats.wind_kwh / totalProd) * 100) : 28;
    const hydroPct = 100 - solarPct - windPct;
    const peakKwh = chartData.length ? Math.max(...chartData).toFixed(1) : '0';
    const lowKwh = chartData.length ? Math.min(...chartData).toFixed(1) : '0';
    const avgPrice = stats.wallet_eth > 0 ? (stats.wallet_eth / Math.max(1, stats.production_kwh)).toFixed(4) : '0.0003';
    const baselineProd = 402;
    const baselineCons = 184;
    const prodChange = ((stats.production_kwh - baselineProd) / baselineProd * 100).toFixed(1);
    const consChange = ((stats.consumption_kwh - baselineCons) / baselineCons * 100).toFixed(1);
    const savingsVsGrid = ((1 - parseFloat(avgPrice) / 0.0006) * 100).toFixed(1);

    // Load initial data
    useEffect(() => {
        (async () => {
            try {
                const { data } = await getEnergyStats(walletAddr);
                if (data) setStats(prev => ({ ...prev, ...data }));
            } catch { /* fallback */ }
            setLoading(false);
        })();
    }, [walletAddr]);

    // Generate initial chart
    useEffect(() => {
        const pts: number[] = [];
        let v = isProducer ? stats.production_kwh : stats.consumption_kwh;
        for (let i = 0; i < CHART_POINTS; i++) { v = jitter(v, v * 0.05); pts.push(v); }
        setChartData(pts);
    }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

    // Live ticking every 2s
    useEffect(() => {
        const id = setInterval(() => {
            setStats(prev => ({
                ...prev,
                production_kwh: jitter(prev.production_kwh, 2),
                consumption_kwh: jitter(prev.consumption_kwh, 1.5),
                battery_percent: Math.min(100, Math.max(10, Math.round(jitter(prev.battery_percent, 1)))),
                efficiency_percent: Math.min(100, Math.max(85, Math.round(jitter(prev.efficiency_percent, 0.5)))),
                solar_kwh: jitter(prev.solar_kwh, 1.5),
                wind_kwh: jitter(prev.wind_kwh, 1),
                hydro_kwh: jitter(prev.hydro_kwh, 0.5),
                wallet_eth: jitter(prev.wallet_eth, 0.002),
            }));
            setLastUpdated(new Date());
            setChartData(prev => {
                const last = prev[prev.length - 1] || 300;
                return [...prev.slice(-CHART_POINTS + 1), jitter(last, last * 0.04)];
            });
        }, 2000);
        return () => clearInterval(id);
    }, []);

    const toggleWidget = (k: string) => setWidgetVis(prev => ({ ...prev, [k]: !prev[k] }));

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#2b2f2b]">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-medium text-[#EAFFD2] tracking-tight">
                        {isProducer ? <>Producer <span className="font-serif italic text-[#FFD700]">Dashboard</span></> : <>Consumer <span className="font-serif italic text-[#545FFF]">Dashboard</span></>}
                    </h1>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-2 text-xs font-bold text-zinc-400 bg-[#1a1d1a] px-3 py-1 rounded-full border border-[#2b2f2b]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9FDC56] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9FDC56]"></span>
                            </span>
                            Live Connection
                        </span>
                        <span className="text-xs text-zinc-500">Last updated: {fmtClock(lastUpdated)}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowCustomize(true)} className="h-11 px-6 rounded-xl border border-[#2b2f2b] bg-[#1a1d1a] text-zinc-400 text-sm font-bold hover:text-white hover:border-zinc-500 transition-all flex items-center gap-2">
                        <Settings size={16} /> Customize
                    </button>
                    {isProducer ? (
                        <button onClick={() => { setAutoTradeOn(p => !p); navigate('/app/auto-trade'); }}
                            className={`h-11 px-6 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${autoTradeOn ? 'bg-[#FFD700] text-[#161815] hover:brightness-110 shadow-[0_0_20px_rgba(255,215,0,0.3)]' : 'bg-[#2b2f2b] text-zinc-400 hover:text-white border border-[#3a3e3a]'}`}>
                            <Zap size={16} className={autoTradeOn ? 'fill-current' : ''} /> Auto-Trade: {autoTradeOn ? 'ON' : 'OFF'}
                        </button>
                    ) : (
                        <button onClick={() => navigate('/app/marketplace')} className="h-11 px-6 rounded-xl bg-[#545FFF] text-white text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(84,95,255,0.3)]">
                            <ShoppingCart size={16} /> Browse Marketplace
                        </button>
                    )}
                </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 1. Main Card — Producer: Production / Consumer: Consumption */}
                {widgetVis.mainCard && (
                <div className="col-span-1 md:col-span-2 relative overflow-hidden rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${isProducer ? 'from-[#FFD700]/20' : 'from-[#545FFF]/20'} to-transparent opacity-50 transition-opacity group-hover:opacity-70`}></div>
                 
                    <div className="relative z-10 p-8 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start">
                            <div className={`bg-[#161815]/40 backdrop-blur-md p-3 rounded-2xl border ${isProducer ? 'border-[#FFD700]/20' : 'border-[#545FFF]/20'}`}>
                                {isProducer ? <Zap className="text-[#FFD700] fill-[#FFD700]" size={24} /> : <ShoppingCart className="text-[#545FFF]" size={24} />}
                            </div>
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                                isProducer
                                    ? (parseFloat(prodChange) >= 0 ? 'bg-[#FFD700] text-[#161815] shadow-[0_0_10px_#FFD700]' : 'bg-red-500/20 text-red-400')
                                    : (parseFloat(consChange) <= 0 ? 'bg-[#9FDC56] text-[#161815]' : 'bg-[#545FFF] text-white shadow-[0_0_10px_#545FFF]')
                            }`}>
                                {parseFloat(isProducer ? prodChange : consChange) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {isProducer ? `${parseFloat(prodChange) >= 0 ? '+' : ''}${prodChange}%` : `${parseFloat(consChange) >= 0 ? '+' : ''}${consChange}%`}
                            </span>
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                                {isProducer
                                    ? <>{stats.production_kwh.toFixed(1)} <span className="text-2xl text-[#FFD700] font-medium font-serif italic opacity-80">kWh</span></>
                                    : <>{stats.consumption_kwh.toFixed(1)} <span className="text-2xl text-[#545FFF] font-medium font-serif italic opacity-80">kWh</span></>}
                            </h3>
                            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center gap-2">
                                {isProducer ? 'Total Production' : 'Total Consumed'} <span className="w-1 h-1 rounded-full bg-zinc-500"></span> Today
                            </p>
                        </div>
                    </div>
                    {/* Decorative Background Chart */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 opacity-20 pointer-events-none">
                         <svg viewBox="0 0 400 100" className={`w-full h-full ${isProducer ? 'text-[#FFD700]' : 'text-[#545FFF]'} fill-current`} preserveAspectRatio="none">
                            <path d="M0,100 C150,80 200,20 400,60 V100 H0 Z" />
                         </svg>
                    </div>
                </div>
                )}

                {/* 2. Wallet Balance */}
                {widgetVis.wallet && (
                <div className="rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] p-6 flex flex-col justify-between group hover:border-[#9FDC56]/30 transition-all relative overflow-hidden">
                    <div className="flex justify-between items-start z-10">
                        <div>
                             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Wallet Balance</p>
                             <h3 className="text-3xl font-black text-white">{stats.wallet_eth.toFixed(3)} <span className="text-lg text-zinc-600 font-medium">ETH</span></h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#2b2f2b] flex items-center justify-center text-zinc-400 group-hover:bg-[#9FDC56] group-hover:text-[#161815] transition-colors shadow-lg">
                            <Wallet size={18} />
                        </div>
                    </div>
                     <div className="flex gap-2 mt-auto z-10 w-full">
                        <button onClick={() => setWalletModal('deposit')} className="flex-1 py-3 rounded-xl bg-[#9FDC56]/10 text-[#9FDC56] text-xs font-bold hover:bg-[#9FDC56] hover:text-[#161815] transition-all border border-[#9FDC56]/20">Deposit</button>
                        <button onClick={() => setWalletModal('withdraw')} className="flex-1 py-3 rounded-xl bg-[#2b2f2b] text-zinc-400 text-xs font-bold hover:text-white hover:bg-[#3a3e3a] transition-all">Withdraw</button>
                     </div>
                </div>
                )}

                {/* 3. Efficiency Ring */}
                {widgetVis.efficiency && (
                <div className="rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] p-6 relative overflow-hidden group">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1 relative z-10">Grid Efficiency</p>
                    <div className="relative z-10 flex items-center gap-4 mt-2">
                        <div className="relative w-24 h-24">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" stroke="#2b2f2b" strokeWidth="8" fill="transparent" />
                                <circle cx="48" cy="48" r="40" stroke="#9FDC56" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * stats.efficiency_percent) / 100} strokeLinecap="round" className="transition-all duration-700" />
                             </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-white">{stats.efficiency_percent}%</span>
                             </div>
                        </div>
                        <div className="space-y-1">
                             <p className="text-sm font-bold text-white">{stats.efficiency_percent >= 95 ? 'Excellent' : stats.efficiency_percent >= 85 ? 'Good' : 'Fair'}</p>
                             <p className="text-[10px] text-zinc-500 leading-tight">{stats.efficiency_percent >= 95 ? 'System performing optimally.' : 'Minor fluctuations detected.'}</p>
                        </div>
                    </div>
                </div>
                )}
            </div>

            {/* Main Viz & Energy Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                
                {/* Large Chart Section */}
                {widgetVis.chart && (
                <div className="col-span-1 lg:col-span-2 rounded-[24px] bg-[#1a1d1a] border border-[#2b2f2b] p-1 shadow-2xl">
                    <div className="bg-[#161815] rounded-[22px] p-8 h-full">
                        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {isProducer ? 'Production Forecast' : 'Consumption Trend'} <span className="px-2 py-0.5 rounded text-[10px] bg-[#9FDC56]/10 text-[#9FDC56] border border-[#9FDC56]/20">Live</span>
                                </h3>
                            </div>
                            <div className="flex bg-[#1a1d1a] rounded-xl p-1 border border-[#2b2f2b]">
                                {['1H', '24H', '1W', '1M'].map((t) => (
                                    <button key={t} onClick={() => setTimePeriod(t)} className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${timePeriod === t ? 'bg-[#9FDC56] text-[#161815] shadow-lg' : 'text-zinc-500 hover:text-white'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <DynamicAreaChart data={chartData} />
                        <div className="flex justify-between mt-6 pt-6 border-t border-[#2b2f2b]">
                            {[
                                { label: 'Peak Output', value: `${peakKwh} kWh`, sub: 'Session high' },
                                { label: 'Lowest Output', value: `${lowKwh} kWh`, sub: 'Session low' },
                                { label: 'Avg. Price', value: `${avgPrice} ETH`, sub: 'per kWh' }
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
                )}

                {/* Vertical Energy Sources / Consumer Stats */}
                {widgetVis.sources && (
                <div className="col-span-1 space-y-4 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-white text-lg">{isProducer ? 'Energy Mix' : 'Buying Summary'}</h3>
                        <div className="flex gap-1">
                            <span className={`w-2 h-2 rounded-full ${isProducer ? 'bg-[#FFD700]' : 'bg-[#545FFF]'}`}></span>
                            <span className="w-2 h-2 rounded-full bg-[#9FDC56]"></span>
                        </div>
                    </div>
                    
                    {isProducer ? (
                        <div className="flex-1 grid grid-rows-3 gap-4">
                            <SourceCard 
                                icon={Sun} label="Solar Arrays" 
                                value={`${stats.solar_kwh.toFixed(1)} kWh`} sub={`${solarPct}% of total`} 
                                color="#FFD700" 
                            />
                            <SourceCard 
                                icon={Wind} label="Wind Turbines" 
                                value={`${stats.wind_kwh.toFixed(1)} kWh`} sub={`${windPct}% of total`} 
                                color="#545FFF" 
                            />
                            <SourceCard 
                                icon={CloudRain} label="Hydro / Other" 
                                value={`${stats.hydro_kwh.toFixed(1)} kWh`} sub={`${hydroPct}% of total`} 
                                color="#9FDC56" 
                            />
                        </div>
                    ) : (
                        <div className="flex-1 grid grid-rows-3 gap-4">
                            <SourceCard 
                                icon={ShoppingCart} label="Energy Purchased" 
                                value={`${stats.consumption_kwh.toFixed(1)} kWh`} sub="Today's total" 
                                color="#545FFF" 
                            />
                            <SourceCard 
                                icon={Wallet} label="Total Spent" 
                                value={`${(stats.consumption_kwh * 0.00042).toFixed(4)} ETH`} sub="Avg 0.00042 ETH/kWh" 
                                color="#FFD700" 
                            />
                            <SourceCard 
                                icon={BarChart3} label="Savings vs Grid" 
                                value={`${savingsVsGrid}%`} sub="Cheaper than traditional grid" 
                                color="#9FDC56" 
                            />
                        </div>
                    )}
                </div>
                )}
            </div>

            {/* ── Modals ── */}
            {showCustomize && <CustomizeModal visible={widgetVis} onToggle={toggleWidget} onClose={() => setShowCustomize(false)} />}
            {walletModal && <WalletModal mode={walletModal} walletEth={stats.wallet_eth} onClose={() => setWalletModal(null)} />}
        </div>
    );
};

export default Dashboard;