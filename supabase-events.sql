-- Run this in Supabase SQL Editor
-- Tracks CTA button clicks and page events

CREATE TABLE IF NOT EXISTS public.gp_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}',
  page text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.gp_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert events (anonymous tracking)
CREATE POLICY "Anyone can insert events"
  ON public.gp_events FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_gp_events_name ON public.gp_events(event_name);
CREATE INDEX IF NOT EXISTS idx_gp_events_created ON public.gp_events(created_at);
