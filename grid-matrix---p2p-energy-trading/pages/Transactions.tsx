import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Download, ArrowUpRight, ArrowDownRight,
    Eye, ExternalLink, Copy, Check, Flame, Gift, Loader2
} from 'lucide-react';
import { getTransactions, subscribeToTransactions } from '../lib/supabase';

type TxType = 'buy' | 'sell' | 'stake' | 'unstake' | 'reward';

interface Transaction {
    id: number; tx_id: string; type: TxType; peer_name: string; amount: string; value: string;
    created_at: string; status: 'confirmed' | 'pending' | 'failed';
    block_number: number; gas_used: string; tx_hash: string; user_address: string; peer_address: string;
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    sell: { label: 'SELL', icon: <ArrowUpRight className="w-3 h-3" />, color: '#9FDC56', bg: 'rgba(159,220,86,0.1)' },
    buy: { label: 'BUY', icon: <ArrowDownRight className="w-3 h-3" />, color: '#545FFF', bg: 'rgba(84,95,255,0.1)' },
    stake: { label: 'STAKE', icon: <Flame className="w-3 h-3" />, color: '#FF7366', bg: 'rgba(255,115,102,0.1)' },
    unstake: { label: 'UNSTAKE', icon: <Flame className="w-3 h-3" />, color: '#FFB366', bg: 'rgba(255,179,102,0.1)' },
    reward: { label: 'REWARD', icon: <Gift className="w-3 h-3" />, color: '#EAFFD2', bg: 'rgba(234,255,210,0.1)' },
};

