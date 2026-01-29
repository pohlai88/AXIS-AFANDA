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
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    label: 'WhatsApp',
    placeholder: 'Type a message...',
    features: {
      attachments: true,
      emoji: true,
    },
  },
  email: {
    icon: Mail,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    label: 'Email',
    placeholder: 'Compose your reply...',
    features: {
      richText: true,
      attachments: true,
    },
  },
  facebook: {
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    label: 'Facebook',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 5000,
    },
  },
  instagram: {
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    label: 'Instagram',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 1000,
    },
  },
  tiktok: {
    icon: Music,
    color: 'text-slate-900 dark:text-slate-100',
    bgColor: 'bg-slate-50 dark:bg-slate-950',
    label: 'TikTok',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 150,
    },
  },
  line: {
    icon: MessageSquare,
    color: 'text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
    label: 'LINE',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  wechat: {
    icon: MessageCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    label: 'WeChat',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  telegram: {
    icon: Send,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    label: 'Telegram',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  twitter: {
    icon: Twitter,
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 dark:bg-sky-950',
    label: 'Twitter',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 280,
    },
  },
  linkedin: {
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    label: 'LinkedIn',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 3000,
    },
  },
  youtube: {
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950',
    label: 'YouTube',
    placeholder: 'Write a response...',
    features: {
      emoji: true,
      characterLimit: 10000,
    },
  },
  sms: {
    icon: Phone,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    label: 'SMS',
    placeholder: 'Type a message...',
    features: {
      characterLimit: 160,
    },
  },
  website: {
    icon: Globe,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    label: 'Website',
    placeholder: 'Type a message...',
    features: {
      emoji: true,
      attachments: true,
    },
  },
  api: {
    icon: MessageSquare,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950',
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
