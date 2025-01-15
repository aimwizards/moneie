/*
  # Clean up database schema
  
  1. Changes
    - Drop all crypto-related tables and functions
    - Keep only business_profiles table for user registration
  
  2. Security
    - Maintain RLS policies for business_profiles
*/

-- Drop crypto-related tables
DROP TABLE IF EXISTS crypto_transactions CASCADE;
DROP TABLE IF EXISTS crypto_wallets CASCADE;

-- Drop crypto-related functions
DROP FUNCTION IF EXISTS create_user_wallets() CASCADE;
DROP FUNCTION IF EXISTS record_transaction(uuid, text, numeric, numeric, text, text, text) CASCADE;

-- Drop crypto-related triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;