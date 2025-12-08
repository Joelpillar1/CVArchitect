-- Create a table for cover letters
create table cover_letters (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  job_title text,
  company_name text,
  job_description text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table cover_letters enable row level security;

create policy "Users can view their own cover letters." on cover_letters
  for select using (auth.uid() = user_id);

create policy "Users can insert their own cover letters." on cover_letters
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own cover letters." on cover_letters
  for update using (auth.uid() = user_id);

create policy "Users can delete their own cover letters." on cover_letters
  for delete using (auth.uid() = user_id);
