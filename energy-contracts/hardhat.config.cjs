require("@nomicfoundation/hardhat-toolbox");

let dotenvLoaded = false;
try {
    require("dotenv").config();
    dotenvLoaded = true;
} catch (_) {}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: { enabled: true, runs: 200 },
        },
    },
    networks: {
        // ── Local Hardhat node ──────────────────────────────────────────────
        localhost: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
        },
        hardhat: {
            chainId: 31337,
        },
        // ── Sepolia testnet (optional – set SEPOLIA_RPC_URL + PRIVATE_KEY) ─
        sepolia: {
            url: process.env.SEPOLIA_RPC_URL || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111,
        },
    },
    paths: {
        sources:   "./contracts",
        tests:     "./test",
        cache:     "./cache",
        artifacts: "./artifacts",
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS !== undefined,
        currency: "USD",
    },
};
