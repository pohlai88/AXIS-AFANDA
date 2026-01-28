"use client";

import * as React from "react";
import { SettingsLayout } from "@/app/components/settings-layout";
import {
  Video, PenTool, Monitor, FileText, Mic, Camera,
  Globe, Smartphone, Layers, CircleDot, Server, Shield,
  Eye, RefreshCw, Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface CollaborationLayer {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function CollaborationSettingsPage() {
  const [layers, setLayers] = React.useState<CollaborationLayer[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [whiteboardEnabled, setWhiteboardEnabled] = React.useState(false);
  const [whiteboardTool, setWhiteboardTool] = React.useState("");
  const [whiteboardAutoSave, setWhiteboardAutoSave] = React.useState(false);
  const [whiteboardSaveInterval, setWhiteboardSaveInterval] = React.useState("");
  const [whiteboardPersist, setWhiteboardPersist] = React.useState(false);
  const [maxWhiteboards, setMaxWhiteboards] = React.useState("");
  const [videoEnabled, setVideoEnabled] = React.useState(false);
  const [jitsiUrl, setJitsiUrl] = React.useState("");
  const [videoProvider, setVideoProvider] = React.useState("");
  const [videoRequireApproval, setVideoRequireApproval] = React.useState(false);
  const [videoScreenShare, setVideoScreenShare] = React.useState(false);
  const [videoRecording, setVideoRecording] = React.useState(false);
  const [maxParticipants, setMaxParticipants] = React.useState("");
  const [videoQuality, setVideoQuality] = React.useState("");
  const [videoClosedCaptions, setVideoClosedCaptions] = React.useState(false);
  const [screenShareEnabled, setScreenShareEnabled] = React.useState(false);
  const [screenShareProvider, setScreenShareProvider] = React.useState("");
  const [screenShareFull, setScreenShareFull] = React.useState(false);
  const [screenShareWindow, setScreenShareWindow] = React.useState(false);
  const [screenShareTab, setScreenShareTab] = React.useState(false);
  const [screenShareQuality, setScreenShareQuality] = React.useState("");
  const [livekitUrl, setLivekitUrl] = React.useState("");
  const [livekitApiKey, setLivekitApiKey] = React.useState("");
  const [cobrowsingUniversal, setCobrowsingUniversal] = React.useState(false);
  const [cobrowsingEmbedded, setCobrowsingEmbedded] = React.useState(false);
  const [cobrowsingMode, setCobrowsingMode] = React.useState("");
  const [cobrowsingAgentControl, setCobrowsingAgentControl] = React.useState(false);
  const [cobrowsingVisitorControl, setCobrowsingVisitorControl] = React.useState(false);
  const [sfmEnabled, setSfmEnabled] = React.useState(false);
  const [sfmUrl, setSfmUrl] = React.useState("");
  const [sfmSnippetInjection, setSfmSnippetInjection] = React.useState(false);
  const [cobrowsingCursor, setCobrowsingCursor] = React.useState(false);
  const [cobrowsingScroll, setCobrowsingScroll] = React.useState(false);
  const [cobrowsingFormInputs, setCobrowsingFormInputs] = React.useState(false);
  const [documentsEnabled, setDocumentsEnabled] = React.useState(false);
  const [documentsMode, setDocumentsMode] = React.useState("");
  const [documentsAnnotations, setDocumentsAnnotations] = React.useState(false);
  const [documentsComments, setDocumentsComments] = React.useState(false);
  const [documentsCursor, setDocumentsCursor] = React.useState(false);
  const [documentsScroll, setDocumentsScroll] = React.useState(false);
  const [maxDocSize, setMaxDocSize] = React.useState("");
  const [recordingEnabled, setRecordingEnabled] = React.useState(false);
  const [recordingType, setRecordingType] = React.useState("");
  const [recordingConsent, setRecordingConsent] = React.useState(false);
  const [recordingIndicator, setRecordingIndicator] = React.useState(false);
  const [recordingStorage, setRecordingStorage] = React.useState("");
  const [recordingRetention, setRecordingRetention] = React.useState("");
  const [recordingQuality, setRecordingQuality] = React.useState("");
  const [renderingEnabled, setRenderingEnabled] = React.useState(false);
  const [renderingUrl, setRenderingUrl] = React.useState("");
  const [renderingApiKey, setRenderingApiKey] = React.useState("");
  const [renderingCobrowsing, setRenderingCobrowsing] = React.useState(false);
  const [renderingDocuments, setRenderingDocuments] = React.useState(false);
  const [renderingMigration, setRenderingMigration] = React.useState(false);
  const [renderingTimeout, setRenderingTimeout] = React.useState("");
  const [maxConcurrent, setMaxConcurrent] = React.useState("");
  const [layerActivation, setLayerActivation] = React.useState(false);
  const [multipleLayers, setMultipleLayers] = React.useState(false);
  const [activeLayers, setActiveLayers] = React.useState<string[]>([]);

  React.useEffect(() => {
    // TODO: Replace with actual API call
    // const fetchSettings = async () => {
    //   const response = await apiClient.get('/api/v1/settings/collaboration');
    //   setLayers(response.layers);
    //   // ... set all state values from API
    // };
    // fetchSettings();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <SettingsLayout title="Collaboration">
        <div className="layout-stack">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Collaboration">
      <div className="layout-stack">
        <div className="flex items-center gap-3">
          <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
            <Video className="h-6 w-6 text-lux-gold" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Collaboration Layers</h2>
            <p className="text-sm text-muted-foreground">
              Configure whiteboards, video calls, screen sharing, co-browsing, document collaboration, and recording
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-8 max-w-full overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="screenshare">Screen Share</TabsTrigger>
            <TabsTrigger value="cobrowsing">Co-browsing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="recording">Recording</TabsTrigger>
            <TabsTrigger value="rendering">Rendering</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  <CardTitle>Collaboration Layers Overview</CardTitle>
                </div>
                <CardDescription>
                  Manage and configure all collaboration layers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {layers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No collaboration layers configured
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {layers.map((layer) => (
                      <div key={layer.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">{layer.name}</Label>
                          <Badge variant={layer.enabled ? "secondary" : "outline"}>
                            {layer.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {layer.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <Label>Layer Manipulation</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Layer Activation</Label>
                      <p className="text-xs text-muted-foreground">
                        Users can activate collaboration layers
                      </p>
                    </div>
                    <Switch checked={layerActivation} onCheckedChange={setLayerActivation} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Multiple Layers</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow multiple collaboration layers simultaneously
                      </p>
                    </div>
                    <Switch checked={multipleLayers} onCheckedChange={setMultipleLayers} />
                  </div>

                  <div className="space-y-2">
                    <Label>Default Active Layers</Label>
                    {activeLayers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No active layers</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {activeLayers.map((layer) => (
                          <Badge key={layer} variant="secondary">{layer}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button className="w-full">Save Layer Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whiteboard Configuration */}
          <TabsContent value="whiteboard" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  <CardTitle>Whiteboard (tldraw)</CardTitle>
                  <Badge variant="secondary">tldraw</Badge>
                </div>
                <CardDescription>
                  Configure whiteboard collaboration settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Whiteboard</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow whiteboard collaboration in conversations
                    </p>
                  </div>
                  <Switch checked={whiteboardEnabled} onCheckedChange={setWhiteboardEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Default Whiteboard Tool</Label>
                  <Select value={whiteboardTool} onValueChange={setWhiteboardTool}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tool" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draw">Draw</SelectItem>
                      <SelectItem value="select">Select</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="shape">Shape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-save Whiteboards</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically save whiteboard state
                    </p>
                  </div>
                  <Switch checked={whiteboardAutoSave} onCheckedChange={setWhiteboardAutoSave} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="save-interval">Auto-save Interval (seconds)</Label>
                  <Input
                    id="save-interval"
                    type="number"
                    value={whiteboardSaveInterval}
                    onChange={(e) => setWhiteboardSaveInterval(e.target.value)}
                    placeholder="Enter interval"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Persist Whiteboards</Label>
                    <p className="text-xs text-muted-foreground">
                      Save whiteboards to database for later access
                    </p>
                  </div>
                  <Switch checked={whiteboardPersist} onCheckedChange={setWhiteboardPersist} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-whiteboards">Max Whiteboards per Conversation</Label>
                  <Input
                    id="max-whiteboards"
                    type="number"
                    value={maxWhiteboards}
                    onChange={(e) => setMaxWhiteboards(e.target.value)}
                    placeholder="Enter maximum"
                  />
                </div>

                <Button className="w-full">Save Whiteboard Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Video Calls Configuration */}
          <TabsContent value="video" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  <CardTitle>Video Calls (Jitsi)</CardTitle>
                  <Badge variant="secondary">Jitsi Meet</Badge>
                </div>
                <CardDescription>
                  Configure video call settings and provider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Video Calls</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow video calls in conversations
                    </p>
                  </div>
                  <Switch checked={videoEnabled} onCheckedChange={setVideoEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jitsi-url">Jitsi Server URL</Label>
                  <Input
                    id="jitsi-url"
                    value={jitsiUrl}
                    onChange={(e) => setJitsiUrl(e.target.value)}
                    placeholder="Enter Jitsi server URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Call Service Provider</Label>
                  <Select value={videoProvider} onValueChange={setVideoProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jitsi">Jitsi Meet</SelectItem>
                      <SelectItem value="livekit">LiveKit</SelectItem>
                      <SelectItem value="azure">Azure Communication Services</SelectItem>
                      <SelectItem value="vonage">Vonage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Approval for Calls</Label>
                    <p className="text-xs text-muted-foreground">
                      Video calls require approval before starting
                    </p>
                  </div>
                  <Switch checked={videoRequireApproval} onCheckedChange={setVideoRequireApproval} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Screen Sharing</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow screen sharing during calls
                    </p>
                  </div>
                  <Switch checked={videoScreenShare} onCheckedChange={setVideoScreenShare} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Recording</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow recording of video calls
                    </p>
                  </div>
                  <Switch checked={videoRecording} onCheckedChange={setVideoRecording} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-participants">Max Participants</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    placeholder="Enter maximum"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default Video Quality</Label>
                  <Select value={videoQuality} onValueChange={setVideoQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="low">Low (240p)</SelectItem>
                      <SelectItem value="medium">Medium (480p)</SelectItem>
                      <SelectItem value="high">High (720p)</SelectItem>
                      <SelectItem value="hd">HD (1080p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Closed Captions</Label>
                    <p className="text-xs text-muted-foreground">
                      Show closed captions in video calls
                    </p>
                  </div>
                  <Switch checked={videoClosedCaptions} onCheckedChange={setVideoClosedCaptions} />
                </div>

                <Button className="w-full">Save Video Call Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Screen Sharing Configuration */}
          <TabsContent value="screenshare" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  <CardTitle>Screen Sharing</CardTitle>
                </div>
                <CardDescription>
                  Configure screen sharing capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Screen Sharing</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow users to share their screen
                    </p>
                  </div>
                  <Switch checked={screenShareEnabled} onCheckedChange={setScreenShareEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Screen Share Provider</Label>
                  <Select value={screenShareProvider} onValueChange={setScreenShareProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webrtc">WebRTC (Browser)</SelectItem>
                      <SelectItem value="livekit">LiveKit</SelectItem>
                      <SelectItem value="jitsi">Jitsi Screen Share</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Full Screen Share</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can share entire screen
                    </p>
                  </div>
                  <Switch checked={screenShareFull} onCheckedChange={setScreenShareFull} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Window Share</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can share specific windows
                    </p>
                  </div>
                  <Switch checked={screenShareWindow} onCheckedChange={setScreenShareWindow} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Tab Share</Label>
                    <p className="text-xs text-muted-foreground">
                      Users can share browser tabs
                    </p>
                  </div>
                  <Switch checked={screenShareTab} onCheckedChange={setScreenShareTab} />
                </div>

                <div className="space-y-2">
                  <Label>Default Share Quality</Label>
                  <Select value={screenShareQuality} onValueChange={setScreenShareQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="livekit-url">LiveKit Server URL (if using LiveKit)</Label>
                  <Input
                    id="livekit-url"
                    value={livekitUrl}
                    onChange={(e) => setLivekitUrl(e.target.value)}
                    placeholder="Enter LiveKit server URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="livekit-api-key">LiveKit API Key</Label>
                  <Input
                    id="livekit-api-key"
                    type="password"
                    value={livekitApiKey}
                    onChange={(e) => setLivekitApiKey(e.target.value)}
                    placeholder="Enter API key"
                  />
                </div>

                <Button className="w-full">Save Screen Share Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Co-browsing Configuration */}
          <TabsContent value="cobrowsing" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>Co-browsing</CardTitle>
                </div>
                <CardDescription>
                  Configure universal and embedded co-browsing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Universal Co-browsing</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow synchronized web browsing
                    </p>
                  </div>
                  <Switch checked={cobrowsingUniversal} onCheckedChange={setCobrowsingUniversal} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Embedded Co-browsing</Label>
                    <p className="text-xs text-muted-foreground">
                      Co-browsing within embedded iframes
                    </p>
                  </div>
                  <Switch checked={cobrowsingEmbedded} onCheckedChange={setCobrowsingEmbedded} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Co-browsing Mode</Label>

                  <div className="space-y-2">
                    <Label>Co-browsing Type</Label>
                    <Select value={cobrowsingMode} onValueChange={setCobrowsingMode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="universal">Universal Co-browsing</SelectItem>
                        <SelectItem value="embedded">Embedded Co-browsing</SelectItem>
                        <SelectItem value="rendered">Rendered Co-browsing (Server-side)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Agent Control</Label>
                      <p className="text-xs text-muted-foreground">
                        Agents can control visitor's browser
                      </p>
                    </div>
                    <Switch checked={cobrowsingAgentControl} onCheckedChange={setCobrowsingAgentControl} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Visitor Control</Label>
                      <p className="text-xs text-muted-foreground">
                        Visitors can control agent's view
                      </p>
                    </div>
                    <Switch checked={cobrowsingVisitorControl} onCheckedChange={setCobrowsingVisitorControl} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <Label>SecureFlow Manager (SFM)</Label>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      SecureFlow Manager is required for embedded co-browsing with restricted resources.
                    </p>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable SecureFlow Manager</Label>
                      <Switch checked={sfmEnabled} onCheckedChange={setSfmEnabled} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sfm-url">SFM Server URL</Label>
                    <Input
                      id="sfm-url"
                      value={sfmUrl}
                      onChange={(e) => setSfmUrl(e.target.value)}
                      placeholder="Enter SFM server URL"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Dynamic Snippet Injection</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically inject co-browsing snippets
                      </p>
                    </div>
                    <Switch checked={sfmSnippetInjection} onCheckedChange={setSfmSnippetInjection} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Co-browsing Settings</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Cursor Position</Label>
                      <p className="text-xs text-muted-foreground">
                        Display cursor position during co-browsing
                      </p>
                    </div>
                    <Switch checked={cobrowsingCursor} onCheckedChange={setCobrowsingCursor} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Scroll Position</Label>
                      <p className="text-xs text-muted-foreground">
                        Synchronize scroll position
                      </p>
                    </div>
                    <Switch checked={cobrowsingScroll} onCheckedChange={setCobrowsingScroll} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Form Inputs</Label>
                      <p className="text-xs text-muted-foreground">
                        Share form input values (masked)
                      </p>
                    </div>
                    <Switch checked={cobrowsingFormInputs} onCheckedChange={setCobrowsingFormInputs} />
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Embedded co-browsing has limitations with HTML tainted canvas and restricted resources.
                    Use SecureFlow Manager for production deployments.
                  </p>
                </div>

                <Button className="w-full">Save Co-browsing Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Collaboration */}
          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <CardTitle>Document Collaboration</CardTitle>
                </div>
                <CardDescription>
                  Configure document viewing and collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Document Collaboration</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow collaborative document viewing
                    </p>
                  </div>
                  <Switch checked={documentsEnabled} onCheckedChange={setDocumentsEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Document Collaboration Mode</Label>
                  <Select value={documentsMode} onValueChange={setDocumentsMode}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client-side (Browser)</SelectItem>
                      <SelectItem value="server">Server-side (Rendering Service)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Supported Document Types</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="secondary">DOCX</Badge>
                    <Badge variant="secondary">XLSX</Badge>
                    <Badge variant="secondary">PPTX</Badge>
                    <Badge variant="secondary">Images</Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Annotations</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow users to annotate documents
                    </p>
                  </div>
                  <Switch checked={documentsAnnotations} onCheckedChange={setDocumentsAnnotations} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Comments</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow comments on documents
                    </p>
                  </div>
                  <Switch checked={documentsComments} onCheckedChange={setDocumentsComments} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Cursor Position</Label>
                    <p className="text-xs text-muted-foreground">
                      Display cursor position in documents
                    </p>
                  </div>
                  <Switch checked={documentsCursor} onCheckedChange={setDocumentsCursor} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Scroll Position</Label>
                    <p className="text-xs text-muted-foreground">
                      Synchronize scroll position across viewers
                    </p>
                  </div>
                  <Switch checked={documentsScroll} onCheckedChange={setDocumentsScroll} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-doc-size">Max Document Size (MB)</Label>
                  <Input
                    id="max-doc-size"
                    type="number"
                    value={maxDocSize}
                    onChange={(e) => setMaxDocSize(e.target.value)}
                    placeholder="Enter maximum size"
                  />
                </div>

                <Button className="w-full">Save Document Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversation Recording */}
          <TabsContent value="recording" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CircleDot className="h-5 w-5" />
                  <CardTitle>Conversation Recording</CardTitle>
                </div>
                <CardDescription>
                  Configure conversation and session recording
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Conversation Recording</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow recording of conversations and sessions
                    </p>
                  </div>
                  <Switch checked={recordingEnabled} onCheckedChange={setRecordingEnabled} />
                </div>

                <div className="space-y-2">
                  <Label>Recording Type</Label>
                  <Select value={recordingType} onValueChange={setRecordingType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Recording</SelectItem>
                      <SelectItem value="audio">Audio Only</SelectItem>
                      <SelectItem value="screen">Screen Recording</SelectItem>
                      <SelectItem value="full">Full Session (Video + Screen)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Consent</Label>
                    <p className="text-xs text-muted-foreground">
                      Require user consent before recording
                    </p>
                  </div>
                  <Switch checked={recordingConsent} onCheckedChange={setRecordingConsent} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Recording Indicator</Label>
                    <p className="text-xs text-muted-foreground">
                      Display recording indicator during session
                    </p>
                  </div>
                  <Switch checked={recordingIndicator} onCheckedChange={setRecordingIndicator} />
                </div>

                <div className="space-y-2">
                  <Label>Recording Storage</Label>
                  <Select value={recordingStorage} onValueChange={setRecordingStorage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recording-retention">Recording Retention (days)</Label>
                  <Input
                    id="recording-retention"
                    type="number"
                    value={recordingRetention}
                    onChange={(e) => setRecordingRetention(e.target.value)}
                    placeholder="Enter retention period"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Recording Quality</Label>
                  <Select value={recordingQuality} onValueChange={setRecordingQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (for storage)</SelectItem>
                      <SelectItem value="medium">Medium (balanced)</SelectItem>
                      <SelectItem value="high">High (quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">Save Recording Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rendering Service */}
          <TabsContent value="rendering" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  <CardTitle>Rendering Service</CardTitle>
                  <Badge variant="outline">Optional</Badge>
                </div>
                <CardDescription>
                  Configure server-side rendering for co-browsing and document collaboration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    The Rendering Service is required for:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
                    <li>Universal co-browsing</li>
                    <li>Server-based document collaboration</li>
                    <li>Conversation recording</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Rendering Service</Label>
                    <p className="text-xs text-muted-foreground">
                      Use server-side rendering for collaboration
                    </p>
                  </div>
                  <Switch checked={renderingEnabled} onCheckedChange={setRenderingEnabled} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rendering-url">Rendering Service URL</Label>
                  <Input
                    id="rendering-url"
                    value={renderingUrl}
                    onChange={(e) => setRenderingUrl(e.target.value)}
                    placeholder="Enter rendering service URL"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rendering-api-key">API Key</Label>
                  <Input
                    id="rendering-api-key"
                    type="password"
                    value={renderingApiKey}
                    onChange={(e) => setRenderingApiKey(e.target.value)}
                    placeholder="Enter API key"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Rendering Features</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Rendered Co-browsing</Label>
                      <p className="text-xs text-muted-foreground">
                        Server-side rendered co-browsing
                      </p>
                    </div>
                    <Switch checked={renderingCobrowsing} onCheckedChange={setRenderingCobrowsing} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Server Document Rendering</Label>
                      <p className="text-xs text-muted-foreground">
                        Render documents on server
                      </p>
                    </div>
                    <Switch checked={renderingDocuments} onCheckedChange={setRenderingDocuments} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Session Migration Support</Label>
                      <p className="text-xs text-muted-foreground">
                        Support session migration with refresh
                      </p>
                    </div>
                    <Switch checked={renderingMigration} onCheckedChange={setRenderingMigration} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="rendering-timeout">Rendering Timeout (seconds)</Label>
                  <Input
                    id="rendering-timeout"
                    type="number"
                    value={renderingTimeout}
                    onChange={(e) => setRenderingTimeout(e.target.value)}
                    placeholder="Enter timeout"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-concurrent">Max Concurrent Renderings</Label>
                  <Input
                    id="max-concurrent"
                    type="number"
                    value={maxConcurrent}
                    onChange={(e) => setMaxConcurrent(e.target.value)}
                    placeholder="Enter maximum"
                  />
                </div>

                <Button className="w-full">Save Rendering Settings</Button>
                <Button variant="outline" className="w-full">Test Rendering Service</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mobile Co-apping</CardTitle>
                <CardDescription>
                  Configure mobile co-apping collaboration layer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Mobile co-apping requires mobile SDK integration.
                    Configure in mobile app settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SettingsLayout>
  );
}
