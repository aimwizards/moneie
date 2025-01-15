/*
  # Add crypto transactions table

  1. New Tables
    - `crypto_transactions`
      - `id` (uuid, primary key)
      - `from_address` (text)
      - `to_address` (text)
      - `amount` (numeric)
      - `type` (text)
      - `status` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `crypto_transactions` table
    - Add policy for authenticated users to read their own transactions
*/

-- Create crypto transactions table
CREATE TABLE crypto_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_address text NOT NULL,
  to_address text NOT NULL,
  amount numeric(20, 8) NOT NULL,
  type text NOT NULL CHECK (type IN ('btc', 'eth')),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE crypto_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for reading transactions
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

-- Create function to handle crypto transfers
CREATE OR REPLACE FUNCTION transfer_crypto(
  p_from_address text,
  p_to_address text,
  p_amount numeric,
  p_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_from_balance numeric;
BEGIN
  -- Check if addresses exist and get current balance
  SELECT balance INTO v_from_balance
  FROM crypto_wallets
  WHERE address = p_from_address AND wallet_type = p_type;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Source wallet not found';
  END IF;

  -- Check sufficient balance
  IF v_from_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Update balances
  UPDATE crypto_wallets
  SET balance = balance - p_amount
  WHERE address = p_from_address AND wallet_type = p_type;

  UPDATE crypto_wallets
  SET balance = balance + p_amount
  WHERE address = p_to_address AND wallet_type = p_type;

  -- Record transaction
  INSERT INTO crypto_transactions (from_address, to_address, amount, type)
  VALUES (p_from_address, p_to_address, p_amount, p_type);
END;
$$;