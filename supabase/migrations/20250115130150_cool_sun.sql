-- Drop all remaining crypto-related tables if they exist
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;

-- Drop all remaining crypto-related functions
DROP FUNCTION IF EXISTS create_user_wallets() CASCADE;

-- Drop all remaining crypto-related triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;