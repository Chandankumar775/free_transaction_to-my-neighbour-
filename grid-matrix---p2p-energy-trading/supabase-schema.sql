-- ====================================
-- GridMatrix Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ====================================

-- 1. PROFILES table (user info, saved from Profile page)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE,
    display_name TEXT DEFAULT 'Anonymous User',
    email TEXT DEFAULT '',
    location TEXT DEFAULT '',
    grid_zone TEXT DEFAULT 'Zone-A (North)',
    role TEXT DEFAULT 'producer' CHECK (role IN ('producer', 'consumer')),
    avatar_initials TEXT DEFAULT 'GU',
    notify_trades BOOLEAN DEFAULT true,
    notify_rewards BOOLEAN DEFAULT true,
    notify_updates BOOLEAN DEFAULT false,
    notify_newsletter BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ENERGY_LISTINGS table (marketplace listings)
CREATE TABLE IF NOT EXISTS energy_listings (
    id SERIAL PRIMARY KEY,
    seller_address TEXT NOT NULL,
    seller_name TEXT DEFAULT 'Anonymous',
    energy_type TEXT DEFAULT 'Solar' CHECK (energy_type IN ('Solar', 'Wind', 'Hydro', 'Biomass')),
    amount_kwh NUMERIC NOT NULL,
    price_per_kwh NUMERIC NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled')),
    buyer_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TRANSACTIONS table (all trades, stakes, rewards)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    tx_id TEXT UNIQUE DEFAULT ('TX-' || upper(substr(md5(random()::text), 1, 6))),
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'stake', 'unstake', 'reward')),
    user_address TEXT NOT NULL,
    peer_address TEXT DEFAULT '',
    peer_name TEXT DEFAULT '',
    amount TEXT NOT NULL,
    value TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'failed')),
    block_number INTEGER DEFAULT floor(random() * 1000000 + 18000000)::int,
    gas_used TEXT DEFAULT '0.0012',
    tx_hash TEXT DEFAULT ('0x' || substr(md5(random()::text), 1, 8) || '...' || substr(md5(random()::text), 1, 4)),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. ENERGY_STATS table (dashboard real-time stats per user)
