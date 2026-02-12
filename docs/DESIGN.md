# Design System
## AI Grant Applications — Shadwell Basin

**Version:** 0.2  
**Date:** 2026-02-12

---

## 1. Design Principles

1. **Approachable, not techy** — Mike has zero AI experience. No jargon, no intimidating interfaces.
2. **Workspace, not chatbot** — This is a productivity tool for writing grants, not a chat novelty.
3. **Content-first** — The grant documents are the product. Everything else supports the writing.
4. **Accessible** — Good contrast, readable fonts, works on tablet (Mike might use iPad).

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| CSS Framework | Tailwind CSS v4 | Utility-first, fast iteration |
| Component Library | shadcn/ui | Beautiful, accessible, copy-paste |
| Icons | Lucide React | Clean, consistent |
| Fonts | Geist (UI) | Modern, readable, ships with Next.js |
| Editor | Textarea + Markdown preview | Simple, no complex editor dependencies |

---

## 3. Layout

### 3.1 Desktop Layout (≥1280px)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (h-14)                                                          │
├────────────┬───────────────────────────────────────────┬────────────────┤
│            │                                           │                │
│  SIDEBAR   │              MAIN                         │  CHAT PANEL    │
│  (w-64)    │              (flex-1)                     │  (w-96)        │
│            │                                           │                │
│  240px     │              flexible                     │  384px         │
│  fixed     │                                           │  collapsible   │
│            │                                           │                │
└────────────┴───────────────────────────────────────────┴────────────────┘
```

### 3.2 Tablet Layout (768px - 1279px)

- Sidebar: Collapsible (hamburger menu)
- Chat panel: Slide-over drawer from right
- Main area: Full width when panels hidden

### 3.3 Mobile Layout (<768px)

- Single column
- Bottom navigation for key actions
- Chat as full-screen modal

---

## 4. Colour Palette

### Primary — Ocean

Warm teal inspired by water/sailing. Friendly, not corporate.

| Name | Value | CSS Variable | Usage |
|------|-------|--------------|-------|
| Ocean | `oklch(0.52 0.105 175)` | `--ocean` | Primary buttons, links, accents |
| Ocean Light | `oklch(0.62 0.13 175)` | `--ocean-light` | Hover states |
| Ocean Dark | `oklch(0.42 0.09 175)` | `--ocean-dark` | Active states, focus |

### Neutrals — Slate

| Name | Value | Usage |
|------|-------|-------|
| Slate 50 | `#F8FAFC` | Page background |
| Slate 100 | `#F1F5F9` | Card backgrounds, sidebar |
| Slate 200 | `#E2E8F0` | Borders, dividers |
| Slate 300 | `#CBD5E1` | Disabled states |
| Slate 400 | `#94A3B8` | Placeholder text |
| Slate 500 | `#64748B` | Secondary text |
| Slate 700 | `#334155` | Primary text |
| Slate 900 | `#0F172A` | Headings |

### Semantic

| Name | Value | Usage |
|------|-------|-------|
| Success | `#16A34A` | Success states, "Ready" status |
| Warning | `#CA8A04` | Warning states, "Processing" status |
| Error | `#DC2626` | Error states |

---

## 5. Typography

### Font

Geist Sans (ships with Next.js) — clean, modern, excellent readability.

### Scale

| Element | Class | Weight | Usage |
|---------|-------|--------|-------|
| Page Title | `text-2xl` | 600 | Dashboard title |
| Section Title | `text-lg` | 600 | Card headers, panel titles |
| Body | `text-base` | 400 | Default text |
| Small | `text-sm` | 400 | Secondary info, metadata |
| Tiny | `text-xs` | 500 | Labels, badges |

### Document Editor

| Element | Class | Notes |
|---------|-------|-------|
| Editor text | `text-base leading-relaxed` | Comfortable reading |
| Markdown H1 | `text-2xl font-bold` | In preview |
| Markdown H2 | `text-xl font-semibold` | In preview |
| Markdown body | `text-base` | In preview |

---

## 6. Spacing

Consistent spacing using Tailwind's scale:

| Context | Value | Usage |
|---------|-------|-------|
| `gap-1` | 4px | Tight groupings (icon + label) |
| `gap-2` | 8px | Related elements |
| `gap-3` | 12px | List items |
| `gap-4` | 16px | Section spacing |
| `gap-6` | 24px | Card padding, major sections |
| `gap-8` | 32px | Page sections |

