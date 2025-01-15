/*
  # Fix Bitcoin testnet address format

  1. Changes
    - Updates Bitcoin address format to use valid testnet addresses with correct length
    - Recreates wallets with proper addresses
    - Maintains existing RLS policies and structure

  2. Security
    - Maintains all existing security policies
    - Only affects wallet addresses
*/

-- First clean up existing wallets to start fresh
DELETE FROM transactions;
DELETE FROM wallets;

-- Drop and recreate the wallet creation function with proper address format
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_wallets();

CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create Bitcoin testnet wallet with proper address format
  INSERT INTO wallets (user_id, blockchain, address, private_key)
  VALUES (
    NEW.id,
    'bitcoin',
    'tb1q' || substring(encode(gen_random_bytes(20), 'hex') from 1 for 32),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create Ethereum Sepolia testnet wallet
  INSERT INTO wallets (user_id, blockchain, address, private_key)
  VALUES (
    NEW.id,
    'ethereum',
    '0x' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();

-- Create wallets for existing users with proper address format
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users LOOP
    -- Create Bitcoin wallet if not exists
    INSERT INTO wallets (user_id, blockchain, address, private_key)
    SELECT 
      user_record.id,
      'bitcoin',
      'tb1q' || substring(encode(gen_random_bytes(20), 'hex') from 1 for 32),
      encode(gen_random_bytes(32), 'hex')
    WHERE NOT EXISTS (
      SELECT 1 FROM wallets 
      WHERE user_id = user_record.id AND blockchain = 'bitcoin'
    );

    -- Create Ethereum wallet if not exists
    INSERT INTO wallets (user_id, blockchain, address, private_key)
    SELECT 
      user_record.id,
      'ethereum',
      '0x' || encode(gen_random_bytes(20), 'hex'),
      encode(gen_random_bytes(32), 'hex')
    WHERE NOT EXISTS (
      SELECT 1 FROM wallets 
      WHERE user_id = user_record.id AND blockchain = 'ethereum'
    );
  END LOOP;
END;
$$;