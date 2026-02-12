-- Storage Bucket for Knowledge Files
-- Note: Run this after creating the bucket in Supabase dashboard
-- Or use the Supabase CLI: supabase storage create knowledge-files

-- Storage bucket policies
-- (Bucket must be created first via dashboard or CLI)

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'knowledge-files');

-- Allow authenticated users to view/download
CREATE POLICY "Authenticated users can view files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'knowledge-files');

-- Allow authenticated users to update (replace)
CREATE POLICY "Authenticated users can update files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'knowledge-files');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'knowledge-files');
