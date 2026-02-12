"use client";

import { useState, useEffect, useRef } from "react";
import { Copy, Download, Check, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Document } from "@/lib/mock-data";

interface DocumentEditorProps {
  document: Document | null;
  onContentChange?: (content: string) => void;
}

export function DocumentEditor({ document, onContentChange }: DocumentEditorProps) {
  const [content, setContent] = useState(document?.content || "");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when document changes
  useEffect(() => {
    setContent(document?.content || "");
    setSaveStatus("saved");
  }, [document?.id]);

  // Auto-save simulation
  useEffect(() => {
    if (content !== document?.content) {
      setSaveStatus("unsaved");
      const timeout = setTimeout(() => {
        setSaveStatus("saving");
        setTimeout(() => {
          setSaveStatus("saved");
          onContentChange?.(content);
        }, 500);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [content]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    // In real implementation, this would generate a .docx file
    alert("Export to Word would happen here!");
  };

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  if (!document) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <p>Select a section to start editing</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <h2 className="text-lg font-semibold text-slate-900">{document.title}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5",
              showPreview ? "bg-slate-100" : ""
            )}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <Edit3 className="h-4 w-4" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <div className="h-full overflow-y-auto p-6">
            <div className="prose prose-slate mx-auto max-w-3xl">
              <MarkdownPreview content={content} />
            </div>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="h-full w-full resize-none bg-white p-6 font-mono text-sm leading-relaxed text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-2 text-xs text-slate-400">
        <span>{wordCount} words</span>
        <span>
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "unsaved" && "Unsaved changes"}
        </span>
      </div>
    </div>
  );
}

// Simple markdown preview (basic implementation)
function MarkdownPreview({ content }: { content: string }) {
  // Very basic markdown rendering - in production use a proper library
  const html = content
    .split("\n\n")
    .map((block) => {
      if (block.startsWith("# ")) {
        return `<h1 class="text-2xl font-bold mb-4">${block.slice(2)}</h1>`;
      }
      if (block.startsWith("## ")) {
        return `<h2 class="text-xl font-semibold mb-3">${block.slice(3)}</h2>`;
      }
      if (block.startsWith("- ") || block.startsWith("• ")) {
        const items = block.split("\n").map((line) => {
          const text = line.replace(/^[-•]\s*/, "");
          return `<li>${text}</li>`;
        });
        return `<ul class="list-disc pl-5 mb-4 space-y-1">${items.join("")}</ul>`;
      }
      // Bold text
      const withBold = block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      return `<p class="mb-4">${withBold}</p>`;
    })
    .join("");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
