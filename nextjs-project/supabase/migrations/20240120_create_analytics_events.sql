-- Create analytics_events table for tracking AI bot traffic and user interactions
create table if not exists analytics_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null, -- 'ai_bot_crawl', 'ai_referral', 'page_view', etc.
  event_data jsonb default '{}'::jsonb, -- Stores user_agent, path, referer, bot_name, etc.
  user_id uuid, -- Optional link to auth.users if available
  session_id text, -- For grouping anonymous sessions
  ip_address text, -- For basic geographical analysis (processed/anonymized if needed)
  user_agent text,
  created_at timestamptz default now()
);

-- Add index for querying by event type and time (used by analysis scripts)
create index if not exists idx_analytics_events_type_time 
on analytics_events(event_type, created_at desc);

-- Enable RLS (Row Level Security)
alter table analytics_events enable row level security;

-- Policy: Allow public (middleware/server) to INSERT
create policy "Allow public insert to analytics_events"
on analytics_events for insert
with check (true);

-- Policy: Allow creating user or admins to SELECT (adjust based on your auth needs)
-- For now, allowing read access to service role (backend scripts) is automatic.
-- Use this if you want dashboard users to see it:
create policy "Allow authenticated users to read analytics"
on analytics_events for select
using (auth.role() = 'authenticated');
