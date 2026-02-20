# GridMatrix — System Architecture

> Peer-to-Peer Energy Trading Platform  
> *Built on blockchain for transparent, trustless energy exchange*

---

## How It Works (User's Perspective)

```
  👩 Priya (Solar Panel Owner)              👨 Rahul (Neighbor)
       Has excess 50 kWh                    Needs cheap electricity
              │                                      │
              │  "Sell 50 kWh @ 0.05 ETK/kWh"        │  "Buy 20 kWh from Priya"
              │                                      │
              ▼                                      ▼
       ┌──────────────────────────────────────────────────┐
       │              GridMatrix Platform                  │
       │                                                   │
       │   Current:  Transactions in ETH + ETK tokens      │
       │   Backend:  Blockchain records every trade         │
       │             (transparent, tamper-proof)            │
       └──────────────────────┬───────────────────────────┘
                              │
                    Priya gets 1 ETK in wallet
                    Rahul gets 20 kWh of energy
                    Zero middleman. Zero fraud.
```

**Current Implementation:** Transactions happen in **ETH** (for gas) and **ETK tokens** (Energy Token, our ERC-20).  
**Production Vision:** A fiat on-ramp (Razorpay/UPI → ETK) would let users pay in ₹ while blockchain runs underneath.

---

## System Architecture

```
  ┌─────────────────┐         ┌──────────────┐         ┌──────────────────┐
  │  User            │────────►│  React App   │────────►│  Blockchain      │
  │  (Browser)       │         │  (Frontend)  │         │  (Trust Layer)   │
  │                  │         │              │         │                  │
  │  MetaMask wallet │◄────────│  ethers.js   │◄────────│  Smart Contracts │
  │  ETH + ETK       │         │  (Web3 bridge)│        │  (auto-execute)  │
  └─────────────────┘         └──────┬───────┘         └──────────────────┘
                                     │
                              MetaMask Wallet
                              (signs transactions
                               in background)
```

---

## Why Blockchain? (Not Just a Database)

| Problem | Without Blockchain | With Blockchain |
|---------|-------------------|----------------|
| Selling excess solar energy | Middleman (DISCOM) takes 40% cut | Direct P2P transfer, near-zero fees |
| Price manipulation | Company sets price | Smart contract enforces fair price |
| Billing disputes | "He said, she said" | Immutable on-chain transaction record |
| Trust between strangers | Need a company to guarantee | Code guarantees it (trustless) |

---

## Smart Contracts (The Invisible Backend)

| Contract | Role | Key Functions |
|----------|---------------|---------------------|
| **EnergyToken** | ERC-20 token (ETK) | `mint`, `transfer`, `approve`, `balanceOf` |
| **EnergyMarket** | Energy marketplace | `listEnergy`, `buyEnergy`, `cancel` — transfers ETK between buyer & seller |
| **EnergyStaking** | Stake ETK, earn rewards | `stake`, `unstake`, `claimRewards` — locks tokens, accrues rewards |
| **AutoTrade** | Automated order book | `placeBuyOrder`, `placeSellOrder`, `matchOrders` — 24/7 matching |

---

## Transaction Flow (What Really Happens)

```
  Rahul clicks "Buy 20 kWh" on Marketplace
       │
       ▼  Step 1: Approve ETK spend
  ┌─────────────┐
  │  MetaMask    │──► EnergyToken.approve(marketAddr, amount)
  │  pops up     │──► User confirms in wallet
  └─────────────┘
       │
       ▼  Step 2: Execute purchase
  ┌─────────────┐
  │  MetaMask    │──► EnergyMarket.buyEnergy(listingId, qty)
  │  pops up     │──► ETK transferred: Rahul → Priya
  └─────────────┘
       │
       ▼  Result (on-chain):
  ┌─────────────────────────────────────────┐
  │  • Rahul's ETK balance decreased        │
  │  • Priya's ETK balance increased        │
  │  • 20 kWh recorded as transferred       │
  │  • Immutable receipt on blockchain       │
  └─────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 19, TypeScript, Vite, Tailwind | Fast, modern UI |
| Web3 Bridge | ethers.js v6, MetaMask | Connects UI to blockchain |
| Smart Contracts | Solidity 0.8.20, OpenZeppelin | Secure, audited code |
| Blockchain | Hardhat (dev) → Polygon (prod) | Low-cost, fast transactions |

---

## Frontend → Blockchain Wiring

```
What user sees              Behind the scenes            On blockchain
──────────────              ─────────────────            ─────────────
Marketplace page  ────►  useMarketListings()  ────►  EnergyMarket.sol
Staking page      ────►  useStaking()         ────►  EnergyStaking.sol
Auto-trade page   ────►  useAutoTrade()       ────►  AutoTrade.sol
```

---

## Project Structure

```
gridmatrix/
├── energy-contracts/        ← Smart contracts + deploy scripts
│   ├── contracts/           ← Solidity (.sol) files
│   └── scripts/             ← deploy.cjs, seed.cjs
├── grid-matrix-.../         ← React frontend (what users see)
│   ├── components/          ← Navbar, Hero, Features, etc.
│   ├── pages/               ← Marketplace, Staking, AutoTrade
│   └── lib/                 ← Blockchain connection (hidden from user)
└── stability-protocol-.../  ← Ecosystem landing page
```

---

## Quick Start

```
Terminal 1:  cd energy-contracts && npx hardhat node
Terminal 2:  cd energy-contracts && npm run deploy && npm run seed
Terminal 3:  cd grid-matrix---p2p-energy-trading && npm run dev
Browser:     http://localhost:3000 → Connect MetaMask (Chain 31337)
```

---

> **GridMatrix** — Your neighbor's solar panel powers your home.  
> No middlemen. No inflated bills. Transparent, on-chain energy trading.

---

## Future Scope (Production Roadmap)

- **Fiat On-Ramp:** Integrate Razorpay/UPI so users pay in ₹, auto-converted to ETK behind the scenes
- **Deploy to Polygon/Base:** Move from Hardhat local to a real L2 chain (gas fees < ₹1)
- **IoT Integration:** Smart meters push real energy data on-chain
- **AI Dynamic Pricing:** Adjust energy prices based on real-time supply/demand
