import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Zap, Battery, Wind, ArrowUpRight, Plus, Check, Loader2, AlertCircle, Wallet } from 'lucide-react';
import { getListings, createListing, buyListing, subscribeToListings } from '../lib/supabase';
import { useWallet } from '../lib/WalletContext';
import { ethers } from 'ethers';

type EnergyType = 'Solar' | 'Wind' | 'Biomass' | 'Hydro';
const TYPE_CYCLE: EnergyType[] = ['Solar', 'Wind', 'Biomass', 'Hydro'];

interface Listing {
    id: number;
    seller_address: string;
    seller_name: string;
    energy_type: string;
    amount_kwh: number;
    price_per_kwh: number;
    status: string;
    buyer_address?: string;
    created_at: string;
}

const TypeIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case 'Solar':   return <Zap className="w-4 h-4 text-[#9FDC56]" />;
        case 'Wind':    return <Wind className="w-4 h-4 text-[#EAFFD2]" />;
        case 'Biomass': return <ShoppingCart className="w-4 h-4 text-orange-400" />;
        case 'Hydro':   return <Battery className="w-4 h-4 text-[#545FFF]" />;
        default:        return <Zap className="w-4 h-4 text-[#9FDC56]" />;
    }
};

/* ── helper: get connected MetaMask wallet ── */
async function getWallet(): Promise<{ address: string; signer: ethers.Signer } | null> {
    if (typeof window === 'undefined' || !window.ethereum) return null;
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        }
        const signer = await provider.getSigner();
        return { address: await signer.getAddress(), signer };
    } catch { return null; }
}

