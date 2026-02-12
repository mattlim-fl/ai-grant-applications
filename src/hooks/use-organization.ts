"use client";

import { useState, useEffect, useCallback } from "react";
import type { Organization } from "@/types/database";

interface OrganizationWithRole extends Organization {
  role: "owner" | "admin" | "member";
}

interface UseOrganizationReturn {
  currentOrg: OrganizationWithRole | null;
  organizations: OrganizationWithRole[];
  loading: boolean;
  error: string | null;
  createOrganization: (name: string) => Promise<OrganizationWithRole | null>;
  switchOrganization: (orgId: string) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useOrganization(): UseOrganizationReturn {
  const [currentOrg, setCurrentOrg] = useState<OrganizationWithRole | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all orgs
      const orgsRes = await fetch("/api/organizations");
      const orgsJson = await orgsRes.json();
      
      if (orgsJson.error) {
        setError(orgsJson.error.message);
        return;
      }
      
      setOrganizations(orgsJson.data || []);

      // Fetch current org
      const currentRes = await fetch("/api/organizations/current");
      const currentJson = await currentRes.json();
      
      if (currentJson.data) {
        setCurrentOrg(currentJson.data);
      } else if (orgsJson.data?.length > 0) {
        // If no current org but user has orgs, set first one as current
        const firstOrg = orgsJson.data[0];
        await switchOrganization(firstOrg.id);
      }
    } catch (err) {
      setError("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const createOrganization = async (name: string): Promise<OrganizationWithRole | null> => {
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return null;
      }
      
      const newOrg = json.data;
      setOrganizations((prev) => [...prev, newOrg]);
      setCurrentOrg(newOrg);
      return newOrg;
    } catch (err) {
      setError("Failed to create organization");
      return null;
    }
  };

  const switchOrganization = async (orgId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/organizations/current", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: orgId }),
      });
      const json = await res.json();
      
      if (json.error) {
        setError(json.error.message);
        return false;
      }
      
      setCurrentOrg(json.data);
      return true;
    } catch (err) {
      setError("Failed to switch organization");
      return false;
    }
  };

  return {
    currentOrg,
    organizations,
    loading,
    error,
    createOrganization,
    switchOrganization,
    refetch: fetchOrganizations,
  };
}
