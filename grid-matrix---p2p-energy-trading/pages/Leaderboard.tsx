import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp, Star, ChevronUp, ChevronDown } from 'lucide-react';

/* ─────────────────── Enhanced Leaderboard ─────────────────── */
const Leaderboard: React.FC = () => {
    const [timeframe, setTimeframe] = useState('weekly');
    
    // Different data per timeframe — makes tabs actually functional
    type UserRow = { rank: number; name: string; score: number; energy: string; change: number; avatar: string };
    const dataByTimeframe: Record<string, UserRow[]> = {
        weekly: [
            { rank: 1, name: 'SolarKing_99', score: 9850, energy: '12.4 MWh', change: 0, avatar: 'SK' },
            { rank: 2, name: 'WindRider_Pro', score: 9420, energy: '11.2 MWh', change: 1, avatar: 'WR' },
            { rank: 3, name: 'GreenNode_X', score: 8990, energy: '10.8 MWh', change: -1, avatar: 'GN' },
            { rank: 4, name: 'EcoVolt_Alpha', score: 8540, energy: '9.2 MWh', change: 2, avatar: 'EA' },
            { rank: 5, name: 'Chandan Kumar', score: 7420, energy: '8.1 MWh', change: 0, avatar: 'CK' },
        ],
        monthly: [
            { rank: 1, name: 'GreenNode_X', score: 38200, energy: '44.8 MWh', change: 2, avatar: 'GN' },
            { rank: 2, name: 'SolarKing_99', score: 36100, energy: '42.1 MWh', change: -1, avatar: 'SK' },
            { rank: 3, name: 'Chandan Kumar', score: 31050, energy: '35.6 MWh', change: 3, avatar: 'CK' },
            { rank: 4, name: 'WindRider_Pro', score: 29800, energy: '33.2 MWh', change: -1, avatar: 'WR' },
            { rank: 5, name: 'EcoVolt_Alpha', score: 27400, energy: '28.5 MWh', change: -1, avatar: 'EA' },
        ],
        'all-time': [
            { rank: 1, name: 'SolarKing_99', score: 248500, energy: '284 MWh', change: 0, avatar: 'SK' },
            { rank: 2, name: 'GreenNode_X', score: 231800, energy: '265 MWh', change: 0, avatar: 'GN' },
            { rank: 3, name: 'WindRider_Pro', score: 218400, energy: '247 MWh', change: 1, avatar: 'WR' },
            { rank: 4, name: 'EcoVolt_Alpha', score: 205100, energy: '232 MWh', change: -1, avatar: 'EA' },
            { rank: 5, name: 'Chandan Kumar', score: 189200, energy: '215 MWh', change: 2, avatar: 'CK' },
        ],
    };
    const users = dataByTimeframe[timeframe] || dataByTimeframe.weekly;

    const podiumColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                     <h1 className="text-3xl font-medium tracking-tight text-[#EAFFD2]">Global Leaderboard</h1>
                     <p className="text-zinc-500 text-sm mt-1">Top energy producers and traders competing for GRID rewards.</p>
                </div>
                <div className="bg-[#1a1d1a] border border-[#2b2f2b] p-1 rounded-xl flex">
                    {['Weekly', 'Monthly', 'All-Time'].map(t => (
                        <button key={t} onClick={() => setTimeframe(t.toLowerCase())} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeframe === t.toLowerCase() ? 'bg-[#9FDC56] text-[#161815]' : 'text-zinc-400 hover:text-white'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Podium Visualizer */}
            <div className="relative h-64 flex items-end justify-center mb-12 gap-4">
                 <div className="absolute inset-x-0 bottom-0 h-1 bg-[#2b2f2b]" />
                 
                 {/* 2nd Place */}
                 <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="mb-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-[#C0C0C0] mb-2 flex items-center justify-center font-bold text-[#C0C0C0]">{users[1]?.avatar}</div>
                        <span className="text-xs font-bold text-zinc-400">{users[1]?.name.split('_')[0]}</span>
                    </div>
                    <div className="w-24 h-32 bg-gradient-to-t from-[#C0C0C0]/20 to-transparent border-t border-x border-[#C0C0C0]/30 rounded-t-lg flex flex-col items-center justify-end pb-4">
                        <span className="text-3xl font-black text-[#C0C0C0]">2</span>
                    </div>
                 </div>

                 {/* 1st Place */}
                 <div className="flex flex-col items-center z-10 animate-fade-in-up">
                    <div className="mb-4 flex flex-col items-center">
                        <Crown className="text-[#FFD700] w-8 h-8 mb-2 animate-bounce-slow" />
                         <div className="w-16 h-16 rounded-full border-4 border-[#FFD700] mb-2 flex items-center justify-center font-bold text-[#FFD700] bg-[#FFD700]/10 ring-4 ring-[#FFD700]/20">{users[0]?.avatar}</div>
                        <span className="text-sm font-bold text-[#FFD700]">{users[0]?.name.split('_')[0]}</span>
                    </div>
                    <div className="w-32 h-48 bg-gradient-to-t from-[#FFD700]/20 to-transparent border-t border-x border-[#FFD700]/30 rounded-t-xl flex flex-col items-center justify-end pb-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#FFD700]/5 animate-pulse" />
                        <span className="text-5xl font-black text-[#FFD700] drop-shadow-lg">1</span>
                    </div>
                 </div>

                 {/* 3rd Place */}
                 <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="mb-4 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full border-2 border-[#CD7F32] mb-2 flex items-center justify-center font-bold text-[#CD7F32]">{users[2]?.avatar}</div>
                        <span className="text-xs font-bold text-zinc-400">{users[2]?.name.split('_')[0]}</span>
                    </div>
                    <div className="w-24 h-24 bg-gradient-to-t from-[#CD7F32]/20 to-transparent border-t border-x border-[#CD7F32]/30 rounded-t-lg flex flex-col items-center justify-end pb-4">
                        <span className="text-3xl font-black text-[#CD7F32]">3</span>
                    </div>
                 </div>
            </div>

            {/* List View */}
            <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl overflow-hidden">
                <table className="w-full">
                    <thead>
                         <tr className="border-b border-[#2b2f2b]">
                            <th className="px-6 py-4 text-left text-[10px] uppercase font-bold text-zinc-500">Rank</th>
                            <th className="px-6 py-4 text-left text-[10px] uppercase font-bold text-zinc-500">Trader</th>
                            <th className="px-6 py-4 text-right text-[10px] uppercase font-bold text-zinc-500">Score</th>
                            <th className="px-6 py-4 text-right text-[10px] uppercase font-bold text-zinc-500">Energy Vol.</th>
                         </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.rank} className={`border-b border-[#2b2f2b] last:border-0 hover:bg-white/[0.02] transition-colors ${user.name === 'Chandan Kumar' ? 'bg-[#9FDC56]/5' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-bold ${user.rank <= 3 ? 'text-white' : 'text-zinc-500'}`}>#{user.rank}</span>
                                        {user.change > 0 && <ChevronUp size={14} className="text-[#9FDC56]" />}
                                        {user.change < 0 && <ChevronDown size={14} className="text-[#FF7366]" />}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#2b2f2b] flex items-center justify-center text-[10px] border border-[#3a3e3a]">{user.avatar}</div>
                                        <span className={`text-sm font-bold ${user.name === 'Chandan Kumar' ? 'text-[#9FDC56]' : 'text-zinc-200'}`}>{user.name}</span>
                                     </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-[#9FDC56]">{user.score.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-zinc-400 text-sm">{user.energy}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;