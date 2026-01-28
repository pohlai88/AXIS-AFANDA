/**
 * Test script to verify Chatwoot webhook is working
 * 
 * Usage:
 * 1. Start orchestrator: npm run dev
 * 2. Start ngrok: ngrok http 8000
 * 3. Update Chatwoot webhook URL with ngrok URL
 * 4. Run this script: tsx test-webhook.ts
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '../../.env') });

const ORCHESTRATOR_URL = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || 'http://localhost:8000';

// Test webhook payloads
const testPayloads = {
  conversation_created: {
    event: 'conversation_created',
    account: {
      id: 1,
      name: 'Test Account',
    },
    conversation: {
      id: 12345,
      account_id: 1,
      inbox_id: 1,
      status: 'open',
      priority: 'medium',
      contact: {
        id: 100,
        name: 'Test User',
        email: 'test@example.com',
      },
      labels: ['test'],
      unread_count: 1,
      last_activity_at: Math.floor(Date.now() / 1000),
    },
  },
  message_created: {
    event: 'message_created',
    account: {
      id: 1,
      name: 'Test Account',
    },
    message: {
      id: 54321,
      conversation_id: 12345,
      content: 'Test message from webhook',
      message_type: 'incoming',
      sender: {
        id: 100,
        type: 'contact',
        name: 'Test User',
      },
      private: false,
    },
  },
};

async function testWebhook(eventType: keyof typeof testPayloads) {
  const payload = testPayloads[eventType];
  const url = `${ORCHESTRATOR_URL}/api/v1/webhooks/chatwoot`;

  console.log(`\n🧪 Testing ${eventType}...`);
  console.log(`📡 URL: ${url}`);
  console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`✅ Success! Response:`, result);
    } else {
      console.error(`❌ Error: ${response.status} ${response.statusText}`);
      console.error(`Response:`, result);
    }
  } catch (error) {
    console.error(`❌ Request failed:`, error);
  }
}

async function main() {
  console.log('🚀 Chatwoot Webhook Test Script');
  console.log(`📍 Orchestrator URL: ${ORCHESTRATOR_URL}`);
  console.log('\n⚠️  Make sure:');
  console.log('   1. Orchestrator is running (npm run dev)');
  console.log('   2. ngrok is running (ngrok http 8000)');
  console.log('   3. Webhook URL in Chatwoot is set to ngrok URL\n');

  // Test conversation created
  await testWebhook('conversation_created');

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Test message created
  await testWebhook('message_created');

  console.log('\n✅ Test completed!');
  console.log('📊 Check orchestrator logs and database to verify data was synced.');
}

main().catch(console.error);
