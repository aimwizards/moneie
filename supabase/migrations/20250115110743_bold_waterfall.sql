/*
  # Add transaction hash tracking
  
  1. Changes
    - Add tx_hash column to crypto_transactions table to track blockchain transaction IDs
    
  2. Notes
    - This allows linking transactions to their on-chain records
    - Helps with transaction verification and tracking
*/

-- Add transaction hash column
ALTER TABLE crypto_transactions 
ADD COLUMN tx_hash text;