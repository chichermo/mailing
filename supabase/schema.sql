-- Enable extensions
create extension if not exists "pgcrypto";

-- Contacts
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null unique,
  company text,
  phone text,
  list_names text[] not null default array['General']::text[],
  "group" text,
  source text,
  imported_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists contacts_list_names_idx on public.contacts using gin (list_names);

-- Templates
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text,
  content text,
  variables text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists templates_created_at_idx on public.templates (created_at desc);

-- Campaigns / Email history
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  template_id uuid references public.templates(id) on delete set null,
  template_name text,
  list_names text[] not null default array[]::text[],
  custom_subject text,
  custom_content text,
  total_sent integer not null default 0,
  success_count integer not null default 0,
  error_count integer not null default 0,
  cc_recipients integer not null default 0,
  bcc_recipients integer not null default 0,
  status text,
  method text,
  created_at timestamptz not null default now()
);

create index if not exists campaigns_created_at_idx on public.campaigns (created_at desc);
