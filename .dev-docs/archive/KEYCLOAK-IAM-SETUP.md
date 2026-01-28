# Keycloak IAM Integration Setup

This document describes the Keycloak IAM integration for AXIS-AFENDA. Keycloak serves as the **single source of truth** for identity and permissions.

## Overview

- **Authentication**: NextAuth.js with Keycloak OIDC provider
- **Authorization**: Keycloak groups and roles mapped to tenant structure
- **Session Management**: JWT tokens with automatic refresh
- **Tenant Resolution**: Keycloak groups → Individual / Team / Organization tenants

## Architecture

```
User → Shell App → Keycloak (OIDC)
                      ↓
                  JWT Token
                      ↓
        ┌─────────────┴─────────────┐
        ▼                           ▼
  Shell App Session          Orchestrator API
  (NextAuth)                 (JWT Validation)
        │                           │
        └───────────┬───────────────┘
                    ▼
            External Services
         (Chatwoot, Matrix, Jitsi)
```

## Keycloak Configuration

### 1. Realm Setup

1. Access Keycloak Admin Console: `http://localhost:8080/admin`
2. Create realm: `axis` (or use existing)
3. Configure realm settings:
   - **Realm name**: `axis`
   - **Enabled**: `ON`
   - **User-managed access**: `OFF` (for MVP)

### 2. Client Configuration

Create a client for the Shell App:

1. **Clients** → **Create client**
2. **Client ID**: `shell-app`
3. **Client authentication**: `ON` (confidential client)
4. **Authorization**: `OFF` (for MVP)
5. **Valid redirect URIs**:
   - `http://localhost:3000/api/auth/callback/keycloak`
   - `http://localhost:3000/auth/signin`
6. **Web origins**: `http://localhost:3000`
7. **Access token lifespan**: `5 minutes` (default)
8. **SSO session idle**: `30 minutes`
9. **SSO session max**: `10 hours`

### 2.1. Add Groups to Token (Critical)

By default, Keycloak does not include groups in the JWT token. You must add a **protocol mapper**:

1. Go to **Clients** → `shell-app` → **Client scopes** tab
2. Click on `shell-app-dedicated` (or create a dedicated scope)
3. **Add mapper** → **By configuration** → **Group Membership**
4. Configure:
   - **Name**: `groups`
   - **Token Claim Name**: `groups`
   - **Full group path**: `ON` (to get `/teams/engineering` instead of `engineering`)
   - **Add to ID token**: `ON`
   - **Add to access token**: `ON`
   - **Add to userinfo**: `ON`
5. **Save**

**Verify**: After signing in, check the JWT token includes a `groups` claim with full paths.

### 3. Group Structure

Configure groups to map to tenant structure:

```
/teams/engineering          → Team tenant
/teams/sales               → Team tenant
/organizations/acme-corp   → Organization tenant
```

**Setup**:
1. **Groups** → **Create group**
2. Create parent groups: `teams`, `organizations`
3. Create child groups under each parent
4. Assign users to groups

### 4. Roles (Optional for MVP)

For MVP, groups are sufficient. Roles can be added later for fine-grained permissions:

- **Realm roles**: Global roles (e.g., `admin`, `user`)
- **Client roles**: Client-specific roles (e.g., `approver`, `viewer`)

### 5. User Attributes

Keycloak user attributes can be used to store additional metadata:
- `tenant_id`: Primary tenant preference
- `department`: Department information
- Custom attributes as needed

## Environment Variables

Create `.env.local` file with the following variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Keycloak OAuth Configuration
KEYCLOAK_ISSUER=http://localhost:8080/realms/axis
KEYCLOAK_CLIENT_ID=shell-app
KEYCLOAK_CLIENT_SECRET=your-client-secret-from-keycloak

# Keycloak Admin API (for tenant sync, optional)
KEYCLOAK_BASE_URL=http://localhost:8080
KEYCLOAK_REALM=axis
KEYCLOAK_ADMIN_CLIENT_ID=admin-cli
KEYCLOAK_ADMIN_CLIENT_SECRET=your-admin-client-secret

