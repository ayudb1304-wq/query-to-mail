-- Private bucket for large Excel report files
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  false,
  104857600,  -- 100MB limit
  array['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
)
on conflict (id) do nothing;

-- Only service role can upload (cron worker)
create policy "Service role upload reports" on storage.objects
  for insert with check (
    bucket_id = 'reports'
  );

-- Users can read their own reports (by matching user_id path prefix)
create policy "Users read own reports" on storage.objects
  for select using (
    bucket_id = 'reports'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
