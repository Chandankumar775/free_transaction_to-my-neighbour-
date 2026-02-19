import React from 'react';

const phases = [
    {
        phase: "Q1 2025",
        tag: "FOUNDATION",
        status: "completed",
        items: [
            "Protocol Architecture Design",
            "Smart Contract Development (EnergyToken, EnergyMarket)",
            "Core Team Assembly",
            "Whitepaper Publication",
        ],
    },
    {
        phase: "Q2 2025",
        tag: "TESTNET",
        status: "completed",
        items: [
            "Testnet Launch on Sepolia",
            "Smart Meter SDK (IoT Integration)",
            "P2P Trading Engine v1",
            "Security Audit — Phase 1",
        ],
    },
    {
        phase: "Q3 2025",
        tag: "BETA",
        status: "active",
        items: [
            "Beta Launch with Partner Microgrids",
            "Dynamic Pricing Algorithm v2",
            "Demand-Supply Matching Engine",
            "Mobile App MVP",
        ],
    },
    {
        phase: "Q4 2025",
        tag: "MAINNET",
        status: "upcoming",
        items: [
            "Mainnet Deployment",
            "GRID Token Launch (TGE)",
            "Carbon Credit NFT Marketplace",
            "Governance DAO Activation",
        ],
    },
    {
        phase: "Q1 2026",
        tag: "SCALE",
        status: "upcoming",
        items: [
            "Layer 2 Scaling (Rollups)",
            "Cross-Chain Energy Bridging",
            "Enterprise API Launch",
            "100+ Microgrid Partnerships",
        ],
    },
];

const Roadmap: React.FC = () => {
    return (
        <section id="roadmap" className="py-40 px-8 md:px-16 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-32">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">DEVELOPMENT</p>
                    <h2 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-12">
                        ROAD<br />MAP.
                    </h2>
                    <div className="w-32 h-2.5 bg-orange-600 mx-auto rounded-full"></div>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute left-6 lg:left-1/2 lg:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/60 via-orange-500/20 to-transparent"></div>

                    <div className="space-y-12 lg:space-y-16">
                        {phases.map((phase, i) => (
                            <div
                                key={i}
                                className={`relative flex flex-col lg:flex-row items-start gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                                    }`}
                            >
                                {/* Dot */}
                                <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 z-10">
                                    <div className={`w-4 h-4 rounded-full border-2 ${phase.status === 'completed' ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/50' :
                                            phase.status === 'active' ? 'bg-orange-500 border-orange-500 animate-pulse shadow-lg shadow-orange-500/50' :
                                                'bg-zinc-800 border-zinc-600'
                                        }`}></div>
                                </div>

                                {/* Content */}
                                <div className={`ml-16 lg:ml-0 lg:w-[45%] ${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                                    <div className={`glass p-8 md:p-10 rounded-[2rem] border-zinc-800/50 ${phase.status === 'active' ? 'border-orange-500/30' : ''
                                        } hover:border-orange-500/20 transition-all duration-500 inline-block w-full`}>

                                        <div className={`flex items-center gap-4 mb-6 ${i % 2 === 0 ? 'lg:justify-end' : ''}`}>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${phase.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                    phase.status === 'active' ? 'bg-orange-500/10 text-orange-500' :
                                                        'bg-zinc-800 text-zinc-500'
                                                }`}>
                                                {phase.status === 'completed' ? '✓ COMPLETE' : phase.status === 'active' ? '● ACTIVE' : 'UPCOMING'}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
                                            {phase.phase}
                                        </h3>
                                        <p className="text-orange-500 text-xs font-black tracking-[0.3em] mb-6">{phase.tag}</p>

                                        <ul className={`space-y-3 ${i % 2 === 0 ? 'lg:text-right' : ''}`}>
                                            {phase.items.map((item, j) => (
                                                <li key={j} className={`text-sm font-medium ${phase.status === 'completed' ? 'text-zinc-500 line-through' :
                                                        phase.status === 'active' ? 'text-zinc-300' : 'text-zinc-600'
                                                    }`}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
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

export default Roadmap;
