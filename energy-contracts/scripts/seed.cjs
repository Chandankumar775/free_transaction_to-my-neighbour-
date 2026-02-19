/**
 * scripts/seed.cjs
 *
 * Seeds the local Hardhat node with realistic demo data:
 *   – Mints ETK to test accounts
 *   – Creates marketplace listings
 *   – Stakes tokens on behalf of test accounts
 *   – Places AutoTrade buy/sell orders
 *
 * Usage (after starting the local node and deploying):
 *   npx hardhat run scripts/seed.cjs --network localhost
 */

const hre  = require("hardhat");
const fs   = require("fs");
const path = require("path");

async function main() {
    const signers  = await hre.ethers.getSigners();
    const deployer = signers[0];
    const users    = signers.slice(1, 6); // 5 test users

    // ── Load deployed addresses ─────────────────────────────────────────────
    const deploymentFile = path.join(__dirname, "..", "deployments", "localhost.json");
    if (!fs.existsSync(deploymentFile)) {
        throw new Error("No localhost deployment found. Run deploy.cjs first.");
    }
    const { contracts } = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

    const token    = await hre.ethers.getContractAt("EnergyToken",   contracts.EnergyToken.address);
    const market   = await hre.ethers.getContractAt("EnergyMarket",  contracts.EnergyMarket.address);
    const staking  = await hre.ethers.getContractAt("EnergyStaking", contracts.EnergyStaking.address);
    const autotrade = await hre.ethers.getContractAt("AutoTrade",    contracts.AutoTrade.address);

    console.log("═══════════════════════════════════════════════════");
    console.log("  GridMatrix – Seeding demo data");
    console.log("═══════════════════════════════════════════════════\n");

    // ── Step 1: Mint ETK to each test user ──────────────────────────────────
    console.log("Step 1 – Minting ETK to test users...");
    const MINT_AMOUNT = hre.ethers.parseUnits("10000", 18); // 10,000 ETK each
    for (const user of users) {
        await (await token.mint(user.address, MINT_AMOUNT)).wait();
        console.log(`         ✓ Minted 10,000 ETK → ${user.address}`);
    }
    console.log();

    // ── Step 2: Create marketplace listings ────────────────────────────────
    console.log("Step 2 – Creating marketplace listings...");
    const listings = [
        { seller: users[0], amount: "500",  priceETH: "0.05"  },
        { seller: users[1], amount: "1200", priceETH: "0.10"  },
        { seller: users[2], amount: "300",  priceETH: "0.03"  },
        { seller: users[3], amount: "800",  priceETH: "0.08"  },
        { seller: users[4], amount: "2000", priceETH: "0.20"  },
    ];

    for (const item of listings) {
        const amount = hre.ethers.parseUnits(item.amount, 18);
        const price  = hre.ethers.parseEther(item.priceETH);

        await (await token.connect(item.seller).approve(contracts.EnergyMarket.address, amount)).wait();
        await (await market.connect(item.seller).listEnergy(amount, price)).wait();
        console.log(`         ✓ Listed ${item.amount} ETK @ ${item.priceETH} ETH  (${item.seller.address})`);
    }
    console.log();

    // ── Step 3: Stake tokens ────────────────────────────────────────────────
    console.log("Step 3 – Staking tokens...");
    const stakes = [
        { user: users[0], amount: "2000" },
        { user: users[1], amount: "3500" },
        { user: users[2], amount: "1000" },
    ];

    for (const s of stakes) {
        const amount = hre.ethers.parseUnits(s.amount, 18);
        await (await token.connect(s.user).approve(contracts.EnergyStaking.address, amount)).wait();
        await (await staking.connect(s.user).stake(amount)).wait();
        console.log(`         ✓ ${s.user.address} staked ${s.amount} ETK`);
    }
    console.log();

    // ── Step 4: AutoTrade orders ────────────────────────────────────────────
    console.log("Step 4 – Placing AutoTrade orders...");

    // Buy orders  — maxPricePerUnit is Wei per 1 whole ETK; amount is whole ETK (no 18-decimal)
    const buyOrders = [
        { user: users[0], maxPrice: "0.0001", amount: 500  },
        { user: users[1], maxPrice: "0.0002", amount: 800  },
    ];
    for (const o of buyOrders) {
        const maxPriceWei = hre.ethers.parseEther(o.maxPrice);
        // targetAmount is a plain integer (whole tokens); contract will scale internally
        const deposit     = maxPriceWei * BigInt(o.amount);

        await (await autotrade.connect(o.user).placeBuyOrder(maxPriceWei, o.amount, { value: deposit })).wait();
        console.log(`         ✓ BUY  order: ${o.amount} ETK @ max ${o.maxPrice} ETH/ETK`);
    }

    // Sell orders — minPricePerUnit is Wei per 1 whole ETK; amount is whole ETK
    const sellOrders = [
        { user: users[2], minPrice: "0.00008", amount: 400 },
        { user: users[3], minPrice: "0.00015", amount: 600 },
    ];
    for (const o of sellOrders) {
        const minPriceWei = hre.ethers.parseEther(o.minPrice);
        // Approve 18-decimal base units for the ERC20 transfer
        const amountWei   = hre.ethers.parseUnits(o.amount.toString(), 18);

        await (await token.connect(o.user).approve(contracts.AutoTrade.address, amountWei)).wait();
        await (await autotrade.connect(o.user).placeSellOrder(minPriceWei, o.amount)).wait();
        console.log(`         ✓ SELL order: ${o.amount} ETK @ min ${o.minPrice} ETH/ETK`);
    }
    console.log();

    console.log("═══════════════════════════════════════════════════");
    console.log("  Seed complete! The app is ready for a demo.");
    console.log("═══════════════════════════════════════════════════\n");
    console.log("  Hardhat test accounts (add to MetaMask via private key):");
    for (let i = 0; i < users.length; i++) {
        console.log(`    User ${i + 1}: ${users[i].address}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