const Transactions: React.FC = () => {
    const [filterType, setFilterType] = useState<TxType | 'all'>('all');
    const [search, setSearch] = useState('');
    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
    const [copied, setCopied] = useState(false);
    const [txData, setTxData] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    const loadTx = async () => {
        setLoading(true);
        const { data } = await getTransactions();
        setTxData((data || []) as Transaction[]);
        setLoading(false);
    };

    useEffect(() => {
        loadTx();
        const sub = subscribeToTransactions(() => loadTx());
        return () => { sub.unsubscribe(); };
    }, []);

    const filtered = txData.filter(tx => {
        if (filterType !== 'all' && tx.type !== filterType) return false;
        if (search && !tx.tx_id?.toLowerCase().includes(search.toLowerCase()) && !tx.peer_name?.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const totalEarned = txData.filter(t => t.type === 'sell' || t.type === 'reward').reduce((s, t) => s + (parseFloat(t.value.replace('+', '').replace(' ETH', '').replace(' ETK', '')) || 0), 0);
    const totalSpent = txData.filter(t => t.type === 'buy' || t.type === 'stake').reduce((s, t) => s + Math.abs(parseFloat(t.value.replace(' ETH', '').replace(' ETK', '')) || 0), 0);

    const handleCopy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    const fmtTime = (iso: string) => { const d = new Date(iso); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); };
    const fmtDate = (iso: string) => { const d = new Date(iso); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#EAFFD2]">Transaction History</h2>
                    <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Transparent on-chain ledger of all energy trades</p>
                </div>
                <button
                    onClick={() => {
                        if (filtered.length === 0) return;
                        const headers = ['TX ID', 'Type', 'Peer', 'Amount', 'Value', 'Status', 'Time'];
                        const rows = filtered.map(tx => [tx.tx_id, tx.type, tx.peer_name || 'Unknown', tx.amount, tx.value, tx.status, new Date(tx.created_at).toLocaleString()]);
                        const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url; a.download = `gridmatrix-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
                        document.body.appendChild(a); a.click(); document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    }}
                    className="px-4 py-2.5 bg-[#1a1d1a] border border-[#2b2f2b] text-[#EAFFD2] rounded-xl font-bold text-sm hover:border-[#3a3e3a] transition-colors flex items-center gap-2"
                >
                    <Download className="w-4 h-4" /> Export CSV
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#9FDC56]/[0.06] border border-[#9FDC56]/10 p-5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Earned</p>
                    <p className="text-2xl font-bold text-[#9FDC56]">{totalEarned.toFixed(3)} <span className="text-sm text-zinc-500">ETH</span></p>
                </div>
                <div className="rounded-2xl bg-[#545FFF]/[0.06] border border-[#545FFF]/10 p-5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-[#545FFF]">{totalSpent.toFixed(3)} <span className="text-sm text-zinc-500">ETH</span></p>
                </div>
                <div className="rounded-2xl bg-[#FF7366]/[0.06] border border-[#FF7366]/10 p-5">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Net Profit</p>
                    <p className="text-2xl font-bold text-[#FF7366]">{(totalEarned - totalSpent).toFixed(3)} <span className="text-sm text-zinc-500">ETH</span></p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="text" placeholder="Search by TX ID or peer..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a1d1a] border border-[#2b2f2b] rounded-xl text-sm font-medium text-[#EAFFD2] placeholder-zinc-700 focus:outline-none focus:border-[#9FDC56]/30 transition-colors" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {(['all', 'sell', 'buy', 'stake', 'reward'] as const).map((type) => (
                        <button key={type} onClick={() => setFilterType(type)}
                            className={`px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${filterType === type ? 'bg-[#9FDC56]/10 text-[#9FDC56] ring-1 ring-[#9FDC56]/20' : 'text-zinc-500 hover:text-[#EAFFD2] hover:bg-white/[0.03]'}`}>
                            {type === 'all' ? 'All' : type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[#2b2f2b]">
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">TX ID</th>
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Type</th>
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Peer</th>
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Value</th>
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Time</th>
                                <th className="text-right px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-[#9FDC56] mx-auto" /></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={8} className="px-6 py-12 text-center text-zinc-600 text-sm">No transactions yet</td></tr>
                            ) : filtered.map((tx) => {
                                const cfg = typeConfig[tx.type] || typeConfig.buy;
                                return (
                                    <tr key={tx.id} className="border-b border-[#2b2f2b] hover:bg-white/[0.01] transition-colors">
                                        <td className="px-6 py-4 text-[12px] font-bold text-[#EAFFD2] font-mono tracking-wider">{tx.tx_id}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.icon} {cfg.label}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[12px] font-medium text-zinc-400">{tx.peer_name || 'Unknown'}</td>
                                        <td className="px-6 py-4 text-[12px] font-bold text-[#EAFFD2]">{tx.amount}</td>
                                        <td className="px-6 py-4"><span className={`text-[12px] font-bold ${tx.value.startsWith('+') ? 'text-[#9FDC56]' : 'text-[#FF7366]'}`}>{tx.value}</span></td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${tx.status === 'confirmed' ? 'bg-[#9FDC56]/10 text-[#9FDC56]' : tx.status === 'pending' ? 'bg-[#FF7366]/10 text-[#FF7366]' : 'bg-red-500/10 text-red-500'}`}>{tx.status}</span>
                                        </td>
                                        <td className="px-6 py-4"><p className="text-[11px] font-medium text-zinc-400">{fmtTime(tx.created_at)}</p><p className="text-[10px] text-zinc-600 font-medium">{fmtDate(tx.created_at)}</p></td>
                                        <td className="px-6 py-4 text-right"><button onClick={() => setSelectedTx(tx)} className="p-2 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-[#EAFFD2] transition-colors"><Eye className="w-4 h-4" /></button></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedTx && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedTx(null)}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-7 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold tracking-tight text-[#EAFFD2]">Transaction Details</h3>
                            <span className="text-[10px] font-bold text-[#9FDC56] font-mono">{selectedTx.tx_id}</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Type', value: <span className="capitalize font-bold" style={{ color: (typeConfig[selectedTx.type] || typeConfig.buy).color }}>{selectedTx.type}</span> },
                                { label: 'Peer', value: selectedTx.peer_name || 'Unknown' },
                                { label: 'Amount', value: selectedTx.amount },
                                { label: 'Value', value: <span className={selectedTx.value.startsWith('+') ? 'text-[#9FDC56]' : 'text-[#FF7366]'}>{selectedTx.value}</span> },
                                { label: 'Status', value: <span className="text-[#9FDC56] font-bold capitalize">{selectedTx.status}</span> },
                                { label: 'Block', value: `#${(selectedTx.block_number ?? 0).toLocaleString()}` },
                                { label: 'Gas Used', value: `${selectedTx.gas_used ?? '0.0000'} ETH` },
                                { label: 'Time', value: `${fmtDate(selectedTx.created_at)} ${fmtTime(selectedTx.created_at)}` },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between px-4 py-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                    <span className="text-[11px] font-medium text-zinc-500">{row.label}</span>
                                    <span className="text-[12px] font-bold text-[#EAFFD2]">{row.value}</span>
                                </div>
                            ))}
                            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <span className="text-[11px] font-medium text-zinc-500">TX Hash</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-[#9FDC56] font-mono">{selectedTx.tx_hash}</span>
                                    <button onClick={() => handleCopy(selectedTx.tx_hash)} className="text-zinc-500 hover:text-[#EAFFD2] transition-colors">
                                        {copied ? <Check className="w-3.5 h-3.5 text-[#9FDC56]" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    const hash = selectedTx.tx_hash;
                                    // Try Etherscan for mainnet hashes, or open localhost for Hardhat
                                    const url = hash && hash.startsWith('0x') && hash.length === 66
                                        ? `https://etherscan.io/tx/${hash}`
                                        : `https://etherscan.io/search?q=${hash || selectedTx.tx_id}`;
                                    window.open(url, '_blank', 'noopener,noreferrer');
                                }}
                                className="flex-1 py-3 bg-[#9FDC56] hover:bg-[#8cc34b] text-[#161815] rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(159,220,86,0.3)]"
                            >
                                <ExternalLink className="w-4 h-4" /> View on Explorer
                            </button>
                            <button onClick={() => setSelectedTx(null)} className="flex-1 py-3 border border-[#2b2f2b] rounded-xl font-bold text-sm text-zinc-400 hover:text-[#EAFFD2] hover:border-[#3a3e3a] transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;