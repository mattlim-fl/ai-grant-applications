"use client";

import { useState, useRef, useEffect } from "react";
import {
  Header,
  ChatMessage,
  ChatInput,
  SuggestedPrompts,
  LoadingDots,
} from "@/components/chat";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Mock responses for demo purposes
const mockResponses: Record<string, string> = {
  default: `Based on our records, I can help you with that. Let me pull together the relevant information from your documents.

Shadwell Basin Outdoor Activity Centre has been serving young people in East London for over 50 years. In the last year, we engaged **1,247 young people** through our sailing, kayaking, and outdoor education programmes.

Our key achievements include:
• 89% of participants reported increased confidence
• 156 young people achieved nationally recognised qualifications
• 42 participants progressed into volunteering or employment in the outdoor sector

Would you like me to expand on any of these points or draft this into a specific section format?`,
  about: `Here's a draft 'About Us' section based on your annual reports and previous successful applications:

---

**About Shadwell Basin Outdoor Activity Centre**

For over 50 years, Shadwell Basin Outdoor Activity Centre has been transforming the lives of young people in East London through outdoor adventure and water sports. Based in the heart of Tower Hamlets, we provide sailing, kayaking, powerboating, and outdoor education to young people who might otherwise never experience life on the water.

Our unique long-term development model means we don't just offer one-off sessions – we build lasting relationships with young people, supporting them from their first time in a boat through to nationally recognised qualifications and, for many, careers in the outdoor sector.

Last year we worked with 1,247 young people, with 85% returning for multiple sessions. Our dedicated team of 6 permanent staff and 12 trained sessional instructors create a safe, supportive environment where young people can challenge themselves, build confidence, and discover new passions.

---

Would you like me to adjust the tone, add specific statistics, or tailor this for a particular funder?`,
  need: `Here's a draft 'Statement of Need' section:

---

**Statement of Need**

Tower Hamlets faces significant challenges in youth provision. With 35% of children living in poverty and limited access to green spaces and waterways, many young people in our community have never experienced outdoor adventure or learned to swim.

The need for our services has never been greater:

• **Mental health crisis**: Referrals from schools and youth services for young people experiencing anxiety and low self-esteem have increased 40% since 2020
• **Limited opportunities**: 68% of the young people we work with have never been on a boat before coming to us
• **Skills gap**: Local schools report declining confidence in outdoor and practical skills among students

Shadwell Basin addresses these needs through accessible, long-term programmes that build confidence, resilience, and practical skills. Unlike one-off activity providers, our model creates sustained engagement – the average young person in our programmes attends for 18 months.

---

Should I add more local statistics or adjust the focus for a specific funding priority?`,
  outcomes: `Based on your 2024/25 Annual Report and monitoring data, here are your key outcomes:

**Participation**
• 1,247 young people engaged (up 12% from previous year)
• 8,340 total sessions delivered
• 85% retention rate (attending 3+ sessions)

**Qualifications & Progression**
• 156 young people achieved RYA qualifications
• 23 completed Level 2 Powerboat certificates
• 42 progressed into volunteering, apprenticeships, or employment

**Wellbeing & Development**
• 89% reported increased confidence (measured via pre/post surveys)
• 78% reported improved teamwork skills
• 94% said they would recommend the programme to friends

**Demographics**
• 72% from Tower Hamlets
• 45% eligible for free school meals
• 38% from BAME backgrounds

Would you like me to format these for a specific funder's reporting template?`,
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("about us") || lower.includes("about section")) {
    return mockResponses.about;
  }
  if (lower.includes("need") || lower.includes("statement of need")) {
    return mockResponses.need;
  }
  if (
    lower.includes("outcome") ||
    lower.includes("achievement") ||
    lower.includes("numbers") ||
    lower.includes("statistics")
  ) {
    return mockResponses.outcomes;
  }
  return mockResponses.default;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(content),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header onNewChat={handleNewChat} />

      <main className="flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto"
        >
          <div className="mx-auto max-w-3xl px-4 pb-32">
            {messages.length === 0 ? (
              <SuggestedPrompts onSelect={handleSend} />
            ) : (
              <div className="space-y-4 py-6">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {isLoading && <LoadingDots />}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
