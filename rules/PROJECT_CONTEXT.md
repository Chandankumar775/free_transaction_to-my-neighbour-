# PROJECT CONTEXT — KMRU Hackathon: P2P Energy Trading Platform

> **PURPOSE OF THIS FILE:** Agent reference file. Read this first in every new chat/window to understand the full project without re-researching.

---

## WHAT WE'RE BUILDING

A **decentralized peer-to-peer (P2P) renewable energy trading platform** for KR Manglam University hackathon.
- Solar/wind producers sell surplus energy directly to consumers via blockchain
- Energy is tokenized as ERC-20 tokens (1 token = 1 kWh)
- Trades settled on-chain with escrow smart contracts
- No middleman utility companies

---

## WORKSPACE ROOT

```
c:\Users\CHANDAN\Pictures\project web 3 kr manglam university\kmru hackanthon\
```

---

## SUB-PROJECTS

### 1. `grid-matrix---p2p-energy-trading/` — PRIMARY FRONTEND

- **Role:** Main user-facing app — landing page + full trading platform
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS (via CDN in index.html) + react-router-dom v7
- **Icons:** lucide-react
- **Fonts:** Inter (body, via Google Fonts CDN), Playfair Display (headings, via Google Fonts CDN)
- **Web3:** ethers.js v6 (`npm` dependency)
- **Port:** 3000 (configured in vite.config.ts)
- **Entry:** index.tsx → App.tsx

**Routes (defined in App.tsx):**
| Route | Component | Description |
|---|---|---|
| `/` | Landing page | Hero, Problems, HowItWorks, Features, LiveDashboard, Solution, Tokenomics, NetworkStats, Roadmap, CTA |
| `/app` | AppLayout shell | Sidebar layout — wallet connection built-in |
| `/app` (index) | Dashboard | Charts, stats, recent activity |
| `/app/energy-map` | EnergyMap | Live grid map |
| `/app/marketplace` | Marketplace | Buy/sell energy listings |
| `/app/my-energy` | MyEnergy | User energy management |
| `/app/auto-trade` | AutoTrade | Standing buy/sell orders |
| `/app/staking` | Staking | Stake ETK for rewards |
| `/app/leaderboard` | Leaderboard | Top traders |
| `/app/transactions` | Transactions | Transaction history |
| `/app/profile` | Profile | Settings |

**Removed routes (deleted):** `energy-swap`, `green-score`, `governance`, `iot-simulator`

**Key directories:**
```
grid-matrix---p2p-energy-trading/
├── App.tsx                     # Router + route definitions
├── index.tsx                   # Entry point
├── index.html                  # HTML shell (Tailwind CDN, fonts)
├── vite.config.ts              # Vite config
├── components/                 # Landing page components
├── pages/                      # App pages
│   ├── AppLayout.tsx           # Sidebar + wallet connect
│   ├── Dashboard.tsx
│   ├── Marketplace.tsx
│   ├── MyEnergy.tsx
│   ├── EnergyMap.tsx
│   ├── AutoTrade.tsx
│   ├── Staking.tsx
│   ├── Leaderboard.tsx
│   ├── Transactions.tsx
│   └── Profile.tsx
└── src/
    ├── lib/
    │   ├── abis.ts             # All 4 contract ABIs (human-readable)
    │   ├── contracts.ts        # Read/write helpers using ethers.js v6
    │   └── deployments.json    # Live contract addresses (auto-written by deploy script)
    └── hooks/
        └── useContracts.ts     # React hooks: useMarketListings, useStaking, useAutoTrade, useTokenBalance
```

**Commands:**
```bash
cd grid-matrix---p2p-energy-trading
npm install
npm run dev      # localhost:3000
npm run build
```

---

### 2. `stability-protocol---web3-ecosystem/` — WEB3 WALLET LANDING PAGE

- **Role:** Showcase landing page for Web3 wallet ecosystem (secondary/supplementary)
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS (CDN)
- **Fonts:** Inter + Orbitron
- **Port:** 3005
- **No routing** — single page

**Commands:**
```bash
cd stability-protocol---web3-ecosystem
npm install && npm run dev
```

---

### 3. `energy-contracts/` — SOLIDITY SMART CONTRACTS

