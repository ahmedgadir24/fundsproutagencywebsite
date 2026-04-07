-- Run this in Supabase SQL Editor
-- Removes all gp_profiles that were auto-created by the old trigger
-- Keeps only profiles where has_paid = true (actual grant database customers)

DELETE FROM public.gp_profiles WHERE has_paid = false;
