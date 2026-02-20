import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Zap, History, User,
    ChevronLeft, ChevronRight, LogOut, Bell, Wallet as WalletIcon,
    TrendingUp, Search, Map, Bot, Coins, Trophy, Power
} from 'lucide-react';
import Logo from '../components/Logo';
import { useWallet, UserRole } from '../lib/WalletContext';

declare global {
    interface Window { ethereum: any; }
}

/* ─── Role labels & colors ─── */
const ROLE_META: Record<UserRole, { label: string; color: string; badge: string }> = {
    producer: { label: 'Producer', color: '#FFD700', badge: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20' },
    consumer: { label: 'Consumer', color: '#545FFF', badge: 'bg-[#545FFF]/10 text-[#545FFF] border-[#545FFF]/20' },
};

/* ─── Nav items per role ─── */
const ALL_NAV = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview',     path: '/app/dashboard',     roles: ['producer', 'consumer'] },
    { icon: <Map size={20} />,             label: 'Energy Map',   path: '/app/energy-map',    roles: ['producer', 'consumer'] },
    { icon: <ShoppingCart size={20} />,    label: 'Marketplace',  path: '/app/marketplace',   roles: ['producer', 'consumer'] },
    { icon: <Zap size={20} />,             label: 'My Energy',    path: '/app/my-energy',     roles: ['producer'] },
    { icon: <Bot size={20} />,             label: 'Auto-Trade',   path: '/app/auto-trade',    roles: ['producer'] },
    { icon: <Coins size={20} />,           label: 'Staking',      path: '/app/staking',       roles: ['consumer'] },
    { icon: <Trophy size={20} />,          label: 'Leaderboard',  path: '/app/leaderboard',   roles: ['producer', 'consumer'] },
    { icon: <History size={20} />,         label: 'History',      path: '/app/transactions',  roles: ['producer', 'consumer'] },
    { icon: <User size={20} />,            label: 'Settings',     path: '/app/profile',       roles: ['producer', 'consumer'] },
];

