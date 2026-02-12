"use client";

import { Plus, Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNewChat: () => void;
}

export function Header({ onNewChat }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ocean text-white">
            <Anchor className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">Shadwell Basin</h1>
            <p className="text-sm text-slate-500">Grant Assistant</p>
          </div>
        </div>

        <Button
          onClick={onNewChat}
          variant="outline"
          size="sm"
          className="gap-1.5 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>
    </header>
  );
}
