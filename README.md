<div align="center">

<!-- Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=9FDC56&height=200&section=header&text=GridMatrix&fontSize=80&fontColor=161815&animation=fadeIn&fontAlignY=38&desc=P2P%20Renewable%20Energy%20Trading%20on%20Blockchain&descAlignY=60&descAlign=50&descColor=161815" />

<br/>

<p>
  <img src="https://img.shields.io/badge/Hackathon-KMRU%202026-9FDC56?style=for-the-badge&labelColor=161815" />
  <img src="https://img.shields.io/badge/Blockchain-Ethereum%20%7C%20Hardhat-545FFF?style=for-the-badge&labelColor=161815" />
  <img src="https://img.shields.io/badge/Frontend-React%2019%20%2B%20TypeScript-61DAFB?style=for-the-badge&labelColor=161815" />
  <img src="https://img.shields.io/badge/Smart%20Contracts-Solidity%200.8.20-orange?style=for-the-badge&labelColor=161815" />
  <img src="https://img.shields.io/badge/Status-Live%20Demo-9FDC56?style=for-the-badge&labelColor=161815" />
</p>

<br/>

> **🏆 KR Manglam University Hackathon 2026 — P2P Decentralized Energy Trading Platform**
>
> *Empowering solar & wind producers to trade surplus energy directly with neighbours — no utility middlemen, no hidden fees, pure blockchain.*

<br/>

</div>

---

## ⚡ The Problem We're Solving

```
Traditional Energy Grid:
  
  [Solar Producer] ──pays fees──▶ [Utility Company] ──inflated bills──▶ [Consumer]
                                        ↑
                              Takes 30–40% margin
                              Central point of failure
                              No transparency
```

```
GridMatrix Solution:

  [Solar Producer] ══ direct trade ══▶ [Consumer]
         ↕                                  ↕
    ETK Tokens                        ETK Tokens
         ↕                                  ↕
         └──────── Smart Contract ──────────┘
                  Transparent • Trustless • Instant
```

---

## 🌐 What is GridMatrix?

**GridMatrix** is a fully decentralized, peer-to-peer renewable energy trading platform built on the Ethereum blockchain. It allows:

- 🌞 **Solar & Wind Producers** to tokenize surplus energy as **ETK tokens** (1 ETK = 1 kWh) and sell directly
- 🏠 **Consumers** to browse a live marketplace and buy green energy at fair peer-set prices
- 💰 **Investors** to stake ETK tokens and earn continuous on-chain rewards
- 🤖 **Traders** to place standing buy/sell orders that execute automatically on-chain

No banks. No utilities. No middlemen. Just clean energy and smart contracts.

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      GridMatrix Platform                        │
│                                                                 │
│  ┌─────────────────────┐      ┌─────────────────────────────┐  │
│  │   React Frontend    │      │    Smart Contract Layer     │  │
│  │                     │      │                             │  │
│  │  ┌───────────────┐  │      │  ┌─────────────────────┐   │  │
│  │  │  Landing Page │  │      │  │   EnergyToken.sol   │   │  │
│  │  │  (Hero, CTA,  │  │      │  │   ERC-20 • ETK      │   │  │
│  │  │   Features)   │  │      │  │   1 ETK = 1 kWh     │   │  │
│  │  └───────────────┘  │      │  └─────────────────────┘   │  │
│  │                     │      │                             │  │
│  │  ┌───────────────┐  │      │  ┌─────────────────────┐   │  │
│  │  │   App Pages   │  │      │  │  EnergyMarket.sol   │   │  │
│  │  │  Dashboard    │◀─┼──────┼─▶│  P2P Marketplace   │   │  │
│  │  │  Marketplace  │  │      │  │  Escrow + Swap      │   │  │
│  │  │  Staking      │  │      │  └─────────────────────┘   │  │
│  │  │  AutoTrade    │  │      │                             │  │
│  │  │  Leaderboard  │  │      │  ┌─────────────────────┐   │  │
│  │  └───────────────┘  │      │  │  EnergyStaking.sol  │   │  │
│  │                     │      │  │  Stake • Earn • Claim│   │  │
│  │  ┌───────────────┐  │      │  └─────────────────────┘   │  │
│  │  │  ethers.js v6 │  │      │                             │  │
│  │  │  MetaMask     │  │      │  ┌─────────────────────┐   │  │
│  │  │  useContracts │◀─┼──────┼─▶│    AutoTrade.sol    │   │  │
│  │  └───────────────┘  │      │  │  Standing Orders    │   │  │
│  └─────────────────────┘      │  └─────────────────────┘   │  │
│                               └─────────────────────────────┘  │
│                                          ↕                      │
│                        ┌─────────────────────────┐             │
│                        │   Hardhat Local Node    │             │
│                        │   localhost:8545         │             │
│                        │   Chain ID: 31337        │             │
│                        └─────────────────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔗 Smart Contracts

