/**
 * Chatwoot API Client
 * 
 * Handles all interactions with Chatwoot Cloud API
 * Documentation: https://www.chatwoot.com/developers/api/
 */

interface ChatwootConfig {
  apiUrl: string;
  apiToken: string;
  accountId: number;
}

interface ChatwootConversation {
  id: number;
  account_id: number;
  inbox_id: number;
  status: string;
  priority?: string;
  contact?: {
    id: number;
    name?: string;
    email?: string;
  };
  assignee?: {
    id: number;
    name?: string;
  };
  team?: {
    id: number;
    name?: string;
  };
  labels?: string[];
  custom_attributes?: Record<string, any>;
  unread_count?: number;
  last_activity_at?: number;
}

interface ChatwootMessage {
  id: number;
  conversation_id: number;
  content: string;
  message_type: string;
  sender?: {
    id: number;
    type: string;
    name?: string;
  };
  private?: boolean;
  attachments?: any[];
  content_attributes?: Record<string, any>;
}

interface ChatwootContact {
  id: number;
  name?: string;
  email?: string;
  phone_number?: string;
  custom_attributes?: Record<string, any>;
}

export class ChatwootClient {
  private config: ChatwootConfig;
  private baseUrl: string;

  constructor(config: ChatwootConfig) {
    this.config = config;
    this.baseUrl = `${config.apiUrl}/api/v1/accounts/${config.accountId}`;
  }

  /**
   * Get conversations with filters
   */
  async getConversations(filters?: {
    status?: string;
    assignee_id?: number;
    inbox_id?: number;
    labels?: string[];
    page?: number;
    per_page?: number;
  }): Promise<{ data: ChatwootConversation[]; meta: any }> {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.assignee_id) params.append('assignee_id', filters.assignee_id.toString());
    if (filters?.inbox_id) params.append('inbox_id', filters.inbox_id.toString());
    if (filters?.labels) filters.labels.forEach(label => params.append('labels[]', label));
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());

    const response = await fetch(`${this.baseUrl}/conversations?${params}`, {
      method: 'GET',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get conversation by ID
   */
  async getConversation(conversationId: number): Promise<ChatwootConversation> {
    const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: number, page = 1): Promise<{ data: ChatwootMessage[]; meta: any }> {
    const response = await fetch(
      `${this.baseUrl}/conversations/${conversationId}/messages?page=${page}`,
      {
        method: 'GET',
        headers: {
          'api_access_token': this.config.apiToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: number,
    content: string,
    options?: {
      private?: boolean;
      content_attributes?: Record<string, any>;
    }
  ): Promise<ChatwootMessage> {
    const response = await fetch(`${this.baseUrl}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content,
        private: options?.private || false,
        content_attributes: options?.content_attributes,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText} - ${error}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Update conversation
   */
  async updateConversation(
    conversationId: number,
    updates: {
      status?: string;
      priority?: string;
      assignee_id?: number;
      team_id?: number;
      labels?: string[];
      custom_attributes?: Record<string, any>;
    }
  ): Promise<ChatwootConversation> {
    const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
      method: 'PUT',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText} - ${error}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Assign conversation to agent
   */
  async assignConversation(conversationId: number, agentId: number): Promise<ChatwootConversation> {
    return this.updateConversation(conversationId, { assignee_id: agentId });
  }

  /**
   * Add labels to conversation
   */
  async addLabels(conversationId: number, labels: string[]): Promise<ChatwootConversation> {
    // First get current labels
    const conversation = await this.getConversation(conversationId);
    const currentLabels = conversation.labels || [];
    const newLabels = [...new Set([...currentLabels, ...labels])];

    return this.updateConversation(conversationId, { labels: newLabels });
  }

  /**
   * Get contact by ID
   */
  async getContact(contactId: number): Promise<ChatwootContact> {
    const response = await fetch(`${this.baseUrl}/contacts/${contactId}`, {
      method: 'GET',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  /**
   * Get canned responses
   */
  async getCannedResponses(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/canned_responses`, {
      method: 'GET',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.payload || [];
  }

  /**
   * Get agents
   */
  async getAgents(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/agents`, {
      method: 'GET',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.payload || [];
  }

  /**
   * Get teams
   */
  async getTeams(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/teams`, {
      method: 'GET',
      headers: {
        'api_access_token': this.config.apiToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.payload || [];
  }
}

/**
 * Create Chatwoot client instance from environment variables (shared account)
 */
export function createChatwootClient(): ChatwootClient {
  const apiUrl = process.env.CHATWOOT_API_URL || 'https://app.chatwoot.com';
  const apiToken = process.env.CHATWOOT_API_TOKEN;
  const accountId = parseInt(process.env.CHATWOOT_ACCOUNT_ID || '1', 10);

  if (!apiToken) {
    throw new Error('CHATWOOT_API_TOKEN environment variable is required');
  }

  return new ChatwootClient({
    apiUrl,
    apiToken,
    accountId,
  });
}

/**
 * Create Chatwoot client for a specific tenant (dedicated account)
 */
export function createChatwootClientForTenant(tenant: {
  chatwootApiUrl?: string | null;
  chatwootApiToken?: string | null;
  chatwootAccountId?: number | null;
  chatwootInboxId?: number | null;
}): ChatwootClient {
  // Option 2: Tenant has dedicated Chatwoot account
  if (tenant.chatwootApiToken && tenant.chatwootAccountId) {
    return new ChatwootClient({
      apiUrl: tenant.chatwootApiUrl || 'https://app.chatwoot.com',
      apiToken: tenant.chatwootApiToken,
      accountId: tenant.chatwootAccountId,
    });
  }

  // Option 1: Tenant uses shared account (fall back to env vars)
  return createChatwootClient();
}

/**
 * Get inbox ID for tenant (for filtering conversations)
 */
export function getTenantInboxId(tenant: {
  chatwootInboxId?: number | null;
}): number | undefined {
  return tenant.chatwootInboxId || undefined;
}
