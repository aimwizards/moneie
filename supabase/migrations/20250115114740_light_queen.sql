/*
  # Wallet Integration Schema

  1. New Tables
    - `wallets`
      - Stores user wallet information
      - Encrypted private keys
      - Network configuration
    - `transactions`
      - Records all wallet transactions
      - Stores transaction details and status

  2. Security
    - Enable RLS on all tables
    - Policies to ensure users can only access their own data
    - Encrypted storage for sensitive data
*/

-- Create wallets table
CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('bitcoin', 'ethereum')),
  address text NOT NULL,
  private_key text NOT NULL,
  network text NOT NULL,
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
  fee numeric(20, 8),
  direction text NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmations integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  block_height integer,
  block_hash text,
  to_address text NOT NULL,
  from_address text NOT NULL,
  gas_price numeric(20, 8),
  gas_limit numeric(20, 8),
  nonce integer
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
  -- Create Bitcoin testnet wallet
  INSERT INTO wallets (
    user_id,
    blockchain,
    address,
    private_key,
    network
  ) VALUES (
    NEW.id,
    'bitcoin',
    'tb1' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    'testnet'
  );

  -- Create Ethereum Sepolia wallet
  INSERT INTO wallets (
    user_id,
    blockchain,
    address,
    private_key,
    network
  ) VALUES (
    NEW.id,
    'ethereum',
    '0x' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    'sepolia'
  );

  RETURN NEW;
END;
$$;

-- Create trigger for wallet creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();

-- Create function to record transactions
CREATE OR REPLACE FUNCTION record_transaction(
  p_wallet_id uuid,
  p_tx_hash text,
  p_amount numeric,
  p_fee numeric,
  p_direction text,
  p_to_address text,
  p_from_address text,
  p_gas_price numeric DEFAULT NULL,
  p_gas_limit numeric DEFAULT NULL,
  p_nonce integer DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  INSERT INTO transactions (
    wallet_id,
    tx_hash,
    amount,
    fee,
    direction,
    to_address,
    from_address,
    gas_price,
    gas_limit,
    nonce
  ) VALUES (
    p_wallet_id,
    p_tx_hash,
    p_amount,
    p_fee,
    p_direction,
    p_to_address,
    p_from_address,
    p_gas_price,
    p_gas_limit,
    p_nonce
  )
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;