### Panel Padding

- Sidebar: `p-4`
- Main area: `p-6`
- Chat panel: `p-4`
- Cards: `p-4` or `p-6`

---

## 7. Components

### 7.1 Header

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [≡] 🔱 Shadwell Basin                              [User ▼] [⚙️]        │
└─────────────────────────────────────────────────────────────────────────┘
```

- Height: `h-14` (56px)
- Background: `bg-white border-b border-slate-200`
- Logo + title left, user menu right
- Hamburger on mobile/tablet

### 7.2 Sidebar

```
┌────────────────┐
│ 📁 Projects    │  ← Section header
├────────────────┤
│ + New Project  │  ← Action button
├────────────────┤
│ ● Sport England│  ← Active project
│ ○ BBC CiN      │  ← Other project
│ ○ Lottery Fund │
├────────────────┤
│                │
│ 📚 Knowledge   │  ← Section header
│    Base        │
│                │
│ ○ Annual Report│  ← Files (collapsed)
│ ○ Policies     │
│ ↳ 4 files      │
└────────────────┘
```

- Width: `w-64` (256px)
- Background: `bg-slate-50`
- Border: `border-r border-slate-200`
- Sections: Projects, Knowledge Base

### 7.3 Project Card (Dashboard)

```
┌────────────────────────────────┐
│ Sport England Youth Sailing    │
│ 2025                           │
│                                │
│ 📅 Due: 15 Mar 2025           │
│ 📝 4 sections                  │
│                                │
│ [Draft ●]            Updated 2h│
└────────────────────────────────┘
```

- Background: `bg-white`
- Border: `border border-slate-200 rounded-xl`
- Hover: `hover:border-ocean hover:shadow-md`
- Padding: `p-5`

### 7.4 Document List (Project Sidebar)

```
┌────────────────┐
│ Sections       │
├────────────────┤
│ ≡ About Us    ✓│  ← Drag handle, complete indicator
│ ≡ Need         │
│ ≡ Project      │
│ ≡ Budget       │
├────────────────┤
│ + Add section  │
└────────────────┘
```

- Active: `bg-ocean/10 text-ocean border-l-2 border-ocean`
- Hover: `bg-slate-100`
- Drag handle: `⋮⋮` or `≡`

### 7.5 Document Editor

```
┌─────────────────────────────────────────────────────────────┐
│ About Us                                    [Copy] [Export] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  # About Shadwell Basin                                     │
│                                                             │
│  For over 50 years, Shadwell Basin Outdoor Activity        │
│  Centre has been transforming the lives of young people    │
│  in East London...                                          │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ 234 words · Saved                                           │
└─────────────────────────────────────────────────────────────┘
```

- Full height textarea or split edit/preview
- Monospace option for editing
- Status bar: word count, save status

### 7.6 Chat Panel

```
┌─────────────────────────────────┐
│ AI Assistant           [−] [×] │  ← Minimize, close
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐│
│ │ How can I help with this    ││
│ │ application?                ││
│ └─────────────────────────────┘│
│                                 │
│         ┌─────────────────────┐│
│         │ Draft an about us   ││  ← User message (right)
│         │ section             ││
│         └─────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ Based on your annual report ││  ← Assistant message
│ │ ...                         ││
│ │ [Insert ↓] [Copy]           ││  ← Actions
│ └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│ ┌───────────────────────┐[Send]│
│ │ Ask something...      │      │
│ └───────────────────────┘      │
└─────────────────────────────────┘
```

- Width: `w-96` (384px)
- Background: `bg-white`
- Border: `border-l border-slate-200`
- Collapsible: Slide out to right

### 7.7 Chat Messages

**User Message:**
- Align: Right
- Background: `bg-ocean text-white`
- Radius: `rounded-2xl rounded-br-md`
- Max width: 85%

**Assistant Message:**
- Align: Left
- Background: `bg-slate-100`
- Radius: `rounded-2xl rounded-bl-md`
- Actions: Insert, Copy (appear below)

**Insert Button:**
- Inserts content into active document
- `bg-ocean text-white` or `variant="outline"`

### 7.8 Knowledge Base File List

```
┌──────────────────────────────────────────────────────────────┐
│ 📄 Annual Report 2024.pdf            120 KB    ✓ Ready  [×] │
│ 📄 Safeguarding Policy.docx           45 KB    ✓ Ready  [×] │
│ 📊 Youth Outcomes.xlsx                 8 KB    ⟳ Processing │
│ 📄 Constitution.pdf                   92 KB    ✗ Error  [↻] │
└──────────────────────────────────────────────────────────────┘
```

- Status icons: ✓ Ready (green), ⟳ Processing (yellow), ✗ Error (red)
- Delete: `×` button, confirmation required
- Retry: `↻` on error

### 7.9 Upload Dropzone

```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│                                       │
│      📁 Drop files here or click      │
│                                       │
│      PDF, Word, Excel, TXT            │
│      Max 10MB per file                │
│                                       │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

