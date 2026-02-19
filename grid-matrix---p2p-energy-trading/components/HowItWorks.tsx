import React from 'react';
import { UserPlus, Sun, ArrowLeftRight, Zap, ShieldCheck } from 'lucide-react';

const steps = [
    {
        icon: <UserPlus className="w-7 h-7" />,
        title: "REGISTER",
        subtitle: "Create Your Identity",
        description: "Sign up as a producer, consumer, or prosumer. Your identity is verified on-chain with zero-knowledge proofs for maximum privacy.",
        tag: "STEP_01",
        color: "from-orange-500 to-amber-500",
    },
    {
        icon: <Sun className="w-7 h-7" />,
        title: "LIST ENERGY",
        subtitle: "Publish Surplus",
        description: "Connect your smart meter or IoT device. Your surplus renewable energy is automatically listed on the decentralized marketplace in real-time.",
        tag: "STEP_02",
        color: "from-yellow-500 to-orange-500",
    },
    {
        icon: <ArrowLeftRight className="w-7 h-7" />,
        title: "MATCH & TRADE",
        subtitle: "AI-Powered Matching",
        description: "Our demand-supply matching engine pairs you with the best local buyer or seller. Dynamic pricing ensures fair market rates for everyone.",
        tag: "STEP_03",
        color: "from-orange-500 to-red-500",
    },
    {
        icon: <Zap className="w-7 h-7" />,
        title: "INSTANT SETTLE",
        subtitle: "Smart Contract Execution",
        description: "Trades are validated and settled instantly via smart contracts. No middlemen, no delays — energy flows, tokens transfer automatically.",
        tag: "STEP_04",
        color: "from-red-500 to-orange-600",
    },
    {
        icon: <ShieldCheck className="w-7 h-7" />,
        title: "EARN & MONITOR",
        subtitle: "Track Everything",
        description: "Monitor your energy production, consumption, earnings, and carbon offset in a transparent dashboard with full transaction history.",
        tag: "STEP_05",
        color: "from-orange-600 to-amber-600",
    },
];

const HowItWorks: React.FC = () => {
    return (
        <section id="how-it-works" className="py-40 px-8 md:px-16 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-32">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">THE PROCESS</p>
                    <h2 className="text-6xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-[0.85] mb-12">
                        HOW IT <br />WORKS.
                    </h2>
                    <div className="w-32 h-2.5 bg-orange-600 mx-auto rounded-full"></div>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Vertical connecting line */}
                    <div className="absolute left-[2.25rem] top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent hidden lg:block"></div>

                    <div className="space-y-8 lg:space-y-0">
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="relative group lg:flex lg:items-start lg:gap-12 lg:py-12"
                            >
                                {/* Step Number Circle */}
                                <div className="hidden lg:flex flex-shrink-0 w-[4.5rem] h-[4.5rem] items-center justify-center relative z-10">
                                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 group-hover:scale-110 transition-all duration-500`}>
                                        <span className="text-white">{step.icon}</span>
                                    </div>
                                </div>

                                {/* Content Card */}
                                <div className="flex-1 glass p-10 md:p-12 rounded-[2rem] border-zinc-800/50 group-hover:border-orange-500/20 transition-all duration-500 group-hover:translate-x-2">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <p className="text-orange-500 font-black text-[10px] tracking-[0.3em] mb-3">{step.tag}</p>
                                            <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter">
                                                {step.title}
                                            </h3>
                                            <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest mt-2">{step.subtitle}</p>
                                        </div>
                                        <div className={`lg:hidden w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                                            <span className="text-white">{step.icon}</span>
                                        </div>
                                    </div>
                                    <p className="text-zinc-400 text-lg leading-relaxed font-medium max-w-2xl">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
