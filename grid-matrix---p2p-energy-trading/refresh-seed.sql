-- ====================================
-- REFRESH: Wipe old seed data & insert realistic data
-- Paste this in Supabase SQL Editor → click Run
-- ====================================

-- Clear existing data
DELETE FROM transactions;
DELETE FROM energy_listings;
DELETE FROM energy_stats;
DELETE FROM profiles;

-- ─── Marketplace Listings (realistic micro-ETH prices) ───
INSERT INTO energy_listings (seller_address, seller_name, energy_type, amount_kwh, price_per_kwh) VALUES
('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Rajesh Rooftop Solar',      'Solar',   120, 0.00042),
('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Meera Wind Farm',           'Wind',    250, 0.00053),
('0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Jaipur Green Hydro',        'Hydro',    85, 0.00038),
('0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 'Ankit BioEnergy',           'Biomass', 175, 0.00035),
('0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 'Sunlight Co-op Jaipur',     'Solar',   310, 0.00040),
('0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Thar Desert Wind',          'Wind',    450, 0.00048),
('0x14dC79964da2C08dA15Fd353d30d9CBa8C7C6ce4', 'Narmada Micro-Hydro',       'Hydro',   190, 0.00041),
('0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', 'Campus Solar — KM Univ',   'Solar',    60, 0.00036);

-- ─── Transactions (spread across last 7 days, realistic amounts) ───
INSERT INTO transactions (type, user_address, peer_address, peer_name, amount, value, status, created_at) VALUES
-- today
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Rajesh Rooftop Solar',  '45 kWh Solar',   '-0.0189 ETH', 'confirmed', now() - interval '25 minutes'),
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 'Sunlight Co-op Jaipur', '30 kWh Solar',   '+0.0120 ETH', 'confirmed', now() - interval '1 hour'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Meera Wind Farm',       '18 kWh Wind',    '-0.0095 ETH', 'confirmed', now() - interval '3 hours'),
-- yesterday
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Jaipur Green Hydro',    '52 kWh Solar',   '+0.0218 ETH', 'confirmed', now() - interval '1 day 2 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Thar Desert Wind',      '75 kWh Wind',    '-0.0360 ETH', 'confirmed', now() - interval '1 day 5 hours'),
('reward', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'GridMatrix Network',    '1.2 ETK',        '+1.2 ETK',    'confirmed', now() - interval '1 day 8 hours'),
-- 2 days ago
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x14dC79964da2C08dA15Fd353d30d9CBa8C7C6ce4', 'Narmada Micro-Hydro',   '110 kWh Solar',  '+0.0440 ETH', 'confirmed', now() - interval '2 days 1 hour'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 'Ankit BioEnergy',       '40 kWh Biomass', '-0.0140 ETH', 'confirmed', now() - interval '2 days 6 hours'),
('stake',  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'Staking Pool',          '200 ETK',        '-200 ETK',    'confirmed', now() - interval '2 days 9 hours'),
-- 3 days ago
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', 'Campus Solar — KM Univ','88 kWh Solar',   '+0.0352 ETH', 'confirmed', now() - interval '3 days 4 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', 'Meera Wind Farm',       '65 kWh Wind',    '-0.0345 ETH', 'confirmed', now() - interval '3 days 7 hours'),
('reward', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'GridMatrix Network',    '0.8 ETK',        '+0.8 ETK',    'confirmed', now() - interval '3 days 12 hours'),
-- 4 days ago
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x976EA74026E726554dB657fA54763abd0C3a0aa9', 'Thar Desert Wind',      '95 kWh Solar',   '+0.0380 ETH', 'confirmed', now() - interval '4 days 3 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', 'Jaipur Green Hydro',    '22 kWh Hydro',   '-0.0084 ETH', 'confirmed', now() - interval '4 days 8 hours'),
-- 5 days ago
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', 'Ankit BioEnergy',       '130 kWh Solar',  '+0.0520 ETH', 'confirmed', now() - interval '5 days 2 hours'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 'Rajesh Rooftop Solar',  '55 kWh Solar',   '-0.0231 ETH', 'pending',   now() - interval '5 days 6 hours'),
('stake',  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'Staking Pool',          '50 ETK',         '-50 ETK',     'confirmed', now() - interval '5 days 10 hours'),
-- 6 days ago
('sell',   '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', 'Sunlight Co-op Jaipur', '200 kWh Solar',  '+0.0800 ETH', 'confirmed', now() - interval '6 days 1 hour'),
('buy',    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x14dC79964da2C08dA15Fd353d30d9CBa8C7C6ce4', 'Narmada Micro-Hydro',   '35 kWh Hydro',   '-0.0144 ETH', 'confirmed', now() - interval '6 days 5 hours'),
('reward', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '',                                          'GridMatrix Network',    '3.5 ETK',        '+3.5 ETK',    'confirmed', now() - interval '6 days 12 hours');

-- ─── Energy Stats ───
INSERT INTO energy_stats (wallet_address, production_kwh, consumption_kwh, battery_percent, battery_kwh, panel_temp_c, efficiency_percent, uptime_hours, solar_kwh, wind_kwh, hydro_kwh) VALUES
('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 452.8, 128.3, 87, 12.4, 42, 98, 338, 284.5, 128.2, 42.1);

-- ─── Profile ───
INSERT INTO profiles (wallet_address, display_name, email, location, grid_zone, role, avatar_initials) VALUES
('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', 'Chandan Kumar', 'chandan@gridmatrix.io', 'Jaipur, India', 'Zone-A (North)', 'prosumer', 'CK');
