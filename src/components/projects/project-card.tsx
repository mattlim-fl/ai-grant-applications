"use client";

import Link from "next/link";
import { Calendar, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project } from "@/lib/mock-data";

interface ProjectCardProps {
  project: Project;
}

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

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-ocean hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 group-hover:text-ocean">
            {project.name}
          </h3>
          <p className="text-sm text-slate-500">{project.funder}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-ocean" />
      </div>

      <div className="mt-auto space-y-2">
        {project.deadline && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar className="h-4 w-4" />
            <span>
              Due:{" "}
              {new Date(project.deadline).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <FileText className="h-4 w-4" />
          <span>
            {project.sectionsCount}{" "}
            {project.sectionsCount === 1 ? "section" : "sections"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              statusStyles[project.status]
            )}
          >
            {statusLabels[project.status]}
          </span>
          <span className="text-xs text-slate-400">
            Updated {project.updatedAt}
          </span>
        </div>
      </div>
    </Link>
  );
}
