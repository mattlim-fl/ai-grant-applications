"use client";

import { useState } from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { ChatPanel } from "./chat-panel";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  showChat?: boolean;
  onInsertToDocument?: (content: string) => void;
  projectName?: string;
}

export function AppShell({
  children,
  showChat = false,
  onInsertToDocument,
  projectName,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(showChat);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        showMenuButton={true}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          className={cn(
            "hidden lg:flex",
            !sidebarOpen && "lg:hidden"
          )}
        />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          className={cn(
            "fixed inset-y-0 left-0 z-50 mt-14 lg:hidden",
            sidebarOpen ? "flex" : "hidden"
          )}
        />

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>

        {/* Chat panel */}
        {showChat && (
          <>
            <ChatPanel
              isOpen={chatOpen}
              onClose={() => setChatOpen(false)}
              onInsert={onInsertToDocument}
              projectName={projectName}
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
          </>
        )}
      </div>
    </div>
  );
}
