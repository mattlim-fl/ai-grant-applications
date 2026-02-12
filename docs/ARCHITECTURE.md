# Architecture
## AI Grant Applications — Shadwell Basin

**Version:** 0.1  
**Date:** 2026-02-12

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                   │
│                         Next.js 16 (App Router)                         │
│                     Deployed on Vercel (Edge)                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            API LAYER                                    │
│                      Next.js API Routes                                 │
│              /api/projects, /api/documents, /api/chat, etc.            │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌───────────────────────┐ ┌─────────────────┐ ┌─────────────────────────┐
│      SUPABASE         │ │     OPENAI      │ │    SUPABASE STORAGE     │
│     (PostgreSQL)      │ │  Assistants API │ │   (S3-compatible)       │
├───────────────────────┤ ├─────────────────┤ ├─────────────────────────┤
│ • Auth (users)        │ │ • GPT-4o        │ │ • Knowledge files       │
│ • profiles            │ │ • File Search   │ │ • Exports (temp)        │
│ • projects            │ │ • Vector Store  │ │                         │
│ • documents           │ │ • Threads       │ │                         │
│ • knowledge_files     │ │                 │ │                         │
│ • chat_messages       │ │                 │ │                         │
│ • assistant_threads   │ │                 │ │                         │
└───────────────────────┘ └─────────────────┘ └─────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 16 | React framework with App Router |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **Components** | shadcn/ui | Accessible component library |
| **Auth** | Supabase Auth | User authentication |
| **Database** | Supabase (PostgreSQL) | Data persistence |
| **Storage** | Supabase Storage | File storage |
| **AI** | OpenAI Assistants API | Chat + RAG |
| **Hosting** | Vercel | Edge deployment |

---

## 3. Frontend Architecture

### 3.1 Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, register)
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (app)/                    # Protected app routes
│   │   ├── layout.tsx            # App shell with sidebar
│   │   ├── page.tsx              # Dashboard
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Project editor
│   │   │   └── new/
│   │   │       └── page.tsx      # New project form
│   │   ├── knowledge/
│   │   │   └── page.tsx          # Knowledge base
│   │   └── settings/
│   │       └── page.tsx          # User settings
│   ├── api/                      # API routes
│   │   ├── projects/
│   │   ├── documents/
│   │   ├── chat/
│   │   ├── knowledge/
│   │   └── export/
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # App shell components
│   ├── editor/                   # Document editor
│   ├── chat/                     # Chat panel
│   ├── projects/                 # Project cards, forms
│   └── knowledge/                # File upload, list
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   ├── openai/
│   │   ├── client.ts             # OpenAI client
│   │   ├── assistant.ts          # Assistant helpers
│   │   └── files.ts              # File upload helpers
│   └── utils.ts                  # Utility functions
├── hooks/                        # Custom React hooks
│   ├── use-projects.ts
│   ├── use-documents.ts
│   └── use-chat.ts
└── types/                        # TypeScript types
    ├── database.ts               # Supabase types (generated)
    └── index.ts                  # App types
```

### 3.2 State Management

- **Server State:** React Query (TanStack Query) for data fetching/caching
- **Client State:** React useState/useReducer for UI state
- **Form State:** React Hook Form for forms
- **URL State:** Next.js useSearchParams for filters

### 3.3 Key Patterns

**Data Fetching:**
- Server Components for initial data load
- Client Components with React Query for mutations
- Optimistic updates for better UX

**Auth:**
- Supabase Auth with SSR support
- Middleware for protected routes
- Server-side session validation

**Real-time (optional):**
- Supabase Realtime for document collaboration
- Not required for MVP

---

## 4. API Architecture

### 4.1 Route Conventions

```
/api/[resource]             GET (list), POST (create)
/api/[resource]/[id]        GET (read), PATCH (update), DELETE
/api/[resource]/[id]/[sub]  Nested resources
```

### 4.2 Request/Response Format

**Request:**
```typescript
// Headers
Content-Type: application/json
Authorization: Bearer <supabase-session-token>

// Body (POST/PATCH)
{
  "field": "value"
}
```

**Response:**
```typescript
// Success (200/201)
{
  "data": { ... },
  "error": null
}

// Error (4xx/5xx)
{
  "data": null,
  "error": {
    "message": "Human readable error",
    "code": "ERROR_CODE"
  }
}
```

### 4.3 Authentication Flow

```
1. Client sends request with Supabase session token
2. API route extracts token from cookies/headers
3. Supabase server client validates session
4. If valid, proceed with request
5. If invalid, return 401 Unauthorized
```

---

## 5. Database Architecture

### 5.1 Supabase Setup

- **Project:** Single Supabase project
- **Region:** eu-west-2 (London) for lowest latency
- **Plan:** Free tier initially, upgrade as needed

### 5.2 Connection Pooling

- Use Supabase's built-in connection pooler
- Transaction mode for serverless (API routes)
- Session mode not needed (no prepared statements)

### 5.3 Migrations

```
supabase/
└── migrations/
    ├── 20260212000000_initial_schema.sql
    ├── 20260212000001_rls_policies.sql
    └── 20260212000002_storage_buckets.sql
