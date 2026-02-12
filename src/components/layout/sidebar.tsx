"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  Plus,
  BookOpen,
  FileText,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockProjects, mockKnowledgeFiles } from "@/lib/mock-data";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isProjectActive = (id: string) => pathname.startsWith(`/projects/${id}`);

  return (
    <aside
      className={cn(
        "flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50",
        className
      )}
    >
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Home */}
        <Link
          href="/"
          className={cn(
            "mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive("/")
              ? "bg-ocean/10 text-ocean"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          )}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>

        {/* Projects Section */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Projects
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-slate-400 hover:text-slate-600"
              asChild
            >
              <Link href="/projects/new">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <nav className="space-y-1">
            {mockProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  isProjectActive(project.id)
                    ? "bg-ocean/10 text-ocean"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <FolderOpen className="h-4 w-4 shrink-0" />
                <span className="truncate">{project.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Knowledge Base Section */}
        <div>
          <div className="mb-2 px-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Knowledge Base
            </span>
          </div>

          <Link
            href="/knowledge"
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
              isActive("/knowledge")
                ? "bg-ocean/10 text-ocean"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Documents</span>
            </div>
            <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
              {mockKnowledgeFiles.filter((f) => f.status === "ready").length}
            </span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-lg bg-ocean/5 p-3">
          <p className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Pro tip:</span> Upload your annual reports and past applications to help the AI write better content.
          </p>
        </div>
      </div>
    </aside>
  );
}
