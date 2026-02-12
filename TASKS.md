# TASKS.md

> Development task tracker. Update as work progresses.

---

## Phase 1: Foundation ⏳

### Supabase Setup
- [ ] Create Supabase project
- [ ] Run initial schema migration
- [ ] Enable RLS policies
- [ ] Create storage bucket
- [ ] Generate TypeScript types
- [ ] Add Supabase clients (browser + server)

### Authentication
- [ ] Install `@supabase/ssr`
- [ ] Create auth middleware
- [ ] Build login page
- [ ] Build signup page (or admin-only invite)
- [ ] Add logout functionality
- [ ] Protected route wrapper
- [ ] User profile page

### Layout Updates
- [ ] Replace mock user in header with real user
- [ ] Handle loading states
- [ ] Handle auth redirects

---

## Phase 2: Projects & Documents 📝

### Projects
- [ ] API: GET /api/projects (list)
- [ ] API: POST /api/projects (create)
- [ ] API: GET /api/projects/[id] (read)
- [ ] API: PATCH /api/projects/[id] (update)
- [ ] API: DELETE /api/projects/[id] (delete)
- [ ] Hook: useProjects()
- [ ] Replace mock data in dashboard
- [ ] Replace mock data in sidebar
- [ ] New project form saves to database
- [ ] Project settings (rename, status, delete)

### Documents
- [ ] API: GET /api/projects/[id]/documents (list)
- [ ] API: POST /api/projects/[id]/documents (create)
- [ ] API: PATCH /api/projects/[id]/documents/[docId] (update)
- [ ] API: DELETE /api/projects/[id]/documents/[docId] (delete)
- [ ] API: POST /api/projects/[id]/documents/reorder
- [ ] Hook: useDocuments(projectId)
- [ ] Replace mock data in project view
- [ ] Auto-save document content
- [ ] Add new document
- [ ] Delete document
- [ ] Drag-to-reorder documents

---

## Phase 3: Knowledge Base 📚

### File Upload
- [ ] API: GET /api/knowledge (list)
- [ ] API: POST /api/knowledge (upload)
- [ ] API: DELETE /api/knowledge/[id] (delete)
- [ ] Hook: useKnowledgeFiles()
- [ ] Supabase Storage upload
- [ ] File type validation
- [ ] File size validation
- [ ] Upload progress indicator

### OpenAI Integration
- [ ] Create OpenAI Assistant (if not exists)
- [ ] Create Vector Store (if not exists)
- [ ] Upload file to OpenAI
- [ ] Add file to Vector Store
- [ ] Update file status in database
- [ ] Handle processing errors
- [ ] Retry failed uploads
- [ ] Delete from OpenAI on file delete

### UI
- [ ] Replace mock data in knowledge base
- [ ] Real-time status updates
- [ ] Error display with retry button

---

## Phase 4: AI Chat 💬

### OpenAI Threads
- [ ] Create thread on first message
- [ ] Store thread ID in assistant_threads
- [ ] Retrieve existing thread for project

### Chat API
- [ ] API: POST /api/projects/[id]/chat (send + stream)
- [ ] API: GET /api/projects/[id]/chat (history)
- [ ] API: DELETE /api/projects/[id]/chat (clear)
- [ ] Streaming response (SSE)
- [ ] Store messages in database
- [ ] Hook: useChat(projectId)

### UI
- [ ] Real chat with OpenAI
- [ ] Streaming message display
- [ ] Loading states
- [ ] Error handling
- [ ] Insert to document (cursor position)
- [ ] Clear chat confirmation

---

## Phase 5: Export 📤

### Word Export
- [ ] Install `docx` package
- [ ] Markdown to DOCX conversion
- [ ] API: GET /api/export/document/[id]
- [ ] API: GET /api/export/project/[id]
- [ ] Download triggers in UI
- [ ] Formatting (headings, lists, bold)

---

## Phase 6: Polish ✨

### UX
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Empty states
- [ ] Confirmation dialogs
- [ ] Keyboard shortcuts

### Mobile
- [ ] Test all pages on mobile
- [ ] Chat panel as bottom sheet
- [ ] Sidebar as drawer
- [ ] Touch-friendly buttons

### Performance
- [ ] Optimistic updates
- [ ] Debounced auto-save
- [ ] Lazy loading
- [ ] Image optimisation

### Documentation
- [ ] User guide / help page
- [ ] Admin documentation
- [ ] Deployment guide

---

## Bugs 🐛

_(Add bugs here as discovered)_

---

## Ideas / Backlog 💡

- [ ] Collaborative editing (multiple users)
- [ ] Version history for documents
- [ ] Grant templates library
- [ ] Deadline reminders
- [ ] Success/failure analytics
- [ ] AI writing suggestions (inline)
- [ ] Import from existing Word docs
- [ ] Integration with funder portals

---

## Completed ✅

- [x] Project scaffolding
- [x] Design system (DESIGN.md)
- [x] PRD documentation
- [x] Layout components (Header, Sidebar, ChatPanel)
- [x] Dashboard page
- [x] Project view page
- [x] Knowledge base page
- [x] New project page
- [x] Mock data for demo
- [x] ERD documentation
- [x] Architecture documentation
- [x] API documentation
- [x] CLAUDE.md for AI assistants
