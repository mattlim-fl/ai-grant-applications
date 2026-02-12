# CLAUDE.md

## Project Overview

AI-powered grant application tool for Shadwell Basin Outdoor Activity Centre — a youth charity in East London. Pro bono project.

**Goal:** Help a time-strapped team (who are already good at grants) apply for more funding by giving them an AI assistant that knows their organisation inside-out.

## Tech Stack

- **Backend:** OpenAI Assistants API with file search
- **Frontend:** Next.js (App Router)
- **Hosting:** Vercel
- **Auth:** Simple password protection (no user accounts needed)

## Key Commands

```bash
npm install          # Install dependencies
npm run dev          # Local dev server
npm run build        # Production build
npm run lint         # Lint check
```

## Project Structure

```
/app                 # Next.js app router pages
/components          # React components
/lib                 # Utilities, OpenAI client, assistant config
/docs                # PRD and documentation
/scripts             # Data ingestion scripts
```

## Environment Variables

```
OPENAI_API_KEY=      # OpenAI API key
ASSISTANT_ID=        # OpenAI Assistant ID (created via script or dashboard)
APP_PASSWORD=        # Simple password for access
```

## OpenAI Assistant Setup

The assistant should be configured with:
- **Model:** gpt-4o
- **Tools:** File search enabled
- **Instructions:** See `/lib/assistant-instructions.txt`

Files to upload to the assistant's vector store:
- Past successful grant applications
- Annual reports
- Constitution & policies
- Budget templates
- Standard "about us" content

## Design Principles

1. **Dead simple UI** — Mike (the director) has zero AI experience
2. **Grant-writing focused** — Not a general chatbot, optimised for drafting applications
3. **Their voice** — Should sound like Shadwell Basin, not generic AI
4. **Export-ready** — Output needs to go into Word docs and grant portals

## User Flows

1. **Ask about their data** — "What youth outcomes did we achieve last year?"
2. **Draft grant sections** — "Write the 'need' section for a Sport England application"
3. **Full application** — "Help me complete this application form" (paste criteria)

## Development Notes

- Keep it minimal — this is pro bono, ship fast
- No database needed initially (Assistants API handles state)
- Can add usage tracking later if needed
