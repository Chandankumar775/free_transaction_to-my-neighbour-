import React from 'react';
import { Coins, Users, Flame, Award } from 'lucide-react';

const tokenDistribution = [
    { label: "Community Rewards", pct: 40, color: "bg-orange-500" },
    { label: "Ecosystem Fund", pct: 25, color: "bg-amber-500" },
    { label: "Team & Advisors", pct: 15, color: "bg-yellow-500" },
    { label: "Liquidity Pool", pct: 10, color: "bg-red-500" },
    { label: "Reserve", pct: 10, color: "bg-orange-600" },
];

const tokenFeatures = [
    {
        icon: <Coins className="w-6 h-6 text-orange-500" />,
        title: "ENERGY TOKEN (GRID)",
        description: "The native utility token powering all P2P energy transactions, staking, governance, and rewards on the Grid Matrix protocol.",
    },
    {
        icon: <Users className="w-6 h-6 text-amber-500" />,
        title: "STAKING & YIELD",
        description: "Lock GRID tokens to validate microgrid transactions and earn passive yield. Higher stake = priority matching for better pricing.",
    },
    {
        icon: <Flame className="w-6 h-6 text-red-500" />,
        title: "DEFLATIONARY MODEL",
        description: "2% of every trade fee is burned permanently. As adoption grows, token supply decreases — creating natural scarcity.",
    },
    {
        icon: <Award className="w-6 h-6 text-yellow-500" />,
        title: "CARBON CREDITS",
        description: "Producers earn on-chain carbon credit NFTs tied to verified renewable energy production, tradeable on secondary markets.",
    },
];

const Tokenomics: React.FC = () => {
    return (
        <section id="token" className="py-40 px-8 md:px-16 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-32">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">ECONOMICS</p>
                    <h2 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-12">
                        TOKEN<br />ECONOMICS.
                    </h2>
                    <p className="text-zinc-400 text-xl max-w-3xl leading-relaxed font-medium">
                        The GRID token is the lifeblood of the decentralized energy economy — powering trades, governance, and rewards.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Token Distribution */}
                    <div className="glass p-10 rounded-[3rem] border-zinc-800/50">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10">Token Distribution</h3>

                        {/* Visual Bar */}
                        <div className="flex rounded-full overflow-hidden h-6 mb-10">
                            {tokenDistribution.map((item, i) => (
                                <div
                                    key={i}
                                    className={`${item.color} transition-all duration-500 hover:brightness-125`}
                                    style={{ width: `${item.pct}%` }}
                                    title={`${item.label}: ${item.pct}%`}
                                ></div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="space-y-4">
                            {tokenDistribution.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <span className="text-sm font-bold text-zinc-400 uppercase tracking-wider">{item.label}</span>
                                    </div>
                                    <span className="text-lg font-black text-white">{item.pct}%</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-zinc-800/50">
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Total Supply</p>
                                <p className="text-2xl font-black">100M <span className="text-orange-500">GRID</span></p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Initial Price</p>
                                <p className="text-2xl font-black">$0.08 <span className="text-zinc-500 text-sm">USD</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Token Features */}
                    <div className="space-y-6">
                        {tokenFeatures.map((feature, i) => (
                            <div
                                key={i}
                                className="group glass p-8 rounded-[2rem] border-zinc-800/50 hover:border-orange-500/20 transition-all duration-500"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800 group-hover:border-orange-500/30 transition-colors flex-shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black uppercase italic tracking-tighter mb-3 group-hover:text-orange-500 transition-colors">
                                            {feature.title}
                                        </h4>
                                        <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Tokenomics;
