-- ==========================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- CONFIGURE RLS POLICIES
-- ==========================================
-- Since this application uses a custom backend with a Service Role Key, 
-- direct frontend access to the database using the anon key is NOT expected.
-- The policies below restrict all operations to authenticated users only.
-- Any direct frontend connections (if implemented in the future) will require these policies.

-- Users Table
CREATE POLICY "Users can only read their own data"
ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can only update their own data"
ON users FOR UPDATE USING (auth.uid() = id);

-- Projects Table
CREATE POLICY "Users can read own projects"
ON projects FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
ON projects FOR DELETE USING (auth.uid() = user_id);

-- Uploads Table
CREATE POLICY "Users can manage own uploads"
ON uploads FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = uploads.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Analysis Table
CREATE POLICY "Users can manage own analysis"
ON analysis FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = analysis.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Reports Table
CREATE POLICY "Users can manage own reports"
ON reports FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = reports.project_id
    AND projects.user_id = auth.uid()
  )
);

-- Chat Messages Table
CREATE POLICY "Users can manage own chat messages"
ON chat_messages FOR ALL USING (
  EXISTS (
    SELECT 1 FROM projects
    WHERE projects.id = chat_messages.project_id
    AND projects.user_id = auth.uid()
  )
);

-- ==========================================
-- CONFIGURE STORAGE SECURITY
-- ==========================================
-- Ensure the project-uploads bucket is not publicly open for unauthorized users
CREATE POLICY "Users can access their own uploaded files"
ON storage.objects FOR SELECT USING (
  bucket_id = 'project-uploads' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'project-uploads' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE USING (
  bucket_id = 'project-uploads' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE USING (
  bucket_id = 'project-uploads' AND 
  (auth.uid())::text = (string_to_array(name, '/'))[1]
);
