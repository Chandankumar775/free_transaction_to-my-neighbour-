# The Omni-Architecture: P2P Energy Grid Matrix

This is the unified "Master Blueprint." It visualizes the system both **Vertically** (from hardware to cloud) and **Horizontally** (from producer to consumer).

## 1. The Full Stack Matrix (Single Unified Diagram)

```mermaid
graph TD
    %% VERTICAL LAYERING
    subgraph "LAYER 4: USER EXPERIENCE (Frontend / UI)"
        UI["Visual Dashboard (Next.js + Tailwind)"]
        CH["Live Telemetry Charts (ApexCharts)"]
        WL["Web3 Gateway (RainbowKit + Wagmi)"]
    end

    subgraph "LAYER 3: MIDDLEWARE (Simulation & Integration)"
        SIM["Virtual Grid Engine (TypeScript)"]
        PRC["Dynamic Pricing AI (Algorithm)"]
        ETH["EVM Connector (Viem/Ethers)"]
    end

    subgraph "LAYER 2: SETTLEMENT (Blockchain / Smart Contracts)"
        direction LR
        TK["EnergyToken (ERC-20)"] <--> MK["Marketplace (Escrow)"]
        MK --- EVM["EVM Node (Polygon/Base)"]
        TK --- EVM
    end

    subgraph "LAYER 1: INFRASTRUCTURE (IOT / Physical Simulation)"
        direction LR
        SP["Solar Array"] --- SM["Smart Meter"]
        WT["Wind Turbine"] --- SM
        SM --- BUF["Data Buffer"]
    end

    %% HORIZONTAL FLOW (Connecting the Layers)
    SP -- "Raw Power" --> SM
    SM -- "Generation Event" --> SIM
    SIM -- "Update State" --> UI
    UI -- "Action: List Energy" --> WL
    WL -- "Sign Transaction" --> ETH
    ETH -- "Execute listEnergy()" --> MK
    MK -- "Lock Assets" --> TK

    CC["Consumer User"] -- "Action: Buy" --> UI
    UI -- "Payment (ETH/USDC)" --> WL
    WL -- "Execute buyEnergy()" --> MK
    MK -- "Transfer Energy" --> TK
    TK -- "Settle to Wallet" --> CC
    MK -- "Settle Payment" --> SP

    %% TECH STACK ANNOTATIONS
    style UI fill:#f9f,stroke:#333,stroke-width:2px
    style MK fill:#69f,stroke:#333,stroke-width:4px
    style SM fill:#9f9,stroke:#333,stroke-width:2px
```

---

## 2. The Tech Stack Deep-Dive (Matrix View)

| Dimension | Technology | Role |
| :--- | :--- | :--- |
| **Logic (The Brain)** | Solidity 0.8.20 | Secure, immutable escrow and token management. |
| **Interface (The Face)** | Next.js 14 | High-performance, SEO-friendly React framework. |
| **Auth (The Access)** | ECDSA Crypto | Wallet-based authentication; no passwords required. |
| **Mocking (The Reality)** | TypeScript Logic | Real-time trigonometric simulation of energy peak/trough. |
| **Visuals (The Vibe)** | Tailwind CSS | Science-fiction "Glassmorphism" UI design. |

---

## 3. The "Unfair Advantage" (USPs)
1.  **Peer-to-Peer Directness:** No utility companies taking a 30% cut.
2.  **Instant Settlement:** Sellers get paid the exact second the energy is sold.
3.  **Proof of Green:** Automated generation of NFT certificates for every MWh.
4.  **Hardware Agnostic:** Can be connected to any meter (or our simulator) via API.

---

## 4. Operational Flow (Horizontal logic)
1.  **Generate:** Producer (Solar) generates 5kWh. Smart Meter logs it.
2.  **Verify:** Virtual Grid Engine validates the production.
3.  **List:** Producer signs a transaction listing 5kWh at 0.05 ETH/unit.
4.  **Match:** Consumer sees the listing on the dashboard and clicks "Buy."
5.  **Execute:** Smart Contract handles the simultaneous swap: ETH to Seller, ETK to Buyer.
