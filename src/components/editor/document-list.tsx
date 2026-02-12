"use client";

import { FileText, Plus, GripVertical, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Document } from "@/types/database";

interface DocumentListProps {
  documents: Document[];
  activeDocumentId: string | null;
  onSelectDocument: (id: string) => void;
  onAddDocument?: () => void;
  onDeleteDocument?: (id: string) => void;
}

export function DocumentList({
  documents,
  activeDocumentId,
  onSelectDocument,
  onAddDocument,
  onDeleteDocument,
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
          const hasContent = doc.content && doc.content.length > 50;

          return (
            <div
              key={doc.id}
              className={cn(
                "group flex items-center gap-1 rounded-lg pr-1 transition-colors",
                isActive
                  ? "bg-ocean/10"
                  : "hover:bg-slate-100"
              )}
            >
              <button
                onClick={() => onSelectDocument(doc.id)}
                className={cn(
                  "flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm",
                  isActive
                    ? "text-ocean"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300" />
                <FileText className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{doc.title}</span>
                {hasContent && (
                  <Check className="h-4 w-4 shrink-0 text-green-500" />
                )}
              </button>
              
              {onDeleteDocument && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(doc.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          );
        })}
      </nav>

      {documents.length === 0 && (
        <p className="px-3 py-4 text-sm text-slate-400">
          No sections yet. Add one to get started.
        </p>
      )}

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
