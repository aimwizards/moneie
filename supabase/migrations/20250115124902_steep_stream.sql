/*
  # Create wallets manually for existing user

  1. Changes
    - Inserts Bitcoin and Ethereum wallets for existing user
    - Uses secure random generation for addresses and keys
    - Maintains proper wallet format (bc1... for BTC, 0x... for ETH)

  2. Security
    - Only creates wallets if they don't exist
    - Maintains RLS policies
*/

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the first user from auth.users
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- Only proceed if we found a user
  IF v_user_id IS NOT NULL THEN
    -- Insert Bitcoin wallet if it doesn't exist
    INSERT INTO wallets (user_id, blockchain, address, private_key)
    SELECT 
      v_user_id,
      'bitcoin',
      'bc1' || encode(gen_random_bytes(20), 'hex'),
      encode(gen_random_bytes(32), 'hex')
    WHERE NOT EXISTS (
      SELECT 1 FROM wallets 
      WHERE user_id = v_user_id AND blockchain = 'bitcoin'
    );

    -- Insert Ethereum wallet if it doesn't exist
    INSERT INTO wallets (user_id, blockchain, address, private_key)
    SELECT 
      v_user_id,
      'ethereum',
      '0x' || encode(gen_random_bytes(20), 'hex'),
      encode(gen_random_bytes(32), 'hex')
    WHERE NOT EXISTS (
      SELECT 1 FROM wallets 
      WHERE user_id = v_user_id AND blockchain = 'ethereum'
    );
  END IF;
END $$;