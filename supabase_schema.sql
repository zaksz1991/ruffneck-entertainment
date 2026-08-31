-- Run this in Supabase → SQL Editor → New query → Run

create table if not exists blog_posts (
  id text primary key,
  title text not null,
  cat text default 'General',
  emoji text default '📝',
  image text,
  "desc" text default '',
  body text default '',
  tags jsonb default '[]'::jsonb,
  author text default 'RuffNeck Entertainment',
  read_time text default '5',
  status text default 'draft',
  created text,
  updated text,
  created_at timestamptz default now()
);

create table if not exists products (
  id text primary key,
  name text not null,
  cat text default 'General',
  emoji text default '📦',
  image text,
  "desc" text default '',
  full_desc text default '',
  tiers jsonb default '{}'::jsonb,
  price numeric,
  status text default 'active',
  created text,
  updated text,
  created_at timestamptz default now()
);

-- Public read access (anon can GET published content via API using service key on server)
-- Writes go only through Vercel API with admin session.

alter table blog_posts enable row level security;
alter table products enable row level security;

-- Service role bypasses RLS. If using anon key only, add policies:
create policy "Allow public read posts" on blog_posts for select using (true);
create policy "Allow public read products" on products for select using (true);

-- Prefer SUPABASE_SERVICE_KEY on Vercel for inserts/updates from API.
