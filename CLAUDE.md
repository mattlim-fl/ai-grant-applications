# CLAUDE.md

## Project Overview

AI-powered grant application workspace for Shadwell Basin Outdoor Activity Centre — a youth charity in East London. Pro bono project.

**Goal:** Help a time-strapped team (who are already good at grants) apply for more funding by giving them:
1. An organised workspace for all their grant applications
2. An AI assistant that knows their organisation inside-out
3. Simple tools to draft, edit, and export application sections

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **File Storage:** Supabase Storage
- **AI:** OpenAI Assistants API (GPT-4o + file search)
- **Hosting:** Vercel

## Key Commands

```bash
npm install          # Install dependencies
npm run dev          # Local dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Lint check
npm run db:migrate   # Run Supabase migrations (if using CLI)
```

## Project Structure

```
/src
  /app                    # Next.js App Router
    /api                  # API routes
    /(auth)               # Auth pages (login, etc.)
    /(app)                # Authenticated app pages
      /projects           # Project list & views
      /knowledge          # Knowledge base management
      /settings           # User settings
  /components
    /ui                   # shadcn/ui components
    /chat                 # Chat panel components
    /editor               # Document editor components
    /layout               # Layout components (header, sidebar)
    /projects             # Project-related components
    /knowledge            # Knowledge base components
  /lib
    /supabase             # Supabase client & helpers
    /openai               # OpenAI client & assistant config
    /utils                # Utility functions
  /types                  # TypeScript types

/docs                     # Documentation
/supabase
  /migrations             # Database migrations
```

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # Server-side only

# OpenAI
OPENAI_API_KEY=
OPENAI_ASSISTANT_ID=           # Created via dashboard or script
OPENAI_VECTOR_STORE_ID=        # For knowledge base files
```

## Database Schema

See `/docs/PRD.md` for full schema. Key tables:

- `profiles` — User profiles (extends Supabase auth.users)
- `projects` — Grant applications
- `documents` — Sections within projects
- `knowledge_files` — Uploaded organisation documents
- `chat_messages` — Chat history per project
- `assistant_threads` — OpenAI thread IDs per project

## OpenAI Setup

### Assistant Configuration

Create an Assistant in the OpenAI dashboard or via API:

- **Model:** gpt-4o
- **Tools:** File search enabled
- **Vector Store:** Create one for knowledge base files

### System Instructions

See `/docs/PRD.md` for full system prompt. Key points:
- Write in Shadwell Basin's voice (warm, professional, outcome-focused)
- Only use facts from uploaded documents — never hallucinate
- Cite sources when providing statistics
- Match tone to funder type

## Key Flows

### 1. User Authentication
```
Login → Supabase Auth → Create/fetch profile → Redirect to dashboard
```

### 2. Create Project
```
Click "New Project" → Enter name/funder/deadline → Create project record
→ Optionally create default document sections
```

### 3. Edit Document
```
Select document → Load content → Edit in textarea → Auto-save to Supabase
```

### 4. Chat with AI
```
Send message → Get/create OpenAI thread for project
→ Run assistant with file search → Stream response → Display
→ User can "Insert" response into active document
```

### 5. Upload Knowledge File
```
Drop file → Upload to Supabase Storage → Create knowledge_files record
→ Background: Upload to OpenAI Files API → Add to vector store
→ Update status to "ready"
```

### 6. Export Document
```
Click "Export" → Generate .docx from markdown → Download
```

## Design Principles

1. **Dead simple UI** — Mike (the director) has zero AI experience
2. **Workspace first** — Documents are the product, chat supports the writing
3. **Their voice** — Output should sound like Shadwell Basin, not generic AI
4. **Export-ready** — Content flows easily into Word docs and grant portals

## Component Library

Using shadcn/ui. Add components with:

```bash
npx shadcn@latest add [component-name]
```

Installed: `button`, `input`, `card`, `scroll-area`, `avatar`

## Development Notes

- Auto-save documents every 5 seconds when content changes
- Use Supabase realtime for optimistic updates (optional)
- Stream AI responses for better UX
- Keep chat context scoped to current project
- Process file uploads asynchronously (don't block UI)

## Deployment

1. Push to GitHub (auto-deploys to Vercel)
2. Set environment variables in Vercel dashboard
3. Run Supabase migrations in production

## Documentation

- `/docs/PRD.md` — Full product requirements
- `/docs/DESIGN.md` — Design system and component specs
