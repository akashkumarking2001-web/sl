-- Add onboarding_completed column to profiles table
-- This tracks whether a user has completed the interactive tour

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding 
ON profiles(onboarding_completed);

-- Update existing users to have onboarding completed (optional)
-- Comment this out if you want existing users to see the tour
-- UPDATE profiles SET onboarding_completed = TRUE WHERE created_at < NOW();

-- Verify the column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name = 'onboarding_completed';
