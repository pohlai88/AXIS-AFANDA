'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  Mail,
  Facebook,
  Instagram,
  MessageCircle,
  Phone,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Zap,
  Globe,
  Music,
  Users2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Channel definitions
const CHANNELS = [
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    description: 'Connect your company emails',
    setupTime: '2 min',
    difficulty: 'Easy',
    fields: [
      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'support@company.com' },
      { name: 'imapServer', label: 'IMAP Server', type: 'text', placeholder: 'mail.company.com' },
      { name: 'imapPort', label: 'IMAP Port', type: 'text', placeholder: '993' },
      { name: 'smtpServer', label: 'SMTP Server', type: 'text', placeholder: 'mail.company.com' },
      { name: 'smtpPort', label: 'SMTP Port', type: 'text', placeholder: '587' },
      { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
    ],
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    icon: MessageCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    description: 'Connect via Twilio or 360Dialog',
    setupTime: '5 min',
    difficulty: 'Easy',
    fields: [
      { name: 'provider', label: 'Provider', type: 'select', options: ['Twilio', '360Dialog', 'Cloud API'] },
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+1234567890' },
      { name: 'accountSid', label: 'Account SID', type: 'text', placeholder: 'ACxxxxxxxx' },
      { name: 'authToken', label: 'Auth Token', type: 'password', placeholder: '••••••••' },
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600/10',
    description: 'Connect your Facebook page',
    setupTime: '3 min',
    difficulty: 'Easy',
    oauth: true,
  },
  {
    id: 'instagram',
    name: 'Instagram DMs',
    icon: Instagram,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    description: 'Connect your Instagram business account',
    setupTime: '3 min',
    difficulty: 'Easy',
    oauth: true,
  },
  {
    id: 'line',
    name: 'LINE',
    icon: MessageSquare,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    description: 'Connect LINE Messaging API',
    setupTime: '5 min',
    difficulty: 'Medium',
    fields: [
      { name: 'channelId', label: 'Channel ID', type: 'text', placeholder: '1234567890' },
      { name: 'channelSecret', label: 'Channel Secret', type: 'password', placeholder: '••••••••' },
      { name: 'channelAccessToken', label: 'Channel Access Token', type: 'password', placeholder: '••••••••' },
    ],
  },
  {
    id: 'wechat',
    name: 'WeChat',
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-600/10',
    description: 'Connect WeChat Official Account',
    setupTime: '10 min',
    difficulty: 'Advanced',
    fields: [
      { name: 'appId', label: 'App ID', type: 'text', placeholder: 'wx1234567890' },
      { name: 'appSecret', label: 'App Secret', type: 'password', placeholder: '••••••••' },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok DMs',
    icon: Music,
    color: 'text-black dark:text-white',
    bgColor: 'bg-black/10 dark:bg-white/10',
    description: 'Connect TikTok Business Account',
    setupTime: '10 min',
    difficulty: 'Advanced',
    fields: [
      { name: 'clientKey', label: 'Client Key', type: 'text', placeholder: 'aw1234567890' },
      { name: 'clientSecret', label: 'Client Secret', type: 'password', placeholder: '••••••••' },
    ],
  },
  {
    id: 'website',
    name: 'Website Chat',
    icon: Globe,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    description: 'Add chat widget to your website',
    setupTime: '1 min',
    difficulty: 'Easy',
    widget: true,
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: Phone,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    description: 'Connect SMS via Twilio',
    setupTime: '5 min',
    difficulty: 'Easy',
    fields: [
      { name: 'phoneNumber', label: 'Phone Number', type: 'tel', placeholder: '+1234567890' },
      { name: 'accountSid', label: 'Twilio Account SID', type: 'text', placeholder: 'ACxxxxxxxx' },
      { name: 'authToken', label: 'Twilio Auth Token', type: 'password', placeholder: '••••••••' },
    ],
  },
];

type Step = 'welcome' | 'select' | 'configure' | 'complete';

export default function OmnichannelSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('welcome');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [configuringChannel, setConfiguringChannel] = useState<string | null>(null);
  const [configuredChannels, setConfiguredChannels] = useState<string[]>([]);
  const [channelData, setChannelData] = useState<Record<string, any>>({});

  const progress = step === 'welcome' ? 0 : step === 'select' ? 25 : step === 'configure' ? 75 : 100;

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels((prev) =>
      prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };

  const handleConfigureChannel = (channelId: string) => {
    setConfiguringChannel(channelId);
  };

  const handleSaveChannel = () => {
    if (configuringChannel) {
      setConfiguredChannels((prev) => [...prev, configuringChannel]);
      setConfiguringChannel(null);
    }
  };

  const handleOAuthConnect = (channelId: string) => {
    // Simulate OAuth flow
    setTimeout(() => {
      setConfiguredChannels((prev) => [...prev, channelId]);
    }, 1000);
  };

  const handleComplete = () => {
    router.push('/app/omnichannel');
  };

  const remainingChannels = selectedChannels.filter((id) => !configuredChannels.includes(id));

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Omnichannel Setup</h1>
            <p className="text-sm text-muted-foreground">
              Connect all your customer communication channels in one place
            </p>
          </div>
          <Badge variant="secondary" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Quick Setup
          </Badge>
        </div>
        <Progress value={progress} className="mt-4" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users2 className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Welcome to Omnichannel</h2>
                <p className="mt-2 text-lg text-muted-foreground">
                  One inbox for all your customer conversations
                </p>
              </div>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    What you'll get
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <MessageCircle className="h-5 w-5 text-blue-500" />
                      </div>
                      <h3 className="font-semibold">Unified Inbox</h3>
                      <p className="text-sm text-muted-foreground">
                        All channels in one beautiful interface
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <h3 className="font-semibold">No Context Switching</h3>
                      <p className="text-sm text-muted-foreground">
                        Stop juggling 10+ apps and tabs
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                      </div>
                      <h3 className="font-semibold">Complete History</h3>
                      <p className="text-sm text-muted-foreground">
                        See all customer interactions across channels
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button size="lg" onClick={() => setStep('select')}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Select Channels Step */}
          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Select Your Channels</h2>
                <p className="mt-2 text-muted-foreground">
                  Choose which channels you want to connect (you can add more later)
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CHANNELS.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = selectedChannels.includes(channel.id);

                  return (
                    <Card
                      key={channel.id}
                      className={cn(
                        'cursor-pointer transition-all hover:shadow-md',
                        isSelected && 'border-primary ring-2 ring-primary/20'
                      )}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', channel.bgColor)}>
                            <Icon className={cn('h-6 w-6', channel.color)} />
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <CardDescription>{channel.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {channel.setupTime}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              channel.difficulty === 'Easy' && 'border-green-500 text-green-500',
                              channel.difficulty === 'Medium' && 'border-yellow-500 text-yellow-500',
                              channel.difficulty === 'Advanced' && 'border-orange-500 text-orange-500'
                            )}
                          >
                            {channel.difficulty}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setStep('welcome')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <div className="text-sm text-muted-foreground">
                  {selectedChannels.length} channel{selectedChannels.length !== 1 && 's'} selected
                </div>
                <Button
                  onClick={() => setStep('configure')}
                  disabled={selectedChannels.length === 0}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Configure Channels Step */}
          {step === 'configure' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Configure Your Channels</h2>
                <p className="mt-2 text-muted-foreground">
                  {remainingChannels.length > 0
                    ? `${remainingChannels.length} channel${remainingChannels.length !== 1 ? 's' : ''} remaining`
                    : 'All channels configured! 🎉'}
                </p>
              </div>

              {/* Channel Configuration Modal */}
              {configuringChannel && (
                <Card className="border-2 border-primary">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {(() => {
                        const channel = CHANNELS.find((c) => c.id === configuringChannel)!;
                        const Icon = channel.icon;
                        return (
                          <>
                            <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', channel.bgColor)}>
                              <Icon className={cn('h-6 w-6', channel.color)} />
                            </div>
                            <div>
                              <CardTitle>{channel.name}</CardTitle>
                              <CardDescription>{channel.description}</CardDescription>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const channel = CHANNELS.find((c) => c.id === configuringChannel)!;

                      if (channel.oauth) {
                        return (
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Click the button below to connect your {channel.name} account via OAuth.
                            </p>
                            <Button
                              className="w-full"
                              onClick={() => handleOAuthConnect(configuringChannel)}
                            >
                              Connect {channel.name}
                            </Button>
                          </div>
                        );
                      }

                      if (channel.widget) {
                        return (
                          <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                              Add this code snippet to your website to enable the chat widget.
                            </p>
                            <div className="rounded-lg bg-muted p-4">
                              <code className="text-xs">
                                {`<script src="https://app.chatwoot.com/packs/js/sdk.js"></script>`}
                              </code>
                            </div>
                            <Button className="w-full" onClick={handleSaveChannel}>
                              I've Added the Widget
                            </Button>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {channel.fields?.map((field) => (
                            <div key={field.name} className="space-y-2">
                              <Label htmlFor={field.name}>{field.label}</Label>
                              {field.type === 'select' ? (
                                <select
                                  id={field.name}
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                  onChange={(e) =>
                                    setChannelData((prev) => ({
                                      ...prev,
                                      [configuringChannel]: {
                                        ...prev[configuringChannel],
                                        [field.name]: e.target.value,
                                      },
                                    }))
                                  }
                                >
                                  <option value="">Select...</option>
                                  {field.options?.map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <Input
                                  id={field.name}
                                  type={field.type}
                                  placeholder={field.placeholder}
                                  onChange={(e) =>
                                    setChannelData((prev) => ({
                                      ...prev,
                                      [configuringChannel]: {
                                        ...prev[configuringChannel],
                                        [field.name]: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              )}
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setConfiguringChannel(null)}
                            >
                              Cancel
                            </Button>
                            <Button className="flex-1" onClick={handleSaveChannel}>
                              Save & Continue
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* Channel List */}
              {!configuringChannel && (
                <div className="space-y-3">
                  {selectedChannels.map((channelId) => {
                    const channel = CHANNELS.find((c) => c.id === channelId)!;
                    const Icon = channel.icon;
                    const isConfigured = configuredChannels.includes(channelId);

                    return (
                      <Card key={channelId} className={cn(isConfigured && 'border-green-500/50 bg-green-500/5')}>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', channel.bgColor)}>
                              <Icon className={cn('h-5 w-5', channel.color)} />
                            </div>
                            <div>
                              <h3 className="font-semibold">{channel.name}</h3>
                              <p className="text-sm text-muted-foreground">{channel.description}</p>
                            </div>
                          </div>
                          {isConfigured ? (
                            <div className="flex items-center gap-2 text-green-500">
                              <CheckCircle2 className="h-5 w-5" />
                              <span className="text-sm font-medium">Connected</span>
                            </div>
                          ) : (
                            <Button onClick={() => handleConfigureChannel(channelId)}>
                              Configure
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {!configuringChannel && (
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep('select')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('complete')}
                    disabled={configuredChannels.length === 0}
                  >
                    {remainingChannels.length === 0 ? 'Complete Setup' : 'Skip for Now'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold">You're All Set! 🎉</h2>
                <p className="mt-2 text-lg text-muted-foreground">
                  Your omnichannel inbox is ready to use
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Channels</CardTitle>
                  <CardDescription>
                    You've successfully connected {configuredChannels.length} channel
                    {configuredChannels.length !== 1 && 's'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {configuredChannels.map((channelId) => {
                      const channel = CHANNELS.find((c) => c.id === channelId)!;
                      const Icon = channel.icon;

                      return (
                        <div
                          key={channelId}
                          className="flex items-center gap-3 rounded-lg border p-3"
                        >
                          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', channel.bgColor)}>
                            <Icon className={cn('h-5 w-5', channel.color)} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{channel.name}</h3>
                            <p className="text-xs text-muted-foreground">Ready to receive messages</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/50 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    What's Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Send a test message</h4>
                      <p className="text-sm text-muted-foreground">
                        Try sending a message from any of your connected channels
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Explore filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Use powerful filters to organize conversations by channel, priority, and more
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Add more channels</h4>
                      <p className="text-sm text-muted-foreground">
                        Return to setup anytime to connect additional channels
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button size="lg" onClick={handleComplete}>
                  Go to Omnichannel Inbox
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
