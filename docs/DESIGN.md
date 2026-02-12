# Design System
## AI Grant Applications — Shadwell Basin

**Version:** 0.1  
**Date:** 2026-02-12

---

## 1. Design Principles

1. **Approachable, not techy** — Mike has zero AI experience. No jargon, no intimidating interfaces.
2. **Calm and focused** — Grant writing is stressful enough. The UI should feel like a helpful colleague, not a complex tool.
3. **Content-first** — The AI responses are the product. Everything else gets out of the way.
4. **Accessible** — Good contrast, readable fonts, works on mobile (Mike might use his phone).

---

## 2. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| CSS Framework | Tailwind CSS | Utility-first, fast iteration, great defaults |
| Component Library | shadcn/ui | Beautiful, accessible, copy-paste components |
| Icons | Lucide React | Clean, consistent, included with shadcn |
| Fonts | Inter (UI) + System | Clean, readable, fast loading |

### Installation

```bash
# Create Next.js app with Tailwind
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Add shadcn/ui
npx shadcn@latest init

# Add components we need
npx shadcn@latest add button input card scroll-area avatar
```

---

## 3. Colour Palette

Warm, friendly, and accessible. Inspired by nature/outdoors (fitting for Shadwell Basin's sailing & outdoor activities).

### Primary Colours

| Name | Hex | Usage |
|------|-----|-------|
| **Ocean** | `#0F766E` | Primary actions, links, accents |
| **Ocean Light** | `#14B8A6` | Hover states, highlights |
| **Ocean Dark** | `#0D5D56` | Active states |

### Neutral Colours

| Name | Hex | Usage |
|------|-----|-------|
| **Slate 50** | `#F8FAFC` | Page background |
| **Slate 100** | `#F1F5F9` | Card backgrounds, input backgrounds |
| **Slate 200** | `#E2E8F0` | Borders, dividers |
| **Slate 500** | `#64748B` | Secondary text |
| **Slate 700** | `#334155` | Primary text |
| **Slate 900** | `#0F172A` | Headings |

### Semantic Colours

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#16A34A` | Success messages |
| **Warning** | `#CA8A04` | Warnings |
| **Error** | `#DC2626` | Error messages |

### Tailwind Config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        ocean: {
          DEFAULT: '#0F766E',
          light: '#14B8A6',
          dark: '#0D5D56',
        },
      },
    },
  },
}
```

---

## 4. Typography

### Font Stack

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
```

### Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Page title) | 24px / `text-2xl` | 600 | 1.3 |
| H2 (Section) | 18px / `text-lg` | 600 | 1.4 |
| Body | 16px / `text-base` | 400 | 1.6 |
| Small / Meta | 14px / `text-sm` | 400 | 1.5 |
| Button | 14px / `text-sm` | 500 | 1 |

### Text Colours

- **Primary text:** `text-slate-700`
- **Secondary text:** `text-slate-500`
- **Headings:** `text-slate-900`
- **Links:** `text-ocean hover:text-ocean-dark`

---

## 5. Spacing

Use Tailwind's default spacing scale. Key values:

| Token | Size | Usage |
|-------|------|-------|
| `p-4` | 16px | Default padding |
| `p-6` | 24px | Card padding |
| `gap-3` | 12px | Between chat messages |
| `gap-4` | 16px | Between sections |
| `my-8` | 32px | Section margins |

---

## 6. Components

### 6.1 Chat Message

Two variants: **User** and **Assistant**

```
┌─────────────────────────────────────────────────────┐
│ [Avatar]  Assistant                                 │
│                                                     │
│  Based on your 2024 Annual Report, Shadwell Basin   │
│  engaged 1,247 young people last year...            │
│                                                     │
│                                    [Copy] [Regenerate]
└─────────────────────────────────────────────────────┘
```

**Assistant message:**
- Background: `bg-slate-100`
- Border radius: `rounded-lg`
- Padding: `p-4`
- Full width

**User message:**
- Background: `bg-ocean text-white`
- Border radius: `rounded-lg`
- Padding: `p-4`
- Max width: `max-w-[80%]`
- Aligned right

### 6.2 Chat Input

```
┌─────────────────────────────────────────────┬──────┐
│ Ask a question or describe what you need... │ Send │
└─────────────────────────────────────────────┴──────┘
```

