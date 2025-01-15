-- First clean up any existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_wallets();
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;

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

-- Create a simplified wallet creation function
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
EXCEPTION WHEN OTHERS THEN
  -- Log error but allow user creation to proceed
  RAISE WARNING 'Error creating wallets for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- Create trigger for wallet creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();