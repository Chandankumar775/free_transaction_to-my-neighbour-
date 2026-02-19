/**
 * src/lib/contracts.ts
 *
 * Central contract configuration.
 *
 * After running `npm run deploy` inside energy-contracts/ the deploy
 * script writes deployments.json to this directory with live addresses.
 * While no deployment exists we fall back to zero-address so the app
 * doesn't crash – pages will just show "not connected" states.
 */

import { ethers, BrowserProvider, Contract, formatUnits, parseUnits, parseEther, formatEther } from "ethers";
import {
  EnergyTokenABI,
  EnergyMarketABI,
  EnergyStakingABI,
  AutoTradeABI,
} from "./abis";
import _deployments from "./deployments.json";

// ── Types ──────────────────────────────────────────────────────────────────

export interface DeploymentManifest {
  network: string;
  deployedAt: string;
  deployer: string;
  contracts: {
    EnergyToken:   { address: string };
    EnergyMarket:  { address: string };
    EnergyStaking: { address: string };
    AutoTrade:     { address: string };
  };
}

export interface MarketListing {
  id: number;
  seller: string;
  amount: string;   // formatted ETK
  price: string;    // formatted ETH
  active: boolean;
}

export interface StakeInfo {
  staked: string;   // formatted ETK
  pending: string;  // formatted ETK (rewards)
}

export interface AutoBuyOrder {
  id: number;
  buyer: string;
  maxPricePerUnit: string;
  targetAmount: string;
  filledAmount: string;
  depositedETH: string;
  active: boolean;
}

export interface AutoSellOrder {
  id: number;
  seller: string;
  minPricePerUnit: string;
  totalAmount: string;
  soldAmount: string;
  active: boolean;
}

// ── Deployment loader ──────────────────────────────────────────────────────

export function getContractAddresses() {
  const m = _deployments as DeploymentManifest;
  return {
    EnergyToken:   m?.contracts.EnergyToken.address   ?? ethers.ZeroAddress,
    EnergyMarket:  m?.contracts.EnergyMarket.address  ?? ethers.ZeroAddress,
    EnergyStaking: m?.contracts.EnergyStaking.address ?? ethers.ZeroAddress,
    AutoTrade:     m?.contracts.AutoTrade.address     ?? ethers.ZeroAddress,
  };
}

// ── Provider helpers ───────────────────────────────────────────────────────

export async function getProvider(): Promise<BrowserProvider | null> {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  if (!provider) throw new Error("No wallet found. Please install MetaMask.");
  return provider.getSigner();
}

// ── Contract getters ───────────────────────────────────────────────────────

async function readOnlyProvider() {
  const p = await getProvider();
  if (p) return p;
  // Fallback to JSON-RPC for the local hardhat node
  return new ethers.JsonRpcProvider("http://127.0.0.1:8545");
}

export async function getEnergyTokenContract(writeable = false) {
  const addr    = getContractAddresses().EnergyToken;
  const signerOrProvider = writeable ? await getSigner() : await readOnlyProvider();
  return new Contract(addr, EnergyTokenABI, signerOrProvider);
}

export async function getMarketContract(writeable = false) {
  const addr    = getContractAddresses().EnergyMarket;
  const signerOrProvider = writeable ? await getSigner() : await readOnlyProvider();
  return new Contract(addr, EnergyMarketABI, signerOrProvider);
}

export async function getStakingContract(writeable = false) {
  const addr    = getContractAddresses().EnergyStaking;
  const signerOrProvider = writeable ? await getSigner() : await readOnlyProvider();
  return new Contract(addr, EnergyStakingABI, signerOrProvider);
}

export async function getAutoTradeContract(writeable = false) {
  const addr    = getContractAddresses().AutoTrade;
  const signerOrProvider = writeable ? await getSigner() : await readOnlyProvider();
  return new Contract(addr, AutoTradeABI, signerOrProvider);
}

// ── High-level read helpers ────────────────────────────────────────────────

export async function fetchTokenBalance(address: string): Promise<string> {
  try {
    const c = await getEnergyTokenContract();
    const bal = await c.balanceOf(address);
    return formatUnits(bal, 18);
  } catch { return "0"; }
}

export async function fetchMarketListings(): Promise<MarketListing[]> {
  try {
    const c     = await getMarketContract();
    const count = Number(await c.listingCount());
    const listings: MarketListing[] = [];

    for (let i = 1; i <= count; i++) {
      const l = await c.listings(i);
      if (l.active) {
        listings.push({
          id:     i,
          seller: l.seller,
          amount: formatUnits(l.amount, 18),
          price:  formatEther(l.price),
          active: l.active,
        });
      }
    }
    return listings;
  } catch { return []; }
}

