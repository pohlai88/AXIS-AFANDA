'use client';

import { useEffect } from 'react';
import { useTenant } from '@/app/providers/tenant-provider';

interface ChatwootSettings {
  hideMessageBubble?: boolean;
  position?: 'left' | 'right';
  locale?: string;
  type?: 'standard' | 'expanded_bubble';
  customAttributes?: Record<string, string | number | boolean>;
}

interface ChatwootSDK {
  run: (config: { websiteToken: string; baseUrl: string }) => void;
}

declare global {
  interface Window {
    chatwootSettings?: ChatwootSettings;
    chatwootSDK?: ChatwootSDK;
    $chatwoot?: { toggle?: () => void } | undefined;
  }
}

/**
 * Chatwoot Widget Component
 * 
 * Loads the Chatwoot chat widget and passes tenant information
 * as custom attributes for multi-tenant support.
 * 
 * Usage:
 * 1. Set NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN in .env
 * 2. Add <ChatwootWidget /> to your layout
 * 3. Widget will automatically identify tenant
 */
export function ChatwootWidget() {
  const { tenant } = useTenant();

  useEffect(() => {
    // Only run in browser with valid tenant
    if (!tenant || typeof window === 'undefined') return;

    // Don't load if already loaded
    if (window.$chatwoot) {
      console.log('Chatwoot already loaded');
      return;
    }

    // Configure Chatwoot with tenant info
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'en',
      type: 'expanded_bubble',
      // ✅ Pass tenant info as custom attributes
      // This allows filtering conversations by tenant in a shared inbox
      customAttributes: {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        tenant_type: tenant.type,
      },
    };

    console.log('🔌 Loading Chatwoot widget for tenant:', tenant.name);

    // Load Chatwoot SDK
    const script = document.createElement('script');
    script.src = 'https://app.chatwoot.com/packs/js/sdk.js';
    script.defer = true;
    script.async = true;

    script.onload = () => {
      if (window.chatwootSDK) {
        const websiteToken = process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN;

        if (!websiteToken) {
          console.error('❌ NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN not set');
          return;
        }

        window.chatwootSDK.run({
          websiteToken,
          baseUrl: 'https://app.chatwoot.com',
        });

        console.log('✅ Chatwoot widget loaded');
      }
    };

    script.onerror = () => {
      console.error('❌ Failed to load Chatwoot SDK');
    };

    document.body.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

      // Reset Chatwoot
      if (window.$chatwoot) {
        window.$chatwoot = undefined;
      }
    };
  }, [tenant]);

  // Widget renders itself via SDK
  return null;
}
