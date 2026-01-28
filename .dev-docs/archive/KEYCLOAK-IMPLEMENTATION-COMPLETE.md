# Keycloak IAM Implementation — Complete ✅

**Status**: Implementation complete and ready for testing  
**Date**: 2026-01-28

## Summary

Full Keycloak IAM integration has been implemented for AXIS-AFENDA. The system uses NextAuth.js v5 with Keycloak as the identity provider, following the project specifications for tenant-based multi-user authentication.

## What Was Implemented

### Core Authentication (NextAuth.js + Keycloak)

✅ **NextAuth configuration** (`app/lib/auth/config.ts`)
- Keycloak OIDC provider
- JWT token handling with automatic refresh
- Group and role extraction from Keycloak profile
- Session management (30-day expiration)
- Type-safe session/JWT types

✅ **API routes** (`app/api/auth/[...nextauth]/route.ts`)
- `/api/auth/signin` - Sign in
- `/api/auth/signout` - Sign out
- `/api/auth/session` - Get session
- `/api/auth/callback/keycloak` - OAuth callback

✅ **Middleware** (`middleware.ts`)
- Protects `/app/**` routes
- Redirects unauthenticated users
- Adds user info to request headers

### Keycloak Integration

✅ **Admin API client** (`app/lib/keycloak/client.ts`)
- Service account authentication
- User/group management utilities
- Token caching and refresh
- Tenant resolution from groups

✅ **Tenant resolution** (`app/lib/keycloak/tenant-resolver.ts`)
- Maps Keycloak groups → tenants
- Supports Individual/Team/Organization
- Default tenant selection (Org > Team > Individual)

✅ **Updated tenant provider** (`app/providers/tenant-provider.tsx`)
- Syncs tenants from Keycloak session
- Resolves tenants from user groups
- Persists selection in localStorage
- Loading state management

### UI Components

✅ **Authentication pages**
- Sign-in page (`app/auth/signin/page.tsx`)
- Error page (`app/auth/error/page.tsx`)
- Auth layout (`app/auth/layout.tsx`)

✅ **Components**
- Auth button with user menu (`app/components/auth-button.tsx`)
- Protected route wrapper (`app/components/require-auth.tsx`)

✅ **Layout integration**
- Root layout includes SessionProvider
- App layout uses Keycloak session for tenants
- Site header includes AuthButton

### Hooks & Utilities

✅ **Client hooks**
- `useAuth()` - Auth state hook
- `useApiClient()` - Authenticated API client

✅ **Server utilities** (`app/lib/auth/server.ts`)
- `requireAuth()` - Require auth in Server Components
- `getCurrentSession()` - Get session
- `hasRole()` / `inGroup()` - Permission checks
- `requireRole()` / `requireGroup()` - Enforce permissions

✅ **API endpoints**
- `/api/session` - Session data endpoint

### Configuration & Documentation

✅ **Environment setup**
- `.env.example` with all required variables
- Environment variable documentation

✅ **Documentation**
- **KEYCLOAK-IAM-SETUP.md** - Complete setup guide
- **KEYCLOAK-IAM-IMPLEMENTATION.md** - Implementation details
- **KEYCLOAK-QUICK-START.md** - 10-minute quick start
- Updated README.md

## File Structure

```
app/
├── lib/
│   ├── auth/
│   │   ├── config.ts           # NextAuth configuration
│   │   ├── index.ts            # Auth exports
│   │   └── server.ts           # Server-side utilities
│   ├── keycloak/
│   │   ├── client.ts           # Admin API client
│   │   └── tenant-resolver.ts  # Tenant resolution
│   └── api/
│       └── client.ts           # API client (auth-ready)
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts        # NextAuth API route
│   └── session/
│       └── route.ts            # Session endpoint
├── auth/
│   ├── layout.tsx              # Auth layout
│   ├── signin/
│   │   └── page.tsx            # Sign-in page
│   └── error/
│       └── page.tsx            # Error page
├── components/
│   ├── auth-button.tsx         # User menu
│   └── require-auth.tsx        # Protected route wrapper
├── providers/
│   ├── session-provider.tsx    # Session provider
│   └── tenant-provider.tsx     # Tenant provider (updated)
└── hooks/
    ├── use-auth.ts             # Auth hook
    └── use-api-client.ts       # API client hook
middleware.ts                   # Auth middleware
.env.example                    # Environment template
```

## Usage Examples

### Server Component (RSC)

```tsx
import { requireAuth } from "@/app/lib/auth/server";

export default async function Page() {
  const session = await requireAuth();
  return <div>Hello {session.user.name}</div>;
}
```

### Client Component

```tsx
"use client";
import { useAuth } from "@/app/hooks/use-auth";

export function Component() {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  return <div>Hello {user?.name}</div>;
}
```

