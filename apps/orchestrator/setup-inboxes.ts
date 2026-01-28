/**
 * Setup script to assign Chatwoot inbox IDs to tenants
 * 
 * Usage: tsx setup-inboxes.ts
 */

import { db, schema } from './src/db/client';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔧 Setting up Chatwoot inboxes for tenants...\n');

  // TODO: Replace these with your actual inbox IDs from Chatwoot
  const inboxMappings = [
    {
      tenantId: 'mock-tenant-id',
      tenantName: 'Mock Tenant',
      inboxId: null, // ← Replace with actual inbox ID (e.g., 123)
    },
    // Add more tenants as needed
    // {
    //   tenantId: 'tenant-2',
    //   tenantName: 'Acme Corp',
    //   inboxId: 456,
    // },
  ];

  console.log('📋 Inbox mappings to apply:');
  inboxMappings.forEach((mapping) => {
    console.log(`  - ${mapping.tenantName}: Inbox ID ${mapping.inboxId || 'NOT SET'}`);
  });
  console.log();

  // Update each tenant
  for (const mapping of inboxMappings) {
    if (!mapping.inboxId) {
      console.log(`⚠️  Skipping ${mapping.tenantName} - no inbox ID provided`);
      continue;
    }

    try {
      const [updated] = await db
        .update(schema.tenants)
        .set({ chatwootInboxId: mapping.inboxId })
        .where(eq(schema.tenants.id, mapping.tenantId))
        .returning();

      if (updated) {
        console.log(`✅ Updated ${mapping.tenantName} → Inbox ID: ${mapping.inboxId}`);
      } else {
        console.log(`❌ Tenant not found: ${mapping.tenantId}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${mapping.tenantName}:`, error);
    }
  }

  console.log('\n✨ Setup complete!');
  console.log('\n📝 Next steps:');
  console.log('  1. Create a conversation in one of your Chatwoot inboxes');
  console.log('  2. Check if it appears in http://localhost:3000/app/inbox');
  console.log('  3. Verify filtering by inbox works correctly');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
