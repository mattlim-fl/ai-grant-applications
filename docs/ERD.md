# Entity Relationship Diagram
## AI Grant Applications — Shadwell Basin

**Version:** 0.1  
**Date:** 2026-02-12

---

## 1. ERD Overview

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     profiles    │       │    projects     │       │   documents     │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK, FK)     │──┐    │ id (PK)         │──┐    │ id (PK)         │
│ full_name       │  │    │ name            │  │    │ project_id (FK) │──┐
│ role            │  │    │ funder          │  │    │ title           │  │
│ created_at      │  │    │ deadline        │  │    │ content         │  │
│ updated_at      │  │    │ status          │  │    │ sort_order      │  │
└─────────────────┘  │    │ created_by (FK) │──┘    │ created_at      │  │
                     │    │ created_at      │       │ updated_at      │  │
                     │    │ updated_at      │       └─────────────────┘  │
                     │    └─────────────────┘                            │
                     │            │                                      │
                     │            │ 1:N                                  │
                     │            ▼                                      │
                     │    ┌─────────────────┐                            │
                     │    │ chat_messages   │                            │
                     │    ├─────────────────┤                            │
                     │    │ id (PK)         │                            │
                     │    │ project_id (FK) │◄───────────────────────────┘
                     │    │ role            │
                     │    │ content         │
                     │    │ created_at      │
                     │    └─────────────────┘
                     │
                     │    ┌─────────────────┐       ┌─────────────────────┐
                     │    │ knowledge_files │       │ assistant_threads   │
                     │    ├─────────────────┤       ├─────────────────────┤
                     └───►│ id (PK)         │       │ id (PK)             │
                          │ filename        │       │ project_id (FK, UQ) │
                          │ file_path       │       │ thread_id           │
                          │ file_size       │       │ created_at          │
                          │ mime_type       │       └─────────────────────┘
                          │ openai_file_id  │
                          │ openai_status   │
                          │ error_message   │
                          │ uploaded_by(FK) │
                          │ created_at      │
                          └─────────────────┘
```

---

## 2. Entity Definitions

### 2.1 profiles

Extends Supabase `auth.users`. Stores additional user information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, FK → auth.users(id) | User ID from Supabase Auth |
| `full_name` | TEXT | | User's display name |
| `role` | TEXT | DEFAULT 'member' | 'admin' or 'member' |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`

**RLS Policies:**
- Users can read their own profile
- Users can update their own profile
- Admins can read all profiles

---

### 2.2 projects

Grant applications being worked on.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique project identifier |
| `name` | TEXT | NOT NULL | Project/application name |
| `funder` | TEXT | | Funding organisation |
| `deadline` | DATE | | Application deadline |
| `status` | TEXT | DEFAULT 'draft' | draft, submitted, successful, unsuccessful, archived |
| `created_by` | UUID | FK → profiles(id) | User who created the project |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Index on `created_by`
- Index on `status`

**RLS Policies:**
- All authenticated users can read all projects (single org)
- All authenticated users can create projects
- All authenticated users can update projects
- Admins can delete projects

---

### 2.3 documents

Sections within a grant application.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique document identifier |
| `project_id` | UUID | FK → projects(id) ON DELETE CASCADE | Parent project |
| `title` | TEXT | NOT NULL | Section title (e.g., "About Us") |
| `content` | TEXT | DEFAULT '' | Markdown content |
| `sort_order` | INTEGER | DEFAULT 0 | Display order within project |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- Primary key on `id`
- Index on `project_id`
- Index on `(project_id, sort_order)`

**RLS Policies:**
- Inherits from project access (if user can access project, can access documents)

---

### 2.4 knowledge_files

Uploaded organisation documents for AI context.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique file identifier |
| `filename` | TEXT | NOT NULL | Original filename |
| `file_path` | TEXT | NOT NULL | Path in Supabase Storage |
| `file_size` | INTEGER | | File size in bytes |
| `mime_type` | TEXT | | MIME type |
| `openai_file_id` | TEXT | | OpenAI Files API ID |
| `openai_status` | TEXT | DEFAULT 'pending' | pending, processing, ready, error |
| `error_message` | TEXT | | Error details if processing failed |
| `uploaded_by` | UUID | FK → profiles(id) | User who uploaded |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Upload timestamp |

