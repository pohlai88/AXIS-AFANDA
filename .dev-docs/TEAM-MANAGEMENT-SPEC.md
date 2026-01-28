# Team Management Specification

## Overview

Teams are **self-managed** entities that can be created by individuals or within existing teams. Organizations remain managed by Keycloak admin authority only.

## Tenant Hierarchy

```
Organization (Keycloak Admin)
  └── Team (Self-managed)
      └── Team (Self-managed, can be nested)
          └── Individual
```

## Team Management Rules

1. **Teams can be created by:**
   - Individuals (standalone teams)
   - Team admins (nested teams within their team)
   - Organization admins (teams within org)

2. **Team Visibility:**
   - **Public**: Visible to all members of parent org/team
   - **Private**: Only visible to team members and admins

3. **Team Roles:**
   - **Owner**: Full control (create/delete team, manage members, settings)
   - **Admin**: Manage members, invite, remove (cannot delete team)
   - **Member**: Participate, view team content

4. **Invitation System:**
   - Email invitations with secure tokens
   - Invitation links expire after 7 days
   - Invitations can be sent to:
     - Existing users (by email)
     - New users (creates account on acceptance)

5. **Organization Management:**
   - Organizations are **Keycloak-only**
   - Cannot be created via UI
   - Managed by Keycloak admin console
   - Teams sync from Keycloak groups (downward only)

## API Endpoints (Orchestrator)

```
# Teams
POST   /api/v1/teams                    # Create team
GET    /api/v1/teams                    # List accessible teams
GET    /api/v1/teams/:id                 # Get team details
PATCH  /api/v1/teams/:id                 # Update team (name, privacy)
DELETE /api/v1/teams/:id                 # Delete team (owner only)

# Team Members
GET    /api/v1/teams/:id/members        # List team members
POST   /api/v1/teams/:id/members        # Add member (direct)
DELETE /api/v1/teams/:id/members/:userId # Remove member

# Invitations
POST   /api/v1/teams/:id/invitations     # Send invitation
GET    /api/v1/teams/:id/invitations     # List pending invitations
POST   /api/v1/invitations/:token/accept # Accept invitation
DELETE /api/v1/invitations/:id           # Cancel invitation
```

## Database Schema

```sql
-- Teams (self-managed)
CREATE TABLE teams (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES teams(id), -- For nested teams
  parent_org_id UUID REFERENCES tenants(id), -- If under org
  visibility VARCHAR(20) NOT NULL DEFAULT 'private', -- 'public' | 'private'
  created_by UUID REFERENCES users(id) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'member', -- 'owner' | 'admin' | 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (team_id, user_id)
);

-- Team Invitations
CREATE TABLE team_invitations (
  id UUID PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  token VARCHAR(255) UNIQUE NOT NULL,
  invited_by UUID REFERENCES users(id) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## UI Components

1. **Create Team Dialog** (`app/components/create-team-dialog.tsx`)
   - Team name (required)
   - Description (optional)
   - Visibility toggle (public/private)
   - Parent selection (if creating nested team)

2. **Invite Members Dialog** (`app/components/invite-team-members-dialog.tsx`)
   - Email input (multiple)
   - Role selection (member/admin)
   - Send invitation button

3. **Team Settings Page** (`app/app/settings/teams/page.tsx`)
   - List of teams user owns/admins
   - Create team button
   - Team management (edit, delete, members)

4. **Team Members Page** (`app/app/teams/[id]/members/page.tsx`)
   - List of members
   - Invite button
   - Remove member (admin/owner)
   - Change role (owner only)

## Implementation Notes

- Teams are stored in Orchestrator DB (not Keycloak)
- Keycloak sync is **one-way** (orgs → teams, not teams → Keycloak)
- Team permissions are managed in Orchestrator
- Invitation tokens are cryptographically secure (UUID v4 + timestamp hash)
