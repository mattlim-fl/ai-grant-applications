"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Plus, Check } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const defaultSections = [
  { id: "about", title: "About Us", description: "Organisation background and mission" },
  { id: "need", title: "Statement of Need", description: "Why this project is needed" },
  { id: "project", title: "Project Description", description: "What you plan to do" },
  { id: "outcomes", title: "Outcomes & Impact", description: "Expected results and how you'll measure them" },
  { id: "budget", title: "Budget", description: "Financial breakdown" },
  { id: "sustainability", title: "Sustainability", description: "How the project will continue" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [funder, setFunder] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "about",
    "need",
    "project",
    "budget",
  ]);

  const toggleSection = (id: string) => {
    setSelectedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    // In real implementation, this would create the project in the database
    // For now, just redirect to the first mock project
    router.push("/projects/1");
  };

  return (
    <AppShell>
      <div className="h-full overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 py-8">
          {/* Back link */}
          <Link
            href="/"
            className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-slate-900">
              New Grant Application
            </h1>
            <p className="mt-1 text-slate-500">
              Create a new project to start working on your grant application.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Project name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Project Name *
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sport England Youth Sailing 2025"
                className="w-full"
              />
            </div>

            {/* Funder */}
            <div>
              <label
                htmlFor="funder"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Funder
              </label>
              <Input
                id="funder"
                value={funder}
                onChange={(e) => setFunder(e.target.value)}
                placeholder="e.g., Sport England"
                className="w-full"
              />
              <p className="mt-1 text-xs text-slate-500">
                Optional — helps organise your applications
              </p>
            </div>

            {/* Deadline */}
            <div>
              <label
                htmlFor="deadline"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Deadline
              </label>
              <div className="relative">
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Optional — we'll remind you as it approaches
              </p>
            </div>

            {/* Sections */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sections to Include
              </label>
              <p className="mb-3 text-xs text-slate-500">
                Select the sections you need for this application. You can add or remove sections later.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {defaultSections.map((section) => {
                  const isSelected = selectedSections.includes(section.id);
                  return (
                    <button
                      key={section.id}
                      onClick={() => toggleSection(section.id)}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                        isSelected
                          ? "border-ocean bg-ocean/5"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                          isSelected
                            ? "border-ocean bg-ocean text-white"
                            : "border-slate-300"
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            isSelected ? "text-ocean" : "text-slate-700"
                          )}
                        >
                          {section.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {section.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreate}
                disabled={!name.trim()}
                className="gap-2 bg-ocean hover:bg-ocean-dark"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
