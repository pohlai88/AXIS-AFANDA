# Keycloak IAM Implementation Summary

This document summarizes the Keycloak IAM integration implementation for AXIS-AFENDA.

## Implementation Status: ✅ Complete

All components of the Keycloak IAM integration have been implemented and are ready for use.

## Components Implemented

### 1. Authentication Configuration ✅

**File**: `app/lib/auth/config.ts`

- NextAuth.js configuration with Keycloak OIDC provider
- JWT token handling with automatic refresh
- Group and role extraction from Keycloak profile
- Session management with 30-day expiration
- Type-safe session and JWT types

**Features**:
- OIDC/OAuth2 authentication flow
- Automatic token refresh
- Group/role mapping
- Tenant resolution from groups

### 2. Auth API Route ✅

**File**: `app/api/auth/[...nextauth]/route.ts`

- NextAuth.js API route handler
- Handles all authentication endpoints:
  - `/api/auth/signin`
  - `/api/auth/signout`
  - `/api/auth/session`
  - `/api/auth/callback/keycloak`

### 3. Auth Middleware ✅

**File**: `middleware.ts`

- Protects `/app/**` routes
- Redirects unauthenticated users to sign-in
- Adds user info to request headers
- Allows public routes (`/`, `/auth/**`, `/api/auth/**`)

### 4. Keycloak Admin Client ✅

**File**: `app/lib/keycloak/client.ts`

- Keycloak Admin REST API client
- Service account authentication
- User and group management utilities
- Tenant resolution from groups
- Token caching and automatic refresh

**Use Cases**:
- Server-side tenant sync
- User group management
- Role assignment
- Bulk operations

### 5. Tenant Resolution ✅

**File**: `app/lib/keycloak/tenant-resolver.ts`

- Maps Keycloak groups to tenant structure
- Supports: Individual, Team, Organization tenants
- Default tenant selection (Org > Team > Individual)
- Path-based group parsing

**Group Structure**:
- `/teams/*` → Team tenant
- `/organizations/*` → Organization tenant
- User ID → Individual tenant

### 6. Tenant Provider (Updated) ✅

**File**: `app/providers/tenant-provider.tsx`

- Syncs tenants from Keycloak session
- Resolves tenants from user groups
- Persists tenant selection in localStorage
- Validates tenant against available tenants
- Loading state management

### 7. Session Provider ✅

**File**: `app/providers/session-provider.tsx`

- Wraps app with NextAuth session provider
- Makes session available to all client components

### 8. Authentication UI Components ✅

**Files**:
- `app/auth/signin/page.tsx` - Sign-in page
- `app/auth/error/page.tsx` - Error page
- `app/components/auth-button.tsx` - User menu with sign-out

**Features**:
- Keycloak OAuth sign-in flow
- Error handling and display
- User avatar and profile menu
- Sign-out functionality

### 9. Hooks ✅

**Files**:
- `app/hooks/use-auth.ts` - Auth state hook
- `app/hooks/use-api-client.ts` - Authenticated API client hook

**Usage**:
```tsx
// Get auth state
const { user, isAuthenticated, groups, roles } = useAuth();

// Get authenticated API client
const api = useApiClient();
const data = await api.get("/approvals");
```

### 10. Layout Integration ✅

**Files Updated**:
- `app/layout.tsx` - Added SessionProvider
- `app/app/layout.tsx` - Integrated Keycloak session for tenants
- `components/site-header.tsx` - Added AuthButton

## File Structure

```
app/
├── lib/
│   ├── auth/
│   │   ├── config.ts          # NextAuth configuration
│   │   └── index.ts           # Auth exports
│   └── keycloak/
│       ├── client.ts          # Admin API client
│       └── tenant-resolver.ts  # Tenant resolution
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts        # NextAuth API route
├── auth/
│   ├── signin/
│   │   └── page.tsx           # Sign-in page
│   └── error/
│       └── page.tsx           # Error page
├── components/
│   └── auth-button.tsx        # User menu component
├── providers/
│   ├── session-provider.tsx   # Session provider
│   └── tenant-provider.tsx    # Tenant provider (updated)
└── hooks/
    ├── use-auth.ts            # Auth hook
    └── use-api-client.ts      # API client hook
middleware.ts                  # Auth middleware
```

