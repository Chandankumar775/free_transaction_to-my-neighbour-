/**
 * scripts/deploy.cjs
 *
 * Deploys all four contracts to the selected network and writes a
 * deployment manifest to:
 *   - energy-contracts/deployments/<network>.json
 *   - grid-matrix---p2p-energy-trading/src/lib/deployments.json  (for the UI)
 */

const hre = require("hardhat");
const fs   = require("fs");
const path = require("path");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const network    = hre.network.name;

    console.log("═══════════════════════════════════════════════════");
    console.log("  GridMatrix P2P Energy – Contract Deployment");
    console.log("═══════════════════════════════════════════════════");
    console.log(`  Network  : ${network}`);
    console.log(`  Deployer : ${deployer.address}`);
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log(`  Balance  : ${hre.ethers.formatEther(balance)} ETH`);
    console.log("───────────────────────────────────────────────────\n");

    // ── 1. EnergyToken ─────────────────────────────────────────────────────
    console.log("1 / 4  Deploying EnergyToken (ETK)...");
    const EnergyToken = await hre.ethers.getContractFactory("EnergyToken");
    const token       = await EnergyToken.deploy(deployer.address);
    await token.waitForDeployment();
    const tokenAddr   = await token.getAddress();
    console.log(`       ✓ EnergyToken  → ${tokenAddr}\n`);

    // ── 2. EnergyMarket ────────────────────────────────────────────────────
    console.log("2 / 4  Deploying EnergyMarket...");
    const EnergyMarket = await hre.ethers.getContractFactory("EnergyMarket");
    const market       = await EnergyMarket.deploy(tokenAddr);
    await market.waitForDeployment();
    const marketAddr   = await market.getAddress();
    console.log(`       ✓ EnergyMarket → ${marketAddr}\n`);

    // ── 3. EnergyStaking ───────────────────────────────────────────────────
    console.log("3 / 4  Deploying EnergyStaking...");
    const EnergyStaking = await hre.ethers.getContractFactory("EnergyStaking");
    const staking       = await EnergyStaking.deploy(tokenAddr, deployer.address);
    await staking.waitForDeployment();
    const stakingAddr   = await staking.getAddress();
    console.log(`       ✓ EnergyStaking → ${stakingAddr}\n`);

    // ── 4. AutoTrade ───────────────────────────────────────────────────────
    console.log("4 / 4  Deploying AutoTrade...");
    const AutoTrade   = await hre.ethers.getContractFactory("AutoTrade");
    const autoTrade   = await AutoTrade.deploy(tokenAddr);
    await autoTrade.waitForDeployment();
    const autoTradeAddr = await autoTrade.getAddress();
    console.log(`       ✓ AutoTrade    → ${autoTradeAddr}\n`);

    // ── Post-deploy: Mint initial tokens to deployer ───────────────────────
    console.log("Post-deploy: Minting initial ETK supply to deployer...");
    const INITIAL_SUPPLY = hre.ethers.parseUnits("1000000", 18); // 1,000,000 ETK
    const REWARD_POOL    = hre.ethers.parseUnits("100000",  18); // 100,000 ETK for staking rewards

    await (await token.mint(deployer.address, INITIAL_SUPPLY)).wait();
    console.log(`       ✓ Minted ${hre.ethers.formatUnits(INITIAL_SUPPLY, 18)} ETK to deployer\n`);

    // Approve and fund the staking reward pool
    console.log("Post-deploy: Funding staking reward pool...");
    await (await token.approve(stakingAddr, REWARD_POOL)).wait();
    await (await staking.fundRewardPool(REWARD_POOL)).wait();
    console.log(`       ✓ Funded staking pool with ${hre.ethers.formatUnits(REWARD_POOL, 18)} ETK\n`);

    // ── Build deployment manifest ──────────────────────────────────────────
    const manifest = {
        network,
        deployedAt: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            EnergyToken:   { address: tokenAddr      },
            EnergyMarket:  { address: marketAddr     },
            EnergyStaking: { address: stakingAddr    },
            AutoTrade:     { address: autoTradeAddr  },
        },
    };

    // Save to energy-contracts/deployments/<network>.json
    const deployDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deployDir)) fs.mkdirSync(deployDir, { recursive: true });
    fs.writeFileSync(
        path.join(deployDir, `${network}.json`),
        JSON.stringify(manifest, null, 2)
    );

    // Copy a lightweight version to the frontend so the UI auto-picks it up.
    const frontendLibDir = path.join(
        __dirname,
        "..", "..",
        "grid-matrix---p2p-energy-trading",
        "src", "lib"
    );
    if (fs.existsSync(frontendLibDir)) {
        fs.writeFileSync(
            path.join(frontendLibDir, "deployments.json"),
            JSON.stringify(manifest, null, 2)
        );
        console.log(`       ✓ Deployment manifest written to frontend/src/lib/deployments.json`);
    }

    console.log("\n═══════════════════════════════════════════════════");
    console.log("  All contracts deployed successfully!");
    console.log("═══════════════════════════════════════════════════\n");
    console.log("  Contract Addresses:");
    console.log(`    EnergyToken   : ${tokenAddr}`);
    console.log(`    EnergyMarket  : ${marketAddr}`);
    console.log(`    EnergyStaking : ${stakingAddr}`);
    console.log(`    AutoTrade     : ${autoTradeAddr}`);
    console.log("\n  Run the seed script next:");
    console.log("    npx hardhat run scripts/seed.cjs --network localhost\n");
}

main()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
