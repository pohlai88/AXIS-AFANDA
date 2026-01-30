import {
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
  Music,
  MessageSquare,
  Phone,
  Globe,
  Twitter,
  Linkedin,
  Youtube,
  Send,
  type LucideIcon,
} from 'lucide-react';

export type ChannelType =
  | 'whatsapp'
  | 'email'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'line'
  | 'wechat'
  | 'telegram'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'sms'
  | 'website'
  | 'api';

export interface ChannelConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  label: string;
  placeholder: string;
  features: {
    richText?: boolean;
    attachments?: boolean;
    emoji?: boolean;
    characterLimit?: number;
  };
}

export const CHANNEL_CONFIGS: Record<ChannelType, ChannelConfig> = {
  whatsapp: {
    icon: MessageCircle,
    color: 'text-approve-fg',
    bgColor: 'bg-approve-bg',
    label: 'WhatsApp',
    placeholder: 'Type a message...',
    features: {
      attachments: true,
      emoji: true,
    },
  },
  email: {
    icon: Mail,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Email',
    placeholder: 'Compose your reply...',
    features: {
      richText: true,
      attachments: true,
    },
  },
  facebook: {
    icon: Facebook,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Facebook',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 5000,
    },
  },
  instagram: {
    icon: Instagram,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Instagram',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 1000,
    },
  },
  tiktok: {
    icon: Music,
    color: 'text-foreground',
    bgColor: 'bg-muted',
    label: 'TikTok',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 150,
    },
  },
  line: {
    icon: MessageSquare,
    color: 'text-approve-fg',
    bgColor: 'bg-approve-bg',
    label: 'LINE',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  wechat: {
    icon: MessageCircle,
    color: 'text-approve-fg',
    bgColor: 'bg-approve-bg',
    label: 'WeChat',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  telegram: {
    icon: Send,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Telegram',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  twitter: {
    icon: Twitter,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Twitter',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 280,
    },
  },
  linkedin: {
    icon: Linkedin,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'LinkedIn',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 3000,
    },
  },
  youtube: {
    icon: Youtube,
    color: 'text-reject-fg',
    bgColor: 'bg-reject-bg',
    label: 'YouTube',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 10000,
    },
  },
  sms: {
    icon: Phone,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'SMS',
    placeholder: 'Type a message...',
    features: {
      characterLimit: 160,
    },
  },
  website: {
    icon: Globe,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    label: 'Website',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  api: {
    icon: MessageSquare,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'API',
    placeholder: 'Type a message...',
    features: {
      richText: true,
      attachments: true,
    },
  },
};

/**
 * Get channel configuration by type
 */
export function getChannelConfig(channelType?: string | null): ChannelConfig {
  if (!channelType) {
    return CHANNEL_CONFIGS.api; // Default fallback
  }

  const normalizedType = channelType.toLowerCase() as ChannelType;
  return CHANNEL_CONFIGS[normalizedType] || CHANNEL_CONFIGS.api;
}

/**
 * Get channel icon component
 */
export function getChannelIcon(channelType?: string | null): LucideIcon {
  return getChannelConfig(channelType).icon;
}

/**
 * Get channel color class
 */
export function getChannelColor(channelType?: string | null): string {
  return getChannelConfig(channelType).color;
}

/**
 * Get channel background color class
 */
export function getChannelBgColor(channelType?: string | null): string {
  return getChannelConfig(channelType).bgColor;
}

/**
 * Get channel label
 */
export function getChannelLabel(channelType?: string | null): string {
  return getChannelConfig(channelType).label;
}

/**
 * Get all available channels for filter dropdown
 */
export function getAllChannels(): Array<{ value: ChannelType; label: string; icon: LucideIcon; color: string }> {
  return Object.entries(CHANNEL_CONFIGS).map(([value, config]) => ({
    value: value as ChannelType,
    label: config.label,
    icon: config.icon,
    color: config.color,
  }));
}