# Optional: Well-known endpoint (if custom)
KEYCLOAK_WELL_KNOWN=http://localhost:8080/realms/axis/.well-known/openid-configuration
```

### Generating Secrets

**NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

**KEYCLOAK_CLIENT_SECRET**:
1. Go to Keycloak Admin Console
2. **Clients** → `shell-app` → **Credentials** tab
3. Copy the **Client secret**

**KEYCLOAK_ADMIN_CLIENT_SECRET**:
1. Create a service account client in Keycloak
2. Enable **Service accounts roles**
3. Assign `realm-management` roles (e.g., `view-users`, `view-groups`)
4. Copy the client secret from **Credentials** tab

## Implementation Details

### Authentication Flow

1. User clicks "Sign in" → Redirected to Keycloak
2. User authenticates in Keycloak
3. Keycloak redirects back with authorization code
4. NextAuth exchanges code for tokens
5. JWT token stored in session with groups/roles
6. Session available throughout app

### Tenant Resolution

Tenants are resolved from Keycloak groups:

```typescript
// Keycloak groups: ["/teams/engineering", "/organizations/acme-corp"]
// Resolved tenants:
[
  { id: "user-123", name: "Personal", type: "individual" },
  { id: "/teams/engineering", name: "Engineering", type: "team" },
  { id: "/organizations/acme-corp", name: "Acme Corp", type: "org" }
]
```

**Default tenant selection**:
- Prefers: Organization → Team → Individual
- Stored in localStorage for persistence

### Token Refresh

Access tokens are automatically refreshed when expired:
- Refresh token used to get new access token
- Seamless user experience (no re-authentication needed)
- Refresh token rotation supported

### Protected Routes

Middleware protects `/app/**` routes:
- Unauthenticated users → Redirected to `/auth/signin`
- Authenticated users → Access granted
- User info added to request headers

## API Integration

### Using Session in API Routes

```typescript
import { auth } from "@/app/lib/auth";

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  // Access user info
  const userId = session.user.id;
  const groups = session.user.groups;
  const roles = session.user.roles;
  
  // Make authenticated request to orchestrator
  const response = await fetch("http://orchestrator/api/v1/...", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });
  
  return response;
}
```

### Using Session in Server Components

```typescript
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

### Using Session in Client Components

```typescript
"use client";

import { useSession } from "next-auth/react";

export function Component() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Hello {session.user.name}</div>;
}
```

## Keycloak Admin API

The `KeycloakAdminClient` provides utilities for server-side operations:

```typescript
import { keycloakAdmin } from "@/app/lib/keycloak/client";

// Get user groups
const groups = await keycloakAdmin.getUserGroups(userId);

// Resolve tenants from groups
const tenants = await keycloakAdmin.resolveTenantsFromGroups(groupPaths);

// Get realm roles
const roles = await keycloakAdmin.getRealmRoles();
```

**Note**: Admin API requires service account with appropriate permissions.

## Testing

### Local Development

1. **Start Keycloak**:
   ```bash
   docker run -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak start-dev
   ```

2. **Configure Keycloak** (see sections above):
   - Create realm: `axis`
   - Create client: `shell-app`
   - Add groups mapper (critical!)
   - Create groups: `/teams/*`, `/organizations/*`
   - Create test user and assign to groups

3. **Set environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Keycloak client secret
   ```

4. **Generate NextAuth secret**:
   ```bash
   openssl rand -base64 32
   # Add to .env.local as NEXTAUTH_SECRET
   ```

5. **Start Next.js app**:
   ```bash
   npm run dev
   ```

6. **Test authentication flow**:
   - Navigate to `http://localhost:3000/app`
   - Should redirect to `/auth/signin`
   - Click "Sign in with Keycloak"
   - Authenticate in Keycloak
   - Should redirect back to `/app`
   - Check tenant switcher shows your groups

### Test Users

Create test users in Keycloak:
1. **Users** → **Add user**
2. Set username, email, password
3. Assign to groups (e.g., `/teams/engineering`)
4. Test sign-in flow

## Troubleshooting

### Common Issues

**"Configuration" error**:
- Check `KEYCLOAK_ISSUER` matches Keycloak realm
- Verify `KEYCLOAK_CLIENT_ID` exists
- Check `KEYCLOAK_CLIENT_SECRET` is correct

**"AccessDenied" error**:
- User may not have required groups/roles
- Check Keycloak user configuration

**Token refresh fails**:
- Verify refresh token is valid
- Check token expiration settings in Keycloak
- Ensure `KEYCLOAK_CLIENT_SECRET` is correct

**Tenants not resolving**:
- Verify user has groups assigned in Keycloak
- Check group paths match expected format (`/teams/*`, `/organizations/*`)
- Verify session includes groups in JWT token

### Debug Mode

Enable NextAuth debug logging:

```bash
NEXTAUTH_DEBUG=true npm run dev
```

Check browser console and server logs for detailed error messages.

## Security Considerations

1. **Secrets**: Never commit `.env.local` to git
2. **HTTPS**: Use HTTPS in production
3. **Token Storage**: JWT tokens stored in httpOnly cookies (secure)
4. **CORS**: Configure CORS properly in Keycloak
5. **Token Lifespan**: Set appropriate token expiration times
6. **Service Account**: Use minimal permissions for admin API

## Production Deployment

1. **Keycloak**:
   - Use production Keycloak instance
   - Enable HTTPS
   - Configure proper database (PostgreSQL)
   - Set up high availability (if needed)

2. **Environment Variables**:
   - Use secure secret management (e.g., Vault, AWS Secrets Manager)
   - Rotate secrets regularly
   - Use different secrets for each environment

3. **Monitoring**:
   - Monitor authentication failures
   - Track token refresh rates
   - Alert on suspicious activity

## References

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [OIDC Specification](https://openid.net/specs/openid-connect-core-1_0.html)
- [Project Spec](./PROJECT-SPEC.md) - Architecture and conventions

---

*Last updated: 2026-01-28*
