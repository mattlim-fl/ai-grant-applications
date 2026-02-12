# Product Requirements Document
## AI Grant Applications — Shadwell Basin

**Version:** 0.1  
**Date:** 2026-02-12  
**Author:** Matt Lim  
**Status:** Draft

---

## 1. Overview

### 1.1 Background

Shadwell Basin Outdoor Activity Centre is a 50-year-old youth charity in East London with ~£400K annual budget and 6 permanent staff. They submit 16-17 grant applications per year with an 85-90% success rate.

**The problem:** They're excellent at writing grants but severely time-constrained. They estimate they could apply for 3x more funding if they had capacity. Currently, they miss deadlines simply because they can't get to everything.

### 1.2 Solution

An AI-powered assistant that:
1. Has deep knowledge of Shadwell Basin's history, outcomes, and documentation
2. Can draft grant application sections in their voice
3. Is simple enough for staff with zero AI experience to use

### 1.3 Success Criteria

- Staff can draft a grant application section in <10 minutes (vs hours)
- Mike (Director) can use it independently after one training session
- Enables at least 2 additional grant applications in first 3 months

---

## 2. Users

### 2.1 Primary Users

| User | Role | AI Experience | Usage |
|------|------|---------------|-------|
| Mike Wardle | Director | None | Primary grant writer, will use most |
| Jan | Deputy | Basic personal use | Data/monitoring support |
| Daniel Belcher | Trustee | Unknown | Learning grants, occasional use |

### 2.2 User Needs

- **Simple interface** — No learning curve, just type and get help
- **Accurate information** — Must use real Shadwell Basin data, not hallucinate
- **Their voice** — Output should sound like them, not generic
- **Exportable** — Need to copy/paste into Word docs and grant portals

---

## 3. Functional Requirements

### 3.1 Core Features (MVP)

#### 3.1.1 Chat Interface
- Single chat window, conversational UI
- Message history within session
- Clear "new conversation" option
- Mobile-responsive (Mike might use on phone)

#### 3.1.2 Knowledge Base Queries
Users can ask questions about their own data:
- "What were our youth participation numbers last year?"
- "How many young people completed sailing qualifications in 2025?"
- "What did we say about our theory of change in the last annual report?"

#### 3.1.3 Grant Section Drafting
Users can request draft content for common grant sections:
- Organisation background / "About us"
- Statement of need
- Project description
- Outcomes and impact
- Budget justification
- Monitoring and evaluation approach

#### 3.1.4 Full Application Assistance
Users can paste grant criteria/questions and get help completing them:
- "Here are the questions for the Sport England application: [paste]. Help me answer them."

### 3.2 Phase 2 Features

#### 3.2.1 Export to Word
- Download conversation or specific responses as .docx
- Basic formatting preserved

#### 3.2.2 Grant Templates
- Pre-configured prompts for common funders
- Saved templates for repeat applications

#### 3.2.3 Document Upload
- Users can upload new documents to expand knowledge base
- Annual report updates, new policies, etc.

### 3.3 Out of Scope (for now)

- User accounts / multi-tenancy
- Direct integration with grant portals
- Automated form filling
- Budget calculator tools
- Grant opportunity discovery/matching

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Response time: <30 seconds for most queries
- Availability: 99% uptime (Vercel/OpenAI SLAs)

### 4.2 Security
- Password-protected access (single shared password initially)
- No sensitive personal data in knowledge base
- HTTPS only

### 4.3 Cost
- Target: <£30/month ongoing
- OpenAI API costs covered by Matt initially
- Handover plan for Shadwell Basin to take over billing

---

## 5. Technical Architecture

### 5.1 Stack
- **AI:** OpenAI Assistants API with file search
- **Frontend:** Next.js 14 (App Router)
- **Hosting:** Vercel (free tier)
- **Auth:** Simple middleware password check

### 5.2 OpenAI Assistant Configuration

