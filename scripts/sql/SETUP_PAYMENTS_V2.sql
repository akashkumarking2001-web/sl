
-- Create the payments table if it doesn't exist
create table if not exists public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  amount numeric not null,
  plan_name text not null,
  transaction_id text,
  screenshot_url text,
  status text default 'pending',
  admin_notes text,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.payments enable row level security;

-- Drop existing policies to avoid conflicts
drop policy if exists "Users can insert their own payments" on public.payments;
drop policy if exists "Users can view their own payments" on public.payments;

-- Allow users to insert their own payments
create policy "Users can insert their own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

-- Allow users to view their own payments
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Create the storage bucket for payments if it doesn't exist
insert into storage.buckets (id, name, public)
values ('payments', 'payments', true)
on conflict (id) do nothing;

-- Drop existing storage policies to avoid conflicts
drop policy if exists "Any authenticated user can upload payment proofs" on storage.objects;
drop policy if exists "Any user can view payment proofs" on storage.objects;

-- Set up storage policies
create policy "Any authenticated user can upload payment proofs"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'payments' );

create policy "Any user can view payment proofs"
  on storage.objects for select
  using ( bucket_id = 'payments' );
