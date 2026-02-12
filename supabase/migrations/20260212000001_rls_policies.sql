-- Row Level Security Policies
-- Single-tenant: all authenticated users can access all data

-- ============================================
-- ENABLE RLS
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_threads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES
-- ============================================
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert for the trigger (SECURITY DEFINER handles this)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- ============================================
-- PROJECTS
-- All authenticated users have full access (single org)
-- ============================================
CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- DOCUMENTS
-- Inherit access from projects
-- ============================================
CREATE POLICY "Authenticated users can view all documents"
  ON documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create documents"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update documents"
  ON documents FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete documents"
  ON documents FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- KNOWLEDGE FILES
-- ============================================
CREATE POLICY "Authenticated users can view all files"
  ON knowledge_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload files"
  ON knowledge_files FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can update files"
  ON knowledge_files FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete files"
  ON knowledge_files FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- CHAT MESSAGES
-- ============================================
CREATE POLICY "Authenticated users can view all messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete messages"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- ASSISTANT THREADS
-- ============================================
CREATE POLICY "Authenticated users can view all threads"
  ON assistant_threads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON assistant_threads FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update threads"
  ON assistant_threads FOR UPDATE
  TO authenticated
  USING (true);
