import { z } from "zod";

export const moduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["in-app", "iframe"]),
  route: z.string(), // e.g., "/app/approvals"
  component: z.string().optional(), // For in-app: component path
  url: z.string().optional(), // For iframe: external URL
  icon: z.string().optional(), // Icon name or path
  enabled: z.boolean().default(true),
  lazy: z.boolean().default(true), // Lazy load iframe
});

export type Module = z.infer<typeof moduleSchema>;

/**
 * Module Registry
 * Defines which modules exist, their type (in-app vs iframe), and how to load them.
 * This enables the Shell to dynamically render modules based on configuration.
 */
export const moduleRegistry: Module[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Overview and activity",
    type: "in-app",
    route: "/app",
    component: "dashboard",
    icon: "LayoutDashboard",
    enabled: true,
    lazy: false,
  },
  {
    id: "inbox",
    name: "Inbox",
    description: "Customer messages",
    type: "in-app",
    route: "/app/inbox",
    component: "inbox",
    icon: "Inbox",
    enabled: true,
    lazy: false,
  },
  {
    id: "approvals",
    name: "Approvals",
    description: "Approval workflow",
    type: "in-app",
    route: "/app/approvals",
    component: "approvals",
    icon: "CheckSquare",
    enabled: true,
    lazy: false,
  },
  {
    id: "omnichannel",
    name: "Omnichannel",
    description: "Chatwoot integration",
    type: "iframe",
    route: "/app/omnichannel",
    url: process.env.NEXT_PUBLIC_CHATWOOT_URL || "",
    icon: "MessageSquare",
    enabled: true,
    lazy: true,
  },
  {
    id: "consultations",
    name: "Consultations",
    description: "Jitsi and Matrix",
    type: "iframe",
    route: "/app/consultations",
    url: process.env.NEXT_PUBLIC_JITSI_URL || "",
    icon: "Video",
    enabled: true,
    lazy: true,
  },
  {
    id: "activity",
    name: "Activity",
    description: "Activity timeline and feed",
    type: "in-app",
    route: "/app/activity",
    component: "activity",
    icon: "Activity",
    enabled: true,
    lazy: false,
  },
];

/**
 * Get module by ID
 */
export function getModule(id: string): Module | undefined {
  return moduleRegistry.find((m) => m.id === id);
}

/**
 * Get module by route
 */
export function getModuleByRoute(route: string): Module | undefined {
  return moduleRegistry.find((m) => m.route === route);
}

/**
 * Get all enabled modules
 */
export function getEnabledModules(): Module[] {
  return moduleRegistry.filter((m) => m.enabled);
}

/**
 * Get modules by type
 */
export function getModulesByType(type: "in-app" | "iframe"): Module[] {
  return moduleRegistry.filter((m) => m.type === type && m.enabled);
}
