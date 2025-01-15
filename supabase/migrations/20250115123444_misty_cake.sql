/*
  # Remove crypto functionality
  
  This migration removes all crypto-related tables and functions from the database
  while preserving the core business profile functionality.
*/

-- Drop all crypto-related tables
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;

-- Drop all crypto-related functions
DROP FUNCTION IF EXISTS create_user_wallets() CASCADE;
DROP FUNCTION IF EXISTS record_transaction(uuid, text, numeric, numeric, text, text, text, numeric, numeric, integer) CASCADE;

-- Drop all crypto-related triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;