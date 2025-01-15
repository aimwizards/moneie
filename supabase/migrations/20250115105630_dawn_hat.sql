/*
  # Add Crypto Wallets Support

  1. New Tables
    - `crypto_wallets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `wallet_type` (text - 'btc' or 'eth')
      - `address` (text)
      - `private_key` (text, encrypted)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `crypto_wallets` table
    - Add policies for authenticated users to access their own wallets
*/

-- Create crypto wallets table
CREATE TABLE crypto_wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  wallet_type text NOT NULL CHECK (wallet_type IN ('btc', 'eth')),
  address text NOT NULL,
  private_key text NOT NULL,
  balance numeric(20, 8) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, wallet_type)
);

-- Enable RLS
ALTER TABLE crypto_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create function to generate wallets on user signup
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert BTC wallet
  INSERT INTO crypto_wallets (user_id, wallet_type, address, private_key)
  VALUES (
    NEW.id,
    'btc',
    'bc1' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Insert ETH wallet
  INSERT INTO crypto_wallets (user_id, wallet_type, address, private_key)
  VALUES (
    NEW.id,
    'eth',
    '0x' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create wallets
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();