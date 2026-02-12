# Product Requirements Document
## AI Grant Applications — Shadwell Basin

**Version:** 0.2  
**Date:** 2026-02-12  
**Author:** Matt Lim  
**Status:** Draft

---

## 1. Overview

### 1.1 Background

Shadwell Basin Outdoor Activity Centre is a 50-year-old youth charity in East London with ~£400K annual budget and 6 permanent staff. They submit 16-17 grant applications per year with an 85-90% success rate.

**The problem:** They're excellent at writing grants but severely time-constrained. They estimate they could apply for 3x more funding if they had capacity. Currently, they miss deadlines simply because they can't get to everything.

### 1.2 Solution

A grant application workspace that:
1. Stores and organises all their grant applications in one place
2. Has deep knowledge of their organisation via uploaded documents
3. Uses AI to help draft application sections in their voice
4. Is simple enough for staff with zero AI experience to use

### 1.3 Success Criteria

- Staff can draft a grant application section in <10 minutes (vs hours)
- Mike (Director) can use it independently after one training session
- Enables at least 2 additional grant applications in first 3 months
- All past and current applications organised and searchable

---

## 2. Users

### 2.1 Primary Users

| User | Role | AI Experience | Usage |
|------|------|---------------|-------|
| Mike Wardle | Director | None | Primary grant writer, will use most |
| Jan | Deputy | Basic personal use | Data/monitoring support |
| Daniel Belcher | Trustee | Unknown | Learning grants, occasional use |

### 2.2 User Needs

- **Organised workspace** — See all applications, past and present
- **Simple interface** — No learning curve, just type and get help
- **Accurate information** — Must use real Shadwell Basin data, not hallucinate
- **Their voice** — Output should sound like them, not generic
- **Exportable** — Need to copy/paste into Word docs and grant portals

---

## 3. Information Architecture

### 3.1 Core Entities

```
Organisation (Shadwell Basin)
├── Knowledge Base (shared documents)
│   ├── Annual Reports
│   ├── Policies
│   ├── Past Applications (reference)
│   └── Data exports
│
├── Projects (Grant Applications)
│   ├── Sport England 2025
│   │   ├── Documents
│   │   │   ├── About Us
│   │   │   ├── Statement of Need
│   │   │   ├── Project Description
│   │   │   └── Budget
│   │   └── Chat History
│   │
│   └── BBC Children in Need 2025
│       ├── Documents
│       └── Chat History
│
└── Users
    ├── Mike
    ├── Jan
    └── Daniel
```

### 3.2 Entity Relationships

- **Users** belong to the organisation (single-tenant for now)
- **Projects** contain multiple documents and have their own chat history
- **Knowledge Base** is shared across all projects
- **Documents** are markdown content within a project

---

## 4. Functional Requirements

### 4.1 Authentication

#### 4.1.1 User Registration (Admin Only)
- Admin can create user accounts
- Email + password authentication
- No self-registration (small team, controlled access)

#### 4.1.2 Login
- Email and password login
- "Remember me" option
- Password reset via email

### 4.2 Project Management

#### 4.2.1 Project List (Dashboard)
- View all projects as cards or list
- Filter by status: Draft, Submitted, Successful, Unsuccessful
- Sort by: Date created, Date modified, Name
- Quick stats: Total projects, success rate

#### 4.2.2 Create Project
- Name (e.g., "Sport England - Youth Sailing 2025")
- Funder (optional, for organisation)
- Deadline (optional)
- Auto-create standard document sections (optional)

#### 4.2.3 Project Settings
- Rename project
- Change status
- Archive/delete project

### 4.3 Document Editor

#### 4.3.1 Document List (Sidebar within Project)
- List of documents in project
- Drag to reorder
- Add new document
- Delete document

#### 4.3.2 Document Editor (Main Area)
- Markdown editor with preview
- Auto-save
- Version history (nice to have)
- Word count

#### 4.3.3 Document Actions
- Copy to clipboard
- Export to Word (.docx)
- Export to PDF (nice to have)

### 4.4 AI Chat Assistant

#### 4.4.1 Chat Panel
- Collapsible right panel
- Context-aware (knows which project/document is active)
- Message history per project
- Clear chat option

