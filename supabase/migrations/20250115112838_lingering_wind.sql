/*
  # Clean up crypto-related database objects
  
  This migration removes all crypto-related tables, functions, triggers, and policies
  while preserving the core authentication and business profile functionality.

  1. Changes
    - Drop all crypto-related triggers
    - Drop all crypto-related functions
    - Drop all crypto-related tables and their associated objects
*/

-- First drop the trigger that depends on the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Then drop the functions
DROP FUNCTION IF EXISTS create_user_wallets();
DROP FUNCTION IF EXISTS transfer_crypto();

-- Finally drop the tables (this will automatically drop their policies and indexes)
DROP TABLE IF EXISTS crypto_transactions CASCADE;
DROP TABLE IF EXISTS crypto_wallets CASCADE;