**Model:** gpt-4o

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
```

**Vector Store Contents:**
- 3-5 successful past grant applications
- Most recent annual report
- Constitution
- Safeguarding policy
- Standard "about us" boilerplate
- Outcomes/impact data summaries
- Budget templates

### 5.3 Data Flow

```
User input → Next.js API route → OpenAI Assistants API
                                        ↓
                                 File search (RAG)
                                        ↓
                              Generated response
                                        ↓
User ← Streamed response ← Next.js API route
```

---

## 6. Knowledge Base Requirements

### 6.1 Documents to Collect from Shadwell Basin

| Document | Purpose | Priority |
|----------|---------|----------|
| 3-5 successful grant applications | Writing style, structure, proven content | High |
| Annual Report 2024/25 | Current outcomes, stats, narrative | High |
| Constitution | Organisational details, charitable objects | Medium |
| Safeguarding policy | Required for many applications | Medium |
| Theory of change / logic model | Impact framework | Medium |
| Budget templates | Financial information | Medium |
| Youth outcomes data (Excel) | Specific numbers | High |
| Staff bios | Team information | Low |

### 6.2 Data Processing

- PDFs and Word docs: Upload directly to OpenAI
- Excel files: Convert key data to markdown summaries
- Large documents: May need chunking strategy

---

## 7. User Interface

### 7.1 Wireframe (MVP)

```
┌─────────────────────────────────────────────┐
│  🏠 Shadwell Basin Grant Assistant          │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ AI: Hello! I'm here to help you     │   │
│  │ write grant applications. I have    │   │
│  │ access to your annual reports,      │   │
│  │ past applications, and policies.    │   │
│  │                                     │   │
│  │ How can I help today?               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ You: Can you draft an "About Us"    │   │
│  │ section for a Sport England app?    │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ AI: Based on your annual report...  │   │
│  │ [draft content]                     │   │
│  │                            [Copy 📋]│   │
│  └─────────────────────────────────────┘   │
│                                             │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐ [Send]│
│  │ Type your message...            │       │
│  └─────────────────────────────────┘       │
└─────────────────────────────────────────────┘
```

### 7.2 Key UI Elements

- **Copy button** on AI responses (essential for workflow)
- **New conversation** button (clear context)
- **Suggested prompts** for new users (optional)
- **Loading state** with streaming text

---

## 8. Implementation Plan

### Phase 1: MVP (Target: 1-2 days build)

- [ ] Set up Next.js project with Vercel
- [ ] Implement OpenAI Assistants integration
- [ ] Create and configure Assistant with file search
- [ ] Build basic chat UI
- [ ] Add password protection
- [ ] Upload initial documents from Shadwell Basin
- [ ] Test with real grant scenarios
- [ ] Deploy

### Phase 2: Polish (Target: 1 day)

- [ ] Add copy-to-clipboard on responses
- [ ] Export to Word functionality
- [ ] Improve mobile responsiveness
- [ ] Add suggested prompts
- [ ] Usage logging (anonymous)

### Phase 3: Handover

- [ ] User documentation / quick start guide
- [ ] Process for adding new documents
- [ ] Billing handover to Shadwell Basin
- [ ] Training session with Mike

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Hallucinated statistics | High — could damage grant credibility | Strong system prompt, cite sources, user verification |
| OpenAI API costs spike | Medium — pro bono budget | Monitor usage, set alerts, rate limiting |
| Mike finds it too complex | High — won't get used | Ruthless simplicity, training session, iterate on feedback |
| Documents contain sensitive data | Medium — privacy | Review docs before upload, no personal youth data |

---

## 10. Open Questions

1. **Document access:** How will Shadwell Basin share their documents? (Google Drive link? Email?)
2. **Funder priorities:** Which funders do they apply to most? (Useful for templates)
3. **Existing Plinth account:** Should we look at what Plinth offers to avoid duplication?
4. **Training:** When can we schedule a walkthrough with Mike?

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
