/*
  # Crypto Wallet Setup

  1. New Tables
    - `wallets`
      - Stores wallet addresses and private keys for each user
      - Supports Bitcoin and Ethereum wallets
    - `transactions`
      - Records all crypto transactions
      - Stores transaction details like hash, amount, status

  2. Security
    - Enable RLS on all tables
    - Only allow users to access their own data
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

-- Create transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES wallets NOT NULL,
  tx_hash text NOT NULL,
  amount numeric(20, 8) NOT NULL,
  direction text NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  created_at timestamptz DEFAULT now(),
  to_address text NOT NULL,
  from_address text NOT NULL
);

-- Enable RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallets
CREATE POLICY "Users can view own wallets"
  ON wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wallets"
  ON wallets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for transactions
CREATE POLICY "Users can view their transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM wallets
      WHERE wallets.id = transactions.wallet_id
      AND wallets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wallets
      WHERE wallets.id = wallet_id
      AND wallets.user_id = auth.uid()
    )
  );