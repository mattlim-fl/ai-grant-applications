"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function NewProjectCard() {
  return (
    <Link
      href="/projects/new"
      className="group flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white p-5 transition-all hover:border-ocean hover:bg-ocean/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-ocean/10">
        <Plus className="h-6 w-6 text-slate-400 group-hover:text-ocean" />
      </div>
      <span className="mt-3 font-medium text-slate-600 group-hover:text-ocean">
        New Project
      </span>
      <span className="mt-1 text-sm text-slate-400">
        Start a new grant application
      </span>
    </Link>
  );
}