const Marketplace: React.FC = () => {
    const { role, address: ctxAddress } = useWallet();
    const isProducer = role === 'producer';
    const isConsumer = role === 'consumer';
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [walletAddr, setWalletAddr] = useState<string | null>(null);

    const [search,    setSearch]    = useState('');
    const [filter,    setFilter]    = useState('All');
    const [selected,  setSelected]  = useState<Listing | null>(null);
    const [isBuying,  setIsBuying]  = useState(false);
    const [buyStep,   setBuyStep]   = useState('');
    const [buyError,  setBuyError]  = useState('');
    const [buyOk,     setBuyOk]     = useState(false);
    const [txHash,    setTxHash]    = useState('');
    const [showCreate,setShowCreate]= useState(false);
    const [createAmt, setCreateAmt] = useState('');
    const [createPx,  setCreatePx]  = useState('');
    const [createType,setCreateType]= useState<EnergyType>('Solar');
    const [createName,setCreateName]= useState('');
    const [isListing, setIsListing] = useState(false);
    const [listOk,    setListOk]    = useState(false);

    // Detect MetaMask wallet on load
    useEffect(() => {
        (async () => {
            const w = await getWallet();
            if (w) setWalletAddr(w.address);
        })();
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accs: string[]) => setWalletAddr(accs[0] ?? null));
        }
    }, []);

    // Load listings from Supabase
    useEffect(() => {
        (async () => {
            const { data } = await getListings('active');
            if (data) setListings(data as Listing[]);
            setLoading(false);
        })();
        const sub = subscribeToListings(() => {
            getListings('active').then(({ data }) => { if (data) setListings(data as Listing[]); });
        });
        return () => { sub.unsubscribe(); };
    }, []);

    const filtered = listings.filter(l => {
        return (filter === 'All' || l.energy_type === filter) &&
               (l.seller_name || l.seller_address).toLowerCase().includes(search.toLowerCase());
    });

    /* ═══════════ BUY with MetaMask ETH transfer ═══════════ */
    const handleBuy = async () => {
        if (!selected) return;
        setIsBuying(true); setBuyError(''); setBuyStep(''); setTxHash('');

        try {
            // 1. Connect wallet
            setBuyStep('Connecting wallet…');
            const w = await getWallet();
            if (!w) throw new Error('Please install MetaMask and connect your wallet');
            setWalletAddr(w.address);

            // 2. Calculate total ETH
            const totalEth = selected.amount_kwh * selected.price_per_kwh;
            // Use a safe string: 6 decimal places for ETH
            const ethValue = totalEth.toFixed(6);

            // 3. Send real ETH via MetaMask → seller address
            setBuyStep('Confirm in MetaMask…');
            const tx = await w.signer.sendTransaction({
                to: selected.seller_address,
                value: ethers.parseEther(ethValue),
            });
            setTxHash(tx.hash);
            setBuyStep('Waiting for block confirmation…');
            await tx.wait();

            // 4. Record in Supabase (listing marked sold + transaction rows)
            setBuyStep('Recording transaction…');
            await buyListing(selected.id, w.address);

            // 5. Done
            setBuyOk(true);
            setBuyStep('');
            setTimeout(() => { setSelected(null); setBuyOk(false); setTxHash(''); }, 3000);
        } catch (e: any) {
            const msg = e?.reason || e?.message || 'Transaction failed';
            setBuyError(msg.includes('user rejected') || msg.includes('denied')
                ? 'You rejected the transaction in MetaMask'
                : msg.slice(0, 140));
            setBuyStep('');
        } finally { setIsBuying(false); }
    };

    /* ═══════════ CREATE LISTING (uses MetaMask address) ═══════════ */
    const handleList = async () => {
        if (!createAmt || !createPx) return;
        setIsListing(true);
        try {
            const w = await getWallet();
            const addr = w?.address || '0x0000000000000000000000000000000000000000';
            if (!w) throw new Error('Connect MetaMask to create a listing');
            const { error } = await createListing({
                seller_address: addr,
                seller_name: createName || 'My Solar Farm',
                energy_type: createType,
                amount_kwh: parseFloat(createAmt),
                price_per_kwh: parseFloat(createPx),
            });
            if (error) throw error;
            setListOk(true);
            setTimeout(() => { setShowCreate(false); setCreateAmt(''); setCreatePx(''); setCreateName(''); setListOk(false); }, 1200);
        } catch (e: any) {
            alert(e?.message?.slice(0, 120) || 'Failed');
        } finally { setIsListing(false); }
    };

    /* ─── total helper ─── */
    const fmtTotal = (l: Listing) => (l.amount_kwh * l.price_per_kwh).toFixed(4);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[#EAFFD2]">{isProducer ? 'My Listings' : 'Energy Marketplace'}</h2>
                    <p className="text-[11px] font-medium text-zinc-500 mt-0.5">
                        {isProducer
                            ? 'Create and manage your energy listings — buyers pay via MetaMask'
                            : 'Browse and buy renewable energy (kWh) — purchases are settled on-chain via MetaMask'}
                        {loading && <span className="ml-2 inline-flex items-center gap-1 text-zinc-600"><Loader2 className="w-3 h-3 animate-spin" /> fetching…</span>}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {walletAddr && (
                        <span className="px-3 py-2 bg-[#2b2f2b] rounded-xl text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                            <Wallet className="w-3.5 h-3.5 text-[#9FDC56]" />
                            {walletAddr.slice(0, 6)}…{walletAddr.slice(-4)}
                        </span>
                    )}
                    {isProducer && (
                        <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 bg-[#9FDC56] text-[#161815] rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(159,220,86,0.3)] hover:bg-[#8cc34b] transition-all flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create Listing
                        </button>
                    )}
                </div>
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
                {filtered.map(item => (
                    <div key={item.id} className="group relative rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-5 hover:border-[#3a3e3a] transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#2b2f2b] flex items-center justify-center"><TypeIcon type={item.energy_type} /></div>
                                <div>
                                    <h3 className="text-sm font-bold text-[#EAFFD2] flex items-center gap-1">
                                        {item.seller_name}<Check className="w-3 h-3 text-[#9FDC56]" />
                                    </h3>
                                    <span className="text-[10px] font-medium text-zinc-500 font-mono">{item.seller_address.slice(0,6)}…{item.seller_address.slice(-4)}</span>
                                </div>
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-[#2b2f2b] text-[10px] font-bold text-zinc-400 border border-[#3a3e3a]">{item.energy_type}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <p className="text-[10px] font-semibold text-zinc-500 uppercase">Available</p>
                                <p className="text-lg font-bold text-[#EAFFD2] mt-0.5">{item.amount_kwh.toLocaleString()} <span className="text-[10px] text-zinc-600">kWh</span></p>
                            </div>
                            <div className="p-3 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <p className="text-[10px] font-semibold text-zinc-500 uppercase">Price</p>
                                <p className="text-lg font-bold text-[#9FDC56] mt-0.5">{item.price_per_kwh} <span className="text-[10px] text-zinc-600">ETH/kWh</span></p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mb-3 px-1">
                            <span className="text-[10px] text-zinc-500">Total cost</span>
                            <span className="text-sm font-bold text-[#9FDC56]">{fmtTotal(item)} ETH</span>
                        </div>
                        <button onClick={() => setSelected(item)}
                            disabled={isProducer}
                            className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isProducer
                                ? 'bg-[#2b2f2b] text-zinc-600 cursor-not-allowed'
                                : 'bg-[#EAFFD2] text-[#161815] hover:bg-white group-hover:shadow-lg group-hover:shadow-[rgba(234,255,210,0.1)]'}`}>
                            {isProducer
                                ? <><Check className="w-4 h-4" /> Your Listing</>
                                : <><Wallet className="w-4 h-4" /> Buy via MetaMask</>}
                        </button>
                    </div>
                ))}
            </div>

            {/* ═══════════ Buy Modal (MetaMask flow) ═══════════ */}
            {selected && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { if (!isBuying) { setSelected(null); setBuyError(''); setBuyOk(false); setTxHash(''); setBuyStep(''); } }}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#EAFFD2]">Confirm Purchase</h3>
                            <button onClick={() => { if (!isBuying) { setSelected(null); setBuyError(''); } }} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-4 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <span className="text-sm font-medium text-zinc-400">Seller</span>
                                <div className="text-right">
                                    <span className="block text-sm font-bold text-[#EAFFD2]">{selected.seller_name}</span>
                                    <span className="text-[10px] text-zinc-600 font-mono">{selected.seller_address.slice(0,8)}…{selected.seller_address.slice(-6)}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-[#161815] border border-[#2b2f2b]">
                                <span className="text-sm font-medium text-zinc-400">Energy</span>
                                <span className="text-sm font-bold text-[#EAFFD2]">{selected.amount_kwh.toLocaleString()} kWh · {selected.energy_type}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-xl bg-[#161815] border border-[#9FDC56]/30">
                                <span className="text-sm font-medium text-zinc-400">You Pay (via MetaMask)</span>
                                <span className="text-xl font-black text-[#9FDC56]">{fmtTotal(selected)} ETH</span>
                            </div>
                        </div>

                        {/* Step progress */}
                        {buyStep && (
                            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-[#545FFF]/10 border border-[#545FFF]/20 text-[#545FFF] text-sm font-semibold">
                                <Loader2 className="w-4 h-4 animate-spin" /> {buyStep}
                            </div>
                        )}

                        {/* Tx hash */}
                        {txHash && (
                            <div className="mt-2 p-3 rounded-xl bg-[#2b2f2b] border border-[#3a3e3a]">
                                <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Transaction Hash</p>
                                <p className="text-xs font-mono text-[#EAFFD2] break-all">{txHash}</p>
                            </div>
                        )}

                        {buyError && (
                            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{buyError}</span>
                            </div>
                        )}
                        {buyOk && (
                            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-[#9FDC56]/10 border border-[#9FDC56]/20 text-[#9FDC56] text-sm font-bold">
                                <Check className="w-4 h-4" /> Purchase confirmed on-chain! Energy transferred.
                            </div>
                        )}
                        <div className="mt-6 flex gap-3">
                            <button onClick={handleBuy} disabled={isBuying || buyOk}
                                className="flex-1 py-3 bg-[#9FDC56] hover:bg-[#8cc34b] disabled:opacity-50 text-[#161815] rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(159,220,86,0.3)] flex items-center justify-center gap-2">
                                {isBuying
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
                                    : buyOk
                                        ? <><Check className="w-4 h-4" /> Done!</>
                                        : <><Wallet className="w-4 h-4" /> Pay with MetaMask</>}
                            </button>
                            <button onClick={() => { if (!isBuying) { setSelected(null); setBuyError(''); } }}
                                disabled={isBuying}
                                className="flex-1 py-3 border border-[#2b2f2b] text-zinc-400 hover:text-[#EAFFD2] rounded-xl font-bold text-sm hover:bg-[#2b2f2b] transition-all disabled:opacity-30">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════ Create Listing Modal ═══════════ */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#EAFFD2]">List Energy for Sale</h3>
                            <button onClick={() => setShowCreate(false)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        {walletAddr && (
                            <div className="mb-4 px-3 py-2 rounded-lg bg-[#2b2f2b] text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5 text-[#9FDC56]" />
                                Listing as: {walletAddr.slice(0,6)}…{walletAddr.slice(-4)}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Seller / Farm Name</label>
                                <input type="text" placeholder="e.g. My Rooftop Solar" value={createName} onChange={e => setCreateName(e.target.value)}
                                    className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Energy Type</label>
                                <div className="flex gap-2">
                                    {TYPE_CYCLE.map(t => (
                                        <button key={t} onClick={() => setCreateType(t)}
                                            className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${createType === t ? 'bg-[#9FDC56]/10 text-[#9FDC56] ring-1 ring-[#9FDC56]/20' : 'text-zinc-500 bg-[#161815] border border-[#2b2f2b] hover:text-white'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Energy Amount (kWh)</label>
                                <input type="number" placeholder="e.g. 150" value={createAmt} onChange={e => setCreateAmt(e.target.value)}
                                    className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Price per kWh (ETH)</label>
                                <input type="number" step="0.0001" placeholder="e.g. 0.0005" value={createPx} onChange={e => setCreatePx(e.target.value)}
                                    className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                            </div>
                        </div>
                        {listOk && (
                            <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-[#9FDC56]/10 border border-[#9FDC56]/20 text-[#9FDC56] text-sm font-bold">
                                <Check className="w-4 h-4" /> Listing created successfully!
                            </div>
                        )}
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