export async function fetchStakeInfo(address: string): Promise<StakeInfo> {
  try {
    const c = await getStakingContract();
    const [stakedAmount, pending] = await c.getStakeInfo(address);
    return {
      staked:  formatUnits(stakedAmount, 18),
      pending: formatUnits(pending, 18),
    };
  } catch { return { staked: "0", pending: "0" }; }
}

export async function fetchAutoBuyOrders(): Promise<AutoBuyOrder[]> {
  try {
    const c     = await getAutoTradeContract();
    const count = Number(await c.buyOrderCount());
    const orders: AutoBuyOrder[] = [];

    for (let i = 1; i <= count; i++) {
      const o = await c.getBuyOrder(i);
      if (o.active) {
        orders.push({
          id:             i,
          buyer:          o.buyer,
          maxPricePerUnit: formatEther(o.maxPricePerUnit),
          targetAmount:   formatUnits(o.targetAmount, 18),
          filledAmount:   formatUnits(o.filledAmount, 18),
          depositedETH:   formatEther(o.depositedETH),
          active:         o.active,
        });
      }
    }
    return orders;
  } catch { return []; }
}

export async function fetchAutoSellOrders(): Promise<AutoSellOrder[]> {
  try {
    const c     = await getAutoTradeContract();
    const count = Number(await c.sellOrderCount());
    const orders: AutoSellOrder[] = [];

    for (let i = 1; i <= count; i++) {
      const o = await c.getSellOrder(i);
      if (o.active) {
        orders.push({
          id:             i,
          seller:         o.seller,
          minPricePerUnit: formatEther(o.minPricePerUnit),
          totalAmount:    formatUnits(o.totalAmount, 18),
          soldAmount:     formatUnits(o.soldAmount, 18),
          active:         o.active,
        });
      }
    }
    return orders;
  } catch { return []; }
}

// ── High-level write helpers ──────────────────────────────────────────────

export async function buyListing(listingId: number, priceEth: string) {
  const market = await getMarketContract(true);
  const tx = await market.buyEnergy(listingId, { value: parseEther(priceEth) });
  return tx.wait();
}

export async function listEnergyForSale(amountETK: string, priceETH: string) {
  const tokenAddr = getContractAddresses().EnergyToken;
  const marketAddr = getContractAddresses().EnergyMarket;

  const token  = await getEnergyTokenContract(true);
  const market = await getMarketContract(true);

  const amount = parseUnits(amountETK, 18);
  const price  = parseEther(priceETH);

  const approveTx = await token.approve(marketAddr, amount);
  await approveTx.wait();

  const tx = await market.listEnergy(amount, price);
  return tx.wait();
}

export async function stakeETK(amountETK: string) {
  const stakingAddr = getContractAddresses().EnergyStaking;
  const token   = await getEnergyTokenContract(true);
  const staking = await getStakingContract(true);

  const amount = parseUnits(amountETK, 18);

  const approveTx = await token.approve(stakingAddr, amount);
  await approveTx.wait();

  const tx = await staking.stake(amount);
  return tx.wait();
}

export async function unstakeETK(amountETK: string) {
  const staking = await getStakingContract(true);
  const tx = await staking.unstake(parseUnits(amountETK, 18));
  return tx.wait();
}

export async function claimStakingRewards() {
  const staking = await getStakingContract(true);
  const tx = await staking.claimReward();
  return tx.wait();
}

export async function placeAutoBuyOrder(
  maxPricePerUnitETH: string,
  targetAmountETK: string  // whole ETK (e.g. "500") — contract uses whole-token amounts
) {
  const auto = await getAutoTradeContract(true);
  const maxPrice  = parseEther(maxPricePerUnitETH);
  const amount    = BigInt(Math.floor(parseFloat(targetAmountETK))); // whole tokens
  const deposit   = maxPrice * amount;
  const tx = await auto.placeBuyOrder(maxPrice, amount, { value: deposit });
  return tx.wait();
}

export async function placeAutoSellOrder(
  minPricePerUnitETH: string,
  totalAmountETK: string  // whole ETK (e.g. "400") — contract will scale internally
) {
  const autoAddr = getContractAddresses().AutoTrade;
  const token = await getEnergyTokenContract(true);
  const auto  = await getAutoTradeContract(true);

  const minPrice = parseEther(minPricePerUnitETH);
  const amount   = BigInt(Math.floor(parseFloat(totalAmountETK))); // whole tokens

  // ERC20 approve needs base units (1e18 per token)
  const approveTx = await token.approve(autoAddr, parseUnits(totalAmountETK, 18));
  await approveTx.wait();

  const tx = await auto.placeSellOrder(minPrice, amount);
  return tx.wait();
}

// Re-export formatting utilities so pages don't need to import ethers directly
export { formatUnits, formatEther, parseUnits, parseEther };
