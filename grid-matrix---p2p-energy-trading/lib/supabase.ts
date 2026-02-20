import { createClient } from '@supabase/supabase-js';

// ⚡ Supabase project credentials
const SUPABASE_URL = 'https://ufsjtodvdhgfzlsjaegc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmc2p0b2R2ZGhnZnpsc2phZWdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MjU4MzksImV4cCI6MjA4NzEwMTgzOX0.EIg5vqrvYHCYiEhvR8jc_TiA6nU8hIyfnYVFi9Ex0Bk';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ──────────────── PROFILE ────────────────
export async function getProfile(walletAddress: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
    return { data, error };
}

export async function upsertProfile(profile: {
    wallet_address: string;
    display_name?: string;
    email?: string;
    location?: string;
    grid_zone?: string;
    role?: string;
    avatar_initials?: string;
    notify_trades?: boolean;
    notify_rewards?: boolean;
    notify_updates?: boolean;
    notify_newsletter?: boolean;
}) {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({ ...profile, updated_at: new Date().toISOString() }, { onConflict: 'wallet_address' })
        .select()
        .single();
    return { data, error };
}

// ──────────────── ENERGY LISTINGS (Marketplace) ────────────────
export async function getListings(status = 'active') {
    const { data, error } = await supabase
        .from('energy_listings')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false });
    return { data: data || [], error };
}

export async function createListing(listing: {
    seller_address: string;
    seller_name: string;
    energy_type: string;
    amount_kwh: number;
    price_per_kwh: number;
}) {
    const { data, error } = await supabase
        .from('energy_listings')
        .insert(listing)
        .select()
        .single();
    return { data, error };
}

export async function buyListing(listingId: number, buyerAddress: string) {
    // Get listing details first
    const { data: listing } = await supabase
        .from('energy_listings')
        .select('*')
        .eq('id', listingId)
        .single();

    if (!listing) return { data: null, error: 'Listing not found' };

    // Look up buyer profile to get a real name for the seller's transaction
    const { data: buyerProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('wallet_address', buyerAddress)
        .single();
    const buyerName = buyerProfile?.display_name || `${buyerAddress.slice(0, 6)}…${buyerAddress.slice(-4)}`;

    // Update listing status
    const { error: updateError } = await supabase
        .from('energy_listings')
        .update({ status: 'sold', buyer_address: buyerAddress, updated_at: new Date().toISOString() })
        .eq('id', listingId);

    if (updateError) return { data: null, error: updateError };

    // Total cost = kWh × price-per-kWh (both stored in realistic units)
    const totalValue = (listing.amount_kwh * listing.price_per_kwh).toFixed(4);

    await supabase.from('transactions').insert([
        {
            type: 'buy',
            user_address: buyerAddress,
            peer_address: listing.seller_address,
            peer_name: listing.seller_name,
            amount: `${listing.amount_kwh} kWh ${listing.energy_type}`,
            value: `-${totalValue} ETH`,
            status: 'confirmed'
        },
        {
            type: 'sell',
            user_address: listing.seller_address,
            peer_address: buyerAddress,
            peer_name: buyerName,
            amount: `${listing.amount_kwh} kWh ${listing.energy_type}`,
            value: `+${totalValue} ETH`,
            status: 'confirmed'
        }
    ]);

    return { data: listing, error: null };
}

export async function cancelListing(listingId: number) {
    const { data, error } = await supabase
        .from('energy_listings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', listingId);
    return { data, error };
}

// ──────────────── TRANSACTIONS ────────────────
export async function getTransactions(walletAddress?: string) {
    let query = supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (walletAddress) {
        query = query.eq('user_address', walletAddress);
    }

    const { data, error } = await query;
    return { data: data || [], error };
}

export async function addTransaction(tx: {
    type: string;
    user_address: string;
    peer_address?: string;
    peer_name?: string;
    amount: string;
    value: string;
    status?: string;
}) {
    const { data, error } = await supabase
        .from('transactions')
        .insert(tx)
        .select()
        .single();
    return { data, error };
}

// ──────────────── ENERGY STATS (Dashboard + MyEnergy) ────────────────
export async function getEnergyStats(walletAddress: string) {
    const { data, error } = await supabase
        .from('energy_stats')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
    return { data, error };
}

export async function upsertEnergyStats(stats: {
    wallet_address: string;
    production_kwh?: number;
    consumption_kwh?: number;
    battery_percent?: number;
    battery_kwh?: number;
    panel_temp_c?: number;
    efficiency_percent?: number;
    uptime_hours?: number;
    solar_kwh?: number;
    wind_kwh?: number;
    hydro_kwh?: number;
}) {
    const { data, error } = await supabase
        .from('energy_stats')
        .upsert({ ...stats, updated_at: new Date().toISOString() }, { onConflict: 'wallet_address' })
        .select()
        .single();
    return { data, error };
}

// ──────────────── STAKING ────────────────
export async function getStaking(walletAddress: string) {
    const { data, error } = await supabase
        .from('staking')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();
    return { data, error };
}

export async function stakeTokens(walletAddress: string, amount: number) {
    // Check existing stake
    const { data: existing } = await supabase
        .from('staking')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

    const newAmount = (existing?.amount_staked || 0) + amount;

    const { data, error } = await supabase
        .from('staking')
        .upsert({
            wallet_address: walletAddress,
            amount_staked: newAmount,
            rewards_earned: existing?.rewards_earned || 0,
            updated_at: new Date().toISOString()
        }, { onConflict: 'wallet_address' })
        .select()
        .single();

    // Record transaction
    await addTransaction({
        type: 'stake',
        user_address: walletAddress,
        peer_name: 'Staking Pool',
        amount: `${amount} ETK`,
        value: `-${amount} ETK`,
        status: 'confirmed'
    });

    return { data, error };
}

export async function unstakeTokens(walletAddress: string, amount: number) {
    const { data: existing } = await supabase
        .from('staking')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

    if (!existing || existing.amount_staked < amount) {
        return { data: null, error: 'Insufficient staked amount' };
    }

    const { data, error } = await supabase
        .from('staking')
        .update({
            amount_staked: existing.amount_staked - amount,
            updated_at: new Date().toISOString()
        })
        .eq('wallet_address', walletAddress)
        .select()
        .single();

    await addTransaction({
        type: 'unstake',
        user_address: walletAddress,
        peer_name: 'Staking Pool',
        amount: `${amount} ETK`,
        value: `+${amount} ETK`,
        status: 'confirmed'
    });

    return { data, error };
}

export async function claimRewards(walletAddress: string) {
    const { data: existing } = await supabase
        .from('staking')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single();

    if (!existing || existing.rewards_earned <= 0) {
        return { data: null, error: 'No rewards to claim' };
    }

    const rewards = existing.rewards_earned;

    const { data, error } = await supabase
        .from('staking')
        .update({ rewards_earned: 0, updated_at: new Date().toISOString() })
        .eq('wallet_address', walletAddress)
        .select()
        .single();

    await addTransaction({
        type: 'reward',
        user_address: walletAddress,
        peer_name: 'Network',
        amount: `${rewards} ETK`,
        value: `+${rewards} ETK`,
        status: 'confirmed'
    });

    return { data, error, rewards };
}

// ──────────────── REAL-TIME SUBSCRIPTIONS ────────────────
export function subscribeToListings(callback: (payload: any) => void) {
    return supabase
        .channel('listings-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'energy_listings' }, callback)
        .subscribe();
}

export function subscribeToTransactions(callback: (payload: any) => void) {
    return supabase
        .channel('tx-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, callback)
        .subscribe();
}
