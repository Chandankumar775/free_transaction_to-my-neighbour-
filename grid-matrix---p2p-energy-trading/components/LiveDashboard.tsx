import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, ArrowUpRight, ArrowDownRight, Activity, Battery } from 'lucide-react';

// Simulated mock data
const mockTrades = [
    { id: "TX-8F2A", from: "Node_Alpha", to: "Node_Beta", amount: "12.4 kWh", price: "0.052 ETH", status: "settled", time: "2m ago" },
    { id: "TX-3C7D", from: "Node_Gamma", to: "Node_Delta", amount: "8.7 kWh", price: "0.034 ETH", status: "pending", time: "5m ago" },
    { id: "TX-1E9B", from: "Node_Epsilon", to: "Node_Alpha", amount: "22.1 kWh", price: "0.089 ETH", status: "settled", time: "8m ago" },
    { id: "TX-5A4F", from: "Node_Zeta", to: "Node_Gamma", amount: "5.3 kWh", price: "0.021 ETH", status: "settled", time: "12m ago" },
    { id: "TX-9D6E", from: "Node_Beta", to: "Node_Zeta", amount: "15.8 kWh", price: "0.063 ETH", status: "matching", time: "15m ago" },
];

const LiveDashboard: React.FC = () => {
    const [activeProducers, setActiveProducers] = useState(1247);
    const [activeConsumers, setActiveConsumers] = useState(3891);
    const [gridLoad, setGridLoad] = useState(67);
    const [energyPrice, setEnergyPrice] = useState(0.042);

    // Simulate live data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveProducers(prev => prev + Math.floor(Math.random() * 5) - 2);
            setActiveConsumers(prev => prev + Math.floor(Math.random() * 8) - 3);
            setGridLoad(prev => Math.min(100, Math.max(40, prev + (Math.random() * 4 - 2))));
            setEnergyPrice(prev => Math.max(0.01, +(prev + (Math.random() * 0.006 - 0.003)).toFixed(3)));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section id="dashboard" className="py-40 px-8 md:px-16 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">LIVE PREVIEW</p>
                    <h2 className="text-6xl md:text-[7rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-8">
                        TRADING DASHBOARD
                    </h2>
                    <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-medium">
                        Real-time monitoring of the Grid Matrix network. Track trades, manage energy listings, and earn rewards.
                    </p>
                </div>

                {/* Dashboard Preview */}
                <div className="glass rounded-[3rem] border-zinc-800/50 overflow-hidden">
                    {/* Dashboard Header */}
                    <div className="px-8 py-5 border-b border-zinc-800/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-4 text-zinc-500 text-xs font-bold uppercase tracking-widest">Grid Matrix — Dashboard v2.1</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-green-500 text-[10px] font-black uppercase tracking-widest">LIVE</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 border-b border-zinc-800/50">
                        <div className="p-8 border-r border-zinc-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-4 h-4 text-orange-500" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Producers</span>
                            </div>
                            <div className="text-3xl font-black tracking-tight">{activeProducers.toLocaleString()}</div>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight className="w-3 h-3 text-green-500" />
                                <span className="text-green-500 text-xs font-bold">+12.4%</span>
                            </div>
                        </div>

                        <div className="p-8 border-r border-zinc-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Battery className="w-4 h-4 text-amber-500" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Consumers</span>
                            </div>
                            <div className="text-3xl font-black tracking-tight">{activeConsumers.toLocaleString()}</div>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowUpRight className="w-3 h-3 text-green-500" />
                                <span className="text-green-500 text-xs font-bold">+8.7%</span>
                            </div>
                        </div>

                        <div className="p-8 border-r border-zinc-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Activity className="w-4 h-4 text-yellow-500" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Grid Load</span>
                            </div>
                            <div className="text-3xl font-black tracking-tight">{gridLoad.toFixed(1)}%</div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full mt-3">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
                                    style={{ width: `${gridLoad}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Energy Price</span>
                            </div>
                            <div className="text-3xl font-black tracking-tight">{energyPrice} <span className="text-lg text-zinc-500">ETH/kWh</span></div>
                            <div className="flex items-center gap-1 mt-2">
                                <ArrowDownRight className="w-3 h-3 text-red-400" />
                                <span className="text-red-400 text-xs font-bold">-2.1%</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Trades Table */}
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Recent Trades</h4>
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">VIEW ALL →</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-zinc-800/50">
                                        <th className="text-left py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">TX ID</th>
                                        <th className="text-left py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">From</th>
                                        <th className="text-left py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">To</th>
                                        <th className="text-left py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Amount</th>
                                        <th className="text-left py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Price</th>
                                        <th className="text-left py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Status</th>
                                        <th className="text-right py-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockTrades.map((trade) => (
                                        <tr key={trade.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                                            <td className="py-4 font-black text-orange-500 text-xs tracking-wider">{trade.id}</td>
                                            <td className="py-4 font-bold text-zinc-300">{trade.from}</td>
                                            <td className="py-4 font-bold text-zinc-300">{trade.to}</td>
                                            <td className="py-4 font-black text-white">{trade.amount}</td>
                                            <td className="py-4 font-bold text-zinc-300">{trade.price}</td>
                                            <td className="py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trade.status === 'settled' ? 'bg-green-500/10 text-green-500' :
                                                        trade.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {trade.status}
                                                </span>
                                            </td>
                                            <td className="py-4 text-right text-zinc-500 font-bold text-xs">{trade.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveDashboard;