- **Role:** On-chain backbone for P2P trading
- **Stack:** Hardhat **2.x** (downgraded from 3 — toolbox v5 incompatible with v3) + Solidity 0.8.20 + OpenZeppelin v5
- **Config:** `hardhat.config.js` (CommonJS, NOT .cjs — Hardhat 2 requires this name)
- **Networks configured:** `localhost` (31337), `hardhat`, `sepolia` (needs .env)

**All 4 Contracts:**
| Contract | File | Purpose |
|---|---|---|
| EnergyToken | `contracts/EnergyToken.sol` | ERC-20 (ETK). Owner mints, anyone burns. 1 ETK = 1 kWh |
| EnergyMarket | `contracts/EnergyMarket.sol` | P2P marketplace. listEnergy → buyEnergy → ETH/ETK swap |
| EnergyStaking | `contracts/EnergyStaking.sol` | Stake ETK, earn time-based rewards. Owner funds reward pool |
| AutoTrade | `contracts/AutoTrade.sol` | Standing buy/sell orders. `targetAmount` in **whole ETK** (not wei); contract scales internally with TOKEN_DECIMALS |

**IMPORTANT — AutoTrade unit convention:**
- `maxPricePerUnit` / `minPricePerUnit` = **Wei per 1 whole ETK**
- `targetAmount` / `totalAmount` = **whole ETK integers** (e.g. `500`, not `parseUnits("500",18)`)
- Contract multiplies by `1e18` internally before calling ERC20 transfer
- ERC20 `approve()` calls still need base units: `parseUnits(amount, 18)`

**Scripts:**
```
scripts/
├── deploy.cjs   # Deploys all 4 contracts, mints 1M ETK, funds staking pool,
│                # writes deployments/localhost.json AND frontend/src/lib/deployments.json
└── seed.cjs     # Mints ETK to 5 test users, creates marketplace listings,
                 # staking positions, and AutoTrade buy/sell orders
```

**NPM Scripts (package.json):**
```bash
npm run compile     # hardhat compile
npm run node        # hardhat node  (starts local blockchain at localhost:8545)
npm run deploy      # deploy to localhost
npm run seed        # seed demo data to localhost
npm run deploy:sep  # deploy to Sepolia (needs .env)
npm run test        # hardhat test
```

**Deployment output:**
- `deployments/localhost.json` — full manifest with all addresses
- `../grid-matrix---p2p-energy-trading/src/lib/deployments.json` — auto-copied for frontend

**Hardhat test accounts (from `npm run node`):**
| # | Address | Private Key |
|---|---|---|
| 0 (deployer) | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| 2 | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |
| 3 | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6` |

---

### 4. Documentation Folders

- `P2P_Energy_Project_Architecture/`
- `Project_Documents/`

Files: architecture.md, implementation_plan.md, technical_architecture.md, Architecture_Dashboard.html

---

## CURRENT STATUS

- [x] Landing page UI (grid-matrix)
- [x] App pages UI — Dashboard, Marketplace, MyEnergy, EnergyMap, AutoTrade, Staking, Leaderboard, Transactions, Profile
- [x] Playfair Display headings + glassmorphism UI throughout
- [x] Wallet Connect button (MetaMask) in AppLayout sidebar
- [x] Smart contracts — EnergyToken, EnergyMarket, EnergyStaking, AutoTrade
- [x] Deploy script (all 4 contracts, mints supply, funds staking)
- [x] Seed script (5 users, 5 listings, 3 staked positions, 4 auto-trade orders)
- [x] ethers.js v6 installed in frontend
- [x] Frontend contract layer — abis.ts, contracts.ts, deployments.json
- [x] React hooks — useMarketListings, useStaking, useAutoTrade, useTokenBalance
- [x] Contracts successfully compiled and deployed to local Hardhat node
- [x] Demo data seeded and verified
- [ ] Pages wired to live contract hooks (pages still show mock data)
- [ ] Testnet deployment (Sepolia .env not configured)
- [ ] Real IoT smart meter integration

---

## HOW TO RUN (FULL STACK)

```bash
# Terminal 1 — keep this running forever
cd energy-contracts
npm run node

# Terminal 2 — run once after starting node
npm run deploy
npm run seed

