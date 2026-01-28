/**
 * Check data in database
 */

import { db, schema } from './src/db/client';

async function main() {
  console.log('📊 Checking database...\n');

  // Check conversations
  const conversations = await db.select().from(schema.conversations);
  console.log(`💬 Conversations: ${conversations.length}`);
  conversations.forEach(conv => {
    console.log(`  - ID: ${conv.id}, Chatwoot ID: ${conv.chatwootId}, Status: ${conv.status}, Contact: ${conv.contactName}`);
  });

  // Check messages
  const messages = await db.select().from(schema.messages);
  console.log(`\n📨 Messages: ${messages.length}`);
  messages.forEach(msg => {
    console.log(`  - ID: ${msg.id}, Content: "${msg.content.substring(0, 50)}...", Type: ${msg.messageType}`);
  });

  // Check activities
  const activities = await db.select().from(schema.activities);
  console.log(`\n📈 Activities: ${activities.length}`);
  activities.forEach(act => {
    console.log(`  - Type: ${act.type}, Title: ${act.title}, Source: ${act.source}`);
  });

  // Check webhook events
  const webhookEvents = await db.select().from(schema.webhookEvents);
  console.log(`\n🔗 Webhook Events: ${webhookEvents.length}`);
  webhookEvents.forEach(evt => {
    console.log(`  - Event: ${evt.eventType}, Processed: ${evt.processed}, Source: ${evt.source}`);
  });

  console.log('\n✅ Database check complete!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
