import React from 'react';
import { Shield, Cpu, TrendingUp, Radio, Lock, BarChart3, Globe, Layers } from 'lucide-react';

const features = [
    {
        icon: <Shield className="w-6 h-6" />,
        title: "SMART CONTRACT VALIDATION",
        description: "Every trade is validated, executed, and recorded via audited Solidity smart contracts on-chain. Trustless by design.",
        accent: "border-orange-500/30",
    },
    {
        icon: <Radio className="w-6 h-6" />,
        title: "IoT / SMART METER",
        description: "Real-time energy data streams from smart meters and IoT sensors feed directly into the protocol for automated trading.",
        accent: "border-amber-500/30",
    },
    {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "DYNAMIC PRICING",
        description: "AI-driven pricing engine adjusts rates based on local demand, supply, grid load, and time-of-use — ensuring fair market value.",
        accent: "border-yellow-500/30",
    },
    {
        icon: <Cpu className="w-6 h-6" />,
        title: "DEMAND-SUPPLY MATCHING",
        description: "Intelligent matching algorithm pairs producers with consumers in real-time based on proximity, price, and energy type.",
        accent: "border-red-500/30",
    },
    {
        icon: <Lock className="w-6 h-6" />,
        title: "SECURE AUTHENTICATION",
        description: "End-to-end encrypted communication with decentralized identity (DID) and zero-knowledge proof-based authentication.",
        accent: "border-orange-600/30",
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "MONITORING & REPORTING",
        description: "Comprehensive dashboards track production, consumption, earnings, carbon credits, and full transparent transaction history.",
        accent: "border-amber-600/30",
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "DECENTRALIZED ARCHITECTURE",
        description: "No single point of failure. The protocol runs on a distributed network of nodes ensuring 99.9% uptime and censorship resistance.",
        accent: "border-yellow-600/30",
    },
    {
        icon: <Layers className="w-6 h-6" />,
        title: "SCALABLE INFRASTRUCTURE",
        description: "Built to handle thousands of concurrent users and transactions with Layer 2 rollups and optimistic settlement batching.",
        accent: "border-orange-500/30",
    },
];

const Features: React.FC = () => {
    return (
        <section id="features" className="py-40 px-8 md:px-16 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-32">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">CAPABILITIES</p>
                    <h2 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-12">
                        BUILT FOR <br />THE GRID.
                    </h2>
                    <p className="text-zinc-400 text-xl max-w-3xl leading-relaxed font-medium">
                        Every feature is engineered to meet the technical and functional requirements of a production-grade decentralized energy trading platform.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, i) => (
                        <div
                            key={i}
                            className={`group glass p-8 rounded-[2rem] border-l-2 ${feature.accent} hover:border-orange-500/60 transition-all duration-500 hover:-translate-y-1`}
                        >
                            <div className="mb-6 p-4 bg-zinc-900/60 w-fit rounded-2xl border border-zinc-800 group-hover:border-orange-500/30 transition-colors">
                                <span className="text-orange-500">{feature.icon}</span>
                            </div>

                            <h3 className="text-lg font-black uppercase italic tracking-tight mb-4 group-hover:text-orange-500 transition-colors">
                                {feature.title}
                            </h3>

                            <p className="text-zinc-500 text-sm leading-relaxed font-medium">
                                {feature.description}
                            </p>

                            <div className="mt-6 text-[9px] font-black text-zinc-800 tracking-[0.3em] uppercase">
                                MODULE_0{i + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
