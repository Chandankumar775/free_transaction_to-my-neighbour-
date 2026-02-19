import React, { useState } from 'react';
import { Search, Filter, ShoppingCart, Zap, Battery, Wind, ArrowUpRight, Plus, Check, Loader2, AlertCircle } from 'lucide-react';
import { useMarketListings } from '../src/hooks/useContracts';
import type { MarketListing } from '../src/lib/contracts';

type EnergyType = 'Solar' | 'Wind' | 'Biomass' | 'Hydro';
const TYPE_CYCLE: EnergyType[] = ['Solar', 'Wind', 'Biomass', 'Hydro'];
const getType = (id: number): EnergyType => TYPE_CYCLE[id % TYPE_CYCLE.length];
const fmtAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

const TypeIcon: React.FC<{ type: EnergyType }> = ({ type }) => {
    switch (type) {
        case 'Solar':   return <Zap className="w-4 h-4 text-[#9FDC56]" />;
        case 'Wind':    return <Wind className="w-4 h-4 text-[#EAFFD2]" />;
        case 'Biomass': return <ShoppingCart className="w-4 h-4 text-orange-400" />;
        case 'Hydro':   return <Battery className="w-4 h-4 text-[#545FFF]" />;
    }
};

const Marketplace: React.FC = () => {
    const { listings, loading, buy, list } = useMarketListings();

    const [search,    setSearch]    = useState('');
    const [filter,    setFilter]    = useState('All');
    const [selected,  setSelected]  = useState<MarketListing | null>(null);
    const [isBuying,  setIsBuying]  = useState(false);
    const [buyError,  setBuyError]  = useState('');
    const [showCreate,setShowCreate]= useState(false);
    const [createAmt, setCreateAmt] = useState('');
    const [createPx,  setCreatePx]  = useState('');
    const [isListing, setIsListing] = useState(false);

    const active = listings.filter(l => l.active);
    const filtered = active.filter(l => {
        const type = getType(l.id);
        return (filter === 'All' || type === filter) &&
               fmtAddr(l.seller).toLowerCase().includes(search.toLowerCase());
    });

    const handleBuy = async () => {
        if (!selected) return;
        setIsBuying(true); setBuyError('');
        try {
            await buy(selected.id, selected.price);
            setSelected(null);
        } catch (e: any) {
            setBuyError(e?.reason || e?.message?.slice(0, 80) || 'Transaction failed');
        } finally { setIsBuying(false); }
    };

    const handleList = async () => {
        if (!createAmt || !createPx) return;
        setIsListing(true);
        try {
            await list(createAmt, createPx);
            setShowCreate(false); setCreateAmt(''); setCreatePx('');
        } catch (e: any) {
            alert(e?.reason || e?.message?.slice(0, 120) || 'Failed');
        } finally { setIsListing(false); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#EAFFD2]">Energy Marketplace</h2>
                    <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                        Buy and sell renewable energy directly from peers
                        {loading && <span className="ml-2 inline-flex items-center gap-1 text-zinc-600"><Loader2 className="w-3 h-3 animate-spin" /> fetching…</span>}
                    </p>
                </div>
                <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 bg-[#9FDC56] text-[#161815] rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(159,220,86,0.3)] hover:bg-[#8cc34b] transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create Listing
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input type="text" placeholder="Search sellers..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#1a1d1a] border border-[#2b2f2b] rounded-xl text-sm font-medium text-[#EAFFD2] placeholder-zinc-700 focus:outline-none focus:border-[#9FDC56]/50 transition-colors" />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {['All', 'Solar', 'Wind', 'Hydro', 'Biomass'].map(t => (
                        <button key={t} onClick={() => setFilter(t)}
                            className={`px-3.5 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${filter === t ? 'bg-[#9FDC56]/10 text-[#9FDC56] ring-1 ring-[#9FDC56]/20' : 'text-zinc-500 hover:text-[#EAFFD2] hover:bg-white/[0.03]'}`}>
                            {t}
                        </button>
                    ))}
                    <button className="px-3 py-2 rounded-lg border border-[#2b2f2b] text-zinc-500 hover:text-[#EAFFD2] hover:border-[#3a3e3a] transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
                    <Zap className="w-12 h-12 mb-4 opacity-30" />
                    <p className="font-semibold">No active listings</p>
                    <p className="text-xs mt-1">Be the first to list energy for sale</p>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(item => {
                    const type = getType(item.id);
                    return (
                        <div key={item.id} className="group relative rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-5 hover:border-[#3a3e3a] transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#2b2f2b] flex items-center justify-center"><TypeIcon type={type} /></div>
                                    <div>
                                        <h3 className="text-sm font-bold text-[#EAFFD2] flex items-center gap-1 font-mono">
                                            {fmtAddr(item.seller)}<Check className="w-3 h-3 text-[#9FDC56]" />
                                        </h3>
                                        <span className="text-[10px] font-medium text-zinc-500">On-chain verified</span>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-lg bg-[#2b2f2b] text-[10px] font-bold text-zinc-400 border border-[#3a3e3a]">{type}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase">Available</p>
                                    <p className="text-lg font-bold text-[#EAFFD2] mt-0.5">{parseFloat(item.amount).toLocaleString()} <span className="text-[10px] text-zinc-600">ETK</span></p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                    <p className="text-[10px] font-semibold text-zinc-500 uppercase">Price</p>
                                    <p className="text-lg font-bold text-[#9FDC56] mt-0.5">{parseFloat(item.price).toFixed(4)} <span className="text-[10px] text-zinc-600">ETH</span></p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(item)}
                                className="w-full py-2.5 rounded-xl bg-[#EAFFD2] text-[#161815] font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[rgba(234,255,210,0.1)]">
                                Buy Energy <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Buy Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setSelected(null); setBuyError(''); }}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#EAFFD2]">Confirm Purchase</h3>
                            <button onClick={() => { setSelected(null); setBuyError(''); }} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-4 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <span className="text-sm font-medium text-zinc-400">Seller</span>
                                <span className="text-sm font-bold text-[#EAFFD2] font-mono">{fmtAddr(selected.seller)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <span className="text-sm font-medium text-zinc-400">You Receive</span>
                                <span className="text-lg font-bold text-[#EAFFD2]">{parseFloat(selected.amount).toLocaleString()} ETK</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <span className="text-sm font-medium text-zinc-400">You Pay</span>
                                <span className="text-lg font-bold text-[#9FDC56]">{parseFloat(selected.price).toFixed(6)} ETH</span>
                            </div>
                        </div>
                        {buyError && (
                            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{buyError}</span>
                            </div>
                        )}
                        <div className="mt-6 flex gap-3">
                            <button onClick={handleBuy} disabled={isBuying}
                                className="flex-1 py-3 bg-[#9FDC56] hover:bg-[#8cc34b] disabled:opacity-50 text-[#161815] rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(159,220,86,0.3)] flex items-center justify-center gap-2">
                                {isBuying ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</> : 'Confirm Transaction'}
                            </button>
                            <button onClick={() => { setSelected(null); setBuyError(''); }} className="flex-1 py-3 border border-[#2b2f2b] text-zinc-400 hover:text-[#EAFFD2] rounded-xl font-bold text-sm hover:bg-[#2b2f2b] transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Listing Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#EAFFD2]">List Energy for Sale</h3>
                            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Amount (ETK)</label>
                                <input type="number" placeholder="e.g. 500" value={createAmt} onChange={e => setCreateAmt(e.target.value)}
                                    className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Price per ETK (ETH)</label>
                                <input type="number" placeholder="e.g. 0.001" value={createPx} onChange={e => setCreatePx(e.target.value)}
                                    className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                                <p className="text-[10px] text-zinc-600 mt-1.5">* MetaMask will ask you to approve ETK spend first</p>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <button onClick={handleList} disabled={isListing || !createAmt || !createPx}
                                className="flex-1 py-3 bg-[#9FDC56] hover:bg-[#8cc34b] disabled:opacity-50 text-[#161815] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                                {isListing ? <><Loader2 className="w-4 h-4 animate-spin" /> Listing...</> : 'Create Listing'}
                            </button>
                            <button onClick={() => setShowCreate(false)} className="flex-1 py-3 border border-[#2b2f2b] text-zinc-400 hover:text-[#EAFFD2] rounded-xl font-bold text-sm hover:bg-[#2b2f2b] transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
