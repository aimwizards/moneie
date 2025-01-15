-- Drop all crypto-related tables
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;

-- Drop all crypto-related functions
DROP FUNCTION IF EXISTS create_user_wallets() CASCADE;

-- Drop all crypto-related triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;