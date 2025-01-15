-- Create function to generate wallets on user signup
CREATE OR REPLACE FUNCTION create_user_wallets()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Create Bitcoin wallet
  INSERT INTO wallets (
    user_id,
    blockchain,
    address,
    private_key
  ) VALUES (
    NEW.id,
    'bitcoin',
    'bc1' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  -- Create Ethereum wallet
  INSERT INTO wallets (
    user_id,
    blockchain,
    address,
    private_key
  ) VALUES (
    NEW.id,
    'ethereum',
    '0x' || encode(gen_random_bytes(20), 'hex'),
    encode(gen_random_bytes(32), 'hex')
  );

  RETURN NEW;
END;
$$;

-- Create trigger for wallet creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_wallets();