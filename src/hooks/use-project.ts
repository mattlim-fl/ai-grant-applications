"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Project, Document } from "@/types/database";

interface ProjectWithDocuments extends Project {
  documents: Document[];
}

interface UseProjectReturn {
  project: ProjectWithDocuments | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProject: (data: UpdateProjectData) => Promise<boolean>;
  addDocument: (title: string) => Promise<Document | null>;
  updateDocument: (docId: string, data: UpdateDocumentData) => Promise<boolean>;
  deleteDocument: (docId: string) => Promise<boolean>;
  reorderDocuments: (order: string[]) => Promise<boolean>;
}

interface UpdateProjectData {
  name?: string;
  funder?: string;
  deadline?: string;
  status?: Project["status"];
}

interface UpdateDocumentData {
  title?: string;
  content?: string;
}

export function useProject(projectId: string): UseProjectReturn {
  const [project, setProject] = useState<ProjectWithDocuments | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track pending saves for debouncing
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`/api/projects/${projectId}`);
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return;
      }
      
      setProject(json.data);
    } catch (err) {
      setError("Failed to fetch project");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const updateProject = async (data: UpdateProjectData): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return false;
      }
      
      setProject((prev) => prev ? { ...prev, ...json.data } : null);
      return true;
    } catch (err) {
      setError("Failed to update project");
      return false;
    }
  };

  const addDocument = async (title: string): Promise<Document | null> => {
    if (!projectId) return null;
    
    try {
      const res = await fetch(`/api/projects/${projectId}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return null;
      }
      
      // Add to local state
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          documents: [...prev.documents, json.data],
        };
      });
      
      return json.data;
    } catch (err) {
      setError("Failed to add document");
      return null;
    }
  };

  const updateDocument = async (docId: string, data: UpdateDocumentData): Promise<boolean> => {
    if (!projectId) return false;
    
    // Optimistically update local state
    setProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === docId ? { ...d, ...data } : d
        ),
      };
    });

    // Debounce the actual API call for content updates
    if (data.content !== undefined) {
      if (saveTimeoutRef.current[docId]) {
        clearTimeout(saveTimeoutRef.current[docId]);
      }
      
      return new Promise((resolve) => {
        saveTimeoutRef.current[docId] = setTimeout(async () => {
          try {
            const res = await fetch(`/api/projects/${projectId}/documents/${docId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const json = await res.json();
            
            if (json.error) {
              setError(json.error.message);
              resolve(false);
              return;
            }
            
            resolve(true);
          } catch (err) {
            setError("Failed to save document");
            resolve(false);
          }
        }, 1000); // 1 second debounce
      });
    }

    // Immediate save for non-content updates (like title)
    try {
      const res = await fetch(`/api/projects/${projectId}/documents/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return false;
      }
      
      return true;
    } catch (err) {
      setError("Failed to update document");
      return false;
    }
  };

  const deleteDocument = async (docId: string): Promise<boolean> => {
    if (!projectId) return false;
    
    try {
      const res = await fetch(`/api/projects/${projectId}/documents/${docId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return false;
      }
      
      // Remove from local state
      setProject((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          documents: prev.documents.filter((d) => d.id !== docId),
        };
      });
      
      return true;
    } catch (err) {
      setError("Failed to delete document");
      return false;
    }
  };

  const reorderDocuments = async (order: string[]): Promise<boolean> => {
    if (!projectId) return false;
    
    // Optimistically reorder local state
    setProject((prev) => {
      if (!prev) return null;
      const reordered = order
        .map((id) => prev.documents.find((d) => d.id === id))
        .filter(Boolean) as Document[];
      return { ...prev, documents: reordered };
    });

    try {
      const res = await fetch(`/api/projects/${projectId}/documents/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        // Refetch to get correct order
        await fetchProject();
        return false;
      }
      
      return true;
    } catch (err) {
      setError("Failed to reorder documents");
      await fetchProject();
      return false;
    }
  };

  return {
    project,
    loading,
    error,
    refetch: fetchProject,
    updateProject,
    addDocument,
    updateDocument,
    deleteDocument,
    reorderDocuments,
  };
}
