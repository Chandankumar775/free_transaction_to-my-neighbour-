/**
 * src/hooks/useContracts.ts
 *
 * React hooks that wrap the contract helpers from src/lib/contracts.ts.
 * Components import these hooks instead of calling ethers directly.
 */

import { useState, useEffect, useCallback } from "react";
import {
  fetchTokenBalance,
  fetchMarketListings,
  fetchStakeInfo,
  fetchAutoBuyOrders,
  fetchAutoSellOrders,
  buyListing,
  listEnergyForSale,
  stakeETK,
  unstakeETK,
  claimStakingRewards,
  placeAutoBuyOrder,
  placeAutoSellOrder,
  MarketListing,
  StakeInfo,
  AutoBuyOrder,
  AutoSellOrder,
} from "../lib/contracts";

// ─── useTokenBalance ──────────────────────────────────────────────────────

export function useTokenBalance(address: string | null) {
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    const bal = await fetchTokenBalance(address);
    setBalance(bal);
    setLoading(false);
  }, [address]);

  useEffect(() => { refresh(); }, [refresh]);
  return { balance, loading, refresh };
}

// ─── useMarketListings ────────────────────────────────────────────────────

export function useMarketListings() {
  const [listings, setListings] = useState<MarketListing[]>([]);
  const [loading, setLoading]   = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchMarketListings();
    setListings(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const buy = useCallback(async (listingId: number, priceEth: string) => {
    const receipt = await buyListing(listingId, priceEth);
    await refresh();
    return receipt;
  }, [refresh]);

  const list = useCallback(async (amountETK: string, priceETH: string) => {
    const receipt = await listEnergyForSale(amountETK, priceETH);
    await refresh();
    return receipt;
  }, [refresh]);

  return { listings, loading, refresh, buy, list };
}

// ─── useStaking ───────────────────────────────────────────────────────────

export function useStaking(address: string | null) {
  const [info, setInfo]       = useState<StakeInfo>({ staked: "0", pending: "0" });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    const data = await fetchStakeInfo(address);
    setInfo(data);
    setLoading(false);
  }, [address]);

  useEffect(() => {
    refresh();
    // Poll every 15 seconds so pending rewards update automatically
    const id = setInterval(refresh, 15_000);
    return () => clearInterval(id);
  }, [refresh]);

  const stake = useCallback(async (amount: string) => {
    const receipt = await stakeETK(amount);
    await refresh();
    return receipt;
  }, [refresh]);

  const unstake = useCallback(async (amount: string) => {
    const receipt = await unstakeETK(amount);
    await refresh();
    return receipt;
  }, [refresh]);

  const claim = useCallback(async () => {
    const receipt = await claimStakingRewards();
    await refresh();
    return receipt;
  }, [refresh]);

  return { info, loading, refresh, stake, unstake, claim };
}

// ─── useAutoTrade ─────────────────────────────────────────────────────────

export function useAutoTrade() {
  const [buyOrders,  setBuyOrders]  = useState<AutoBuyOrder[]>([]);
  const [sellOrders, setSellOrders] = useState<AutoSellOrder[]>([]);
  const [loading, setLoading]       = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [buys, sells] = await Promise.all([
      fetchAutoBuyOrders(),
      fetchAutoSellOrders(),
    ]);
    setBuyOrders(buys);
    setSellOrders(sells);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const placeBuy = useCallback(async (maxPrice: string, amount: string) => {
    const receipt = await placeAutoBuyOrder(maxPrice, amount);
    await refresh();
    return receipt;
  }, [refresh]);

  const placeSell = useCallback(async (minPrice: string, amount: string) => {
    const receipt = await placeAutoSellOrder(minPrice, amount);
    await refresh();
    return receipt;
  }, [refresh]);

  return { buyOrders, sellOrders, loading, refresh, placeBuy, placeSell };
}
