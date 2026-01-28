/**
 * Seed script to create a mock tenant for testing
 * 
 * Usage: tsx seed-tenant.ts
 */

import { db, schema } from './src/db/client';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🌱 Seeding mock tenant...');

  // Check if tenant already exists
  const [existing] = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.id, 'mock-tenant-id'))
    .limit(1);

  if (existing) {
    console.log('✅ Mock tenant already exists');
    return;
  }

  // Create mock tenant
  const [tenant] = await db
    .insert(schema.tenants)
    .values({
      id: 'mock-tenant-id',
      name: 'Mock Tenant',
      type: 'org',
      metadata: { description: 'Mock tenant for testing webhooks' },
    })
    .returning();

  console.log('✅ Created mock tenant:', tenant);
  console.log('📊 Tenant ID:', tenant.id);
  console.log('\n🎉 Ready to receive webhooks!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