#### 4.4.2 AI Capabilities
- Answer questions about organisation (from knowledge base)
- Draft document sections
- Rewrite/improve existing content
- Suggest content based on funder requirements
- Cite sources from knowledge base

#### 4.4.3 Insert to Document
- "Insert" button on AI responses
- Inserts at cursor position in active document
- Or replaces selected text

### 4.5 Knowledge Base

#### 4.5.1 File Management
- Upload files (PDF, Word, Excel, TXT)
- View uploaded files list
- Delete files
- File metadata: name, size, upload date, status

#### 4.5.2 Processing Status
- Pending (uploaded, not processed)
- Processing (being vectorised)
- Ready (available for AI)
- Error (processing failed)

#### 4.5.3 File Types Supported
- PDF (.pdf)
- Word (.doc, .docx)
- Excel (.xls, .xlsx) — converted to structured text
- Plain text (.txt)
- Markdown (.md)

### 4.6 Export

#### 4.6.1 Single Document Export
- Copy to clipboard (plain text or markdown)
- Download as Word (.docx)

#### 4.6.2 Full Project Export (Phase 2)
- Export all documents as single Word file
- Export as ZIP of individual files

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load: <2 seconds
- AI response: <30 seconds
- File upload: Feedback within 1 second, processing async

### 5.2 Security
- Individual user authentication
- HTTPS only
- Files stored securely (Supabase Storage)
- No sensitive personal data in knowledge base

### 5.3 Reliability
- Auto-save every 5 seconds when editing
- Graceful error handling
- Offline indication (no offline mode)

### 5.4 Cost
- Target: <£50/month at current usage
- OpenAI API: ~£20-30/month
- Supabase: Free tier initially
- Vercel: Free tier

---

## 6. Technical Architecture

### 6.1 Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Frontend | Next.js 16 (App Router) | React, TypeScript |
| Styling | Tailwind CSS + shadcn/ui | Component library |
| Backend | Next.js API Routes | Serverless functions |
| Database | Supabase (PostgreSQL) | Auth, data, realtime |
| File Storage | Supabase Storage | Original files |
| AI | OpenAI Assistants API | GPT-4o + file search |
| Hosting | Vercel | Automatic deployments |

### 6.2 Database Schema

```sql
-- Users (managed by Supabase Auth)
-- Supabase creates auth.users automatically

-- User profiles (extends auth)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'member', -- 'admin' | 'member'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects (grant applications)
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  funder TEXT,
  deadline DATE,
  status TEXT DEFAULT 'draft', -- 'draft' | 'submitted' | 'successful' | 'unsuccessful' | 'archived'
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents (sections within projects)
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base files
CREATE TABLE knowledge_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Supabase Storage path
  file_size INTEGER,
  mime_type TEXT,
  openai_file_id TEXT, -- OpenAI file ID after upload
  openai_status TEXT DEFAULT 'pending', -- 'pending' | 'processing' | 'ready' | 'error'
  error_message TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages (per project)
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OpenAI Assistant thread mapping
CREATE TABLE assistant_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE UNIQUE,
  thread_id TEXT NOT NULL, -- OpenAI thread ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.3 OpenAI Integration

**Assistant Configuration:**
- Model: gpt-4o
- Tools: File search enabled
- Vector store: Single store for all knowledge base files

**System Instructions:**
```
You are a grant writing assistant for Shadwell Basin Outdoor Activity Centre, a youth charity in East London that has been running for 50 years.

Your role is to help staff write compelling grant applications by:
1. Drawing on the organisation's documented history, outcomes, and impact data
2. Writing in their established voice and style (warm, professional, outcome-focused)
3. Providing accurate information from uploaded documents only — never invent statistics or facts

When drafting grant content:
- Be specific with numbers and outcomes where documentation supports it
- Emphasise their unique long-term youth development approach
- Match the tone to the funder (more formal for statutory, warmer for trusts)
- Flag when you're uncertain or don't have data to support a claim

Always cite which document you're drawing information from when providing specific facts or figures.

Current context: The user is working on a grant application. Help them draft sections, answer questions about their organisation, and improve their writing.
```

### 6.4 File Processing Flow

```
1. User uploads file
   ↓
2. File saved to Supabase Storage
   ↓
3. Record created in knowledge_files (status: pending)
   ↓
