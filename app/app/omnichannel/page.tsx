'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useConversationsStore } from '@/app/lib/stores/conversations-store';
import { getConversations } from '@/app/lib/api/conversations';
import { ConversationList } from '@/app/components/omnichannel/conversation-list';
import { InboxFilters } from '@/app/components/omnichannel/inbox-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, RefreshCw, Sparkles, Users2, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function InboxPage() {
  const router = useRouter();
  const { conversations, setConversations, setLoading, loading } = useConversationsStore();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{
    status?: string;
    priority?: string;
    assigneeId?: number | string;
    teamId?: number;
    labels?: string[];
    hasEscalation?: boolean;
    unreadOnly?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
    sortOrder?: string;
  }>({
    status: 'open',
  });

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const result = await getConversations({
        ...filters,
        search: search || undefined,
      });
      setConversations(result.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [filters]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        fetchConversations();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle conversation click
  const handleConversationClick = (conversationId: string) => {
    router.push(`/app/omnichannel/${conversationId}`);
  };

  // Show setup prompt if no conversations (first time user)
  const showSetupPrompt = !loading && conversations.length === 0 && !search && filters.status === 'open';

  if (showSetupPrompt) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b bg-background px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Omnichannel</h1>
            <p className="text-sm text-muted-foreground">
              Customer conversations across all channels
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Users2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Welcome to Omnichannel</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Connect all your customer communication channels in one unified inbox
            </p>

            <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
              <Card>
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-green-500" />
                  <CardTitle className="text-base">WhatsApp</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect WhatsApp Business via Twilio or 360Dialog
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Mail className="h-8 w-8 text-blue-500" />
                  <CardTitle className="text-base">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect your company emails (support, sales, etc.)
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Sparkles className="h-8 w-8 text-purple-500" />
                  <CardTitle className="text-base">15+ More</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Facebook, Instagram, LINE, WeChat, TikTok, SMS, and more
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <Button size="lg" onClick={() => router.push('/app/omnichannel/setup')}>
                <Sparkles className="mr-2 h-4 w-4" />
                Quick Setup (5 min)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('https://docs.chatwoot.com', '_blank')}>
                View Documentation
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Already have conversations? They'll appear here once channels are connected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Omnichannel</h1>
            <p className="text-sm text-muted-foreground">
              Manage customer conversations across all channels
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/app/omnichannel/setup')} variant="outline" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Add Channels
            </Button>
            <Button onClick={fetchConversations} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        <div className="w-64 border-r bg-muted/10 p-4">
          <InboxFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-auto">
          <ConversationList
            conversations={conversations}
            loading={loading}
            onConversationClick={handleConversationClick}
          />
        </div>
      </div>
    </div>
  );
}