| Contract | Purpose | Key Functions |
|---|---|---|
| `EnergyToken.sol` | ERC-20 token • 1 ETK = 1 kWh | `mint()` `burn()` `transfer()` |
| `EnergyMarket.sol` | P2P escrow marketplace | `listEnergy()` `buyEnergy()` `cancelListing()` |
| `EnergyStaking.sol` | Stake ETK, earn rewards every second | `stake()` `unstake()` `claimReward()` |
| `AutoTrade.sol` | Standing buy/sell orders on-chain | `placeBuyOrder()` `placeSellOrder()` `cancelOrder()` |

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Frontend** | React 19 • TypeScript • Vite 6 • Tailwind CSS |
| **Web3 / Wallet** | ethers.js v6 • MetaMask |
| **Smart Contracts** | Solidity 0.8.20 • OpenZeppelin v5 |
| **Blockchain (local)** | Hardhat 2.x • localhost:8545 • Chain ID 31337 |
| **UI Design** | Glassmorphism • Playfair Display • Custom green palette |

</div>

---

## ✨ What Makes GridMatrix Unique

### 1. 🔋 Energy as a Token
> Unlike generic DeFi platforms, every token represents **real-world energy**. 1 ETK = 1 kWh. Energy is tokenized at source and burned when consumed — creating a closed, honest economy.

### 2. 🤝 True Peer-to-Peer
> The `EnergyMarket` contract holds ETH in escrow and releases it only when ETK is delivered. **No intermediary ever touches the funds.**

### 3. ⏱️ Second-by-Second Staking Rewards
> The `EnergyStaking` contract uses block timestamps to calculate rewards **per second** — not per epoch or per day. Stakers earn continuously.

### 4. 🤖 On-Chain Standing Orders
> `AutoTrade.sol` lets users set **permanent buy/sell conditions** stored on-chain. Orders execute when price conditions are met — like a DEX order book, but for energy.

### 5. 🎨 Production-Grade UI
> Full glassmorphism design system with animated components, responsive sidebar, live chain data polling, and real MetaMask wallet integration — not just a prototype.

---

## 🚀 Live App Pages

| Page | Route | Description |
|---|---|---|
| 🏠 Landing | `/` | Hero, Features, Tokenomics, Roadmap |
| 📊 Dashboard | `/app` | Live stats and recent activity |
| 🗺️ Energy Map | `/app/energy-map` | Grid visualization |
| 🛒 Marketplace | `/app/marketplace` | **Live** — buy/sell from blockchain |
| ⚡ My Energy | `/app/my-energy` | Personal energy portfolio |
| 🤖 Auto-Trade | `/app/auto-trade` | **Live** — standing orders on-chain |
| 🪙 Staking | `/app/staking` | **Live** — stake ETK, earn rewards |
| 🏆 Leaderboard | `/app/leaderboard` | Top traders |
| 📜 Transactions | `/app/transactions` | History |

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js 18+
- MetaMask browser extension
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Chandankumar775/free_transaction_to-my-neighbour-.git
cd free_transaction_to-my-neighbour-
```

### 2. Start the Blockchain
```bash
cd energy-contracts
npm install
npm run node        # starts local chain at localhost:8545
```

### 3. Deploy Contracts + Seed Data (new terminal)
```bash
cd energy-contracts
npm run deploy      # deploys all 4 contracts
npm run seed        # creates demo listings, staking positions, orders
```

### 4. Start the Frontend (new terminal)
```bash
cd grid-matrix---p2p-energy-trading
npm install
npm run dev         # http://localhost:3000
```

### 5. Setup MetaMask
1. Add network: RPC `http://127.0.0.1:8545` • Chain ID `31337` • Symbol `ETH`
2. Import test account private key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
3. You now have **10,000 ETH** + **10,000 ETK** to trade with

---

## 📂 Project Structure

```
kmru-hackathon/
├── grid-matrix---p2p-energy-trading/   # Main React frontend
│   ├── pages/                          # App views
│   │   ├── Marketplace.tsx             # Live P2P marketplace
│   │   ├── Staking.tsx                 # Live staking page
│   │   ├── AutoTrade.tsx               # Live auto-trade orders
│   │   └── AppLayout.tsx               # Sidebar + wallet connect
│   ├── components/                     # Landing page components
│   └── src/
│       ├── lib/
│       │   ├── abis.ts                 # Contract ABIs
│       │   ├── contracts.ts            # ethers.js helpers
│       │   └── deployments.json        # Live contract addresses
│       └── hooks/
│           └── useContracts.ts         # React hooks for contracts
│
├── energy-contracts/                   # Solidity smart contracts
│   ├── contracts/
│   │   ├── EnergyToken.sol
│   │   ├── EnergyMarket.sol
│   │   ├── EnergyStaking.sol
│   │   └── AutoTrade.sol
│   └── scripts/
│       ├── deploy.cjs                  # Deploy all contracts
│       └── seed.cjs                    # Seed demo data
│
└── stability-protocol---web3-ecosystem/ # Web3 wallet landing page
```

---

## 👥 Team

**KR Manglam University — Hackathon 2026**

Built with passion to make renewable energy trading accessible, transparent, and decentralized for everyone.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=9FDC56&height=120&section=footer&animation=fadeIn" />

**⭐ Star this repo if you believe in decentralized clean energy! ⭐**

`Built at KMRU Hackathon 2026` • `Solidity` • `React` • `ethers.js` • `Hardhat`

</div>
