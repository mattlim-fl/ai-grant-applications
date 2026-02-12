"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MoreHorizontal, Loader2, MessageSquare, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/layout/header";
import { ChatPanel } from "@/components/layout/chat-panel";
import { DocumentList } from "@/components/editor/document-list";
import { DocumentEditor } from "@/components/editor/document-editor";
import { useProject } from "@/hooks";
import { cn } from "@/lib/utils";

const statusStyles = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-blue-100 text-blue-700",
  successful: "bg-green-100 text-green-700",
  unsuccessful: "bg-red-100 text-red-700",
  archived: "bg-gray-100 text-gray-600",
};

const statusLabels = {
  draft: "Draft",
  submitted: "Submitted",
  successful: "Successful",
  unsuccessful: "Unsuccessful",
  archived: "Archived",
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const {
    project,
    loading,
    error,
    updateDocument,
    addDocument,
    deleteDocument,
  } = useProject(projectId);

  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(true);

  // Set active document to first one when project loads
  useEffect(() => {
    if (project?.documents?.length && !activeDocumentId) {
      setActiveDocumentId(project.documents[0].id);
    }
  }, [project?.documents, activeDocumentId]);

  const activeDocument = project?.documents?.find((d) => d.id === activeDocumentId) || null;

  const handleInsertFromChat = useCallback((content: string) => {
    if (!activeDocumentId || !activeDocument) return;

    const newContent = activeDocument.content 
      ? activeDocument.content + "\n\n" + content 
      : content;
    
    updateDocument(activeDocumentId, { content: newContent });
  }, [activeDocumentId, activeDocument, updateDocument]);

  const handleContentChange = useCallback((content: string) => {
    if (!activeDocumentId) return;
    updateDocument(activeDocumentId, { content });
  }, [activeDocumentId, updateDocument]);

  const handleAddDocument = async () => {
    const doc = await addDocument("New Section");
    if (doc) {
      setActiveDocumentId(doc.id);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    
    const success = await deleteDocument(docId);
    if (success && activeDocumentId === docId) {
      // Select another document
      const remaining = project?.documents?.filter((d) => d.id !== docId);
      setActiveDocumentId(remaining?.[0]?.id || null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-ocean" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-slate-500">{error || "Project not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/">Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header showMenuButton={false} />

      <div className="flex flex-1 overflow-hidden">
        {/* Project Sidebar */}
        <aside className="flex w-64 flex-col border-r border-slate-200 bg-slate-50">
          {/* Back button and project info */}
          <div className="border-b border-slate-200 p-4">
            <Link
              href="/"
              className="mb-3 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </Link>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="font-semibold text-slate-900">{project.name}</h2>
                {project.funder && (
                  <p className="text-sm text-slate-500">{project.funder}</p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Rename</DropdownMenuItem>
                  <DropdownMenuItem>Change status</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  statusStyles[project.status]
                )}
              >
                {statusLabels[project.status]}
              </span>
              {project.deadline && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(project.deadline).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Document list */}
          <div className="flex-1 overflow-y-auto p-4">
            <DocumentList
              documents={project.documents || []}
              activeDocumentId={activeDocumentId}
              onSelectDocument={setActiveDocumentId}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          </div>
        </aside>

        {/* Main editor area */}
        <main className="flex-1 overflow-hidden bg-white">
          <DocumentEditor
            document={activeDocument}
            onContentChange={handleContentChange}
          />
        </main>

        {/* Chat panel */}
        <ChatPanel
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
          onInsert={handleInsertFromChat}
          projectName={project.name}
        />

        {/* Chat toggle button when closed */}
        {!chatOpen && (
          <Button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-ocean shadow-lg hover:bg-ocean-dark"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
