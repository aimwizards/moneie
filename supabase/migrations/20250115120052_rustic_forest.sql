/*
  # Add Crypto Wallets and Transactions

  1. New Tables
    - `wallets`
      - Stores user wallet information
      - Includes address and private key
      - Supports both Bitcoin and Ethereum
    - `transactions`
      - Records all crypto transactions
      - Includes transaction details and status

  2. Security
    - Enable RLS on both tables
    - Only allow users to access their own wallets and transactions
*/

-- Create wallets table
CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('bitcoin', 'ethereum')),
  address text NOT NULL,
  private_key text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
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

CREATE POLICY "Users can update own wallets"
  ON wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
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

-- Create function to generate wallets on user signup
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create Bitcoin wallet
  INSERT INTO wallets (
    user_id,
    blockchain,
    address,
    private_key
  ) VALUES (
    NEW.id,
    'bitcoin',
    'bc1' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create Ethereum wallet
  INSERT INTO wallets (
    user_id,
    blockchain,
    address,
    private_key
  ) VALUES (
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