import React, { useState, useEffect } from 'react';
import { Zap, Activity, Battery, Server, Info, X } from 'lucide-react';

/* ─────────────────── Types ─────────────────── */
interface Node {
    id: string; x: number; y: number; type: 'producer' | 'consumer' | 'grid' | 'storage';
    label: string; energy: number; capacity: number; status: 'active' | 'low' | 'charging';
}

interface Connection { from: string; to: string; value: number; }

/* ─────────────────── Enhanced Components ─────────────────── */
const StatCard = ({ label, value, unit, icon, color }: any) => (
    <div className="bg-[#1a1d1a]/80 backdrop-blur-md border border-[#2b2f2b] p-4 rounded-2xl flex items-center gap-4 hover:border-[#9FDC56]/30 transition-all group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110" style={{ backgroundColor: `${color}15`, color: color }}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</p>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-white">{value}</span>
                <span className="text-xs font-bold text-zinc-500">{unit}</span>
            </div>
        </div>
    </div>
);

/* ─────────────────── Main Page ─────────────────── */
const EnergyMap: React.FC = () => {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [tick, setTick] = useState(0);

    // Dynamic Animation Loop
    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 50);
        return () => clearInterval(interval);
    }, []);

    // ─────────────────── Mock Data ───────────────────
    const nodes: Node[] = [
        { id: 'grid', x: 50, y: 50, type: 'grid', label: 'Main Grid', energy: 4500, capacity: 10000, status: 'active' },
        { id: 'p1', x: 20, y: 30, type: 'producer', label: 'Solar Farm A', energy: 850, capacity: 1000, status: 'active' },
        { id: 'p2', x: 80, y: 30, type: 'producer', label: 'Wind Farm B', energy: 1200, capacity: 1500, status: 'active' },
        { id: 'c1', x: 20, y: 70, type: 'consumer', label: 'Ind. Zone X', energy: -600, capacity: 2000, status: 'active' },
        { id: 'c2', x: 80, y: 70, type: 'consumer', label: 'Res. Area Y', energy: -400, capacity: 1000, status: 'low' },
        { id: 's1', x: 50, y: 85, type: 'storage', label: 'Battery Bank', energy: 200, capacity: 500, status: 'charging' },
    ];

    const connections: Connection[] = [
        { from: 'p1', to: 'grid', value: 450 },
        { from: 'p2', to: 'grid', value: 600 },
        { from: 'grid', to: 'c1', value: 300 },
        { from: 'grid', to: 'c2', value: 200 },
        { from: 'grid', to: 's1', value: 100 },
    ];

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-6">
            {/* Header Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Grid Load" value="78" unit="%" icon={<Activity className="w-5 h-5" />} color="#9FDC56" />
                <StatCard label="Total Production" value="2.4" unit="MW" icon={<Zap className="w-5 h-5" />} color="#FFD700" />
                <StatCard label="Storage Level" value="65" unit="%" icon={<Battery className="w-5 h-5" />} color="#545FFF" />
                <StatCard label="Active Nodes" value="12" unit="#" icon={<Server className="w-5 h-5" />} color="#FF7366" />
            </div>

            {/* Interactive Map Canvas */}
            <div className="flex-1 bg-[#1a1d1a] border border-[#2b2f2b] rounded-3xl relative overflow-hidden shadow-2xl">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'radial-gradient(#9FDC56 1px, transparent 1px)', 
                         backgroundSize: '20px 20px' 
                     }} 
                />

                {/* SVG Visualizer */}
                <svg className="w-full h-full">
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9FDC56" stopOpacity="0" />
                            <stop offset="50%" stopColor="#9FDC56" stopOpacity="1" />
                            <stop offset="100%" stopColor="#9FDC56" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Connections */}
                    {connections.map((conn, i) => {
                        const start = nodes.find(n => n.id === conn.from)!;
                        const end = nodes.find(n => n.id === conn.to)!;
                        return (
                            <g key={i}>
                                <line 
                                    x1={`${start.x}%`} y1={`${start.y}%`} 
                                    x2={`${end.x}%`} y2={`${end.y}%`} 
                                    stroke="#2b2f2b" strokeWidth="2" 
                                />
                                <circle r="3" fill="#9FDC56" filter="url(#glow)">
                                    <animateMotion 
                                        dur={`${3000 / Math.max(conn.value, 100)}s`} 
                                        repeatCount="indefinite"
                                        path={`M${start.x * 10},${start.y * 5} L${end.x * 10},${end.y * 5}`} // Simplified path logic for quick render
                                    >
                                         {/* Note: In real SVG scaling, path coords need to match viewbox. 
                                             Here we use percentage based positioning for the group/line, 
                                             but animateMotion requires absolute paths or complex calc.
                                             Simulating flow with dashed offset for simplicity below instead.
                                         */}
                                    </animateMotion>
                                </circle>
                                {/* Simpler Flow Effect */}
                                <line 
                                    x1={`${start.x}%`} y1={`${start.y}%`} 
                                    x2={`${end.x}%`} y2={`${end.y}%`} 
                                    stroke="#9FDC56" strokeWidth="2" strokeDasharray="10,10"
                                    className="opacity-60"
                                >
                                    <animate attributeName="stroke-dashoffset" from="20" to="0" dur="1s" repeatCount="indefinite" />
                                </line>
                            </g>
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((node) => {
                        const isSelected = selectedNode?.id === node.id;
                        const color = node.type === 'producer' ? '#FFD700' : node.type === 'grid' ? '#9FDC56' : node.type === 'storage' ? '#545FFF' : '#FF7366';
                        
                        return (
                            <g 
                                key={node.id} 
                                onClick={() => setSelectedNode(node)}
                                className="cursor-pointer transition-all duration-300"
                                style={{ transformOrigin: `${node.x}% ${node.y}%` }}
                            >
                                {/* Glow Ring */}
                                <circle 
                                    cx={`${node.x}%`} cy={`${node.y}%`} r={isSelected ? 35 : 25} 
                                    fill={color} fillOpacity="0.1" 
                                    stroke={color} strokeWidth="1" strokeDasharray="4 2"
                                    className={isSelected ? 'animate-spin-slow' : ''}
                                />
                                {/* Core */}
                                <circle 
                                    cx={`${node.x}%`} cy={`${node.y}%`} r={isSelected ? 12 : 8} 
                                    fill={color} filter="url(#glow)"
                                    className="transition-all duration-300"
                                />
                                {/* Label */}
                                <text 
                                    x={`${node.x}%`} y={`${node.y + 8}%`} 
                                    textAnchor="middle" fill="#EAFFD2" 
                                    className="text-[10px] uppercase font-bold tracking-widest opacity-80"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Detail Panel Overlay */}
                {selectedNode && (
                    <div className="absolute top-6 right-6 w-80 bg-[#161815]/95 backdrop-blur-xl border border-[#9FDC56]/50 rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedNode.label}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-2 h-2 rounded-full ${selectedNode.status === 'active' ? 'bg-[#9FDC56] animate-pulse' : 'bg-[#FF7366]'}`} />
                                    <span className="text-xs text-zinc-400 capitalize">{selectedNode.status}</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedNode(null)} className="p-1 rounded-lg hover:bg-[#2b2f2b] transition-colors">
                                <X className="w-5 h-5 text-zinc-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#1a1d1a] rounded-xl p-4 border border-[#2b2f2b]">
                                <div className="flex justify-between mb-2 text-xs">
                                    <span className="text-zinc-500">Current Load</span>
                                    <span className="text-white font-bold">{Math.abs(selectedNode.energy)} kWh</span>
                                </div>
                                <div className="h-2 bg-[#2b2f2b] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ 
                                            width: `${(Math.abs(selectedNode.energy) / selectedNode.capacity) * 100}%`,
                                            backgroundColor: selectedNode.energy > 0 ? '#9FDC56' : '#FF7366'
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-[#1a1d1a] rounded-xl border border-[#2b2f2b]">
                                    <p className="text-[10px] text-zinc-500 mb-1">Capacity</p>
                                    <p className="text-sm font-bold text-white">{selectedNode.capacity} kW</p>
                                </div>
                                <div className="p-3 bg-[#1a1d1a] rounded-xl border border-[#2b2f2b]">
                                    <p className="text-[10px] text-zinc-500 mb-1">Efficiency</p>
                                    <p className="text-sm font-bold text-[#9FDC56]">94.2%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnergyMap;