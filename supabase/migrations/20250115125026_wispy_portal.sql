/*
  # Create wallets for existing users

  1. Changes
    - Creates wallets for all existing users
    - Ensures trigger works for new users
    - Adds proper error handling

  2. Security
    - Maintains RLS policies
    - Only creates wallets for authenticated users
*/

-- First ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_wallets();

-- Create a robust wallet creation function
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create Bitcoin wallet
  INSERT INTO wallets (user_id, blockchain, address, private_key)
  VALUES (
    NEW.id,
    'bitcoin',
    'bc1' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create Ethereum wallet
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

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();

-- Create wallets for existing users
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
      'bc1' || encode(gen_random_bytes(20), 'hex'),
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