-- Updated RLS Policies for Organization-based Access
-- Replaces previous single-tenant policies

-- ============================================
-- ENABLE RLS ON NEW TABLES
-- ============================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DROP OLD POLICIES
-- ============================================
DROP POLICY IF EXISTS "Authenticated users can view all projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;

DROP POLICY IF EXISTS "Authenticated users can view all documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can create documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON documents;

DROP POLICY IF EXISTS "Authenticated users can view all files" ON knowledge_files;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON knowledge_files;
DROP POLICY IF EXISTS "Authenticated users can update files" ON knowledge_files;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON knowledge_files;

DROP POLICY IF EXISTS "Authenticated users can view all messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can create messages" ON chat_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON chat_messages;

DROP POLICY IF EXISTS "Authenticated users can view all threads" ON assistant_threads;
DROP POLICY IF EXISTS "Authenticated users can create threads" ON assistant_threads;
DROP POLICY IF EXISTS "Authenticated users can update threads" ON assistant_threads;

-- ============================================
-- ORGANIZATIONS POLICIES
-- ============================================
CREATE POLICY "Users can view orgs they belong to"
  ON organizations FOR SELECT
  TO authenticated
  USING (is_org_member(id));

CREATE POLICY "Users can create orgs"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Owners and admins can update org"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ORGANIZATION MEMBERS POLICIES
-- ============================================
CREATE POLICY "Users can view members of their orgs"
  ON organization_members FOR SELECT
  TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "Owners and admins can add members"
  ON organization_members FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is owner/admin of the org, OR if they're creating themselves as owner (new org)
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
    OR (
      -- First member of a new org can be owner
      organization_members.user_id = auth.uid()
      AND organization_members.role = 'owner'
      AND NOT EXISTS (
        SELECT 1 FROM organization_members om
        WHERE om.organization_id = organization_members.organization_id
      )
    )
  );

CREATE POLICY "Owners can remove members"
  ON organization_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role = 'owner'
    )
  );

-- ============================================
-- PROFILES POLICIES (update for current_org)
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view profiles in their org"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members om1
      JOIN organization_members om2 ON om1.organization_id = om2.organization_id
      WHERE om1.user_id = auth.uid()
      AND om2.user_id = profiles.id
    )
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PROJECTS POLICIES (org-scoped)
-- ============================================
CREATE POLICY "Users can view projects in their org"
  ON projects FOR SELECT
  TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "Users can create projects in their org"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (is_org_member(organization_id));

CREATE POLICY "Users can update projects in their org"
  ON projects FOR UPDATE
  TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "Admins and owners can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = projects.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- DOCUMENTS POLICIES (inherit from project)
-- ============================================
CREATE POLICY "Users can view documents in their org projects"
  ON documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = documents.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can create documents in their org projects"
  ON documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = documents.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can update documents in their org projects"
  ON documents FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = documents.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can delete documents in their org projects"
  ON documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = documents.project_id
      AND is_org_member(p.organization_id)
    )
  );

-- ============================================
-- KNOWLEDGE FILES POLICIES (org-scoped)
-- ============================================
CREATE POLICY "Users can view files in their org"
  ON knowledge_files FOR SELECT
  TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "Users can upload files to their org"
  ON knowledge_files FOR INSERT
  TO authenticated
  WITH CHECK (is_org_member(organization_id));

CREATE POLICY "Users can update files in their org"
  ON knowledge_files FOR UPDATE
  TO authenticated
  USING (is_org_member(organization_id));

CREATE POLICY "Admins and owners can delete files"
  ON knowledge_files FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = knowledge_files.organization_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
    )
  );

-- ============================================
-- CHAT MESSAGES POLICIES (inherit from project)
-- ============================================
CREATE POLICY "Users can view messages in their org projects"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = chat_messages.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can create messages in their org projects"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = chat_messages.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can delete messages in their org projects"
  ON chat_messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = chat_messages.project_id
      AND is_org_member(p.organization_id)
    )
  );

-- ============================================
-- ASSISTANT THREADS POLICIES (inherit from project)
-- ============================================
CREATE POLICY "Users can view threads in their org projects"
  ON assistant_threads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = assistant_threads.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can create threads in their org projects"
  ON assistant_threads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = assistant_threads.project_id
      AND is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Users can update threads in their org projects"
  ON assistant_threads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = assistant_threads.project_id
      AND is_org_member(p.organization_id)
    )
  );
