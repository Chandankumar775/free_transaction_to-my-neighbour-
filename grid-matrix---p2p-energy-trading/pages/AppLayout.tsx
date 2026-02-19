import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingCart, Zap, History, User,
    ChevronLeft, ChevronRight, LogOut, Bell, Wallet as WalletIcon,
    Menu, TrendingUp, TrendingDown, Search,
    Map, Bot, Coins, Trophy
} from 'lucide-react';
import Logo from '../components/Logo';

declare global {
    interface Window {
        ethereum: any;
    }
}

const SidebarItem = ({ icon, label, active, onClick, collapsed }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${active
            ? 'bg-[#9FDC56] text-[#161815] shadow-[0_0_15px_rgba(159,220,86,0.3)]'
            : 'text-zinc-400 hover:text-[#EAFFD2] hover:bg-white/[0.03]'
            }`}
    >
        <div className={`relative z-10 ${active ? 'text-[#161815]' : 'group-hover:text-[#9FDC56] transition-colors'}`}>
            {icon}
        </div>
        {!collapsed && (
            <span className={`text-sm font-semibold tracking-wide ${active ? 'text-[#161815]' : ''}`}>
                {label}
            </span>
        )}
        {active && !collapsed && (
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#161815]/40" />
        )}
    </button>
);

const AppLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        // Check if already connected
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                    }
                } catch (error) {
                    console.error("Error checking wallet connection:", error);
                }
            }
        };
        checkConnection();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            setIsConnecting(true);
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
                alert("Failed to connect wallet. Please try again.");
            } finally {
                setIsConnecting(false);
            }
        } else {
            alert("MetaMask not found! Please install a crypto wallet extension.");
        }
    };

    const formatAddress = (addr: string) => {
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    const navItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/app/dashboard' },
        { icon: <Map size={20} />, label: 'Energy Map', path: '/app/energy-map' },
        { icon: <ShoppingCart size={20} />, label: 'Marketplace', path: '/app/marketplace' },
        { icon: <Zap size={20} />, label: 'My Energy', path: '/app/my-energy' },
        { icon: <Bot size={20} />, label: 'Auto-Trade', path: '/app/auto-trade' },
        { icon: <Coins size={20} />, label: 'Staking', path: '/app/staking' },
        { icon: <Trophy size={20} />, label: 'Leaderboard', path: '/app/leaderboard' },
        { icon: <History size={20} />, label: 'History', path: '/app/transactions' },
        { icon: <User size={20} />, label: 'Settings', path: '/app/profile' },
    ];

    return (
        <div className="min-h-screen bg-[#161815] text-[#EAFFD2] font-sans selection:bg-[#9FDC56] selection:text-[#161815]">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                border-r border-[#2b2f2b] bg-[#1a1d1a] ${collapsed ? 'w-[72px]' : 'w-64'}`}
            >
                <div className="flex flex-col h-full p-4">
                    {/* Brand */}
                    <div className={`flex items-center gap-3 px-2 mb-8 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="relative group">
                            <div className="w-10 h-10 rounded-xl bg-[#9FDC56] flex items-center justify-center shadow-[0_0_20px_rgba(159,220,86,0.2)] overflow-hidden">
                                <Logo size={28} color="#161815" />
                            </div>
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="text-lg font-bold text-white tracking-tight">Grid<span className="text-[#9FDC56]">Matrix</span></h1>
                                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Energy P2P</p>
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5 flex-1">
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

                    {/* User Card */}
                    <div className={`mt-auto pt-4 border-t border-[#2b2f2b] ${collapsed ? 'items-center flex flex-col' : ''}`}>
                         <button className={`flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white/[0.03] transition-colors group ${collapsed ? 'justify-center' : ''}`}>
                            <div className="w-9 h-9 rounded-full bg-[#2b2f2b] border border-[#3a3e3a] flex items-center justify-center text-[#9FDC56] font-bold">
                                CK
                            </div>
                            {!collapsed && (
                                <div className="flex-1 text-left">
                                    <p className="text-xs font-bold text-white group-hover:text-[#9FDC56] transition-colors">Chandan Kumar</p>
                                    <p className="text-[10px] text-zinc-500">Prosumer</p>
                                </div>
                            )}
                         </button>
                         <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="mt-4 w-full h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.03] rounded-lg transition-all"
                         >
                            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                         </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main
                className={`transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] min-h-screen flex flex-col
                ${collapsed ? 'pl-[72px]' : 'pl-64'}`}
            >
                {/* Header */}
                <header className={`sticky top-0 z-30 px-8 py-4 flex items-center justify-between transition-all duration-300 ${scrolled ? 'bg-[#161815]/80 backdrop-blur-md border-b border-[#2b2f2b]' : 'bg-transparent'}`}>
                     {/* Search Bar */}
                     <div className="relative w-96 hidden md:block">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Type to search for everything..."
                            className="w-full h-10 pl-10 pr-4 bg-[#1a1d1a] border border-[#2b2f2b] rounded-full text-sm text-[#EAFFD2] placeholder-zinc-600 focus:outline-none focus:border-[#9FDC56]/50 hover:bg-[#2b2f2b] transition-all"
                        />
                     </div>

                    <div className="flex items-center gap-4">
                        {/* Token Price Ticker */}
                         <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-full bg-[#1a1d1a] border border-[#2b2f2b]">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#9FDC56] animate-pulse"></span>
                                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">GRID Price</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white">$0.4285</span>
                                <span className="flex items-center text-[10px] font-bold text-[#9FDC56] bg-[#9FDC56]/10 px-1.5 py-0.5 rounded">
                                    <TrendingUp size={10} className="mr-1" /> +2.4%
                                </span>
                            </div>
                         </div>

                        {/* Notifications */}
                        <button className="w-10 h-10 rounded-full border border-[#2b2f2b] bg-[#1a1d1a] flex items-center justify-center text-zinc-400 hover:text-[#EAFFD2] hover:border-[#3a3e3a] transition-all relative">
                            <Bell size={18} />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#FF7366] rounded-full border border-[#1a1d1a]"></span>
                        </button>

                         {/* Wallet Button */}
                        <button 
                            onClick={() => !walletAddress && connectWallet()}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(159,220,86,0.2)] ${
                                walletAddress 
                                ? 'bg-[#1a1d1a] border border-[#2b2f2b] text-[#EAFFD2] hover:border-[#9FDC56]/50' 
                                : 'bg-[#9FDC56] text-[#161815] hover:bg-[#8cc34b]'
                            }`}
                        >
                            <WalletIcon size={16} className={walletAddress ? "text-[#9FDC56]" : "fill-current"} />
                            <span>
                                {isConnecting 
                                    ? 'Confirming...' 
                                    : walletAddress 
                                        ? formatAddress(walletAddress) 
                                        : 'Connect Wallet'
                                }
                            </span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 pb-32">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AppLayout;