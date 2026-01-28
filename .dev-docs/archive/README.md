# Archived Documentation

This directory contains documentation for features that have been temporarily removed or postponed.

## Keycloak IAM Integration (Archived 2026-01-28)

The Keycloak authentication implementation was removed to unblock development and focus on core features.

**Reason**: Auth integration was disrupting the build process and delaying progress on Chatwoot integration.

**Status**: Complete implementation exists in these files, ready to be restored when needed:
- `KEYCLOAK-IAM-SETUP.md` - Complete setup guide
- `KEYCLOAK-IAM-IMPLEMENTATION.md` - Implementation details
- `KEYCLOAK-QUICK-START.md` - Quick start guide
- `KEYCLOAK-AUTH-AUDIT-COMPLETE.md` - Quality audit report
- `KEYCLOAK-IMPLEMENTATION-COMPLETE.md` - Final summary
- `KEYCLOAK-FINAL-SUMMARY.md` - Comprehensive summary

**What was removed**:
- NextAuth.js and Keycloak dependencies
- Auth middleware and API routes
- Auth UI components (signin, error pages)
- Auth hooks and utilities
- Keycloak admin client
- Session management

**What remains**:
- Mock tenant provider for development
- Basic tenant switching functionality
- UI structure intact

**To restore**: 
1. Reinstall dependencies: `npm install next-auth@beta @auth/core keycloak-js`
2. Restore files from git history (commit before removal)
3. Follow setup guide in archived docs
4. Configure Keycloak instance

**Priority**: Will be implemented in production phase after core MVP features are complete.