- Border: `border-2 border-dashed border-slate-300`
- Hover/drag: `border-ocean bg-ocean/5`
- Padding: `p-8`

### 7.10 Status Badges

```
[Draft]        bg-slate-100 text-slate-600
[Submitted]    bg-blue-100 text-blue-700
[Successful]   bg-green-100 text-green-700
[Unsuccessful] bg-red-100 text-red-700
```

---

## 8. Iconography

Using Lucide React throughout:

| Context | Icons |
|---------|-------|
| Navigation | `Home`, `FolderOpen`, `FileText`, `BookOpen`, `Settings` |
| Actions | `Plus`, `Pencil`, `Trash2`, `Copy`, `Download`, `Upload` |
| Status | `Check`, `Loader2`, `AlertCircle`, `Clock` |
| Chat | `Send`, `Sparkles`, `MessageSquare`, `ChevronRight` |
| Project | `Calendar`, `Target`, `FileCheck` |

Size: `h-4 w-4` (16px) for inline, `h-5 w-5` (20px) for buttons.

---

## 9. Motion & Transitions

Keep it subtle — productivity tool, not a showcase.

| Element | Transition |
|---------|------------|
| Hover states | `transition-colors duration-150` |
| Panel open/close | `transition-transform duration-200` |
| Messages appearing | `animate-in fade-in slide-in-from-bottom-2 duration-200` |
| Loading spinner | `animate-spin` (Lucide `Loader2`) |

---

## 10. Accessibility

- **Contrast:** All text meets WCAG AA (4.5:1 body, 3:1 large)
- **Focus:** Visible focus rings (`ring-2 ring-ocean ring-offset-2`)
- **Keyboard:** Full keyboard navigation
- **Screen readers:** Proper labels, ARIA where needed
- **Reduced motion:** Respect `prefers-reduced-motion`

---

## 11. Component Checklist

### Layout
- [ ] `AppShell` — Header + Sidebar + Main + Chat wrapper
- [ ] `Header` — Logo, nav, user menu
- [ ] `Sidebar` — Collapsible navigation
- [ ] `ChatPanel` — Collapsible right panel

### Dashboard
- [ ] `ProjectCard` — Project summary card
- [ ] `ProjectGrid` — Grid of project cards
- [ ] `EmptyState` — No projects yet

### Project View
- [ ] `DocumentList` — Sidebar list of documents
- [ ] `DocumentEditor` — Markdown textarea + preview
- [ ] `EditorToolbar` — Title, actions, word count

### Chat
- [ ] `ChatMessage` — User and assistant variants
- [ ] `ChatInput` — Message input with send
- [ ] `ChatActions` — Insert, Copy buttons
- [ ] `LoadingDots` — Typing indicator

### Knowledge Base
- [ ] `FileList` — List of uploaded files
- [ ] `FileRow` — Single file with status
- [ ] `UploadDropzone` — Drag and drop upload
- [ ] `ProcessingStatus` — Status indicator

### Common
- [ ] `StatusBadge` — Draft, Submitted, etc.
- [ ] `ConfirmDialog` — Delete confirmations
- [ ] `Toast` — Success/error notifications

---

## 12. Page Wireframes

