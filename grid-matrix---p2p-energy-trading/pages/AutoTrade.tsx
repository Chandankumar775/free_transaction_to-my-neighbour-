import React, { useState } from 'react';
import { Bot, Plus, TrendingUp, AlertCircle, ArrowRight, Zap, Loader2, ShoppingCart, Tag } from 'lucide-react';
import { useAutoTrade } from '../src/hooks/useContracts';
import type { AutoBuyOrder, AutoSellOrder } from '../src/lib/contracts';

const fmtETH = (v: string) => parseFloat(v).toFixed(6);
const fmtETK = (v: string) => parseFloat(v).toLocaleString();

const AutoTrade: React.FC = () => {
    const { buyOrders, sellOrders, loading, placeBuy, placeSell } = useAutoTrade();

    const [showModal, setShowModal] = useState<'buy' | 'sell' | null>(null);
    const [maxPrice,  setMaxPrice]  = useState('');
    const [minPrice,  setMinPrice]  = useState('');
    const [amount,    setAmount]    = useState('');
    const [ethDeposit,setEthDeposit]= useState('');
    const [isPlacing, setIsPlacing] = useState(false);
    const [txErr,     setTxErr]     = useState('');

    const activeBuys  = buyOrders.filter(o => o.active);
    const activeSells = sellOrders.filter(o => o.active);

    const handlePlaceBuy = async () => {
        setIsPlacing(true); setTxErr('');
        try {
            await placeBuy(maxPrice, amount);
            setShowModal(null); setMaxPrice(''); setAmount(''); setEthDeposit('');
        } catch (e: any) {
            setTxErr(e?.reason || e?.message?.slice(0, 100) || 'Transaction failed');
        } finally { setIsPlacing(false); }
    };

    const handlePlaceSell = async () => {
        setIsPlacing(true); setTxErr('');
        try {
            await placeSell(minPrice, amount);
            setShowModal(null); setMinPrice(''); setAmount('');
        } catch (e: any) {
            setTxErr(e?.reason || e?.message?.slice(0, 100) || 'Transaction failed');
        } finally { setIsPlacing(false); }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-medium tracking-tight text-[#EAFFD2]">Auto-Trade <span className="text-[#9FDC56]">Orders</span></h1>
                    <p className="text-zinc-500 mt-2 text-sm max-w-lg">
                        Place standing buy or sell orders on-chain. Orders execute automatically when matched.
                        {loading && <span className="ml-2 inline-flex items-center gap-1 text-zinc-600"><Loader2 className="w-3 h-3 animate-spin" /> syncing…</span>}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => { setShowModal('buy'); setTxErr(''); }}
                        className="px-5 py-3 bg-[#545FFF]/10 border border-[#545FFF]/30 rounded-xl text-[#545FFF] font-bold text-sm hover:bg-[#545FFF]/20 transition-all flex items-center gap-2">
                        <ShoppingCart size={18} /> Place Buy Order
                    </button>
                    <button onClick={() => { setShowModal('sell'); setTxErr(''); }}
                        className="px-6 py-3 bg-[#9FDC56] text-[#161815] rounded-xl font-bold text-sm hover:brightness-110 shadow-[0_0_20px_rgba(159,220,86,0.2)] transition-all flex items-center gap-2">
                        <Tag size={18} /> Place Sell Order
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#1a1d1a] to-[#161815] p-6 rounded-3xl border border-[#2b2f2b] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Bot size={100} className="text-[#9FDC56]" /></div>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Active Buy Orders</p>
                    <h2 className="text-4xl font-black text-white">{activeBuys.length}</h2>
                    <div className="flex items-center gap-2 mt-4 text-[#545FFF] text-sm font-bold bg-[#545FFF]/10 w-fit px-3 py-1 rounded-full">
                        <ArrowRight size={14} className="rotate-45" /> Waiting to buy
                    </div>
                </div>
                <div className="bg-[#1a1d1a] p-6 rounded-3xl border border-[#2b2f2b] flex flex-col justify-between">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Active Sell Orders</p>
                    <h2 className="text-3xl font-black text-white">{activeSells.length}</h2>
                    <p className="text-xs text-zinc-500 mt-2">On-chain escrow held</p>
                </div>
                <div className="bg-[#1a1d1a] p-6 rounded-3xl border border-[#2b2f2b] flex flex-col justify-between">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Orders</p>
                    <h2 className="text-3xl font-black text-white">{buyOrders.length + sellOrders.length}</h2>
                    <div className="flex items-center gap-1 mt-4">
                        <div className="w-2 h-2 rounded-full bg-[#9FDC56] animate-pulse" />
                        <p className="text-xs text-zinc-500">Live from chain</p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {!loading && activeBuys.length === 0 && activeSells.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-600 border border-dashed border-[#2b2f2b] rounded-2xl">
                    <Bot className="w-12 h-12 mb-4 opacity-30" />
                    <p className="font-semibold">No active orders</p>
                    <p className="text-xs mt-1">Place a buy or sell order to get started</p>
                </div>
            )}

            {/* Buy Orders */}
            {activeBuys.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-[#545FFF] mb-4 flex items-center gap-2">
                        <ShoppingCart size={18} /> Buy Orders
                    </h2>
                    <div className="grid gap-4">
                        {activeBuys.map((order: AutoBuyOrder) => (
                            <div key={order.id} className="group bg-[#1a1d1a] border border-[#2b2f2b] hover:border-[#545FFF]/50 rounded-2xl p-6 transition-all duration-300">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 rounded-2xl bg-[#545FFF]/10 text-[#545FFF] flex items-center justify-center">
                                            <ArrowRight className="rotate-45" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Buy Order #{order.id}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-[#9FDC56] animate-pulse" />
                                                <span className="text-xs font-medium text-zinc-500 uppercase">active</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full bg-[#161815] rounded-xl p-3 border border-[#2b2f2b] flex items-center gap-3 font-mono text-xs overflow-x-auto">
                                        <span className="text-[#545FFF] font-bold">BUY</span>
                                        <span className="px-2 py-1 rounded bg-[#2b2f2b] text-[#EAFFD2] whitespace-nowrap">{fmtETK(order.targetAmount)} ETK</span>
                                        <span className="text-zinc-500">max price</span>
                                        <span className="px-2 py-1 rounded bg-[#2b2f2b] text-[#9FDC56] whitespace-nowrap">{fmtETH(order.maxPricePerUnit)} ETH/ETK</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase">ETH Deposited</p>
                                        <p className="text-[#9FDC56] font-bold">{fmtETH(order.depositedETH)} ETH</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sell Orders */}
            {activeSells.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                        <Tag size={18} /> Sell Orders
                    </h2>
                    <div className="grid gap-4">
                        {activeSells.map((order: AutoSellOrder) => (
                            <div key={order.id} className="group bg-[#1a1d1a] border border-[#2b2f2b] hover:border-[#FFD700]/50 rounded-2xl p-6 transition-all duration-300">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 text-[#FFD700] flex items-center justify-center">
                                            <Zap />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Sell Order #{order.id}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="w-2 h-2 rounded-full bg-[#9FDC56] animate-pulse" />
                                                <span className="text-xs font-medium text-zinc-500 uppercase">active</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 w-full bg-[#161815] rounded-xl p-3 border border-[#2b2f2b] flex items-center gap-3 font-mono text-xs overflow-x-auto">
                                        <span className="text-[#FFD700] font-bold">SELL</span>
                                        <span className="px-2 py-1 rounded bg-[#2b2f2b] text-[#EAFFD2] whitespace-nowrap">{fmtETK(order.totalAmount)} ETK</span>
                                        <span className="text-zinc-500">min price</span>
                                        <span className="px-2 py-1 rounded bg-[#2b2f2b] text-[#9FDC56] whitespace-nowrap">{fmtETH(order.minPricePerUnit)} ETH/ETK</span>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase">Filled</p>
                                        <p className="text-zinc-400 font-bold">{fmtETK(order.soldAmount)} ETK</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Place Order Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(null)}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {showModal === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
                            </h2>
                            <button onClick={() => setShowModal(null)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Amount (ETK)</label>
                                <input type="number" placeholder="e.g. 500 (whole tokens)" value={amount} onChange={e => setAmount(e.target.value)}
                                    className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                                <p className="text-[10px] text-zinc-600 mt-1">Enter whole number of ETK tokens</p>
                            </div>

                            {showModal === 'buy' ? (
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Max Price per ETK (ETH)</label>
                                    <input type="number" placeholder="e.g. 0.001" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                                        className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                                    <p className="text-[10px] text-zinc-600 mt-1">* ETH deposit = amount × max price. MetaMask will show total ETH needed.</p>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Min Price per ETK (ETH)</label>
                                    <input type="number" placeholder="e.g. 0.001" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                                        className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors" />
                                    <p className="text-[10px] text-zinc-600 mt-1">* MetaMask will ask you to approve ETK transfer first.</p>
                                </div>
                            )}
                        </div>

                        {txErr && (
                            <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{txErr}</span>
                            </div>
                        )}

                        <div className="mt-8 flex gap-3">
                            <button onClick={() => setShowModal(null)} className="flex-1 py-3 rounded-xl font-bold bg-[#2b2f2b] text-zinc-400 hover:text-white transition-colors">Cancel</button>
                            <button
                                onClick={showModal === 'buy' ? handlePlaceBuy : handlePlaceSell}
                                disabled={isPlacing || !amount || !(showModal === 'buy' ? maxPrice : minPrice)}
                                className="flex-1 py-3 rounded-xl font-bold bg-[#9FDC56] text-[#161815] hover:brightness-110 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                                {isPlacing ? <><Loader2 className="w-4 h-4 animate-spin" /> Placing...</> : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AutoTrade;
