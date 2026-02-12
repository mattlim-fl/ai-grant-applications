# CLAUDE.md

> **For AI assistants working on this codebase.** Read this file first.

## Project Summary

AI-powered grant application workspace for **Shadwell Basin Outdoor Activity Centre** — a youth charity in East London. Pro bono project.

**Goal:** Help a time-strapped team (who are already excellent at grants) apply for more funding by giving them:
1. An organised workspace for all their grant applications
2. An AI assistant that knows their organisation inside-out
3. Simple tools to draft, edit, and export application sections

**Users:** Mike (Director, zero AI experience), Jan (Deputy), Daniel (Trustee)

---

## Quick Start

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Lint check
```

---

## Documentation

Read these before making changes:

| Document | Purpose |
|----------|---------|
| `/docs/PRD.md` | Product requirements, user needs, success criteria |
| `/docs/ERD.md` | Database schema, relationships, SQL migrations |
| `/docs/ARCHITECTURE.md` | System design, tech stack, data flows |
| `/docs/API.md` | API routes, request/response formats |
| `/docs/DESIGN.md` | UI components, design system, wireframes |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI | OpenAI Assistants API (GPT-4o) |
| Hosting | Vercel |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login)
│   ├── (app)/              # Protected app pages
│   │   ├── page.tsx        # Dashboard
│   │   ├── projects/       # Project views
│   │   └── knowledge/      # Knowledge base
│   └── api/                # API routes
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Sidebar, ChatPanel
│   ├── editor/             # Document editor
│   ├── projects/           # Project cards
│   └── knowledge/          # File upload
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── openai/             # OpenAI client & helpers
│   └── utils.ts            # Utilities
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript types

docs/                       # Documentation
supabase/migrations/        # Database migrations
```

---

## Key Patterns

### Data Fetching
- Server Components for initial data
- React Query for client-side mutations
- Optimistic updates where appropriate

### Authentication
- Supabase Auth with SSR
- Middleware protects `/app/*` routes
- Session in cookies (httpOnly)

### File Handling
- Upload to Supabase Storage first
- Then push to OpenAI for vectorisation
- Track status in `knowledge_files` table

### Chat/AI
- One OpenAI thread per project
- Stream responses via Server-Sent Events
- Store messages in `chat_messages` table

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=
OPENAI_VECTOR_STORE_ID=
```

---

## Database

See `/docs/ERD.md` for full schema. Key tables:

- `profiles` — User profiles (extends Supabase auth)
- `projects` — Grant applications
- `documents` — Sections within projects
- `knowledge_files` — Uploaded org documents
- `chat_messages` — Chat history per project
- `assistant_threads` — OpenAI thread IDs

All tables have RLS enabled. Single-tenant (all authenticated users see all data).

---

## Commands for Common Tasks

### Add a shadcn/ui component
```bash
npx shadcn@latest add [component]
```

### Generate Supabase types
```bash
npx supabase gen types typescript --project-id [id] > src/types/database.ts
```

### Run Supabase migrations
```bash
npx supabase db push
```

---

## Code Style

- **TypeScript:** Strict mode, no `any`
- **Components:** Functional, with explicit prop types
- **Naming:** PascalCase for components, camelCase for functions/variables
- **Files:** kebab-case for filenames
- **Imports:** Absolute imports via `@/`

### Component Template
```tsx
"use client"; // Only if needed

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ComponentProps {
  title: string;
  className?: string;
}

export function Component({ title, className }: ComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className={cn("base-styles", className)}>
      {title}
    </div>
  );
}
```

---

## Testing Approach

- Manual testing for MVP (no automated tests yet)
- Test all user flows before shipping
- Check mobile responsiveness
- Verify auth flows work correctly

---

## Deployment

1. Push to `main` branch
2. Vercel auto-deploys
3. Set env vars in Vercel dashboard
4. Run Supabase migrations manually

---

## Current Status

### ✅ Done
- [x] Project structure
- [x] Design system
- [x] Layout shell (header, sidebar, chat panel)
- [x] Dashboard with project cards
- [x] Project view with document editor
- [x] Knowledge base UI
- [x] Mock data for demo

### 🚧 To Build
- [ ] Supabase setup & migrations
- [ ] Authentication flow
- [ ] Real data fetching (replace mocks)
- [ ] OpenAI Assistant integration
- [ ] File upload processing
- [ ] Chat with streaming
- [ ] Export to Word

---

## Design Decisions

### Why OpenAI Assistants API (not raw completions)?
- Built-in file search (RAG)
- Thread management for conversation history
- Simpler than building our own vector store

### Why Supabase (not Firebase/Planetscale)?
- PostgreSQL with RLS = simple auth + security
- Built-in storage
- Generous free tier
- Good DX

### Why single-tenant (not multi-org)?
- Shadwell Basin is the only user
- Simpler RLS policies
- Can add multi-tenancy later if needed

---

## Gotchas

1. **OpenAI file processing is async** — Files take 10-60 seconds to process. Poll status or use webhooks.

2. **Supabase Storage paths** — Include user ID in path to avoid collisions.

3. **Chat streaming** — Use Server-Sent Events, not WebSockets. Vercel edge functions support SSE.

4. **Auto-save** — Debounce saves to avoid hammering the database. 5 seconds is a good interval.

5. **Word export** — Use `docx` npm package. Handle markdown → docx conversion carefully.

---

## Contact

- **Project lead:** Matt Lim
- **Client:** Shadwell Basin (Mike Wardle)
- **Repo:** https://github.com/mattlim-fl/ai-grant-applications
