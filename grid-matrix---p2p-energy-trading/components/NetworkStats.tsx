import React, { useState, useEffect } from 'react';

const statsData = [
    { label: "Total Energy Traded", value: 2847562, suffix: " kWh", prefix: "" },
    { label: "Active Nodes", value: 14289, suffix: "", prefix: "" },
    { label: "Smart Contracts Executed", value: 892341, suffix: "", prefix: "" },
    { label: "Total Value Locked", value: 12.8, suffix: "M", prefix: "$" },
    { label: "Carbon Offset", value: 1847, suffix: " tons CO₂", prefix: "" },
    { label: "Average Settlement Time", value: 2.4, suffix: "s", prefix: "" },
];

const NetworkStats: React.FC = () => {
    const [animatedValues, setAnimatedValues] = useState<number[]>(statsData.map(() => 0));

    useEffect(() => {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

            setAnimatedValues(statsData.map(stat => stat.value * eased));

            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const formatValue = (value: number, index: number) => {
        const stat = statsData[index];
        if (Number.isInteger(stat.value)) {
            return `${stat.prefix}${Math.floor(value).toLocaleString()}${stat.suffix}`;
        }
        return `${stat.prefix}${value.toFixed(1)}${stat.suffix}`;
    };

    return (
        <section className="py-32 px-8 md:px-16 relative">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <p className="text-orange-500 font-black tracking-[0.4em] text-xs mb-8">NETWORK METRICS</p>
                    <h2 className="text-5xl md:text-[6rem] font-black italic uppercase tracking-tighter leading-[0.85]">
                        LIVE NETWORK
                    </h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsData.map((stat, i) => (
                        <div
                            key={i}
                            className="glass p-8 md:p-10 rounded-[2rem] border-zinc-800/50 text-center group hover:border-orange-500/20 transition-all duration-500"
                        >
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
                            <p className="text-3xl md:text-5xl font-black tracking-tight group-hover:text-orange-500 transition-colors">
                                {formatValue(animatedValues[i], i)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NetworkStats;
