import React, { useState } from 'react';
import { Vote, Clock, CheckCircle, XCircle, Users, Coins, Plus, ThumbsUp, ThumbsDown, AlertCircle, Check, Loader2 } from 'lucide-react';

interface Proposal {
    id: number; title: string; description: string; status: 'active' | 'passed' | 'rejected' | 'pending';
    votesFor: number; votesAgainst: number; totalVoters: number; endDate: string; author: string; category: string;
}

const initialProposals: Proposal[] = [
    { id: 1, title: 'Increase Solar Feed-in Tariff by 15%', description: 'Proposal to increase the base feed-in tariff for solar producers from 0.12 to 0.138 GRID tokens per kWh to incentivize more solar installations.', status: 'active', votesFor: 1847, votesAgainst: 423, totalVoters: 2270, endDate: '2025-01-20', author: 'SolarKing_99', category: 'Economics' },
    { id: 2, title: 'Launch Grid Matrix on Polygon zkEVM', description: 'Deploy Grid Matrix smart contracts on Polygon zkEVM for lower gas fees and faster settlement of energy trades.', status: 'active', votesFor: 2156, votesAgainst: 312, totalVoters: 2468, endDate: '2025-01-18', author: 'EcoVolt_Alpha', category: 'Technical' },
    { id: 3, title: 'Create Community Green Fund', description: 'Allocate 2% of all trading fees to a community fund for renewable energy projects in underserved areas.', status: 'passed', votesFor: 3420, votesAgainst: 180, totalVoters: 3600, endDate: '2025-01-10', author: 'GreenNode_X', category: 'Community' },
    { id: 4, title: 'Reduce Minimum Stake to 50 GRID', description: 'Lower the minimum staking requirement from 100 GRID to 50 GRID to increase participation.', status: 'rejected', votesFor: 890, votesAgainst: 1540, totalVoters: 2430, endDate: '2025-01-05', author: 'HydroFlow_Z', category: 'Economics' },
    { id: 5, title: 'Add Wind Energy Category', description: 'Introduce a separate Wind Energy trading category with specialized pricing algorithms for offshore and onshore wind.', status: 'pending', votesFor: 0, votesAgainst: 0, totalVoters: 0, endDate: '2025-01-25', author: 'WindRider_Pro', category: 'Technical' },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    active: { color: '#9FDC56', icon: <Clock className="w-3 h-3" />, label: 'Active' },
    passed: { color: '#9FDC56', icon: <CheckCircle className="w-3 h-3" />, label: 'Passed' },
    rejected: { color: '#FF7366', icon: <XCircle className="w-3 h-3" />, label: 'Rejected' },
    pending: { color: '#545FFF', icon: <AlertCircle className="w-3 h-3" />, label: 'Pending' },
};

