/*
  # Store crypto wallets

  1. New Tables
    - `wallets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `blockchain` (text, either 'bitcoin' or 'ethereum')
      - `address` (text)
      - `private_key` (text)
      - `wif` (text, for Bitcoin wallets)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `wallets` table
    - Add policy for users to read their own wallets
    - Add policy for users to insert their own wallets
*/

CREATE TABLE wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  blockchain text NOT NULL CHECK (blockchain IN ('bitcoin', 'ethereum')),
  address text NOT NULL,
  private_key text NOT NULL,
  wif text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, blockchain)
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

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