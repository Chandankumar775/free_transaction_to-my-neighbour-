# GridMatrix Smart Contracts

Hardhat project containing all on-chain logic for the GridMatrix P2P Energy Trading platform.

## Contracts

| Contract | Description |
|---|---|
| `EnergyToken.sol` | ERC-20 token representing 1 kWh of energy (ETK) |
| `EnergyMarket.sol` | P2P marketplace — list, buy, and cancel energy listings |
| `EnergyStaking.sol` | Stake ETK tokens and earn passive rewards |
| `AutoTrade.sol` | Place standing buy / sell orders executed by a keeper or user |

---

## Quick Start (Local Demo)

### 1 – Install Dependencies
```bash
cd energy-contracts
npm install
```

### 2 – Compile Contracts
```bash
npm run compile
```

### 3 – Start a Local Hardhat Node
Open a **dedicated terminal** and keep it running:
```bash
npm run node
```
This starts a local JSON-RPC node at `http://127.0.0.1:8545` with 20 pre-funded test accounts.

### 4 – Deploy Contracts
In a **new terminal**:
```bash
npm run deploy
```
This deploys all four contracts, mints 1,000,000 ETK to the deployer, and funds the staking reward pool.  
Contract addresses are saved to `deployments/localhost.json` **and** copied to `../grid-matrix---p2p-energy-trading/src/lib/deployments.json` so the UI picks them up automatically.

### 5 – Seed Demo Data
```bash
npm run seed
```
Creates marketplace listings, staked positions, and AutoTrade orders using the Hardhat test accounts.

### 6 – Connect MetaMask to the local node
| Setting | Value |
|---|---|
| Network Name | Hardhat Local |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | `ETH` |

Import one of the private keys printed by `npm run node` into MetaMask for a pre-funded test account.

---

## Sepolia Testnet (Optional)

1. Copy `.env.example` → `.env` and fill in:
   ```
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   PRIVATE_KEY=0x...
   ```
2. Deploy:
   ```bash
   npm run deploy:sep
   ```

---

## Contract Architecture

```
EnergyToken (ETK)
    ↓  used by
    ├── EnergyMarket   (listEnergy / buyEnergy / cancelListing)
    ├── EnergyStaking  (stake / unstake / claimReward)
    └── AutoTrade      (placeAutoBuyOrder / placeAutoSellOrder / execute*)
```

---

## Frontend Integration

The UI (`../grid-matrix---p2p-energy-trading/`) reads contract addresses from  
`src/lib/deployments.json` (written by the deploy script) and interacts through  
`src/lib/contracts.ts` and React hooks in `src/hooks/useContracts.ts`.

```typescript
import { useMarketListings, useStaking } from "@/hooks/useContracts";

const { listings, buy } = useMarketListings();
const { info, stake, claim } = useStaking(walletAddress);
```
