"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/layout/header";
import { ChatPanel } from "@/components/layout/chat-panel";
import { DocumentList } from "@/components/editor/document-list";
import { DocumentEditor } from "@/components/editor/document-editor";
import { MessageSquare } from "lucide-react";
import { mockProjects, mockDocuments, Document } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles = {
  draft: "bg-slate-100 text-slate-600",
  submitted: "bg-blue-100 text-blue-700",
  successful: "bg-green-100 text-green-700",
  unsuccessful: "bg-red-100 text-red-700",
};

const statusLabels = {
  draft: "Draft",
  submitted: "Submitted",
  successful: "Successful",
  unsuccessful: "Unsuccessful",
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const project = mockProjects.find((p) => p.id === projectId);
  const documents = mockDocuments[projectId] || [];

  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(
    documents[0]?.id || null
  );
  const [chatOpen, setChatOpen] = useState(true);
  const [localDocuments, setLocalDocuments] = useState<Document[]>(documents);

  const activeDocument = localDocuments.find((d) => d.id === activeDocumentId) || null;

  const handleInsertFromChat = useCallback((content: string) => {
    if (!activeDocumentId) return;

    setLocalDocuments((docs) =>
      docs.map((doc) =>
        doc.id === activeDocumentId
          ? { ...doc, content: doc.content + "\n\n" + content }
          : doc
      )
    );
  }, [activeDocumentId]);

  const handleContentChange = useCallback((content: string) => {
    if (!activeDocumentId) return;

    setLocalDocuments((docs) =>
      docs.map((doc) =>
        doc.id === activeDocumentId ? { ...doc, content } : doc
      )
    );
  }, [activeDocumentId]);

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-500">Project not found</p>
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
                <p className="text-sm text-slate-500">{project.funder}</p>
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
              documents={localDocuments}
              activeDocumentId={activeDocumentId}
              onSelectDocument={setActiveDocumentId}
              onAddDocument={() => {
                const newDoc: Document = {
                  id: `doc-new-${Date.now()}`,
                  projectId,
                  title: "New Section",
                  content: "",
                  sortOrder: localDocuments.length,
                };
                setLocalDocuments([...localDocuments, newDoc]);
                setActiveDocumentId(newDoc.id);
              }}
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
