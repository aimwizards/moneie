/*
  # Update business profiles schema

  1. Changes
    - Add first_name and last_name columns with default values
    - Add optional website column
    - Remove bank_account and tax_id columns
    
  2. Security
    - Maintain existing RLS policies
*/

-- First add new columns with a default value
ALTER TABLE business_profiles
ADD COLUMN IF NOT EXISTS first_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS last_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS website text;

-- Then remove the default constraints
ALTER TABLE business_profiles
ALTER COLUMN first_name DROP DEFAULT,
ALTER COLUMN last_name DROP DEFAULT;

-- Finally remove the old columns
ALTER TABLE business_profiles 
DROP COLUMN IF EXISTS bank_account,
DROP COLUMN IF EXISTS tax_id;