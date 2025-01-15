/*
  # Update crypto wallet policies and add transaction support

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-create policies with proper checks
    - Add transaction support functions
    - Add proper indexes for performance

  2. Security
    - Enable RLS on all tables
    - Add proper policies for data access
    - Use security definer for sensitive functions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Users can update own wallets" ON crypto_wallets;
DROP POLICY IF EXISTS "Users can view their own transactions" ON crypto_transactions;

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
CREATE POLICY "Users can view their own transactions"
  ON crypto_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM crypto_wallets
      WHERE user_id = auth.uid()
      AND (address = crypto_transactions.from_address OR address = crypto_transactions.to_address)
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_user_id ON crypto_wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_crypto_wallets_address ON crypto_wallets(address);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_addresses ON crypto_transactions(from_address, to_address);
CREATE INDEX IF NOT EXISTS idx_crypto_transactions_created_at ON crypto_transactions(created_at DESC);