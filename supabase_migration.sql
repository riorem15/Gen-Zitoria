-- Run this in Supabase SQL Editor to add new columns for full persistence

ALTER TABLE user_stats
  ADD COLUMN IF NOT EXISTS game_points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS has_seen_tutorial boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS initial_level integer DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS module_progress text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS completed_phases text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS profile_name text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS profile_province text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS profile_country text DEFAULT 'Indonesia',
  ADD COLUMN IF NOT EXISTS profile_avatar text DEFAULT 'cat';
