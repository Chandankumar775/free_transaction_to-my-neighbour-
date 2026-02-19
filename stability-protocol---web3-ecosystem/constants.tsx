
export const APP_CONFIG = {
  projectName: "Stability",
  hero: {
    title: "Exploring the Different Types of Wallets in the Web3 Ecosystem",
    subtitle: "A comprehensive guide to understanding the various types of wallets in the Web3 space. Secure your assets with precision-engineered infrastructure."
  }
};

export const NAV_LINKS = [
  { id: 'DASHBOARD', name: 'Dashboard', href: '#dashboard' },
  { id: 'STAKING', name: 'Staking', href: '#staking' },
  { id: 'OPERATORS', name: 'Operators', href: '#operators' },
  { id: 'AVS', name: 'AVS', href: '#avs' },
  { id: 'DEFI', name: 'DeFi', href: '#defi' },
];

export const DASHBOARD_STATS = [
  { 
    label: "TOTAL PORTFOLIO", 
    value: "$124,237.42", 
    change: "+27.03%", 
    color: "#ff4d00",
    chartData: "M0 35 L10 32 L20 38 L30 25 L40 28 L50 20 L60 25 L70 12 L80 18 L90 5 L100 8"
  },
  { 
    label: "APY RATE", 
    value: "8.72%", 
    change: "+1.17%", 
    color: "#00ff88",
    chartData: "M0 38 L10 35 L20 42 L30 38 L40 40 L50 32 L60 35 L70 22 L80 28 L90 18 L100 12"
  },
  { 
    label: "TOTAL REWARDS", 
    value: "$7,307.11", 
    change: "+14.59%", 
    color: "#ffd700",
    chartData: "M0 38 L10 40 L20 32 L30 38 L40 28 L50 35 L60 25 L70 32 L80 18 L90 22 L100 12"
  }
];

export const OPERATOR_DATA = [
  { id: 1, name: "Galaxy Node", icon: "https://api.iconify.design/ri:shining-2-fill.svg?color=%23ffffff", tvl: "$21.17M", apy: "3.12%", avsCount: 4, stakers: "105,019", status: 'Active' },
  { id: 2, name: "Kiin Labs", icon: "https://api.iconify.design/ri:hexagon-fill.svg?color=%23ffffff", tvl: "$12.45M", apy: "2.85%", avsCount: 17, stakers: "98,423", status: 'Verified' },
  { id: 3, name: "K3-Alpha", icon: "https://api.iconify.design/ri:flashlight-fill.svg?color=%23ffffff", tvl: "$7.89M", apy: "1.47%", avsCount: 4, stakers: "15,782", status: 'Active' },
  { id: 4, name: "Sentinel", icon: "https://api.iconify.design/ri:shield-user-fill.svg?color=%23ffffff", tvl: "$5.12M", apy: "0.32%", avsCount: 29, stakers: "27,105", status: 'Active' },
  { id: 5, name: "Whizzy DAO", icon: "https://api.iconify.design/ri:windy-fill.svg?color=%23ffffff", tvl: "$9.34M", apy: "2.12%", avsCount: 12, stakers: "45,219", status: 'Verified' },
  { id: 6, name: "Pinnacle", icon: "https://api.iconify.design/ri:heavy-showers-fill.svg?color=%23ffffff", tvl: "$3.67M", apy: "0.76%", avsCount: 8, stakers: "76,832", status: 'Active' },
];

export const TOKEN_LIST = [
  { name: 'Bitcoin', symbol: 'BTC', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=040', color: '#F7931A', pos: { top: '22%', left: '12%' } },
  { name: 'Ethereum', symbol: 'ETH', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=040', color: '#627EEA', pos: { top: '18%', right: '12%' } },
  { name: 'Ripple', symbol: 'XRP', icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.svg?v=040', color: '#23292F', pos: { top: '48%', left: '8%' } },
  { name: 'Tether', symbol: 'USDT', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.svg?v=040', color: '#26A17B', pos: { top: '48%', right: '8%' } },
];

export const WALLET_CARDS = [
  { title: "Hardware Isolation", description: "Operate offline, offering a higher level of security for storing large amounts of cryptocurrency.", icon: "https://api.iconify.design/material-symbols:grid-view.svg?color=%23ffffff", isFeatured: false },
  { title: "Standard Hot Wallets", description: "Hot wallets are connected to the internet, making them ideal for quick transactions and active trading.", icon: "https://api.iconify.design/mdi:fire.svg?color=%23ffffff", isFeatured: true },
  { title: "Hybrid Protection", description: "Hybrid wallets combine the benefits of hot and cold storage, providing an optimal balance.", icon: "https://api.iconify.design/material-symbols:lightbulb-outline.svg?color=%23ffffff", isFeatured: false }
];