# Terminal 3 — frontend
cd ../grid-matrix---p2p-energy-trading
npm run dev      # http://localhost:3000
```

**MetaMask setup (one-time):**
1. Add network: RPC `http://127.0.0.1:8545`, Chain ID `31337`, Symbol `ETH`
2. Import Account #1 private key (see table above) → gets 10,000 ETH + 10,000 ETK from seed

---

## TECH STACK SUMMARY

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS (CDN), react-router-dom v7 |
| Web3 / Wallet | ethers.js v6, MetaMask (window.ethereum) |
| Icons | lucide-react |
| Smart Contracts | Solidity 0.8.20, Hardhat 2.x, OpenZeppelin v5 |
| Blockchain (local) | Hardhat node (localhost:8545, Chain ID 31337) |
| Blockchain (testnet) | Sepolia (planned, `.env` needed) |
| Styling approach | Tailwind via CDN — NOT installed as npm package |

---

## IMPORTANT PATTERNS & CONVENTIONS

- Tailwind via CDN `<script>` in `index.html` — never install as npm dep
- `contracts.ts` uses ESM imports (no `require()`), `deployments.json` auto-imported
- AutoTrade amounts are **whole ETK integers**, not wei — do NOT use `parseUnits` for amounts
- Staking rewards poll every 15s in `useStaking` hook
- `deploy.cjs` / `seed.cjs` are CommonJS (`.cjs`) — hardhat.config is `.js` (CommonJS, no `type:module` in package.json)
- Deploy script writes addresses to both `deployments/localhost.json` AND the frontend automatically
- App sidebar nav is in `pages/AppLayout.tsx` — modify `navItems` array to add/remove pages

---

*Last updated: Feb 19, 2026*


---

## WHAT WE'RE BUILDING

A **decentralized peer-to-peer (P2P) renewable energy trading platform** for KR Manglam University hackathon.
- Solar/wind producers sell surplus energy directly to consumers via blockchain
- Energy is tokenized as ERC-20 tokens (1 token = 1 kWh)
- Trades settled on-chain with escrow smart contracts
- No middleman utility companies

---

## WORKSPACE ROOT

```
c:\Users\CHANDAN\Pictures\project web 3 kr manglam university\kmru hackanthon\
```

---

## SUB-PROJECTS

### 1. `grid-matrix---p2p-energy-trading/` — PRIMARY FRONTEND

- **Role:** Main user-facing app — landing page + full trading platform
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS (via CDN in index.html) + react-router-dom v7
- **Icons:** lucide-react
- **Fonts:** Inter (via Google Fonts CDN)
- **Port:** 3000 (configured in vite.config.ts, may use 3001/3002 if occupied)
- **Entry:** index.tsx → App.tsx
- **Env var:** GEMINI_API_KEY

**Routes (defined in App.tsx):**
| Route | Component | Description |
|---|---|---|
| `/` | Landing page | Hero, Problems, HowItWorks, Features, LiveDashboard, Solution, Tokenomics, NetworkStats, Roadmap, CTA |
| `/app` | AppLayout shell | Trading platform wrapper |
| `/app` (index) | Dashboard | Main dashboard |
| `/app/marketplace` | Marketplace | Buy/sell energy |
| `/app/my-energy` | MyEnergy | Energy management |
| `/app/transactions` | Transactions | Transaction history |
| `/app/profile` | Profile | User profile |

**Key directories:**
```
grid-matrix---p2p-energy-trading/
├── App.tsx              # Router + route definitions
├── index.tsx            # Entry point
├── index.html           # HTML shell (Tailwind CDN, fonts)
├── vite.config.ts       # Vite config (port 3000, env vars)
├── components/          # Landing page components (Hero, Navbar, Footer, etc.)
├── pages/               # App pages (Dashboard, Marketplace, MyEnergy, etc.)
└── src/assets/          # Static assets
```

**Commands:**
```bash
cd grid-matrix---p2p-energy-trading
npm install
npm run dev      # localhost:3000
npm run build
npm run preview
```

---

### 2. `stability-protocol---web3-ecosystem/` — WEB3 WALLET LANDING PAGE

