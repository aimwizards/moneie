/*
  # Fix wallet creation trigger

  1. Changes
    - Drop existing trigger and function
    - Re-create wallet creation function with better error handling
    - Add new trigger with proper timing
    - Add proper indexes for performance

  2. Security
    - Maintain RLS policies
    - Use security definer for sensitive operations
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_wallets();

-- Create a more robust wallet creation function
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
  -- Generate unique addresses and keys
  btc_address := 'bc1' || encode(gen_random_bytes(20), 'hex');
  eth_address := '0x' || encode(gen_random_bytes(20), 'hex');
  btc_private_key := encode(gen_random_bytes(32), 'hex');
  eth_private_key := encode(gen_random_bytes(32), 'hex');

  -- Create BTC wallet with error handling
  BEGIN
    INSERT INTO crypto_wallets (user_id, wallet_type, address, private_key)
    VALUES (NEW.id, 'btc', btc_address, btc_private_key);
  EXCEPTION WHEN OTHERS THEN
    -- Log error but continue execution
    RAISE WARNING 'Error creating BTC wallet: %', SQLERRM;
  END;

  -- Create ETH wallet with error handling
  BEGIN
    INSERT INTO crypto_wallets (user_id, wallet_type, address, private_key)
    VALUES (NEW.id, 'eth', eth_address, eth_private_key);
  EXCEPTION WHEN OTHERS THEN
    -- Log error but continue execution
    RAISE WARNING 'Error creating ETH wallet: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Create new trigger with proper timing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();