```

Run migrations:
```bash
supabase db push        # Push to remote
supabase db reset       # Reset local
```

---

## 6. AI Architecture

### 6.1 OpenAI Assistants Setup

```
┌─────────────────────────────────────────────────────────────────────┐
│                        OPENAI ACCOUNT                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐    │
│  │     ASSISTANT       │    │        VECTOR STORE             │    │
│  │  "Shadwell Basin    │───▶│   "shadwell-basin-knowledge"   │    │
│  │   Grant Writer"     │    │                                 │    │
│  │                     │    │  • Annual Report 2024.pdf      │    │
│  │  Model: gpt-4o      │    │  • Safeguarding Policy.docx    │    │
│  │  Tools: file_search │    │  • Constitution.pdf            │    │
│  └─────────────────────┘    │  • ...                         │    │
│                             └─────────────────────────────────┘    │
│                                                                     │
│  ┌─────────────────────┐                                           │
│  │      THREADS        │  One per project                          │
│  │  thread_abc123...   │  Maintains conversation history           │
│  │  thread_def456...   │                                           │
│  └─────────────────────┘                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 Chat Flow

```
1. User sends message
2. API receives message
3. Get or create thread for project
4. Add message to thread
5. Run assistant on thread
6. Stream response back to client
7. Store message in chat_messages table
```

### 6.3 File Processing Flow

```
1. User uploads file
2. File saved to Supabase Storage
3. Record created in knowledge_files (status: pending)
4. API triggers processing:
   a. Download from Supabase Storage
   b. Upload to OpenAI Files API
   c. Add file to Vector Store
   d. Update status to 'ready'
5. File now available for AI context
```

### 6.4 System Prompt

See `/lib/openai/assistant.ts` for full prompt. Key elements:
- Organisation context (Shadwell Basin)
- Writing style guidelines
- Citation requirements
- Hallucination prevention

---

## 7. File Storage Architecture

### 7.1 Supabase Storage

```
Bucket: knowledge-files
├── {user_id}/
│   ├── {file_id}_annual-report-2024.pdf
│   ├── {file_id}_safeguarding-policy.docx
│   └── ...
```

### 7.2 File Lifecycle

```
Upload → Supabase Storage → OpenAI Files → Vector Store → Ready

Delete → Remove from Vector Store → Delete from OpenAI → Delete from Storage
```

### 7.3 Supported File Types

| Type | Extensions | Max Size |
|------|------------|----------|
| PDF | .pdf | 10MB |
| Word | .doc, .docx | 10MB |
| Excel | .xls, .xlsx | 10MB |
| Text | .txt, .md | 5MB |

---

## 8. Deployment Architecture

### 8.1 Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Preview | *.vercel.app | PR previews |
| Production | grants.shadwellbasin.org (TBD) | Live site |

### 8.2 Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ASSISTANT_ID=asst_...
OPENAI_VECTOR_STORE_ID=vs_...

# App
NEXT_PUBLIC_APP_URL=https://...
```

### 8.3 CI/CD

```
Push to GitHub → Vercel Build → Deploy

main branch → Production
PR branches → Preview deployments
```

---

## 9. Security Considerations

### 9.1 Authentication
- Supabase Auth handles all auth
- JWT tokens validated server-side
- Session cookies are httpOnly

### 9.2 Authorization
- Row Level Security (RLS) on all tables
- All users in same org (single-tenant)
- Future: Role-based access (admin vs member)

### 9.3 Data Protection
- All traffic over HTTPS
- Files stored encrypted at rest (Supabase)
- No PII in knowledge base (org docs only)
- OpenAI data handling per their DPA

### 9.4 API Security
- Rate limiting via Vercel
- Input validation on all endpoints
- SQL injection prevented by Supabase client

---

## 10. Monitoring & Observability

### 10.1 Logging
- Vercel function logs
- Supabase query logs
- OpenAI usage tracked in dashboard

### 10.2 Error Tracking
- Vercel error tracking (built-in)
- Consider Sentry for production

### 10.3 Analytics
- Vercel Analytics (optional)
- Basic usage metrics in app

### 10.4 Cost Monitoring
- OpenAI usage dashboard
- Supabase usage dashboard
- Set billing alerts

---

## 11. Performance Considerations

### 11.1 Frontend
- Static generation where possible
- Streaming for AI responses
- Image optimisation (next/image)
- Code splitting (automatic with Next.js)

### 11.2 API
- Edge functions for low latency
- Connection pooling for database
- Streaming responses for chat

### 11.3 Database
- Indexes on frequently queried columns
- RLS policies are performant
- Consider read replicas if needed (unlikely)

---

## 12. Future Considerations

### 12.1 Scalability
- Current architecture supports 100s of concurrent users
- Supabase handles scaling automatically
- OpenAI rate limits may need management

### 12.2 Multi-tenancy
- Current: Single organisation
- Future: Add org_id to all tables
- Separate vector stores per organisation

### 12.3 Offline Support
- Not planned for MVP
- Could add with service workers
- Would need conflict resolution
