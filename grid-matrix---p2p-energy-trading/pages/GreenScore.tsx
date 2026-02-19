import React from 'react';
import { Leaf, Award, Share2, TrendingUp, Wind, Sun, TreeDeciduous } from 'lucide-react';

/* ─────────────────── Enhanced Green Score ─────────────────── */
const GreenScore: React.FC = () => {
    const score = 742;
    const maxScore = 1000;
    const percentage = (score / maxScore) * 100;
    const circumference = 2 * Math.PI * 120; // Radius 120
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-medium tracking-tight text-[#EAFFD2] mb-2">My Green<span className="text-[#9FDC56]">Score</span>™</h1>
                <p className="text-zinc-500">Your ecological impact footprint calculated in real-time.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Score Visualizer */}
                <div className="relative flex items-center justify-center p-8">
                    {/* SVG Progress Circle */}
                    <div className="relative w-80 h-80">
                        {/* Glow Background */}
                        <div className="absolute inset-0 bg-[#9FDC56]/10 blur-3xl rounded-full animate-pulse" />
                        
                        <svg className="transform -rotate-90 w-full h-full drop-shadow-2xl">
                            {/* Track */}
                            <circle cx="160" cy="160" r="120" stroke="#2b2f2b" strokeWidth="20" fill="transparent" />
                            {/* Progress Indicator */}
                            <circle 
                                cx="160" cy="160" r="120" 
                                stroke="#9FDC56" strokeWidth="20" fill="transparent"
                                strokeDasharray={circumference} 
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        
                        {/* Inner Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <Leaf size={48} className="text-[#9FDC56] mb-2 animate-bounce-slow" />
                            <span className="text-6xl font-black text-white tracking-tighter shadow-black drop-shadow-lg">{score}</span>
                            <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">Excellent</span>
                        </div>
                    </div>
                </div>

                {/* Impact Stats */}
                <div className="space-y-6">
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] p-6 rounded-2xl flex items-center gap-5 hover:border-[#9FDC56]/30 transition-all">
                        <div className="w-14 h-14 rounded-full bg-[#161815] border border-[#2b2f2b] flex items-center justify-center text-[#9FDC56]">
                            <TreeDeciduous size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-bold text-white">Carbon Offset</h3>
                                <span className="font-bold text-[#9FDC56]">+12%</span>
                            </div>
                            <p className="text-zinc-500 text-sm mb-3">Equivalent to planting 48 trees this month.</p>
                            <div className="w-full bg-[#2b2f2b] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#9FDC56] w-[75%] h-full rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] p-6 rounded-2xl flex items-center gap-5 hover:border-[#9FDC56]/30 transition-all">
                         <div className="w-14 h-14 rounded-full bg-[#161815] border border-[#2b2f2b] flex items-center justify-center text-[#545FFF]">
                            <Wind size={24} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <h3 className="font-bold text-white">Renewable Usage</h3>
                                <span className="font-bold text-[#545FFF]">+8%</span>
                            </div>
                            <p className="text-zinc-500 text-sm mb-3">You sourced 92% of energy from clean nodes.</p>
                            <div className="w-full bg-[#2b2f2b] h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#545FFF] w-[92%] h-full rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NFT Achievements */}
            <div className="pt-8 border-t border-[#2b2f2b]">
                <h2 className="text-2xl font-bold text-white mb-6">Earned Badges (NFTs)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { name: 'Solar Pioneer', rarity: 'Rare', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', icon: <Sun className="text-yellow-500" /> },
                        { name: 'Grid Guardian', rarity: 'Legendary', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: <Award className="text-purple-500" /> },
                        { name: 'Eco Saver', rarity: 'Common', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: <Leaf className="text-green-500" /> },
                        { name: 'Wind Walker', rarity: 'Epic', bg: 'bg-blue-500/10', border: 'border-blue-500/30', icon: <Wind className="text-blue-500" /> },
                    ].map((badge, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${badge.border} ${badge.bg} flex flex-col items-center justify-center text-center gap-3 aspect-square hover:scale-105 transition-transform cursor-pointer group`}>
                            <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                                {badge.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">{badge.name}</h3>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{badge.rarity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GreenScore;