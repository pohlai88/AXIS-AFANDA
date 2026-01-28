"use client";

import * as React from "react";
import { z } from "zod";

const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["individual", "team", "org"]),
});

export type Tenant = z.infer<typeof tenantSchema>;

type TenantContextType = {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant | null) => void;
  tenants: Tenant[];
  isLoading: boolean;
};

const TenantContext = React.createContext<TenantContextType | undefined>(
  undefined
);

export function TenantProvider({
  children,
  initialTenant,
  tenants = [],
}: {
  children: React.ReactNode;
  initialTenant?: Tenant | null;
  tenants?: Tenant[];
}) {
  const [tenant, setTenantState] = React.useState<Tenant | null>(
    initialTenant ?? null
  );
  const [isLoading, setIsLoading] = React.useState(false);

  // Set initial tenant
  React.useEffect(() => {
    if (!tenant && tenants.length > 0) {
      setTenantState(tenants[0]);
      if (typeof window !== "undefined") {
        localStorage.setItem("tenant", JSON.stringify(tenants[0]));
      }
    }
  }, [tenant, tenants]);

  const setTenant = React.useCallback((newTenant: Tenant | null) => {
    setTenantState(newTenant);
    // Persist to localStorage
    if (typeof window !== "undefined") {
      if (newTenant) {
        localStorage.setItem("tenant", JSON.stringify(newTenant));
      } else {
        localStorage.removeItem("tenant");
      }
    }
  }, []);

  // Load from localStorage on mount
  React.useEffect(() => {
    if (typeof window === "undefined" || tenants.length === 0) return;
    const stored = localStorage.getItem("tenant");
    if (!stored) return;
    try {
      const parsed = tenantSchema.parse(JSON.parse(stored));
      const isValid = tenants.some((t) => t.id === parsed.id);
      if (isValid) {
        setTenantState(parsed);
      }
    } catch {
      // Invalid stored tenant, ignore
    }
  }, [tenants]);

  const value = React.useMemo(
    () => ({
      tenant,
      setTenant,
      tenants,
      isLoading,
    }),
    [tenant, setTenant, tenants, isLoading]
  );

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  );
}

export function useTenant() {
  const context = React.useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
