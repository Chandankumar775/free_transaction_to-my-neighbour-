import React, { useState, useEffect } from 'react';
import { Coins, Lock, ShieldCheck, Wallet, Loader2, AlertCircle, TrendingUp, Gift } from 'lucide-react';
import { useStaking, useTokenBalance } from '../src/hooks/useContracts';

const fmtETK = (v: string) => parseFloat(v).toLocaleString(undefined, { maximumFractionDigits: 4 });

const Staking: React.FC = () => {
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        const check = async () => {
            if (!window.ethereum) return;
            const accs: string[] = await window.ethereum.request({ method: 'eth_accounts' });
            if (accs[0]) setAccount(accs[0]);
        };
        check();
        window.ethereum?.on('accountsChanged', (a: string[]) => setAccount(a[0] ?? null));
    }, []);

    const { info, loading, stake, unstake, claim } = useStaking(account);
    const { balance } = useTokenBalance(account);

    const [stakeAmt,   setStakeAmt]   = useState('');
    const [unstakeAmt, setUnstakeAmt] = useState('');
    const [isStaking,  setIsStaking]  = useState(false);
    const [isUnstake,  setIsUnstake]  = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [txErr,      setTxErr]      = useState('');
    const [showModal,  setShowModal]  = useState<'stake' | 'unstake' | null>(null);

    const handleStake = async () => {
        setIsStaking(true); setTxErr('');
        try { await stake(stakeAmt); setStakeAmt(''); setShowModal(null); }
        catch (e: any) { setTxErr(e?.reason || e?.message?.slice(0, 100) || 'Failed'); }
        finally { setIsStaking(false); }
    };

    const handleUnstake = async () => {
        setIsUnstake(true); setTxErr('');
        try { await unstake(unstakeAmt); setUnstakeAmt(''); setShowModal(null); }
        catch (e: any) { setTxErr(e?.reason || e?.message?.slice(0, 100) || 'Failed'); }
        finally { setIsUnstake(false); }
    };

    const handleClaim = async () => {
        setIsClaiming(true); setTxErr('');
        try { await claim(); }
        catch (e: any) { setTxErr(e?.reason || e?.message?.slice(0, 100) || 'Failed'); }
        finally { setIsClaiming(false); }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a1d1a] to-[#161815] border border-[#2b2f2b] p-8 md:p-12">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <span className="px-3 py-1 rounded-full bg-[#9FDC56]/10 text-[#9FDC56] text-xs font-bold uppercase tracking-wider border border-[#9FDC56]/20 mb-4 inline-block">
                            Live Staking
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Stake ETK.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9FDC56] to-[#545FFF]">Power the Network.</span>
                        </h1>
                        <p className="text-zinc-400 text-lg mb-8">
                            Lock your Energy Tokens and earn continuous on-chain rewards.
                            Rewards accrue every second.
                        </p>
                        {!account ? (
                            <p className="text-zinc-500 text-sm flex items-center gap-2">
                                <Wallet size={16} /> Connect wallet in the sidebar to stake
                            </p>
                        ) : (
                            <div className="flex gap-4">
                                <button onClick={() => { setShowModal('stake'); setTxErr(''); }}
                                    className="px-6 py-3 bg-[#EAFFD2] text-[#161815] rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2">
                                    <Coins size={18} /> Stake ETK
                                </button>
                                <button onClick={() => { setShowModal('unstake'); setTxErr(''); }}
                                    className="px-6 py-3 bg-transparent border border-[#2b2f2b] text-zinc-300 rounded-xl font-bold hover:text-white hover:border-white transition-all">
                                    Unstake
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="hidden md:block absolute right-0 bottom-0 opacity-10">
                        <Coins size={300} className="transform translate-x-20 translate-y-20" />
                    </div>
                </div>
            </div>

            {/* Error banner */}
            {txErr && (
                <div className="flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{txErr}</span>
                    <button onClick={() => setTxErr('')} className="ml-auto text-xs opacity-60 hover:opacity-100">✕</button>
                </div>
            )}

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Your ETK Balance', value: account ? `${fmtETK(balance)} ETK` : '—', icon: <Wallet className="text-[#9FDC56]" />, loading },
                    { label: 'Your Staked Amount', value: account ? `${fmtETK(info.staked)} ETK` : '—', icon: <Lock className="text-[#545FFF]" />, loading },
                    { label: 'Pending Rewards', value: account ? `${fmtETK(info.pending)} ETK` : '—', icon: <Gift className="text-[#FFD700]" />, loading },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#1a1d1a] border border-[#2b2f2b] p-6 rounded-2xl flex items-center gap-6">
                        <div className="w-14 h-14 rounded-full bg-[#2b2f2b] flex items-center justify-center">{stat.icon}</div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                            {stat.loading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-zinc-600 mt-2" />
                            ) : (
                                <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Claim Rewards */}
            {account && parseFloat(info.pending) > 0 && (
                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-[#9FDC56]/10 to-transparent border border-[#9FDC56]/20">
                    <div>
                        <p className="text-sm font-bold text-[#9FDC56]">Rewards Available!</p>
                        <p className="text-xs text-zinc-500 mt-0.5">You have {fmtETK(info.pending)} ETK ready to claim</p>
                    </div>
                    <button onClick={handleClaim} disabled={isClaiming}
                        className="px-6 py-3 bg-[#9FDC56] text-[#161815] rounded-xl font-bold text-sm hover:bg-[#8cc34b] disabled:opacity-50 transition-all flex items-center gap-2">
                        {isClaiming ? <><Loader2 className="w-4 h-4 animate-spin" /> Claiming...</> : <><Gift size={16} /> Claim Rewards</>}
                    </button>
                </div>
            )}

            {/* Pool Info Card */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">ETK Staking Pool</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group bg-[#1a1d1a] border border-[#2b2f2b] p-1 rounded-3xl hover:scale-[1.02] transition-all duration-300 relative">
                        <div className="bg-[#161815] rounded-[22px] p-6 flex flex-col gap-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#9FDC56]/20 text-[#9FDC56]">
                                    <Coins size={24} />
                                </div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#2b2f2b] text-zinc-400">No Lock</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Energy Token Pool</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-end">
                                    <span className="text-zinc-500 text-xs">Reward rate</span>
                                    <span className="text-3xl font-black text-[#9FDC56]">Live</span>
                                </div>
                                <div className="h-px w-full bg-[#2b2f2b]" />
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">Token</span>
                                    <span className="text-white font-bold">ETK (Energy Token)</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">Rewards accrue</span>
                                    <span className="text-zinc-300 font-bold">Every second</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-zinc-500">Your staked</span>
                                    <span className="text-zinc-300 font-bold">{account ? `${fmtETK(info.staked)} ETK` : '—'}</span>
                                </div>
                            </div>
                            <button onClick={() => { setShowModal('stake'); setTxErr(''); }}
                                disabled={!account}
                                className="w-full mt-auto py-3 rounded-xl font-bold text-sm bg-white text-black hover:bg-[#9FDC56] hover:text-black disabled:opacity-40 transition-all">
                                {account ? 'Stake Now' : 'Connect Wallet'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-3xl p-6 flex flex-col gap-4">
                        <h3 className="font-bold text-white flex items-center gap-2"><TrendingUp size={18} className="text-[#9FDC56]" /> How it Works</h3>
                        {[
                            ['Approve & Stake', 'MetaMask will ask you to approve ETK, then stake into the pool'],
                            ['Earn Rewards', 'Rewards accrue every second based on your share of the pool'],
                            ['Claim Anytime', 'Claim rewards without unstaking — no lock period'],
                            ['Unstake Freely', 'Unstake any amount at any time with no penalty'],
                        ].map(([title, desc]) => (
                            <div key={title} className="flex gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#9FDC56]/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <ShieldCheck size={12} className="text-[#9FDC56]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">{title}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stake / Unstake Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(null)}>
                    <div className="bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-[#EAFFD2]">{showModal === 'stake' ? 'Stake ETK' : 'Unstake ETK'}</h3>
                            <button onClick={() => setShowModal(null)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-zinc-500 mb-2">
                                <span>Amount (ETK)</span>
                                <span>Balance: {fmtETK(showModal === 'stake' ? balance : info.staked)} ETK</span>
                            </div>
                            <input type="number" placeholder="0.0"
                                value={showModal === 'stake' ? stakeAmt : unstakeAmt}
                                onChange={e => showModal === 'stake' ? setStakeAmt(e.target.value) : setUnstakeAmt(e.target.value)}
                                className="w-full bg-[#161815] border border-[#2b2f2b] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9FDC56] transition-colors text-lg" />
                            {showModal === 'stake' && (
                                <p className="text-[10px] text-zinc-600 mt-1.5">* MetaMask will ask you to approve ETK transfer first</p>
                            )}
                        </div>
                        {txErr && (
                            <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{txErr}</span>
                            </div>
                        )}
                        <div className="flex gap-3">
                            <button
                                onClick={showModal === 'stake' ? handleStake : handleUnstake}
                                disabled={isStaking || isUnstake || !(showModal === 'stake' ? stakeAmt : unstakeAmt)}
                                className="flex-1 py-3 bg-[#9FDC56] hover:bg-[#8cc34b] disabled:opacity-50 text-[#161815] rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                                {(isStaking || isUnstake) ? <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</> : showModal === 'stake' ? 'Stake' : 'Unstake'}
                            </button>
                            <button onClick={() => setShowModal(null)} className="flex-1 py-3 border border-[#2b2f2b] text-zinc-400 hover:text-[#EAFFD2] rounded-xl font-bold text-sm hover:bg-[#2b2f2b] transition-all">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staking;
