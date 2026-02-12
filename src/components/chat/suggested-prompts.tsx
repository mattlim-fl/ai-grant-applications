"use client";

import { FileText, BarChart3, Target, BookOpen } from "lucide-react";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

const suggestions = [
  {
    icon: FileText,
    title: "Draft an 'About Us' section",
    prompt:
      "Help me draft an 'About Us' section for a grant application. Include our history, mission, and key achievements.",
  },
  {
    icon: BarChart3,
    title: "What outcomes did we achieve last year?",
    prompt:
      "What were our key youth outcomes and participation numbers from the last annual report?",
  },
  {
    icon: Target,
    title: "Write a statement of need",
    prompt:
      "Help me write a compelling 'Statement of Need' section that explains why our work matters and who benefits.",
  },
  {
    icon: BookOpen,
    title: "Summarise our theory of change",
    prompt:
      "Summarise our theory of change and how we measure impact with young people.",
  },
];

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-2xl font-semibold text-slate-900">
          👋 How can I help with your next grant?
        </h2>
        <p className="text-slate-500">
          I have access to your annual reports, past applications, and policies.
        </p>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          return (
            <button
              key={index}
              onClick={() => onSelect(suggestion.prompt)}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-ocean hover:bg-slate-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ocean/10 text-ocean">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {suggestion.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
