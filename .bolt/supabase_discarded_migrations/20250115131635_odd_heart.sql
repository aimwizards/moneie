/*
  # Create persistent wallets table
  
  1. New Tables
    - `wallets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `blockchain` (text, either 'bitcoin' or 'ethereum')
      - `address` (text)
      - `private_key` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `wallets` table
    - Add policies for users to view their own wallets
*/

-- Create wallets table
CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('bitcoin', 'ethereum')),
  address text NOT NULL,
  private_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, blockchain)
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own wallets"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to generate wallets on user signup
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create Bitcoin testnet wallet
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

-- Create trigger for wallet creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();