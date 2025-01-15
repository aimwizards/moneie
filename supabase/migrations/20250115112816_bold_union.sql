/*
  # Remove crypto-related database objects
  
  This migration removes all crypto wallet and transaction related tables, functions, 
  and triggers while preserving the core authentication functionality.

  1. Changes
    - Drop crypto_transactions table
    - Drop crypto_wallets table
    - Drop related functions and triggers
    - Drop related policies and indexes
*/

-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop functions
DROP FUNCTION IF EXISTS create_user_wallets();
DROP FUNCTION IF EXISTS transfer_crypto();

-- Drop tables (this will automatically drop their policies and indexes)
DROP TABLE IF EXISTS crypto_transactions;
DROP TABLE IF EXISTS crypto_wallets;