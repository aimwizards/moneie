-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the functions
DROP FUNCTION IF EXISTS create_user_wallets() CASCADE;
DROP FUNCTION IF EXISTS record_transaction(uuid, text, numeric, numeric, text, text, text, numeric, numeric, integer) CASCADE;