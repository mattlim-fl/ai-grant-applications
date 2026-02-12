"use client";

import { AppShell } from "@/components/layout";
import { ProjectCard, NewProjectCard } from "@/components/projects";
import { useProjects } from "@/hooks";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { projects, loading, error } = useProjects();

  const draftCount = projects.filter((p) => p.status === "draft").length;
  const successCount = projects.filter((p) => p.status === "successful").length;
  const totalCount = projects.length;
  const successRate = totalCount > 0 
    ? Math.round((successCount / totalCount) * 100) 
    : 0;

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              Your Applications
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your grant applications and track their progress.
            </p>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-ocean" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={{
                      id: project.id,
                      name: project.name,
                      funder: project.funder || "",
                      deadline: project.deadline,
                      status: project.status,
                      sectionsCount: project.documents_count,
                      updatedAt: formatRelativeTime(project.updated_at),
                    }}
                  />
                ))}
                <NewProjectCard />
              </div>

              {/* Stats */}
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Total Applications</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {totalCount}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">In Progress</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">
                    {draftCount}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-sm text-slate-500">Success Rate</p>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    {successRate}%
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}
