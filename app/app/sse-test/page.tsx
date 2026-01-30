'use client';

/**
 * SSE Connection Diagnostic Page
 * Test and debug Server-Sent Events connections
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useActivityStream } from '@/app/hooks/use-activity-stream';

export default function SSETestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [manualConnection, setManualConnection] = useState<{
    status: string;
    messages: string[];
  }>({
    status: 'disconnected',
    messages: [],
  });

  // Test using the hook
  const { activity, isConnected, error, lastHeartbeat } = useActivityStream('test-tenant');

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };

  useEffect(() => {
    addLog(`Hook connection status: ${isConnected ? 'CONNECTED' : 'DISCONNECTED'}`);
  }, [isConnected]);

  useEffect(() => {
    if (error) {
      addLog(`Hook error: ${error.message}`);
    }
  }, [error]);

  useEffect(() => {
    if (activity) {
      addLog(`Hook received activity: ${JSON.stringify(activity)}`);
    }
  }, [activity]);

  useEffect(() => {
    if (lastHeartbeat) {
      addLog(`Hook heartbeat received at ${lastHeartbeat.toLocaleTimeString()}`);
    }
  }, [lastHeartbeat]);

  // Manual EventSource test
  const testManualConnection = () => {
    addLog('Starting manual EventSource test...');
    setManualConnection({ status: 'connecting', messages: [] });

    const eventSource = new EventSource('/api/v1/activity');

    eventSource.onopen = () => {
      addLog('Manual connection OPENED');
      setManualConnection((prev) => ({ ...prev, status: 'connected' }));
    };

    eventSource.onerror = (error) => {
      const state = eventSource.readyState;
      const states = ['CONNECTING', 'OPEN', 'CLOSED'];
      addLog(`Manual connection ERROR - State: ${states[state]} (${state})`);
      console.error('Manual EventSource error:', error);
    };

    eventSource.onmessage = (event) => {
      addLog(`Manual message: ${event.data.substring(0, 100)}`);
      setManualConnection((prev) => ({
        ...prev,
        messages: [event.data, ...prev.messages].slice(0, 10),
      }));
    };

    // Listen for specific event types
    ['connected', 'heartbeat', 'activity'].forEach((type) => {
      eventSource.addEventListener(type, (event) => {
        addLog(`Manual event [${type}]: ${event.data.substring(0, 100)}`);
      });
    });

    // Clean up after 60 seconds
    setTimeout(() => {
      addLog('Closing manual connection after 60s test');
      eventSource.close();
      setManualConnection((prev) => ({ ...prev, status: 'closed' }));
    }, 60000);
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">SSE Connection Diagnostics</h1>
        <p className="text-muted-foreground">
          Test and debug Server-Sent Events connections
        </p>
      </div>

      {/* Hook Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            useActivityStream Hook Status
            <Badge variant={isConnected ? 'default' : 'destructive'}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Connection</div>
              <div className="font-mono text-sm">
                {isConnected ? '✅ OPEN' : '❌ CLOSED'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Heartbeat</div>
              <div className="font-mono text-sm">
                {lastHeartbeat?.toLocaleTimeString() || 'None'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Error</div>
              <div className="font-mono text-sm text-destructive">
                {error?.message || 'None'}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Activity</div>
              <div className="font-mono text-sm">
                {activity ? JSON.stringify(activity).substring(0, 50) : 'None'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manual Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Manual EventSource Test
            <Badge
              variant={
                manualConnection.status === 'connected'
                  ? 'default'
                  : manualConnection.status === 'connecting'
                    ? 'secondary'
                    : 'outline'
              }
            >
              {manualConnection.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testManualConnection}>Start 60s Test</Button>
          {manualConnection.messages.length > 0 && (
            <div>
              <div className="text-sm font-medium mb-2">Recent Messages:</div>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {manualConnection.messages.map((msg, i) => (
                  <div key={i} className="font-mono text-xs p-2 bg-muted rounded">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Log</span>
            <Button variant="outline" size="sm" onClick={() => setLogs([])}>
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-96 overflow-y-auto font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-muted-foreground">No logs yet...</div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className={`p-2 rounded ${log.includes('ERROR') || log.includes('error')
                    ? 'bg-destructive/10 text-destructive'
                    : log.includes('CONNECTED') || log.includes('OPENED')
                      ? 'bg-approve-bg text-approve-fg'
                      : 'bg-muted'
                    }`}
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Browser Console Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Console Checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Open your browser DevTools console and look for:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>
              <code className="bg-muted px-1 rounded">[SSE] Connection established:</code> -
              Success!
            </li>
            <li>
              <code className="bg-muted px-1 rounded">[SSE] Connection error:</code> - Shows
              detailed error info
            </li>
            <li>
              <code className="bg-muted px-1 rounded">[ActivityStream] Connected</code> - Hook
              is working
            </li>
            <li>Network tab → Filter by "activity" → Should show "EventStream" type</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
