// Mock data for demo purposes

export interface Project {
  id: string;
  name: string;
  funder: string;
  deadline: string | null;
  status: "draft" | "submitted" | "successful" | "unsuccessful";
  sectionsCount: number;
  updatedAt: string;
}

export interface Document {
  id: string;
  projectId: string;
  title: string;
  content: string;
  sortOrder: number;
}

export interface KnowledgeFile {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  status: "pending" | "processing" | "ready" | "error";
  uploadedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Sport England Youth Sailing",
    funder: "Sport England",
    deadline: "2025-03-15",
    status: "draft",
    sectionsCount: 4,
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "BBC Children in Need 2025",
    funder: "BBC Children in Need",
    deadline: "2025-04-01",
    status: "draft",
    sectionsCount: 2,
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    name: "National Lottery Community Fund",
    funder: "National Lottery",
    deadline: "2025-05-30",
    status: "draft",
    sectionsCount: 0,
    updatedAt: "3 days ago",
  },
];

export const mockDocuments: Record<string, Document[]> = {
  "1": [
    {
      id: "doc-1",
      projectId: "1",
      title: "About Us",
      content: `# About Shadwell Basin

For over 50 years, Shadwell Basin Outdoor Activity Centre has been transforming the lives of young people in East London through outdoor adventure and water sports.

Based in the heart of Tower Hamlets, we provide sailing, kayaking, powerboating, and outdoor education to young people who might otherwise never experience life on the water.

## Our Mission

Our unique long-term development model means we don't just offer one-off sessions – we build lasting relationships with young people, supporting them from their first time in a boat through to nationally recognised qualifications and, for many, careers in the outdoor sector.

## Key Facts

- **50+ years** serving East London communities
- **1,247 young people** engaged last year
- **85% retention rate** (attending 3+ sessions)
- **156 young people** achieved RYA qualifications`,
      sortOrder: 0,
    },
    {
      id: "doc-2",
      projectId: "1",
      title: "Statement of Need",
      content: `# Statement of Need

Tower Hamlets faces significant challenges in youth provision. With 35% of children living in poverty and limited access to green spaces and waterways, many young people in our community have never experienced outdoor adventure or learned to swim.

## The Challenge

The need for our services has never been greater:

- **Mental health crisis**: Referrals from schools and youth services for young people experiencing anxiety and low self-esteem have increased 40% since 2020
- **Limited opportunities**: 68% of the young people we work with have never been on a boat before coming to us
- **Skills gap**: Local schools report declining confidence in outdoor and practical skills among students

## Our Response

Shadwell Basin addresses these needs through accessible, long-term programmes that build confidence, resilience, and practical skills.`,
      sortOrder: 1,
    },
    {
      id: "doc-3",
      projectId: "1",
      title: "Project Description",
      content: `# Project Description

*Start writing your project description here...*`,
      sortOrder: 2,
    },
    {
      id: "doc-4",
      projectId: "1",
      title: "Budget",
      content: `# Budget

*Add your budget breakdown here...*`,
      sortOrder: 3,
    },
  ],
  "2": [
    {
      id: "doc-5",
      projectId: "2",
      title: "About Us",
      content: `# About Us

*Start writing...*`,
      sortOrder: 0,
    },
    {
      id: "doc-6",
      projectId: "2",
      title: "Project Plan",
      content: `# Project Plan

*Start writing...*`,
      sortOrder: 1,
    },
  ],
  "3": [],
};

export const mockKnowledgeFiles: KnowledgeFile[] = [
  {
    id: "file-1",
    filename: "Annual Report 2024.pdf",
    fileSize: 122880,
    mimeType: "application/pdf",
    status: "ready",
    uploadedAt: "2025-01-15",
  },
  {
    id: "file-2",
    filename: "Safeguarding Policy.docx",
    fileSize: 46080,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    status: "ready",
    uploadedAt: "2025-01-15",
  },
  {
    id: "file-3",
    filename: "Youth Outcomes 2024.xlsx",
    fileSize: 8192,
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    status: "processing",
    uploadedAt: "2025-02-10",
  },
  {
    id: "file-4",
    filename: "Constitution.pdf",
    fileSize: 94208,
    mimeType: "application/pdf",
    status: "ready",
    uploadedAt: "2025-01-10",
  },
  {
    id: "file-5",
    filename: "Previous Grant - Sport England 2023.pdf",
    fileSize: 204800,
    mimeType: "application/pdf",
    status: "ready",
    uploadedAt: "2025-01-20",
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Hi! I'm here to help you write this grant application. I have access to your annual reports, past applications, and policies. What would you like to work on?",
    createdAt: "2025-02-12T10:00:00Z",
  },
];

