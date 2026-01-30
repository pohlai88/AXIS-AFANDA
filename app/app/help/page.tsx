'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Book,
  MessageSquare,
  Video,
  Search,
  FileText,
  Lightbulb,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

const helpTopics = [
  {
    title: 'Getting Started',
    icon: Lightbulb,
    description: 'Learn the basics of AXIS-AFENDA',
    articles: [
      'Quick start guide',
      'Understanding the interface',
      'Your first conversation',
      'Setting up your profile',
    ],
  },
  {
    title: 'Omnichannel',
    icon: MessageSquare,
    description: 'Managing customer conversations',
    articles: [
      'Connecting channels',
      'Using filters effectively',
      'Responding to customers',
      'Channel-specific features',
    ],
  },
  {
    title: 'Approvals & Escalations',
    icon: FileText,
    description: 'Workflow and approval processes',
    articles: [
      'Creating escalations',
      'Approval workflows',
      'Decision logging',
      'Audit trails',
    ],
  },
  {
    title: 'Team Collaboration',
    icon: MessageSquare,
    description: 'Internal communication',
    articles: [
      'Using the Inbox',
      'Direct messages',
      'Group chats',
      'Team coordination',
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
              <HelpCircle className="h-6 w-6 text-lux-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Help & Documentation</h1>
              <p className="text-sm text-muted-foreground">
                Get help and learn how to use AXIS-AFENDA
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Quick Actions */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <Book className="h-8 w-8 text-primary" />
                <CardTitle className="text-base">Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse comprehensive guides and tutorials
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  View docs
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <Video className="h-8 w-8 text-approve-fg" />
                <CardTitle className="text-base">Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Watch step-by-step video guides
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Watch videos
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary" />
                <CardTitle className="text-base">Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get help from our support team
                </p>
                <Button variant="link" className="mt-2 h-auto p-0">
                  Contact us
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Help Topics */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Browse by Topic</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {helpTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <Card key={topic.title}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{topic.title}</CardTitle>
                          <CardDescription>{topic.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {topic.articles.map((article) => (
                          <li key={article}>
                            <Button variant="link" className="h-auto p-0 text-sm">
                              {article}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Frequently Asked Questions</h2>
            <Card>
              <CardContent className="divide-y pt-6">
                <div className="py-4">
                  <h3 className="font-semibold">How do I connect a new channel?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Go to Omnichannel → Click &quot;Add Channels&quot; → Follow the setup wizard to connect your channels.
                  </p>
                </div>
                <div className="py-4">
                  <h3 className="font-semibold">What&apos;s the difference between Inbox and Omnichannel?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Inbox is for internal team communication (DMs, group chats). Omnichannel is for external customer communication across all channels (WhatsApp, email, social media, etc.).
                  </p>
                </div>
                <div className="py-4">
                  <h3 className="font-semibold">How do I escalate a conversation?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Open the conversation → Click the &quot;Escalate&quot; button → Fill in the reason → Submit for approval.
                  </p>
                </div>
                <div className="py-4">
                  <h3 className="font-semibold">Can I use AXIS-AFENDA on mobile?</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Yes! The interface is fully responsive and works on mobile devices. A dedicated mobile app is coming soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
