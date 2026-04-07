-- Run this in Supabase SQL Editor to remove the auto-trigger
-- This prevents gp_profiles from being created for users from your other project

DROP TRIGGER IF EXISTS on_auth_user_created_gp ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_gp_user();