const Governance: React.FC = () => {
    const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [voted, setVoted] = useState<Record<number, 'for' | 'against'>>({});
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newCat, setNewCat] = useState('Economics');
    const [submitting, setSubmitting] = useState(false);
    const [submitOk, setSubmitOk] = useState(false);

    const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);
    const quorum = 2000;

    const handleVote = (id: number, direction: 'for' | 'against') => {
        if (voted[id]) return; // already voted
        setVoted(prev => ({ ...prev, [id]: direction }));
        setProposals(prev => prev.map(p => {
            if (p.id !== id) return p;
            return {
                ...p,
                votesFor: direction === 'for' ? p.votesFor + 1 : p.votesFor,
                votesAgainst: direction === 'against' ? p.votesAgainst + 1 : p.votesAgainst,
                totalVoters: p.totalVoters + 1,
            };
        }));
    };

    const handleSubmit = () => {
        if (!newTitle.trim() || !newDesc.trim()) return;
        setSubmitting(true);
        setTimeout(() => {
            const newP: Proposal = {
                id: Date.now(),
                title: newTitle,
                description: newDesc,
                status: 'pending',
                votesFor: 0, votesAgainst: 0, totalVoters: 0,
                endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                author: 'You',
                category: newCat,
            };
            setProposals(prev => [newP, ...prev]);
            setSubmitting(false);
            setSubmitOk(true);
            setTimeout(() => { setShowModal(false); setNewTitle(''); setNewDesc(''); setSubmitOk(false); }, 1200);
        }, 800);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-medium tracking-tight text-[#EAFFD2]">DAO Governance</h1>
                    <p className="text-zinc-500 text-sm mt-1">Vote on proposals shaping the Grid Matrix ecosystem</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#9FDC56] text-[#161815] rounded-xl text-xs font-bold hover:brightness-110 transition-all">
                    <Plus className="w-4 h-4" /> New Proposal
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Active Proposals', value: '2', icon: <Clock className="w-4 h-4" />, color: '#9FDC56' },
                    { label: 'Total Voters', value: '4,738', icon: <Users className="w-4 h-4" />, color: '#545FFF' },
                    { label: 'Proposals Passed', value: '24', icon: <CheckCircle className="w-4 h-4" />, color: '#9FDC56' },
                    { label: 'Treasury', value: '125K GRID', icon: <Coins className="w-4 h-4" />, color: '#FFD700' },
                ].map(s => (
                    <div key={s.label} className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <span style={{ color: s.color }}>{s.icon}</span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase">{s.label}</span>
                        </div>
                        <span className="text-2xl font-black text-[#EAFFD2]">{s.value}</span>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-[#1a1d1a] rounded-lg p-1 border border-[#2b2f2b] w-fit">
                {['all', 'active', 'passed', 'rejected', 'pending'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all capitalize ${filter === f ? 'bg-[#9FDC56] text-[#161815]' : 'text-zinc-500 hover:text-[#EAFFD2]'}`}>{f}</button>
                ))}
            </div>

            {/* Proposals */}
            <div className="space-y-4">
                {filtered.map(p => {
                    const total = p.votesFor + p.votesAgainst;
                    const forPct = total > 0 ? (p.votesFor / total) * 100 : 0;
                    const cfg = statusConfig[p.status];
                    const meetsQuorum = total >= quorum;
                    return (
                        <div key={p.id} className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6 hover:border-[#9FDC56]/20 transition-all">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ backgroundColor: cfg.color + '15', color: cfg.color }}>
                                            {cfg.icon} {cfg.label}
                                        </span>
                                        <span className="text-[10px] font-bold text-zinc-600 px-2 py-0.5 rounded-full bg-[#2b2f2b]">{p.category}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#EAFFD2]">{p.title}</h3>
                                    <p className="text-zinc-500 text-xs mt-1 max-w-xl">{p.description}</p>
                                    <p className="text-[10px] text-zinc-600 mt-2">by <span className="text-[#9FDC56]">{p.author}</span> · Ends {p.endDate}</p>
                                </div>
                                {p.status === 'active' && (
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => handleVote(p.id, 'for')} disabled={!!voted[p.id]}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${voted[p.id] === 'for' ? 'bg-[#9FDC56] text-[#161815]' : voted[p.id] ? 'opacity-40 cursor-not-allowed bg-[#9FDC56]/10 text-[#9FDC56]' : 'bg-[#9FDC56]/10 text-[#9FDC56] hover:bg-[#9FDC56]/20'}`}>
                                            {voted[p.id] === 'for' ? <Check className="w-3 h-3" /> : <ThumbsUp className="w-3 h-3" />} For
                                        </button>
                                        <button onClick={() => handleVote(p.id, 'against')} disabled={!!voted[p.id]}
                                            className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all ${voted[p.id] === 'against' ? 'bg-[#FF7366] text-white' : voted[p.id] ? 'opacity-40 cursor-not-allowed bg-[#FF7366]/10 text-[#FF7366]' : 'bg-[#FF7366]/10 text-[#FF7366] hover:bg-[#FF7366]/20'}`}>
                                            {voted[p.id] === 'against' ? <Check className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />} Against
                                        </button>
                                    </div>
                                )}
                            </div>
                            {total > 0 && (
                                <div>
                                    <div className="flex justify-between text-[10px] mb-1">
                                        <span className="text-[#9FDC56] font-bold">For {p.votesFor.toLocaleString()} ({forPct.toFixed(1)}%)</span>
                                        <span className="text-[#FF7366] font-bold">Against {p.votesAgainst.toLocaleString()} ({(100 - forPct).toFixed(1)}%)</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-[#2b2f2b] overflow-hidden flex">
                                        <div className="h-full rounded-l-full" style={{ width: `${forPct}%`, backgroundColor: '#9FDC56' }} />
                                        <div className="h-full rounded-r-full" style={{ width: `${100 - forPct}%`, backgroundColor: '#FF7366' }} />
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[10px] text-zinc-500">{total.toLocaleString()} votes</span>
                                        <span className={`text-[10px] font-bold ${meetsQuorum ? 'text-[#9FDC56]' : 'text-[#FF7366]'}`}>
                                            {meetsQuorum ? 'Quorum reached' : `${quorum - total} more needed`}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* New Proposal Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-[#EAFFD2] mb-4">Create Proposal</h3>
                        <div className="space-y-3">
                            <input placeholder="Proposal Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#161815] border border-[#2b2f2b] text-[#EAFFD2] text-sm focus:outline-none focus:border-[#9FDC56]" />
                            <textarea placeholder="Description..." rows={4} value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#161815] border border-[#2b2f2b] text-[#EAFFD2] text-sm focus:outline-none focus:border-[#9FDC56] resize-none" />
                            <select value={newCat} onChange={e => setNewCat(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-[#161815] border border-[#2b2f2b] text-zinc-400 text-sm focus:outline-none focus:border-[#9FDC56]">
                                <option>Economics</option>
                                <option>Technical</option>
                                <option>Community</option>
                            </select>
                        </div>
                        {submitOk && (
                            <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-[#9FDC56]/10 border border-[#9FDC56]/20 text-[#9FDC56] text-sm font-bold">
                                <Check className="w-4 h-4" /> Proposal submitted!
                            </div>
                        )}
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#2b2f2b] text-zinc-400 hover:text-[#EAFFD2] transition-all">Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting || !newTitle.trim()} className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#9FDC56] text-[#161815] hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-1">
                                {submitting ? <><Loader2 className="w-3 h-3 animate-spin" /> Submitting...</> : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Governance;