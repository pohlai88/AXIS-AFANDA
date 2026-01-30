'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import {
  User,
  Mail,
  Calendar,
  Tag,
  UserCheck,
  Users,
  AlertCircle,
  Phone,
  Link2,
} from 'lucide-react';
import type { Conversation } from '@/app/lib/stores/conversations-store';
import { getChannelIcon, getChannelColor, getChannelLabel, type ChannelType } from '@/app/lib/utils/channel-icons';

/** Channel metadata for unified contacts */
interface ChannelMetadata {
  whatsapp?: string;
  email?: string;
  phone?: string;
  facebook?: string;
  instagram?: string;
}

/** Extended conversation with omnichannel properties */
interface OmnichannelConversation extends Conversation {
  channelType?: ChannelType;
  channelIdentifier?: string;
  unifiedContactId?: string;
  channelMetadata?: ChannelMetadata;
}

interface ConversationSidebarProps {
  conversation: Conversation;
}

export function ConversationSidebar({ conversation: conv }: ConversationSidebarProps) {
  const conversation = conv as OmnichannelConversation;
  return (
    <div className="h-full overflow-auto p-4">
      <div className="space-y-6">
        {/* Contact Info */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {conversation.contactName
                    ? conversation.contactName.charAt(0).toUpperCase()
                    : <User className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{conversation.contactName || 'Unknown'}</p>
                {conversation.contactEmail && (
                  <p className="text-sm text-muted-foreground">
                    {conversation.contactEmail}
                  </p>
                )}
              </div>
            </div>

            {conversation.contactEmail && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{conversation.contactEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Channel Information */}
        {conversation.channelType && (
          <>
            <Separator />
            <div>
              <h3 className="mb-3 text-sm font-medium">Channel</h3>
              {(() => {
                const ChannelIcon = getChannelIcon(conversation.channelType);
                const channelColor = getChannelColor(conversation.channelType);
                const channelLabel = getChannelLabel(conversation.channelType);
                return (
                  <div className="space-y-2">
                    <Badge variant="outline" className="gap-1.5">
                      <ChannelIcon className={`h-3.5 w-3.5 ${channelColor}`} />
                      <span>{channelLabel}</span>
                    </Badge>
                    {conversation.channelIdentifier && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link2 className="h-3.5 w-3.5" />
                        <span className="truncate">{conversation.channelIdentifier}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {/* Unified Contact Channels (if available) */}
        {conversation.unifiedContactId && conversation.channelMetadata && (
          <>
            <Separator />
            <div>
              <h3 className="mb-3 text-sm font-medium">Connected Channels</h3>
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2 text-sm">
                    {conversation.channelMetadata.whatsapp && (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const WhatsAppIcon = getChannelIcon('whatsapp');
                          const whatsappColor = getChannelColor('whatsapp');
                          return (
                            <>
                              <WhatsAppIcon className={`h-3.5 w-3.5 ${whatsappColor}`} />
                              <span className="text-muted-foreground">
                                {conversation.channelMetadata.whatsapp}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                    {conversation.channelMetadata.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        <span className="text-muted-foreground">
                          {conversation.channelMetadata.email}
                        </span>
                      </div>
                    )}
                    {conversation.channelMetadata.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-primary" />
                        <span className="text-muted-foreground">
                          {conversation.channelMetadata.phone}
                        </span>
                      </div>
                    )}
                    {conversation.channelMetadata.facebook && (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const FacebookIcon = getChannelIcon('facebook');
                          const facebookColor = getChannelColor('facebook');
                          return (
                            <>
                              <FacebookIcon className={`h-3.5 w-3.5 ${facebookColor}`} />
                              <span className="text-muted-foreground">
                                {conversation.channelMetadata.facebook}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                    {conversation.channelMetadata.instagram && (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const InstagramIcon = getChannelIcon('instagram');
                          const instagramColor = getChannelColor('instagram');
                          return (
                            <>
                              <InstagramIcon className={`h-3.5 w-3.5 ${instagramColor}`} />
                              <span className="text-muted-foreground">
                                @{conversation.channelMetadata.instagram}
                              </span>
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <p className="mt-2 text-xs text-muted-foreground">
                All channels linked to this contact
              </p>
            </div>
          </>
        )}

        <Separator />

        {/* Status */}
        <div>
          <h3 className="mb-3 text-sm font-medium">Status</h3>
          <Badge
            variant={
              conversation.status === 'open'
                ? 'default'
                : conversation.status === 'resolved'
                  ? 'secondary'
                  : 'outline'
            }
          >
            {conversation.status}
          </Badge>
        </div>

        {/* Priority */}
        {conversation.priority && (
          <>
            <Separator />
            <div>
              <h3 className="mb-3 text-sm font-medium">Priority</h3>
              <Badge
                variant={
                  conversation.priority === 'urgent'
                    ? 'destructive'
                    : conversation.priority === 'high'
                      ? 'default'
                      : 'outline'
                }
              >
                <AlertCircle className="mr-1 h-3 w-3" />
                {conversation.priority}
              </Badge>
            </div>
          </>
        )}

        {/* Assignee */}
        {conversation.assigneeName && (
          <>
            <Separator />
            <div>
              <h3 className="mb-3 text-sm font-medium">Assigned to</h3>
              <div className="flex items-center gap-2 text-sm">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <span>{conversation.assigneeName}</span>
              </div>
            </div>
          </>
        )}

        {/* Team */}
        {conversation.teamName && (
          <>
            <Separator />
            <div>
              <h3 className="mb-3 text-sm font-medium">Team</h3>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{conversation.teamName}</span>
              </div>
            </div>
          </>
        )}

        {/* Labels */}
        {conversation.labels && conversation.labels.length > 0 && (
          <>
            <Separator />
            <div>
              <h3 className="mb-3 text-sm font-medium">Labels</h3>
              <div className="flex flex-wrap gap-2">
                {conversation.labels.map((label: string) => (
                  <Badge key={label} variant="outline">
                    <Tag className="mr-1 h-3 w-3" />
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Metadata */}
        <Separator />
        <div>
          <h3 className="mb-3 text-sm font-medium">Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created {format(new Date(conversation.createdAt), 'MMM d, yyyy')}</span>
            </div>
            {conversation.lastMessageAt && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Last activity {format(new Date(conversation.lastMessageAt), 'MMM d, h:mm a')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
