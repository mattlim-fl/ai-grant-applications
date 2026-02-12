"use client";

import { useState, useEffect, useCallback } from "react";
import type { Project } from "@/types/database";

interface ProjectWithCount extends Project {
  documents_count: number;
}

interface UseProjectsReturn {
  projects: ProjectWithCount[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProject: (data: CreateProjectData) => Promise<Project | null>;
  updateProject: (id: string, data: UpdateProjectData) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
}

interface CreateProjectData {
  name: string;
  funder?: string;
  deadline?: string;
  sections?: string[];
}

interface UpdateProjectData {
  name?: string;
  funder?: string;
  deadline?: string;
  status?: Project["status"];
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<ProjectWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch("/api/projects");
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return;
      }
      
      setProjects(json.data || []);
    } catch (err) {
      setError("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (data: CreateProjectData): Promise<Project | null> => {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return null;
      }
      
      // Refetch to get updated list
      await fetchProjects();
      return json.data;
    } catch (err) {
      setError("Failed to create project");
      return null;
    }
  };

  const updateProject = async (id: string, data: UpdateProjectData): Promise<Project | null> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return null;
      }
      
      // Update local state
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...json.data } : p))
      );
      return json.data;
    } catch (err) {
      setError("Failed to update project");
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return false;
      }
      
      // Remove from local state
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete project");
      return false;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
