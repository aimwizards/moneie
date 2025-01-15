/*
  # Fix wallet creation trigger

  1. Changes
    - Improve error handling in wallet creation trigger
    - Add proper transaction handling
    - Add better error reporting
    - Ensure atomic operations
  
  2. Security
    - Maintain RLS policies
    - Keep security definer setting
*/

-- First drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_wallets();

-- Create a more robust wallet creation function with better error handling
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  btc_address text;
  eth_address text;
  btc_private_key text;
  eth_private_key text;
BEGIN
  -- Generate wallet details before any database operations
  btc_address := 'bc1' || encode(gen_random_bytes(20), 'hex');
  eth_address := '0x' || encode(gen_random_bytes(20), 'hex');
  btc_private_key := encode(gen_random_bytes(32), 'hex');
  eth_private_key := encode(gen_random_bytes(32), 'hex');

  -- Wrap both wallet creations in a single transaction
  BEGIN
    -- Create BTC wallet
    INSERT INTO crypto_wallets (
      user_id,
      wallet_type,
      address,
      private_key,
      network
    ) VALUES (
      NEW.id,
      'btc',
      btc_address,
      btc_private_key,
      'testnet'
    );

    -- Create ETH wallet
    INSERT INTO crypto_wallets (
      user_id,
      wallet_type,
      address,
      private_key,
      network
    ) VALUES (
      NEW.id,
      'eth',
      eth_address,
      eth_private_key,
      'sepolia'
    );

    -- If we get here, both wallets were created successfully
    RETURN NEW;
  EXCEPTION 
    WHEN OTHERS THEN
      -- Log the error details
      RAISE WARNING 'Error in create_user_wallets(): %', SQLERRM;
      -- Return NEW to allow user creation even if wallet creation fails
      RETURN NEW;
  END;
END;
$$;

-- Recreate the trigger with AFTER timing to ensure user exists
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();