CREATE TABLE IF NOT EXISTS energy_stats (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL UNIQUE,
    production_kwh NUMERIC DEFAULT 0,
    consumption_kwh NUMERIC DEFAULT 0,
    battery_percent NUMERIC DEFAULT 0,
    battery_kwh NUMERIC DEFAULT 0,
    panel_temp_c NUMERIC DEFAULT 35,
    efficiency_percent NUMERIC DEFAULT 95,
    uptime_hours INTEGER DEFAULT 0,
    solar_kwh NUMERIC DEFAULT 0,
    wind_kwh NUMERIC DEFAULT 0,
    hydro_kwh NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. STAKING table (staking positions)
CREATE TABLE IF NOT EXISTS staking (
    id SERIAL PRIMARY KEY,
    wallet_address TEXT NOT NULL,
    amount_staked NUMERIC DEFAULT 0,
    rewards_earned NUMERIC DEFAULT 0,
    staked_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (but allow all for hackathon demo)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking ENABLE ROW LEVEL SECURITY;

-- Policies: Allow everything for anon (hackathon demo - not production safe)
DROP POLICY IF EXISTS "Allow all on profiles" ON profiles;
DROP POLICY IF EXISTS "Allow all on energy_listings" ON energy_listings;
DROP POLICY IF EXISTS "Allow all on transactions" ON transactions;
DROP POLICY IF EXISTS "Allow all on energy_stats" ON energy_stats;
DROP POLICY IF EXISTS "Allow all on staking" ON staking;

CREATE POLICY "Allow all on profiles" ON profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on energy_listings" ON energy_listings FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on transactions" ON transactions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on energy_stats" ON energy_stats FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on staking" ON staking FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ====================================
-- SEED DATA (realistic P2P energy trades)
-- ====================================

-- Fix: update profiles role constraint to remove prosumer (if table already exists)
DO $$ BEGIN
  UPDATE profiles SET role = 'producer' WHERE role = 'prosumer';
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('producer', 'consumer'));
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Wipe old seed data so re-runs are safe
DELETE FROM transactions;
DELETE FROM energy_listings;
DELETE FROM energy_stats;
DELETE FROM staking;
DELETE FROM profiles WHERE wallet_address = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

-- Marketplace listings (realistic ETH/kWh prices ≈ $0.06-$0.12 equivalent)
INSERT INTO energy_listings (seller_address, seller_name, energy_type, amount_kwh, price_per_kwh) VALUES
('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Rajesh Rooftop Solar',      'Solar',   120, 0.00042),
('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Meera Wind Farm',           'Wind',    250, 0.00053),
('0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Jaipur Green Hydro',        'Hydro',    85, 0.00038),
('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 'Ankit BioEnergy',           'Biomass', 175, 0.00035),
('0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 'Sunlight Co-op Jaipur',     'Solar',   310, 0.00040),
('0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Thar Desert Wind',          'Wind',    450, 0.00048),
('0x14dC79964da2C08dA15Fd353d30d9CBa8C7C6ce4', 'Narmada Micro-Hydro',       'Hydro',   190, 0.00041),
('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', 'Campus Solar — KM Univ',   'Solar',    60, 0.00036);

-- Transactions — realistic mix across last 7 days
INSERT INTO transactions (type, user_address, peer_address, peer_name, amount, value, status, created_at) VALUES
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Rajesh Rooftop Solar',  '45 kWh Solar',   '-0.0189 ETH', 'confirmed', now() - interval '25 minutes'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 'Sunlight Co-op Jaipur', '30 kWh Solar',   '+0.0120 ETH', 'confirmed', now() - interval '1 hour'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Meera Wind Farm',       '18 kWh Wind',    '-0.0095 ETH', 'confirmed', now() - interval '3 hours'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Jaipur Green Hydro',    '52 kWh Solar',   '+0.0218 ETH', 'confirmed', now() - interval '1 day 2 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Thar Desert Wind',      '75 kWh Wind',    '-0.0360 ETH', 'confirmed', now() - interval '1 day 5 hours'),
('reward', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'GridMatrix Network',    '1.2 ETK',        '+1.2 ETK',    'confirmed', now() - interval '1 day 8 hours'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x14dC79964da2C08dA15Fd353d30d9CBa8C7C6ce4', 'Narmada Micro-Hydro',   '110 kWh Solar',  '+0.0440 ETH', 'confirmed', now() - interval '2 days 1 hour'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 'Ankit BioEnergy',       '40 kWh Biomass', '-0.0140 ETH', 'confirmed', now() - interval '2 days 6 hours'),
('stake',  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'Staking Pool',          '200 ETK',        '-200 ETK',    'confirmed', now() - interval '2 days 9 hours'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', 'Campus Solar — KM Univ','88 kWh Solar',   '+0.0352 ETH', 'confirmed', now() - interval '3 days 4 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Meera Wind Farm',       '65 kWh Wind',    '-0.0345 ETH', 'confirmed', now() - interval '3 days 7 hours'),
('reward', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'GridMatrix Network',    '0.8 ETK',        '+0.8 ETK',    'confirmed', now() - interval '3 days 12 hours'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Thar Desert Wind',      '95 kWh Solar',   '+0.0380 ETH', 'confirmed', now() - interval '4 days 3 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Jaipur Green Hydro',    '22 kWh Hydro',   '-0.0084 ETH', 'confirmed', now() - interval '4 days 8 hours'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 'Ankit BioEnergy',       '130 kWh Solar',  '+0.0520 ETH', 'confirmed', now() - interval '5 days 2 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Rajesh Rooftop Solar',  '55 kWh Solar',   '-0.0231 ETH', 'pending',   now() - interval '5 days 6 hours'),
('stake',  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'Staking Pool',          '50 ETK',         '-50 ETK',     'confirmed', now() - interval '5 days 10 hours'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 'Sunlight Co-op Jaipur', '200 kWh Solar',  '+0.0800 ETH', 'confirmed', now() - interval '6 days 1 hour'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x14dC79964da2C08dA15Fd353d30d9CBa8C7C6ce4', 'Narmada Micro-Hydro',   '35 kWh Hydro',   '-0.0144 ETH', 'confirmed', now() - interval '6 days 5 hours'),
('reward', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'GridMatrix Network',    '3.5 ETK',        '+3.5 ETK',    'confirmed', now() - interval '6 days 12 hours');

-- Energy stats
INSERT INTO energy_stats (wallet_address, production_kwh, consumption_kwh, battery_percent, battery_kwh, panel_temp_c, efficiency_percent, uptime_hours, solar_kwh, wind_kwh, hydro_kwh) VALUES
('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 452.8, 128.3, 87, 12.4, 42, 98, 338, 284.5, 128.2, 42.1);

-- Profile
INSERT INTO profiles (wallet_address, display_name, email, location, grid_zone, role, avatar_initials) VALUES
('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Chandan Kumar', 'chandan@gridmatrix.io', 'Jaipur, India', 'Zone-A (North)', 'producer', 'CK');
