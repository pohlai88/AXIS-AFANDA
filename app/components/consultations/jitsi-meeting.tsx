'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';

interface JitsiMeetingProps {
  roomName: string;
  userName?: string;
  onMeetingEnd?: () => void;
}

interface JitsiApi {
  dispose: () => void;
  addEventListener: (event: string, callback: (data?: unknown) => void) => void;
}

interface JitsiMeetExternalAPIConstructor {
  new(domain: string, options: Record<string, unknown>): JitsiApi;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: JitsiMeetExternalAPIConstructor;
  }
}

export function JitsiMeeting({ roomName, userName = 'Guest', onMeetingEnd }: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiApi | null>(null);

  const initializeJitsi = useCallback(() => {
    if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

    const domain = 'meet.jit.si';
    const options = {
      roomName: roomName,
      width: '100%',
      height: '100%',
      parentNode: containerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        enableWelcomePage: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1a1a1a',
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
      },
      userInfo: {
        displayName: userName,
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    // Event listeners
    apiRef.current.addEventListener('readyToClose', () => {
      if (onMeetingEnd) {
        onMeetingEnd();
      }
    });

    apiRef.current.addEventListener('videoConferenceJoined', (data) => {
      console.log('User joined:', data);
    });
  }, [roomName, userName, onMeetingEnd]);

  useEffect(() => {
    // Load Jitsi Meet API script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => initializeJitsi();
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (apiRef.current) {
        apiRef.current.dispose();
      }
      document.body.removeChild(script);
    };
  }, [initializeJitsi]);

  return (
    <Card className="overflow-hidden">
      <div ref={containerRef} className="h-[600px] w-full" />
    </Card>
  );
}
