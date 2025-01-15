-- First drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_user_wallets();

-- Create a simpler wallet creation function with better error handling
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  btc_address text;
  eth_address text;
  btc_private_key text;
  eth_private_key text;
BEGIN
  -- Generate wallet details
  btc_address := 'bc1' || encode(gen_random_bytes(20), 'hex');
  eth_address := '0x' || encode(gen_random_bytes(20), 'hex');
  btc_private_key := encode(gen_random_bytes(32), 'hex');
  eth_private_key := encode(gen_random_bytes(32), 'hex');

  -- Create wallets in a single transaction
  BEGIN
    -- Bitcoin wallet
    INSERT INTO wallets (user_id, blockchain, address, private_key)
    VALUES (NEW.id, 'bitcoin', btc_address, btc_private_key);

    -- Ethereum wallet
    INSERT INTO wallets (user_id, blockchain, address, private_key)
    VALUES (NEW.id, 'ethereum', eth_address, eth_private_key);

  EXCEPTION WHEN OTHERS THEN
    -- Log error but allow user creation to proceed
    RAISE WARNING 'Error creating wallets for user %: %', NEW.id, SQLERRM;
  END;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();