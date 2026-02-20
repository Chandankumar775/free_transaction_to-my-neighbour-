import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProfile, upsertProfile } from './supabase';

export type UserRole = 'producer' | 'consumer';

interface WalletState {
    address: string | null;
    role: UserRole;
    displayName: string;
    initials: string;
    isConnecting: boolean;
    isLoading: boolean;
    connect: () => Promise<void>;
    disconnect: () => void;
    setRole: (role: UserRole) => void;
    refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletState>({
    address: null,
    role: 'producer',
    displayName: '',
    initials: 'GU',
    isConnecting: false,
    isLoading: true,
    connect: async () => {},
    disconnect: () => {},
    setRole: () => {},
    refresh: async () => {},
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [role, _setRole] = useState<UserRole>('producer');
    const [displayName, setDisplayName] = useState('');
    const [initials, setInitials] = useState('GU');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load profile from Supabase for a given address
    const loadProfile = useCallback(async (addr: string) => {
        try {
            const { data } = await getProfile(addr);
            if (data) {
                _setRole((data.role as UserRole) || 'producer');
                setDisplayName(data.display_name || '');
                const ini = data.avatar_initials || data.display_name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'GU';
                setInitials(ini);
            } else {
                // No profile yet — defaults
                _setRole('producer');
                setDisplayName('');
                setInitials('GU');
            }
        } catch { /* silently fall back */ }
    }, []);

    // Check existing connection on mount (silent, no popup)
    useEffect(() => {
        const init = async () => {
            if (typeof window === 'undefined' || !window.ethereum) { setIsLoading(false); return; }
            try {
                const accounts: string[] = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    const addr = accounts[0];
                    setAddress(addr);
                    await loadProfile(addr);
                }
            } catch { /* no wallet */ }
            setIsLoading(false);
        };
        init();

        // Listen for account changes in MetaMask
        if (window.ethereum) {
            const handler = async (accs: string[]) => {
                if (accs.length === 0) {
                    setAddress(null); _setRole('producer'); setDisplayName(''); setInitials('GU');
                } else {
                    setAddress(accs[0]);
                    await loadProfile(accs[0]);
                }
            };
            window.ethereum.on('accountsChanged', handler);
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
    }, [loadProfile]);

    const connect = useCallback(async () => {
        if (!window.ethereum) return;
        setIsConnecting(true);
        try {
            const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                setAddress(accounts[0]);
                await loadProfile(accounts[0]);
            }
        } catch { /* user rejected */ }
        setIsConnecting(false);
    }, [loadProfile]);

    const disconnect = useCallback(() => {
        setAddress(null);
        _setRole('producer');
        setDisplayName('');
        setInitials('GU');
    }, []);

    const setRole = useCallback(async (newRole: UserRole) => {
        _setRole(newRole);
        if (address) {
            await upsertProfile({ wallet_address: address, role: newRole });
        }
    }, [address]);

    const refresh = useCallback(async () => {
        if (address) await loadProfile(address);
    }, [address, loadProfile]);

    return (
        <WalletContext.Provider value={{ address, role, displayName, initials, isConnecting, isLoading, connect, disconnect, setRole, refresh }}>
            {children}
        </WalletContext.Provider>
    );
};
