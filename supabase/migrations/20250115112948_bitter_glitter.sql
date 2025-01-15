/*
  # Implement Crypto Wallet Integration
  
  1. New Tables
    - crypto_wallets: Stores wallet information for users
    - crypto_transactions: Records all transactions
  
  2. Security
    - Enable RLS on all tables
    - Add policies for wallet and transaction access
    
  3. Functions
    - create_user_wallets: Generates wallets on user signup
    - record_transaction: Records crypto transactions
*/

-- Create crypto wallets table
CREATE TABLE crypto_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  wallet_type text NOT NULL CHECK (wallet_type IN ('btc', 'eth')),
  address text NOT NULL,
  private_key text NOT NULL,
  network text NOT NULL DEFAULT 'mainnet',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallet_type)
);

-- Create crypto transactions table
CREATE TABLE crypto_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid REFERENCES crypto_wallets NOT NULL,
  tx_hash text NOT NULL,
  amount numeric(20, 8) NOT NULL,
  fee numeric(20, 8),
  type text NOT NULL CHECK (type IN ('send', 'receive')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  confirmations integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  block_height integer,
  block_hash text,
  to_address text NOT NULL,
  from_address text NOT NULL
);

-- Enable RLS
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crypto_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for crypto wallets
CREATE POLICY "Users can view own wallets"
  ON crypto_wallets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own wallets"
  ON crypto_wallets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for crypto transactions
CREATE POLICY "Users can view their transactions"
  ON crypto_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crypto_wallets
      WHERE crypto_wallets.id = crypto_transactions.wallet_id
      AND crypto_wallets.user_id = auth.uid()
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
  -- Create BTC wallet
  INSERT INTO crypto_wallets (user_id, wallet_type, address, private_key, network)
  VALUES (
    NEW.id,
    'btc',
    'bc1' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    'testnet'
  );

  -- Create ETH wallet
  INSERT INTO crypto_wallets (user_id, wallet_type, address, private_key, network)
  VALUES (
    NEW.id,
    'eth',
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
  p_type text,
  p_to_address text,
  p_from_address text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  INSERT INTO crypto_transactions (
    wallet_id, tx_hash, amount, fee, type, to_address, from_address
  ) VALUES (
    p_wallet_id, p_tx_hash, p_amount, p_fee, p_type, p_to_address, p_from_address
  )
  RETURNING id INTO v_transaction_id;
  
  RETURN v_transaction_id;
END;
$$;