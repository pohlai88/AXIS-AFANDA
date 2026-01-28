# Keycloak IAM Quick Start

Fast setup guide for getting Keycloak authentication working locally.

## Prerequisites

- Docker installed
- Node.js 18+ installed
- Project dependencies installed (`npm install`)

## Step-by-Step Setup

### 1. Start Keycloak (2 minutes)

```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak start-dev
```

Wait for: `Keycloak 26.x.x started`

### 2. Configure Keycloak Realm (5 minutes)

1. **Access Admin Console**: http://localhost:8080/admin
   - Username: `admin`
   - Password: `admin`

2. **Create Realm**:
   - Click dropdown (top-left) → **Create realm**
   - Name: `axis`
   - **Create**

3. **Create Client**:
   - **Clients** → **Create client**
   - **Client ID**: `shell-app`
   - **Next**
   - **Client authentication**: `ON`
   - **Next**
   - **Valid redirect URIs**: `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
   - **Save**

4. **Get Client Secret**:
   - **Clients** → `shell-app` → **Credentials** tab
   - Copy the **Client secret** (you'll need this)

5. **Add Groups Mapper** (CRITICAL):
   - **Clients** → `shell-app` → **Client scopes** tab
   - Click `shell-app-dedicated`
   - **Add mapper** → **By configuration** → **Group Membership**
   - **Name**: `groups`
   - **Token Claim Name**: `groups`
   - **Full group path**: `ON`
   - **Add to ID token**: `ON`
   - **Add to access token**: `ON`
   - **Save**

6. **Create Groups**:
   - **Groups** → **Create group**
   - Name: `teams` → **Create**
   - Click `teams` → **Create child group**
   - Name: `engineering` → **Create**
   - Repeat for `organizations/acme-corp`

7. **Create Test User**:
   - **Users** → **Add user**
   - **Username**: `testuser`
   - **Email**: `test@example.com`
   - **First name**: `Test`
   - **Last name**: `User`
   - **Create**
   - **Credentials** tab → **Set password**
   - Password: `testpass` (temporary: `OFF`)
   - **Save**
   - **Groups** tab → **Join group**
   - Select `/teams/engineering` → **Join**

### 3. Configure Environment Variables (1 minute)

```bash
# Copy example
cp .env.example .env.local

# Generate secret
openssl rand -base64 32

# Edit .env.local:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-generated-secret>
KEYCLOAK_ISSUER=http://localhost:8080/realms/axis
KEYCLOAK_CLIENT_ID=shell-app
KEYCLOAK_CLIENT_SECRET=<paste-from-keycloak>
```

### 4. Start Application (1 minute)

```bash
npm run dev
```

### 5. Test Authentication (1 minute)

1. Open: http://localhost:3000/app
2. Should redirect to sign-in page
3. Click "Sign in with Keycloak"
4. Login with:
   - Username: `testuser`
   - Password: `testpass`
5. Should redirect back to `/app`
6. Check tenant switcher (top-right) shows:
   - Personal (Test User)
   - Engineering (team)

## Verification Checklist

- [ ] Keycloak running on port 8080
- [ ] Realm `axis` created
- [ ] Client `shell-app` created with secret
- [ ] Groups mapper added (full path enabled)
- [ ] Groups created: `/teams/engineering`, `/organizations/acme-corp`
- [ ] Test user created and assigned to groups
- [ ] `.env.local` configured with client secret
- [ ] App running on port 3000
- [ ] Sign-in redirects to Keycloak
- [ ] After login, redirects back to app
- [ ] Tenant switcher shows groups

## Troubleshooting

### "Configuration error"
- Check `KEYCLOAK_CLIENT_SECRET` matches Keycloak
- Verify `KEYCLOAK_ISSUER` URL is correct
- Ensure realm name is `axis`

### "Tenants not showing"
- Verify groups mapper is configured
- Check "Full group path" is enabled
- Ensure user is assigned to groups
- Check browser console for errors

### "Redirect loop"
- Clear browser cookies
- Check `NEXTAUTH_URL` matches your app URL
- Verify redirect URIs in Keycloak client

### "Access denied"
- User might not be enabled in Keycloak
- Check user credentials are set
- Verify client is enabled

## Next Steps

- Add more users and groups
- Configure organization tenants
- Set up Keycloak Admin API (optional)
- Configure production Keycloak instance
- Set up Redis for session storage (optional)

## Resources

- [Full Setup Guide](.dev-docs/KEYCLOAK-IAM-SETUP.md)
- [Implementation Details](.dev-docs/KEYCLOAK-IAM-IMPLEMENTATION.md)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

---

*Estimated setup time: 10 minutes*