### Protected Client Content

```tsx
import { RequireAuth } from "@/app/components/require-auth";

export function Page() {
  return (
    <RequireAuth>
      <ProtectedContent />
    </RequireAuth>
  );
}
```

### Authenticated API Calls

```tsx
"use client";
import { useApiClient } from "@/app/hooks/use-api-client";

export function Component() {
  const api = useApiClient(); // Auto-includes auth token
  
  const fetchData = async () => {
    const data = await api.get("/approvals");
  };
  
  return <button onClick={fetchData}>Fetch</button>;
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
  return NextResponse.json({ userId: session.user.id });
}
```

## Environment Variables Required

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Keycloak OAuth
KEYCLOAK_ISSUER=http://localhost:8080/realms/axis
KEYCLOAK_CLIENT_ID=shell-app
KEYCLOAK_CLIENT_SECRET=<from-keycloak-credentials>

# Optional: Keycloak Admin API
KEYCLOAK_BASE_URL=http://localhost:8080
KEYCLOAK_REALM=axis
KEYCLOAK_ADMIN_CLIENT_ID=admin-cli
KEYCLOAK_ADMIN_CLIENT_SECRET=<from-keycloak>
```

## Keycloak Configuration Checklist

- [ ] Realm `axis` created
- [ ] Client `shell-app` created (confidential)
- [ ] Client secret obtained
- [ ] **Groups mapper added** (critical - full path enabled)
- [ ] Groups created: `/teams/*`, `/organizations/*`
- [ ] Test user created
- [ ] User assigned to groups
- [ ] Valid redirect URIs configured
- [ ] Web origins configured

## Testing Checklist

- [ ] Keycloak running on port 8080
- [ ] `.env.local` configured
- [ ] App running on port 3000
- [ ] Navigate to `/app` redirects to sign-in
- [ ] Sign-in redirects to Keycloak
- [ ] After login, redirects back to `/app`
- [ ] Tenant switcher shows groups
- [ ] User menu shows profile
- [ ] Sign-out works
- [ ] Protected routes require auth
- [ ] API client includes auth token

## Key Features

### Authentication Flow
1. User accesses `/app` → Middleware checks auth
2. Not authenticated → Redirect to `/auth/signin`
3. User clicks "Sign in with Keycloak"
4. Keycloak OAuth flow
5. Callback to `/api/auth/callback/keycloak`
6. Session created with JWT
7. Redirect back to original URL

### Tenant Resolution
1. User signs in → Keycloak returns groups in JWT
2. Groups extracted: `["/teams/engineering", "/organizations/acme-corp"]`
3. Tenants resolved:
   - Personal (user ID)
   - Engineering (team)
   - Acme Corp (org)
4. Default tenant selected (Org > Team > Individual)
5. Tenant stored in context + localStorage

### Token Refresh
- Access token expires after 5 minutes (Keycloak default)
- Refresh token used automatically
- Seamless user experience (no re-authentication)
- Error handling for failed refresh

## Consistency with Project Spec

✅ **Keycloak as SSOT** - All identity/permissions from Keycloak  
✅ **No Local Roles** - No role editing in sub-systems  
✅ **NextAuth.js** - As specified in project reference  
✅ **Group Mapping** - Groups → Tenants as documented  
✅ **JWT Validation** - Tokens validated on every request  
✅ **Tenant Isolation** - Tenant context from Keycloak groups  
✅ **Session Management** - JWT strategy, Redis-ready  

## Next Steps

1. **Configure Keycloak** (10 minutes)
   - Follow [KEYCLOAK-QUICK-START.md](.dev-docs/KEYCLOAK-QUICK-START.md)

2. **Test Authentication** (5 minutes)
   - Sign in with test user
   - Verify tenant resolution
   - Check API authentication

3. **Integrate with Orchestrator** (future)
   - Orchestrator validates JWT tokens
   - Tenant isolation in database queries
   - Role-based permissions

4. **Production Setup** (future)
   - Production Keycloak instance
   - HTTPS everywhere
   - Secret management (Vault/AWS Secrets Manager)
   - Redis for session storage

## Resources

- [Keycloak Quick Start](.dev-docs/KEYCLOAK-QUICK-START.md)
- [Keycloak IAM Setup](.dev-docs/KEYCLOAK-IAM-SETUP.md)
- [Keycloak IAM Implementation](.dev-docs/KEYCLOAK-IAM-IMPLEMENTATION.md)
- [Project Spec](.dev-docs/PROJECT-SPEC.md)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

**Implementation Status**: ✅ Complete  
**Ready for**: Keycloak configuration and testing  
**Estimated setup time**: 10 minutes (with quick start guide)
