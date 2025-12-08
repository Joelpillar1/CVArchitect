-- Create a function to allow users to delete their own account
-- This function deletes the user from auth.users, which will cascade delete
-- everything else due to the foreign key constraints we set up.

create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
begin
  delete from auth.users
  where id = auth.uid();
end;
$$;