### 12.1 Dashboard

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [≡] 🔱 Shadwell Basin                              [Mike ▼] [⚙️]        │
├────────────┬────────────────────────────────────────────────────────────┤
│            │                                                            │
│ Projects   │  Your Applications                    [+ New Project]      │
│ ─────────  │  ─────────────────────────────────────────────────────     │
│            │                                                            │
│ ● All      │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│ ○ Draft    │  │Sport England │ │ BBC CiN      │ │ + New        │       │
│ ○ Submitted│  │Youth Sailing │ │ 2025         │ │   Project    │       │
│ ○ Complete │  │              │ │              │ │              │       │
│            │  │📅 15 Mar     │ │📅 1 Apr      │ │              │       │
│ ─────────  │  │📝 4 sections │ │📝 2 sections │ │              │       │
│            │  │[Draft]       │ │[Draft]       │ │              │       │
│ Knowledge  │  └──────────────┘ └──────────────┘ └──────────────┘       │
│ Base       │                                                            │
│            │                                                            │
│ 📄 6 files │                                                            │
│ [Manage →] │                                                            │
│            │                                                            │
└────────────┴────────────────────────────────────────────────────────────┘
```

### 12.2 Project View

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [≡] 🔱 Shadwell Basin                              [Mike ▼] [⚙️]        │
├────────────┬───────────────────────────────────────────┬────────────────┤
│            │                                           │                │
│ ← Back     │ About Us                   [Copy][Export] │ AI Assistant   │
│            │ ─────────────────────────────────────────│ ────────────── │
│ Sport      │                                           │                │
│ England    │ # About Shadwell Basin                   │ How can I help │
│ ─────────  │                                           │ with this      │
│            │ For over 50 years, Shadwell Basin        │ section?       │
│ Sections   │ Outdoor Activity Centre has been         │                │
│ ● About Us │ transforming the lives of young people   │ ────────────── │
│ ○ Need     │ in East London through outdoor           │                │
│ ○ Project  │ adventure and water sports.              │ [Draft intro]  │
│ ○ Budget   │                                           │                │
│            │ Based in the heart of Tower Hamlets,     │         ┌─────┐│
│ + Add      │ we provide sailing, kayaking,            │ You:    │Write││
│            │ powerboating, and outdoor education      │         │intro││
│            │ to young people who might otherwise      │         └─────┘│
│            │ never experience life on the water.      │                │
│ ─────────  │                                           │ ┌─────────────┐│
│            │                                           │ │Based on your││
│ 📅 15 Mar  │                                           │ │annual report││
│ [Draft]    │                                           │ │...          ││
│            │ ─────────────────────────────────────────│ │[Insert][Copy]││
│            │ 156 words · Saved just now               │ └─────────────┘│
│            │                                           │                │
│            │                                           │ ┌───────┐[Send]│
│            │                                           │ │Ask... │     │
│            │                                           │ └───────┘      │
└────────────┴───────────────────────────────────────────┴────────────────┘
```

### 12.3 Knowledge Base

```
┌─────────────────────────────────────────────────────────────────────────┐
│ [≡] 🔱 Shadwell Basin                              [Mike ▼] [⚙️]        │
├────────────┬────────────────────────────────────────────────────────────┤
│            │                                                            │
│ Projects   │  Knowledge Base                                            │
│ ─────────  │  ─────────────────────────────────────────────────────     │
│            │                                                            │
│ [...]      │  These documents help the AI understand your organisation. │
│            │                                                            │
│ ─────────  │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐      │
│            │  │                                                   │      │
│ Knowledge  │  │     📁 Drop files here or click to upload        │      │
│ Base ←     │  │                                                   │      │
│            │  │     PDF, Word, Excel, TXT · Max 10MB              │      │
│            │  │                                                   │      │
│            │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘      │
│            │                                                            │
│            │  Uploaded Files                                            │
│            │  ───────────────────────────────────────────────────────── │
│            │  📄 Annual Report 2024.pdf        120 KB   ✓ Ready    [×] │
│            │  📄 Safeguarding Policy.docx       45 KB   ✓ Ready    [×] │
│            │  📊 Youth Outcomes 2024.xlsx        8 KB   ⟳ Processing   │
│            │  📄 Constitution.pdf               92 KB   ✓ Ready    [×] │
│            │                                                            │
└────────────┴────────────────────────────────────────────────────────────┘
```

---

## 13. Figma / References

No Figma — moving fast with code.

**Reference UIs:**
- [Notion](https://notion.so) — Sidebar navigation, document structure
- [Linear](https://linear.app) — Clean workspace aesthetic
- [ChatGPT](https://chat.openai.com) — Chat patterns
- [Vercel AI Chatbot](https://github.com/vercel/ai-chatbot) — Next.js patterns
