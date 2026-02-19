
import React, { useState } from 'react';
import { WalletState } from '../types';

export const WalletButton: React.FC = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const connectWallet = async () => {
    setWallet(prev => ({ ...prev, isConnecting: true }));
    setTimeout(() => {
      setWallet({
        address: '0x71...3a52',
        isConnected: true,
        isConnecting: false,
        error: null,
      });
    }, 600);
  };

  if (wallet.isConnected) {
    return (
      <button className="px-5 py-2 bg-[#18181b] border border-[#27272a] text-[#a1a1aa] rounded-full text-xs font-medium hover:text-white transition-colors">
        {wallet.address}
      </button>
    );
  }

  return (
    <button 
      onClick={connectWallet}
      className="px-5 py-2 bg-transparent border border-[#27272a] text-[#a1a1aa] rounded-full text-xs font-medium hover:bg-white/5 hover:text-white transition-all"
    >
      {wallet.isConnecting ? 'Connecting...' : 'Connect wallet'}
    </button>
  );
};