// Mock responses for the chat
export const mockResponses: Record<string, string> = {
  default: `Based on your documents, I can help you with that. Let me pull together the relevant information.

Shadwell Basin Outdoor Activity Centre has been serving young people in East London for over 50 years. In the last year, you engaged **1,247 young people** through sailing, kayaking, and outdoor education programmes.

Key achievements from your Annual Report:
• 89% of participants reported increased confidence
• 156 young people achieved nationally recognised qualifications
• 42 participants progressed into volunteering or employment

Would you like me to expand on any of these points or draft this into a specific section format?`,

  about: `Here's a draft 'About Us' section based on your Annual Report 2024 and previous successful applications:

---

**About Shadwell Basin Outdoor Activity Centre**

For over 50 years, Shadwell Basin Outdoor Activity Centre has been transforming the lives of young people in East London through outdoor adventure and water sports. Based in the heart of Tower Hamlets, we provide sailing, kayaking, powerboating, and outdoor education to young people who might otherwise never experience life on the water.

Our unique long-term development model means we don't just offer one-off sessions – we build lasting relationships with young people, supporting them from their first time in a boat through to nationally recognised qualifications and, for many, careers in the outdoor sector.

Last year we worked with 1,247 young people, with 85% returning for multiple sessions. Our dedicated team of 6 permanent staff and 12 trained sessional instructors create a safe, supportive environment where young people can challenge themselves, build confidence, and discover new passions.

---

*Source: Annual Report 2024.pdf, Previous Grant - Sport England 2023.pdf*

Would you like me to adjust the tone or add specific statistics?`,

  need: `Here's a draft 'Statement of Need' based on your documentation:

---

**Statement of Need**

Tower Hamlets faces significant challenges in youth provision. With 35% of children living in poverty and limited access to green spaces and waterways, many young people in our community have never experienced outdoor adventure or learned to swim.

The need for our services has never been greater:

• **Mental health crisis**: Referrals from schools and youth services for young people experiencing anxiety and low self-esteem have increased 40% since 2020

• **Limited opportunities**: 68% of the young people we work with have never been on a boat before coming to us

• **Skills gap**: Local schools report declining confidence in outdoor and practical skills among students

Shadwell Basin addresses these needs through accessible, long-term programmes that build confidence, resilience, and practical skills. Unlike one-off activity providers, our model creates sustained engagement – the average young person in our programmes attends for 18 months.

---

*Source: Annual Report 2024.pdf, Youth Outcomes 2024.xlsx*

Should I add more local statistics or adjust the focus?`,

  outcomes: `Based on your Youth Outcomes 2024.xlsx and Annual Report, here are your key outcomes:

**Participation**
• 1,247 young people engaged (up 12% from previous year)
• 8,340 total sessions delivered
• 85% retention rate (attending 3+ sessions)

**Qualifications & Progression**
• 156 young people achieved RYA qualifications
• 23 completed Level 2 Powerboat certificates
• 42 progressed into volunteering, apprenticeships, or employment

**Wellbeing & Development**
• 89% reported increased confidence (pre/post surveys)
• 78% reported improved teamwork skills
• 94% would recommend the programme to friends

**Demographics**
• 72% from Tower Hamlets
• 45% eligible for free school meals
• 38% from BAME backgrounds

*Source: Youth Outcomes 2024.xlsx, Annual Report 2024.pdf*

Would you like me to format these for a specific funder's template?`,
};

export function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("about us") || lower.includes("about section") || lower.includes("about shadwell")) {
    return mockResponses.about;
  }
  if (lower.includes("need") || lower.includes("statement of need") || lower.includes("why")) {
    return mockResponses.need;
  }
  if (
    lower.includes("outcome") ||
    lower.includes("achievement") ||
    lower.includes("numbers") ||
    lower.includes("statistics") ||
    lower.includes("impact")
  ) {
    return mockResponses.outcomes;
  }
  return mockResponses.default;
}
