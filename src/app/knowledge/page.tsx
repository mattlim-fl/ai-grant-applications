"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  FileSpreadsheet,
  File,
  Check,
  Loader2,
  AlertCircle,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockKnowledgeFiles, KnowledgeFile } from "@/lib/mock-data";

const statusConfig = {
  pending: {
    icon: Loader2,
    label: "Pending",
    className: "text-slate-500",
    iconClassName: "",
  },
  processing: {
    icon: Loader2,
    label: "Processing",
    className: "text-amber-600",
    iconClassName: "animate-spin",
  },
  ready: {
    icon: Check,
    label: "Ready",
    className: "text-green-600",
    iconClassName: "",
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    className: "text-red-600",
    iconClassName: "",
  },
};

function getFileIcon(mimeType: string) {
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
    return FileSpreadsheet;
  }
  if (mimeType.includes("pdf") || mimeType.includes("word")) {
    return FileText;
  }
  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgeBasePage() {
  const [files, setFiles] = useState<KnowledgeFile[]>(mockKnowledgeFiles);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    // Simulate file upload
    const droppedFiles = Array.from(e.dataTransfer.files);
    const newFiles: KnowledgeFile[] = droppedFiles.map((file, index) => ({
      id: `file-new-${Date.now()}-${index}`,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      status: "processing" as const,
      uploadedAt: new Date().toISOString().split("T")[0],
    }));

    setFiles((prev) => [...newFiles, ...prev]);

    // Simulate processing completion
    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) =>
          newFiles.find((nf) => nf.id === f.id) ? { ...f, status: "ready" as const } : f
        )
      );
    }, 3000);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this file? The AI will no longer have access to its content.")) {
      setFiles((prev) => prev.filter((f) => f.id !== id));
    }
  };

  const handleRetry = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "processing" as const } : f))
    );

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status: "ready" as const } : f))
      );
    }, 2000);
  };

  const readyCount = files.filter((f) => f.status === "ready").length;
  const processingCount = files.filter((f) => f.status === "processing").length;

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Knowledge Base
            </h1>
            <p className="mt-1 text-slate-500">
              Upload documents to help the AI understand your organisation. These will be used across all your grant applications.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-6 flex gap-4">
            <div className="rounded-lg bg-green-50 px-4 py-2">
              <span className="text-sm text-green-700">
                <span className="font-semibold">{readyCount}</span> documents ready
              </span>
            </div>
            {processingCount > 0 && (
              <div className="rounded-lg bg-amber-50 px-4 py-2">
                <span className="text-sm text-amber-700">
                  <span className="font-semibold">{processingCount}</span> processing
                </span>
              </div>
            )}
          </div>

          {/* Upload dropzone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "mb-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-colors",
              isDragging
                ? "border-ocean bg-ocean/5"
                : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
            )}
            onClick={() => {
              // In real implementation, trigger file input
              alert("File picker would open here!");
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Upload className="h-6 w-6 text-slate-500" />
            </div>
            <p className="mt-4 font-medium text-slate-700">
              Drop files here or click to upload
            </p>
            <p className="mt-1 text-sm text-slate-500">
              PDF, Word, Excel, TXT • Max 10MB per file
            </p>
          </div>

          {/* File list */}
          <div>
            <h2 className="mb-4 font-semibold text-slate-900">Uploaded Files</h2>
            <div className="space-y-2">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.mimeType);
                const status = statusConfig[file.status];
                const StatusIcon = status.icon;

                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <FileIcon className="h-5 w-5 text-slate-500" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {file.filename}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatFileSize(file.fileSize)} • Uploaded{" "}
                        {new Date(file.uploadedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className={cn("flex items-center gap-1.5", status.className)}>
                      <StatusIcon className={cn("h-4 w-4", status.iconClassName)} />
                      <span className="text-sm font-medium">{status.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {file.status === "error" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-600"
                          onClick={() => handleRetry(file.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-400 hover:text-red-600"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {files.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center">
                  <p className="text-slate-500">No files uploaded yet</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Upload your annual reports, policies, and past applications
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 rounded-lg bg-ocean/5 p-4">
            <h3 className="font-medium text-slate-900">
              💡 Tips for better AI responses
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>• Upload your most recent annual report for up-to-date statistics</li>
              <li>• Include 2-3 successful past grant applications as style examples</li>
              <li>• Add your constitution and key policies for accurate org info</li>
              <li>• Excel files with outcome data help provide specific numbers</li>
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
