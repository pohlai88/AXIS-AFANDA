# AXIS-AFENDA

> **The compass for work's morphology.**  
> Life is chaos, but work doesn't have to be.

---

## The Name

**AXIS** — The X and Y coordinates. The compass that gives direction.  
**AFENDA** — The morphology of work. The form, structure, and organization of work itself.

Together: **Directional structure** for work in a chaotic world.

---

## The Problem We Solve

### Today's Workforce Pain Points

1. **Multi-Hundred App Chaos** — Teams use 100+ apps. Constant context switching. No single source of truth.
2. **Social Media Invasion** — Personal bleeds into work. No clear boundaries. Privacy concerns.
3. **Nothing Belongs to Ourselves** — Data scattered. Vendor lock-in. No ownership.

### Our Solution

- **Work-Life Separation** — Work tools stay in work. Personal tools stay personal.
- **Peaceful Collaboration** — Leave notes silently. Collaborate on whiteboards. No constant texting.
- **Directional Structure** — AXIS provides direction. AFENDA provides structure.

---

## Core Philosophy

> **"Life is chaos, but work doesn't have to be."**

Work should be a **sanctuary of order** within life's chaos. We provide the compass (AXIS) to navigate the morphology of work (AFENDA).

---

## Features

- **Silent Team Notes** — Leave notes without texting. Collaborate asynchronously, peacefully.
- **Collaborative Whiteboards** — Figma Jam-like drawing and ideation. Visual collaboration.
- **Structured Meetings** — Organized, transcribed, summarized. Not chaotic, not noisy.
- **Consultation Rooms** — Scheduled, thoughtful consultations. Jitsi integration.
- **Approval Workflows** — CEO approval, audit trail, tenant-scoped requests.
- **Omnichannel** — Chatwoot integration. Team chat when needed, not by default.

---

## Architecture

**Clone + Integrate Strategy**: Deploy existing open-source tools and build minimal orchestration.

### Core Components

- **Shell App** (Next.js): Unified UI with tenant context and module registry
- **Orchestrator API** (Hono): Approvals workflow, audit trail, cross-service events
- **Keycloak**: Identity and multi-tenant management
- **Chatwoot**: Customer omnichannel
- **Matrix + Element**: Team chat
- **Jitsi**: Consultation rooms
- **tldraw**: Embedded whiteboards

---

## Stack

- **Shell**: Next.js (App Router), React, TypeScript
- **Orchestrator**: Hono, TypeScript
- **Validation**: Zod
- **State**: Zustand (client); server = source of truth
- **Design System**: Tailwind v4, shadcn/ui + blocks
- **DB**: PostgreSQL
- **Cache**: Redis
- **Identity**: Keycloak

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Docker & Docker Compose

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start core services**
   ```bash
   docker-compose up -d postgres redis keycloak
   ```

3. **Configure Keycloak**
   - Navigate to http://localhost:8080
   - Login with admin/admin_password
   - Create realm: `axis`
   - Create client: `shell-app` (Standard flow, root URL: http://localhost:3000)

4. **Start development servers**
   ```bash
   pnpm dev
   ```

---

## MVP Feature Flow

**Customer Inbox → Escalate → CEO Approval → Decision Logged**

This single flow validates:
- Multi-tenant isolation
- Approval workflow
- Audit trail
- External service integration

---

## Brand Positioning

### For Teams Who Want:

✅ Work to be organized while life stays chaotic  
✅ Clear boundaries between work and personal  
✅ Peaceful collaboration without constant interruptions  
✅ Ownership of their data and workflows  
✅ Direction and structure in a chaotic world  

### What We're Not:

❌ A personal productivity tool (we're for teams)  
❌ A universal app that sees everything (we only see work)  
❌ A chat-first platform (we're notes-first, peaceful)  
❌ A vendor lock-in (we're open, self-hostable)  
❌ A life organizer (we organize work, not life)  

---

## Documentation

- **[Brand Positioning](.dev-docs/BRAND-POSITIONING.md)** — Complete brand strategy and messaging
- **[Project Spec](.dev-docs/PROJECT-SPEC.md)** — Architecture, stack, roadmap
- **[Competitive Analysis](.dev-docs/LITTLEBIRD-COMPETITIVE-ANALYSIS.md)** — Market positioning
- **[Agent Guidelines](AGENTS.md)** — Development guidelines

---

## License

[Add your license here]

---

**AXIS-AFENDA** — The compass for work's morphology.  
Life is chaos, but work doesn't have to be.