## Environment Variables Required

See `.dev-docs/KEYCLOAK-IAM-SETUP.md` for complete environment variable documentation.

**Required**:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `KEYCLOAK_ISSUER`
- `KEYCLOAK_CLIENT_ID`
- `KEYCLOAK_CLIENT_SECRET`

**Optional** (for Admin API):
- `KEYCLOAK_BASE_URL`
- `KEYCLOAK_REALM`
- `KEYCLOAK_ADMIN_CLIENT_ID`
- `KEYCLOAK_ADMIN_CLIENT_SECRET`

## Usage Examples

### Server Component

```tsx
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  return <div>Hello {session.user.name}</div>;
}
```

### Client Component

```tsx
"use client";

import { useAuth } from "@/app/hooks/use-auth";
import { useApiClient } from "@/app/hooks/use-api-client";

export function Component() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const api = useApiClient();
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  
  // Use authenticated API client
  const handleFetch = async () => {
    const data = await api.get("/approvals");
  };
  
  return <div>Hello {user?.name}</div>;
}
```

### API Route

```tsx
import { auth } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Access user info
  const userId = session.user.id;
  const groups = session.user.groups;
  
  return NextResponse.json({ userId, groups });
}
```

## Integration Points

### 1. Tenant Resolution

Tenants are automatically resolved from Keycloak groups when:
- User signs in
- Session is loaded
- Groups change

**Flow**:
1. User authenticates → Keycloak returns groups
2. Groups extracted from JWT token
3. Tenants resolved via `tenant-resolver.ts`
4. Default tenant selected (Org > Team > Individual)
5. Tenant stored in context and localStorage

### 2. API Authentication

All API requests to orchestrator should include the access token:

```tsx
const api = useApiClient(); // Automatically includes token
await api.get("/approvals");
```

Or manually:

```tsx
const { accessToken } = useAuth();
const response = await fetch("/api/v1/approvals", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### 3. Protected Routes

Middleware automatically protects `/app/**` routes:
- Unauthenticated → Redirect to `/auth/signin`
- Authenticated → Access granted
- User info available in headers

## Testing Checklist

- [ ] Keycloak realm configured
- [ ] Client created with correct redirect URIs
- [ ] Test user created and assigned to groups
- [ ] Environment variables set
- [ ] Sign-in flow works
- [ ] Session persists across page loads
- [ ] Token refresh works
- [ ] Tenants resolve from groups
- [ ] Protected routes redirect when not authenticated
- [ ] API client includes auth token
- [ ] Sign-out works

## Next Steps

1. **Configure Keycloak**: Set up realm, client, groups (see `KEYCLOAK-IAM-SETUP.md`)
2. **Set Environment Variables**: Add all required variables to `.env.local`
3. **Test Authentication**: Verify sign-in/sign-out flow
4. **Test Tenant Resolution**: Create test users with groups and verify tenants
5. **Integrate with Orchestrator**: Ensure orchestrator validates JWT tokens
6. **Production Setup**: Configure production Keycloak instance

## Documentation

- **Setup Guide**: `.dev-docs/KEYCLOAK-IAM-SETUP.md` - Complete setup instructions
- **Project Spec**: `.dev-docs/PROJECT-SPEC.md` - Architecture and conventions
- **Project Reference**: `.dev-docs/AXIS-AFENDA-PROJECT-REF.md` - Detailed technical reference

## Consistency with Project Spec

This implementation follows the project specifications:

✅ **Keycloak as SSOT**: All identity/permissions from Keycloak  
✅ **No Local Roles**: No role editing in sub-systems  
✅ **NextAuth.js**: As specified in project reference  
✅ **Group Mapping**: Groups → Tenants as documented  
✅ **JWT Validation**: Tokens validated on every request  
✅ **Session Management**: Redis-ready (can be added later)  
✅ **Tenant Isolation**: Tenant context from Keycloak groups  

---

*Implementation completed: 2026-01-28*  
*Status: Ready for Keycloak configuration and testing*
