"use client";

import { AppShell } from "@/components/layout";
import { ProjectCard, NewProjectCard } from "@/components/projects";
import { mockProjects } from "@/lib/mock-data";

export default function DashboardPage() {
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

          {/* Projects Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            <NewProjectCard />
          </div>

          {/* Stats (optional) */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Total Applications</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {mockProjects.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {mockProjects.filter((p) => p.status === "draft").length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Success Rate</p>
              <p className="mt-1 text-2xl font-semibold text-green-600">85%</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