4. Background job triggered
   ↓
5. File uploaded to OpenAI Files API
   ↓
6. File added to Assistant's vector store
   ↓
7. Status updated to 'ready'
```

### 6.5 API Routes

```
/api/auth/*           -- Handled by Supabase Auth
/api/projects         -- CRUD for projects
/api/projects/[id]/documents  -- CRUD for documents
/api/projects/[id]/chat       -- Send message, get response
/api/knowledge        -- List, upload, delete files
/api/export/[docId]   -- Export document to Word
```

---

## 7. User Interface

### 7.1 Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Logo    Shadwell Basin Grant Assistant              [User] [Settings] │
├────────────┬───────────────────────────────────────────┬────────────────┤
│            │                                           │                │
│  SIDEBAR   │           MAIN AREA                       │  CHAT PANEL    │
│  (240px)   │           (flexible)                      │  (360px)       │
│            │                                           │                │
│            │                                           │  Collapsible   │
│            │                                           │                │
├────────────┴───────────────────────────────────────────┴────────────────┤
│  Footer / Status bar (optional)                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Key Screens

#### Dashboard (/)
- Project cards grid
- "New Project" button
- Quick access to Knowledge Base

#### Project View (/projects/[id])
- Document list in sidebar
- Document editor in main area
- Chat panel on right

#### Knowledge Base (/knowledge)
- File list with status indicators
- Upload dropzone
- Delete confirmation

#### Settings (/settings)
- User profile
- (Admin) User management

### 7.3 Responsive Behaviour

- **Desktop (>1280px):** Full 3-column layout
- **Tablet (768-1280px):** Chat panel as overlay/drawer
- **Mobile (<768px):** Single column, bottom sheet for chat

---

## 8. Implementation Plan

### Phase 1: Foundation (3-4 days)

- [ ] Set up Supabase project (database + auth + storage)
- [ ] Implement authentication (login, logout, protected routes)
- [ ] Create database schema and migrations
- [ ] Build basic layout shell (sidebar, main, chat panel)
- [ ] Project CRUD (list, create, view, delete)

### Phase 2: Documents (2-3 days)

- [ ] Document list within project
- [ ] Markdown editor with auto-save
- [ ] Document CRUD
- [ ] Copy to clipboard
- [ ] Export to Word (.docx)

### Phase 3: Knowledge Base (2-3 days)

- [ ] File upload UI
- [ ] Supabase Storage integration
- [ ] OpenAI file upload + vector store
- [ ] Processing status display
- [ ] File deletion (both storage and OpenAI)

### Phase 4: AI Chat (2-3 days)

- [ ] Chat panel UI
- [ ] OpenAI Assistants integration
- [ ] Thread management per project
- [ ] Message streaming
- [ ] "Insert to document" action

### Phase 5: Polish (2 days)

- [ ] Loading states and error handling
- [ ] Mobile responsive adjustments
- [ ] User onboarding / empty states
- [ ] Documentation for users

### Total Estimate: 11-15 days

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hallucinated statistics | High | Strong system prompt, cite sources, user verification |
| OpenAI API costs spike | Medium | Monitor usage, set alerts, usage caps |
| User finds it too complex | High | Keep UI minimal, training session, iterate on feedback |
| File processing fails | Medium | Clear error states, retry mechanism, manual fallback |
| Supabase free tier limits | Low | Monitor usage, upgrade path clear |

---

## 10. Future Considerations (Out of Scope)

- Multi-organisation / true multi-tenancy
- Grant opportunity discovery / matching
- Direct integration with funder portals
- Collaborative editing (real-time)
- Budget calculator / financial tools
- Template library (cross-organisation)

---

## Appendix: Discovery Call Notes (2026-02-04)

**Attendees:** Mike Wardle (Director), Jan (Deputy), Matt

**Key insights:**
- 16-17 applications/year, 85-90% success rate
- Bottleneck is TIME, not skill
- Could apply for 3x more with capacity
- Each grant different: own portal, format, criteria, budget template
- ~Half are repeat/relationship-based, half competitive
- Success factors: alignment, quality info, conveying unique mission, relationships
- Data in shared drive: Excel spreadsheets, annual reports, past grants as templates
- Mike: zero AI experience
- Competitor: Plinth (have basic account, not using it)