const SidebarItem = ({ icon, label, active, onClick, collapsed }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${active
            ? 'bg-[#9FDC56] text-[#161815] shadow-[0_0_15px_rgba(159,220,86,0.3)]'
            : 'text-zinc-400 hover:text-[#EAFFD2] hover:bg-white/[0.03]'}`}
    >
        <div className={`relative z-10 ${active ? 'text-[#161815]' : 'group-hover:text-[#9FDC56] transition-colors'}`}>{icon}</div>
        {!collapsed && <span className={`text-sm font-semibold tracking-wide ${active ? 'text-[#161815]' : ''}`}>{label}</span>}
        {active && !collapsed && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#161815]/40" />}
    </button>
);

const AppLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { address, role, displayName, initials, isConnecting, connect, disconnect } = useWallet();
    const [collapsed, setCollapsed] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [showRolePicker, setShowRolePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifs, setShowNotifs] = useState(false);
    const [gridPrice, setGridPrice] = useState(0.4285);
    const [gridPriceChange, setGridPriceChange] = useState(2.4);

    // Scroll shadow
    React.useEffect(() => {
        const h = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', h);
        return () => window.removeEventListener('scroll', h);
    }, []);

    // Simulate GRID price fluctuations
    React.useEffect(() => {
        const id = setInterval(() => {
            setGridPrice(prev => {
                const delta = (Math.random() - 0.48) * 0.005;
                return Math.max(0.01, +(prev + delta).toFixed(4));
            });
            setGridPriceChange(prev => {
                const delta = (Math.random() - 0.48) * 0.3;
                return +(prev + delta).toFixed(1);
            });
        }, 3000);
        return () => clearInterval(id);
    }, []);

    const roleMeta = ROLE_META[role];
    const navItems = ALL_NAV.filter(n => n.roles.includes(role));

    const formatAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;

    const handleSignOut = () => {
        disconnect();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#161815] text-[#EAFFD2] font-sans selection:bg-[#9FDC56] selection:text-[#161815]">
            {/* ════════ Sidebar ════════ */}
            <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] border-r border-[#2b2f2b] bg-[#1a1d1a] ${collapsed ? 'w-[72px]' : 'w-64'}`}>
                <div className="flex flex-col h-full p-4">
                    {/* Brand */}
                    <div className={`flex items-center gap-3 px-2 mb-6 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-xl bg-[#9FDC56] flex items-center justify-center shadow-[0_0_20px_rgba(159,220,86,0.2)] overflow-hidden">
                            <Logo size={28} color="#161815" />
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="text-lg font-bold text-white tracking-tight">Grid<span className="text-[#9FDC56]">Matrix</span></h1>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Energy P2P</p>
                            </div>
                        )}
                    </div>

                    {/* Role badge */}
                    {!collapsed && (
                        <button
                            onClick={() => setShowRolePicker(prev => !prev)}
                            className={`mb-4 mx-1 px-3 py-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${roleMeta.badge}`}
                        >
                            <span>{roleMeta.label} Mode</span>
                            <ChevronRight size={12} className={`transition-transform ${showRolePicker ? 'rotate-90' : ''}`} />
                        </button>
                    )}

                    {/* Role picker dropdown */}
                    {showRolePicker && !collapsed && (
                        <RolePicker
                            current={role}
                            onSelect={(r) => { setShowRolePicker(false); }}
                        />
                    )}

                    {/* Navigation — filtered by role */}
                    <nav className="space-y-1.5 flex-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                {...item}
                                active={location.pathname === item.path}
                                collapsed={collapsed}
                                onClick={() => navigate(item.path)}
                            />
                        ))}
                    </nav>

                    {/* User Card + Sign Out */}
                    <div className={`mt-auto pt-4 border-t border-[#2b2f2b] ${collapsed ? 'items-center flex flex-col' : ''}`}>
                        <button
                            onClick={() => navigate('/app/profile')}
                            className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/[0.03] transition-colors group ${collapsed ? 'justify-center' : ''}`}
                        >
                            <div className="w-9 h-9 rounded-full border border-[#3a3e3a] flex items-center justify-center font-bold text-xs" style={{ backgroundColor: `${roleMeta.color}15`, color: roleMeta.color }}>
                                {initials}
                            </div>
                            {!collapsed && (
                                <div className="flex-1 text-left">
                                    <p className="text-xs font-bold text-white group-hover:text-[#9FDC56] transition-colors truncate">{displayName || (address ? formatAddr(address) : 'Not Connected')}</p>
                                    <p className="text-[10px]" style={{ color: roleMeta.color }}>{roleMeta.label}</p>
                                </div>
                            )}
                        </button>

                        {/* Sign Out */}
                        <button
                            onClick={handleSignOut}
                            className={`mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all text-xs font-semibold ${collapsed ? 'justify-center' : ''}`}
                        >
                            <Power size={14} />
                            {!collapsed && <span>Sign Out</span>}
                        </button>

                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="mt-3 w-full h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all"
                        >
                            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ════════ Main Content ════════ */}
            <main className={`transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] min-h-screen flex flex-col ${collapsed ? 'pl-[72px]' : 'pl-64'}`}>
                {/* Header */}
                <header className={`sticky top-0 z-30 px-8 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-[#161815]/80 backdrop-blur-md border-b border-[#2b2f2b]' : 'bg-transparent'}`}>
                    <div className="relative w-96 hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search pages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    const q = searchQuery.toLowerCase();
                                    const match = ALL_NAV.find(n => n.label.toLowerCase().includes(q));
                                    if (match) { navigate(match.path); setSearchQuery(''); }
                                }
                            }}
                            className="w-full h-10 pl-10 pr-4 bg-[#1a1d1a] border border-[#2b2f2b] rounded-full text-sm text-[#EAFFD2] placeholder-zinc-600 focus:outline-none focus:border-[#9FDC56]/50 hover:bg-[#2b2f2b] transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4 relative">
                        {/* GRID Token Price (live) */}
                        <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-full bg-[#1a1d1a] border border-[#2b2f2b]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#9FDC56] animate-pulse"></span>
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">GRID Price</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">${gridPrice.toFixed(4)}</span>
                                <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${gridPriceChange >= 0 ? 'text-[#9FDC56] bg-[#9FDC56]/10' : 'text-[#FF7366] bg-[#FF7366]/10'}`}>
                                    <TrendingUp size={10} className="mr-1" /> {gridPriceChange >= 0 ? '+' : ''}{gridPriceChange.toFixed(1)}%
                                </span>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifs(prev => !prev)}
                                className="w-10 h-10 rounded-full border border-[#2b2f2b] bg-[#1a1d1a] flex items-center justify-center text-zinc-400 hover:text-[#EAFFD2] hover:border-[#3a3e3a] transition-all relative"
                            >
                                <Bell size={18} />
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#FF7366] rounded-full border border-[#1a1d1a]"></span>
                            </button>
                            {showNotifs && (
                                <div className="absolute right-0 top-12 w-72 bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl shadow-2xl p-4 z-50">
                                    <h4 className="text-sm font-bold text-[#EAFFD2] mb-3">Notifications</h4>
                                    {[
                                        { text: 'New listing: 50 kWh Solar at 0.0004 ETH', time: '2m ago' },
                                        { text: 'Auto-trade order matched!', time: '15m ago' },
                                        { text: 'Weekly reward: +12 GRID tokens', time: '1h ago' },
                                    ].map((n, i) => (
                                        <div key={i} className="py-2.5 border-b border-[#2b2f2b] last:border-0">
                                            <p className="text-xs text-[#EAFFD2]">{n.text}</p>
                                            <p className="text-[10px] text-zinc-600 mt-0.5">{n.time}</p>
                                        </div>
                                    ))}
                                    <button onClick={() => setShowNotifs(false)} className="mt-2 w-full text-center text-[10px] font-bold text-[#9FDC56] hover:underline">
                                        Mark all as read
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Wallet Button */}
                        <button
                            onClick={() => !address && connect()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(159,220,86,0.2)] ${address ? 'bg-[#1a1d1a] border border-[#2b2f2b] text-[#EAFFD2] hover:border-[#9FDC56]/50' : 'bg-[#9FDC56] text-[#161815] hover:bg-[#8cc34b]'}`}
                        >
                            <WalletIcon size={16} className={address ? "text-[#9FDC56]" : "fill-current"} />
                            <span>{isConnecting ? 'Confirming...' : address ? formatAddr(address) : 'Connect Wallet'}</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 pb-32">
                    <Outlet />
                </div>
            </main>

            {/* Role Picker Modal (full screen on mobile) */}
            {showRolePicker && collapsed && (
                <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setShowRolePicker(false)}>
                    <div className="absolute left-20 top-24 bg-[#1a1d1a] border border-[#2b2f2b] rounded-2xl p-4 w-56 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <RolePicker current={role} onSelect={() => setShowRolePicker(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

/* ═══════════ Role Picker Component ═══════════ */
const RolePicker: React.FC<{ current: UserRole; onSelect: (r: UserRole) => void }> = ({ current, onSelect }) => {
    const { setRole } = useWallet();
    const roles: { id: UserRole; label: string; desc: string; color: string }[] = [
        { id: 'producer', label: 'Producer', desc: 'List & sell your energy', color: '#FFD700' },
        { id: 'consumer', label: 'Consumer', desc: 'Browse & buy energy', color: '#545FFF' },
    ];

    return (
        <div className="space-y-1 mb-3">
            {roles.map(r => (
                <button
                    key={r.id}
                    onClick={() => { setRole(r.id); onSelect(r.id); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${current === r.id ? 'bg-white/[0.06] ring-1' : 'hover:bg-white/[0.03]'}`}
                    style={current === r.id ? { borderColor: r.color + '40' } : {}}
                >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <div>
                        <p className="text-xs font-bold" style={{ color: r.color }}>{r.label}</p>
                        <p className="text-[10px] text-zinc-500">{r.desc}</p>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default AppLayout;