- Container: `bg-white border border-slate-200 rounded-xl p-2`
- Input: `border-0 focus:ring-0` (no inner border)
- Button: `bg-ocean text-white rounded-lg px-4 py-2`
- Disabled state: `opacity-50 cursor-not-allowed`

### 6.3 Page Header

```
┌─────────────────────────────────────────────────────┐
│ 🏠 Shadwell Basin                    [New Chat]     │
│    Grant Assistant                                  │
└─────────────────────────────────────────────────────┘
```

- Background: `bg-white border-b border-slate-200`
- Padding: `px-6 py-4`
- Title: `text-xl font-semibold text-slate-900`
- Subtitle: `text-sm text-slate-500`

### 6.4 Suggested Prompts (Empty State)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     👋 How can I help with your next grant?         │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Draft an        │  │ What outcomes   │          │
│  │ "About Us"      │  │ did we achieve  │          │
│  │ section         │  │ last year?      │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Help me write   │  │ Summarise our   │          │
│  │ a statement     │  │ theory of       │          │
│  │ of need         │  │ change          │          │
│  └─────────────────┘  └─────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Cards: `border border-slate-200 rounded-lg p-4 hover:border-ocean hover:bg-slate-50 cursor-pointer transition`
- Grid: `grid grid-cols-2 gap-3`

### 6.5 Copy Button

Appears on hover over assistant messages.

- Default: `text-slate-400 hover:text-slate-600`
- After copy: Show "Copied!" with checkmark, then reset after 2s
- Icon: `Copy` from Lucide, then `Check` when copied

### 6.6 Loading State

Streaming dots while AI is typing:

```
●  ●  ●
```

- Three dots with staggered animation
- `text-slate-400`
- Replace with streamed text as it arrives

---

## 7. Layout

### Desktop (>768px)

```
┌──────────────────────────────────────────────────────────┐
│ Header                                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    Chat Area                             │
│                  (scrollable)                            │
│                  max-w-3xl mx-auto                       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                    Input Area                            │
│                  max-w-3xl mx-auto                       │
└──────────────────────────────────────────────────────────┘
```

- Max content width: `max-w-3xl` (768px)
- Centered: `mx-auto`
- Page padding: `px-4`

### Mobile (<768px)

- Full width chat
- Sticky input at bottom
- Smaller padding: `px-3`

---

## 8. Motion

Keep it subtle — this is a productivity tool, not a showpiece.

| Element | Animation |
|---------|-----------|
| Messages appearing | `animate-in fade-in slide-in-from-bottom-2 duration-200` |
| Buttons | `transition-colors duration-150` |
| Hover states | `transition duration-150` |
| Copy feedback | `animate-in fade-in duration-150` |

---

## 9. Accessibility

- **Contrast:** All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
- **Focus states:** Visible focus rings on all interactive elements
- **Keyboard nav:** Full keyboard support for chat
- **Screen readers:** Proper ARIA labels on buttons, live regions for new messages
- **Reduced motion:** Respect `prefers-reduced-motion`

---

## 10. Component Checklist

MVP components to build:

- [ ] `ChatMessage` — User and assistant variants
- [ ] `ChatInput` — Text input with send button
- [ ] `ChatContainer` — Scrollable message list
- [ ] `Header` — Title and new chat button
- [ ] `SuggestedPrompts` — Empty state with clickable prompts
- [ ] `CopyButton` — Copy to clipboard with feedback
- [ ] `LoadingDots` — Typing indicator
- [ ] `PasswordGate` — Simple password entry screen

---

## 11. Sample Screens

### Empty State

![Empty state placeholder]

Clean welcome with suggested prompts to get started.

### Active Conversation

![Conversation placeholder]

Back-and-forth with clear visual distinction between user and AI.

### Mobile View

![Mobile placeholder]

Full-width messages, sticky input, easy thumb reach for send button.

---

## Appendix: Figma / Reference

No Figma for this project — moving fast with code. Reference designs:

- [ChatGPT](https://chat.openai.com) — Clean chat UI patterns
- [Claude](https://claude.ai) — Message styling, copy buttons
- [Vercel AI Chatbot Template](https://github.com/vercel/ai-chatbot) — Next.js patterns
