import React, { useState } from 'react';
import {
    User, Shield, Bell, Sun, Globe, Wallet, Zap, Copy, Check,
    Camera, ChevronRight, LogOut, Key, Smartphone, Mail
} from 'lucide-react';

const roles = [
    { id: 'prosumer', label: 'Prosumer', desc: 'Produce & consume energy', icon: <Zap className="w-4 h-4" /> },
    { id: 'producer', label: 'Producer', desc: 'Sell energy to the grid', icon: <Sun className="w-4 h-4" /> },
    { id: 'consumer', label: 'Consumer', desc: 'Buy energy from peers', icon: <Globe className="w-4 h-4" /> },
];

const Profile: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState('prosumer');
    const [copied, setCopied] = useState(false);
    const [notifications, setNotifications] = useState({ trades: true, rewards: true, updates: false, newsletter: false });

    const handleCopy = () => { navigator.clipboard.writeText('0x7F2e9a1B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F'); setCopied(true); setTimeout(() => setCopied(false), 2000); };

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#EAFFD2]">Settings</h2>
                <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Manage your profile and preferences</p>
            </div>

            {/* Profile Card */}
            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                <div className="flex items-start gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-[#9FDC56] flex items-center justify-center text-2xl font-black text-[#161815] shadow-[0_0_20px_rgba(159,220,86,0.3)]">CK</div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#EAFFD2] rounded-lg flex items-center justify-center text-[#161815] hover:bg-white transition-colors">
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-[#EAFFD2]">Chandan Kumar</h3>
                        <p className="text-sm font-medium text-zinc-500 mt-0.5">chandan@gridmatrix.io</p>
                        <div className="flex items-center gap-2 mt-3">
                            <span className="text-[10px] font-mono text-zinc-500 bg-[#161815] px-3 py-1.5 rounded-lg border border-[#2b2f2b]">0x7F2e...3a9B</span>
                            <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/[0.04] text-zinc-500 hover:text-[#EAFFD2] transition-colors">
                                {copied ? <Check className="w-3.5 h-3.5 text-[#9FDC56]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#9FDC56]/10 text-[#9FDC56] text-[10px] font-bold uppercase tracking-wider border border-[#9FDC56]/20">Verified</span>
                </div>
            </div>

            {/* Role Selection */}
            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-[#EAFFD2]">Network Role</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {roles.map((role) => (
                        <button key={role.id} onClick={() => setSelectedRole(role.id)}
                            className={`p-4 rounded-xl border text-left transition-all ${selectedRole === role.id ? 'bg-[#9FDC56] border-[#9FDC56] shadow-[0_0_15px_rgba(159,220,86,0.2)]' : 'bg-[#161815] border-[#2b2f2b] hover:border-[#3a3e3a]'}`}>
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${selectedRole === role.id ? 'bg-[#161815] text-[#9FDC56]' : 'bg-[#2b2f2b] text-zinc-500'}`}>{role.icon}</div>
                            <p className={`text-sm font-bold ${selectedRole === role.id ? 'text-[#161815]' : 'text-[#EAFFD2]'}`}>{role.label}</p>
                            <p className={`text-[10px] font-medium mt-0.5 ${selectedRole === role.id ? 'text-[#161815]/70' : 'text-zinc-500'}`}>{role.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Personal Info */}
            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Mail className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-[#EAFFD2]">Personal Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Display Name', value: 'Chandan Kumar', ph: 'Your name' },
                        { label: 'Email', value: 'chandan@gridmatrix.io', ph: 'Your email' },
                        { label: 'Location', value: 'Jaipur, India', ph: 'City, Country' },
                        { label: 'Grid Zone', value: 'Zone-A (North)', ph: '' },
                    ].map((field, i) => (
                        <div key={i}>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                            <input type="text" defaultValue={field.value} placeholder={field.ph}
                                className="w-full px-4 py-2.5 bg-[#161815] border border-[#2b2f2b] rounded-xl text-sm font-medium placeholder-zinc-700 text-[#EAFFD2] focus:outline-none focus:border-[#9FDC56]/50 transition-colors" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-[#EAFFD2]">Notifications</h3>
                </div>
                <div className="space-y-1">
                    {[
                        { key: 'trades', label: 'Trade Confirmations', desc: 'Get notified when trades are executed' },
                        { key: 'rewards', label: 'Rewards & Staking', desc: 'Alerts for earned rewards and staking updates' },
                        { key: 'updates', label: 'Platform Updates', desc: 'New features and system maintenance' },
                        { key: 'newsletter', label: 'Newsletter', desc: 'Weekly energy market insights' },
                    ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between px-4 py-3.5 rounded-xl hover:bg-white/[0.01] transition-colors">
                            <div>
                                <p className="text-sm font-bold text-[#EAFFD2]">{item.label}</p>
                                <p className="text-[10px] font-medium text-zinc-500 mt-0.5">{item.desc}</p>
                            </div>
                            <button onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                                className={`w-10 h-[22px] rounded-full transition-colors flex items-center ${notifications[item.key as keyof typeof notifications] ? 'bg-[#9FDC56] justify-end' : 'bg-[#2b2f2b] justify-start'}`}>
                                <div className={`w-[18px] h-[18px] rounded-full mx-0.5 transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-[#161815]' : 'bg-zinc-500'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl bg-[#1a1d1a] border border-[#2b2f2b] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-bold text-[#EAFFD2]">Security</h3>
                </div>
                <div className="space-y-1">
                    {[
                        { icon: <Key className="w-4 h-4" />, label: 'Change Password', desc: 'Last changed 30 days ago' },
                        { icon: <Smartphone className="w-4 h-4" />, label: 'Two-Factor Auth', desc: 'Enabled via authenticator app' },
                        { icon: <Wallet className="w-4 h-4" />, label: 'Connected Wallets', desc: '1 wallet connected' },
                    ].map((item, i) => (
                        <button key={i} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-[#EAFFD2]/[0.03] transition-colors group text-left">
                            <div className="w-9 h-9 rounded-lg bg-[#161815] border border-[#2b2f2b] flex items-center justify-center text-zinc-500 group-hover:text-[#EAFFD2] transition-colors">{item.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#EAFFD2]">{item.label}</p>
                                <p className="text-[10px] font-medium text-zinc-500 mt-0.5">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-[#EAFFD2] transition-colors" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pb-6">
                <button className="flex-1 py-3.5 bg-[#9FDC56] hover:bg-[#8cc34b] text-[#161815] rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(159,220,86,0.3)]">Save Changes</button>
                <button className="py-3.5 px-6 border border-[#FF7366]/20 text-[#FF7366] rounded-xl font-bold text-sm hover:bg-[#FF7366]/[0.06] transition-colors flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Sign Out
                </button>
            </div>
        </div>
    );
};

export default Profile;