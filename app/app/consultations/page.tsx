'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Calendar, Users, Clock, Plus } from 'lucide-react';

export default function ConsultationsPage() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Consultations</h1>
            <p className="text-sm text-muted-foreground">
              Video consultation rooms powered by Jitsi
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Consultation
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Video className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Consultation Rooms</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Create secure video consultation rooms for approved escalations
          </p>

          <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
            <Card>
              <CardHeader>
                <Video className="h-8 w-8 text-blue-500" />
                <CardTitle className="text-base">Jitsi Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Secure, self-hosted video conferencing
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="h-8 w-8 text-green-500" />
                <CardTitle className="text-base">Scheduled Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schedule consultations in advance
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-purple-500" />
                <CardTitle className="text-base">Multi-Party</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Invite multiple participants
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <p className="text-sm text-muted-foreground">
              <Clock className="mr-2 inline h-4 w-4" />
              Coming soon - Jitsi integration in development
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