**Indexes:**
- Primary key on `id`
- Index on `openai_status`
- Index on `uploaded_by`

**RLS Policies:**
- All authenticated users can read all files
- All authenticated users can upload files
- Admins can delete files

---

### 2.5 chat_messages

Chat history for each project.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique message identifier |
| `project_id` | UUID | FK → projects(id) ON DELETE CASCADE | Associated project |
| `role` | TEXT | NOT NULL | 'user' or 'assistant' |
| `content` | TEXT | NOT NULL | Message content |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Message timestamp |

**Indexes:**
- Primary key on `id`
- Index on `project_id`
- Index on `(project_id, created_at)`

**RLS Policies:**
- Inherits from project access

---

### 2.6 assistant_threads

Maps projects to OpenAI Assistant threads.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Unique record identifier |
| `project_id` | UUID | FK → projects(id) ON DELETE CASCADE, UNIQUE | One thread per project |
| `thread_id` | TEXT | NOT NULL | OpenAI thread ID |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- Primary key on `id`
- Unique index on `project_id`

**RLS Policies:**
- Inherits from project access

---

## 3. Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| profiles → projects | 1:N | A user can create many projects |
| projects → documents | 1:N | A project has many document sections |
| projects → chat_messages | 1:N | A project has many chat messages |
| projects → assistant_threads | 1:1 | Each project has one OpenAI thread |
| profiles → knowledge_files | 1:N | A user can upload many files |

---

## 4. SQL Schema

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  funder TEXT,
  deadline DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'successful', 'unsuccessful', 'archived')),
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_projects_status ON projects(status);

-- Documents
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_project_order ON documents(project_id, sort_order);

-- Knowledge Files
CREATE TABLE knowledge_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  openai_file_id TEXT,
  openai_status TEXT DEFAULT 'pending' CHECK (openai_status IN ('pending', 'processing', 'ready', 'error')),
  error_message TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_knowledge_files_status ON knowledge_files(openai_status);
CREATE INDEX idx_knowledge_files_uploaded_by ON knowledge_files(uploaded_by);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_project_id ON chat_messages(project_id);
CREATE INDEX idx_chat_messages_project_created ON chat_messages(project_id, created_at);

-- Assistant Threads
CREATE TABLE assistant_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE NOT NULL,
  thread_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 5. Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_threads ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies (all authenticated users have access - single org)
CREATE POLICY "Authenticated users can view all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Documents policies (inherit from project access)
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

-- Knowledge files policies
CREATE POLICY "Authenticated users can view all files"
  ON knowledge_files FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can upload files"
  ON knowledge_files FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete files"
  ON knowledge_files FOR DELETE
  TO authenticated
  USING (true);

-- Chat messages policies
CREATE POLICY "Authenticated users can view all messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Assistant threads policies
CREATE POLICY "Authenticated users can view all threads"
  ON assistant_threads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON assistant_threads FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

---

## 6. Storage Buckets

```sql
-- Create storage bucket for knowledge files
INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-files', 'knowledge-files', false);

-- Storage policies
CREATE POLICY "Authenticated users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'knowledge-files');

CREATE POLICY "Authenticated users can view files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'knowledge-files');

CREATE POLICY "Authenticated users can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'knowledge-files');
```

---

## 7. Supabase Functions (Edge Functions)

### 7.1 process-knowledge-file

Triggered after file upload. Sends file to OpenAI for vectorisation.

```
Trigger: INSERT on knowledge_files
Action:
  1. Download file from Supabase Storage
  2. Upload to OpenAI Files API
  3. Add to Vector Store
  4. Update knowledge_files.openai_status
```

### 7.2 cleanup-knowledge-file

Triggered before file deletion. Removes file from OpenAI.

```
Trigger: DELETE on knowledge_files
Action:
  1. Remove file from OpenAI Vector Store
  2. Delete from OpenAI Files API
  3. Allow deletion to proceed
```
