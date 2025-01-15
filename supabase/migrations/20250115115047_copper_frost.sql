/*
  # Remove Database Trigger for Wallet Creation
  
  1. Changes
    - Remove the trigger that automatically creates wallets
    - Remove the function used by the trigger
    - Keep the tables and policies intact
    
  2. Reason
    - Moving wallet creation to the API layer for better control and reliability
*/

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS create_user_wallets();