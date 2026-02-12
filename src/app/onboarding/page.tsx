"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Anchor, Loader2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrganization } from "@/hooks/use-organization";

export default function OnboardingPage() {
  const router = useRouter();
  const { createOrganization } = useOrganization();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Organization name is required");
      return;
    }

    setLoading(true);
    setError(null);

    const org = await createOrganization(name.trim());
    
    if (org) {
      router.push("/");
      router.refresh();
    } else {
      setError("Failed to create organization");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean text-white">
            <Anchor className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">
            Welcome to Grant Assistant
          </h1>
          <p className="mt-1 text-center text-slate-500">
            Let's set up your organization to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ocean/10">
              <Building2 className="h-8 w-8 text-ocean" />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Organization Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Shadwell Basin Outdoor Activity Centre"
              required
              className="w-full"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              This is the name of your charity or organization
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-ocean hover:bg-ocean-dark"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Organization"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          You can invite team members and manage settings later
        </p>
      </div>
    </div>
  );
}
