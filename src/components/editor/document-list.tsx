"use client";

import { FileText, Plus, GripVertical, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Document } from "@/lib/mock-data";

interface DocumentListProps {
  documents: Document[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onAddDocument?: () => void;
}

export function DocumentList({
  documents,
  activeDocumentId,
  onSelectDocument,
  onAddDocument,
}: DocumentListProps) {
  return (
    <div className="flex flex-col">
      <div className="mb-2 px-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Sections
        </span>
      </div>

      <nav className="space-y-1">
        {documents.map((doc) => {
          const isActive = doc.id === activeDocumentId;
          const hasContent = doc.content.length > 50;

          return (
            <button
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                isActive
                  ? "bg-ocean/10 text-ocean"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300" />
              <FileText className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{doc.title}</span>
              {hasContent && (
                <Check className="h-4 w-4 shrink-0 text-green-500" />
              )}
            </button>
          );
        })}
      </nav>

      {onAddDocument && (
        <Button
          variant="ghost"
          className="mt-2 justify-start gap-2 text-slate-500 hover:text-slate-700"
          onClick={onAddDocument}
        >
          <Plus className="h-4 w-4" />
          Add section
        </Button>
      )}
    </div>
  );
}