- **Role:** Showcase landing page for Web3 wallet ecosystem (secondary/supplementary)
- **Stack:** React 19 + TypeScript + Vite 6 + Tailwind CSS (CDN)
- **Fonts:** Inter + Orbitron (cyberpunk/glassmorphism aesthetic)
- **Port:** 3005 (configured in vite.config.ts, host 0.0.0.0)
- **Entry:** index.tsx → App.tsx
- **No routing** — single page with sections: Hero, Operators, TransformationSection, GrowthStats, Footer
- **All data is mock** — defined in constants.tsx

**Commands:**
```bash
cd stability-protocol---web3-ecosystem
npm install
npm run dev      # localhost:3005
```

---

### 3. `energy-contracts/` — SOLIDITY SMART CONTRACTS

- **Role:** On-chain backbone for P2P trading
- **Stack:** Hardhat 3.1.8 + Solidity 0.8.20 + OpenZeppelin Contracts v5.4.0
- **Config:** hardhat.config.cjs (no network config yet, defaults to local Hardhat node)

**Contracts:**
| Contract | File | Purpose |
|---|---|---|
| EnergyToken | contracts/EnergyToken.sol | ERC-20 token ("Energy Token" / ETK). Owner-only mint(), anyone can consume() (burn). 1 token = 1 kWh |
| EnergyMarket | contracts/EnergyMarket.sol | Escrow marketplace. listEnergy() → buyEnergy() → ETH/ETK swap. cancelListing(). ReentrancyGuard |

**Commands:**
```bash
cd energy-contracts
npm install
npx hardhat compile
npx hardhat node     # local blockchain on localhost:8545
```

**Status:** No deploy scripts, no frontend integration yet (ethers.js/wagmi planned but not wired).

---

### 4. Documentation Folders (identical content in both)

- `P2P_Energy_Project_Architecture/` 
- `Project_Documents/`

Files: architecture.md, implementation_plan.md, technical_architecture.md, Architecture_Dashboard.html

---

## CURRENT STATUS & WHAT'S NOT DONE YET

- [x] Landing page UI (grid-matrix)
- [x] App pages UI with mock data (Dashboard, Marketplace, MyEnergy, Transactions, Profile)
- [x] Smart contracts written (EnergyToken, EnergyMarket)
- [x] Stability Protocol landing page
- [ ] Web3 wallet connection (ethers.js / wagmi / RainbowKit not installed)
- [ ] Smart contract deployment scripts
- [ ] Frontend ↔ Contract integration
- [ ] Real data / backend API
- [ ] IoT smart meter integration (currently simulated)
- [ ] Authentication system
- [ ] Testnet deployment (planned: Polygon Amoy)

---

## TECH STACK SUMMARY

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS, react-router-dom v7 |
| Icons | lucide-react |
| Smart Contracts | Solidity 0.8.20, Hardhat 3.1.8, OpenZeppelin v5 |
| Blockchain (planned) | Polygon Amoy testnet |
| Web3 (planned) | ethers.js, wagmi, RainbowKit |
| Styling approach | Tailwind via CDN (not installed as npm package) |

---

## IMPORTANT PATTERNS & CONVENTIONS

- Tailwind CSS loaded via CDN `<script>` in index.html, NOT as npm dependency
- Video background on landing page (scroll-controlled mp4)
- Both frontends use `type: "module"` in package.json
- App pages are under `/app` route with AppLayout as parent layout
- All energy/trading data is currently MOCK/hardcoded — no real backend
- Components are in `components/` (landing page) and `pages/` (app views)

---

## HOW TO START (QUICK REFERENCE)

```bash
# Main app
cd "c:\Users\CHANDAN\Pictures\project web 3 kr manglam university\kmru hackanthon\grid-matrix---p2p-energy-trading"
npm install && npm run dev

# Stability protocol (optional)
cd "c:\Users\CHANDAN\Pictures\project web 3 kr manglam university\kmru hackanthon\stability-protocol---web3-ecosystem"
npm install && npm run dev

# Smart contracts (compile)
cd "c:\Users\CHANDAN\Pictures\project web 3 kr manglam university\kmru hackanthon\energy-contracts"
npm install && npx hardhat compile
```

---

*Last updated: Feb 19, 2026*
