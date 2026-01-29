'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, Copy, Edit, Trash2, Star } from 'lucide-react';

// Mock templates
const mockTemplates = {
  meeting_request: [
    {
      id: '1',
      name: 'Sales Call',
      description: 'For client meetings and product demos',
      isDefault: true,
      usageCount: 45,
      category: 'Sales',
    },
    {
      id: '2',
      name: 'Internal Meeting',
      description: 'For team syncs and planning',
      isDefault: true,
      usageCount: 128,
      category: 'Internal',
    },
    {
      id: '3',
      name: 'Customer Support',
      description: 'For support and technical issues',
      isDefault: true,
      usageCount: 67,
      category: 'Support',
    },
  ],
  meeting_minutes: [
    {
      id: '4',
      name: 'Standard Minutes',
      description: 'Default meeting minutes template',
      isDefault: true,
      usageCount: 234,
      category: 'General',
    },
  ],
  approval_request: [
    {
      id: '5',
      name: 'Budget Approval',
      description: 'For budget and purchase requests',
      isDefault: true,
      usageCount: 89,
      category: 'Finance',
    },
    {
      id: '6',
      name: 'Project Approval',
      description: 'For project and initiative approvals',
      isDefault: true,
      usageCount: 56,
      category: 'Projects',
    },
  ],
};

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('meeting_request');

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Templates</h1>
            <p className="text-sm text-muted-foreground">
              Manage reusable templates for meetings, minutes, and approvals
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="meeting_request">Meeting Requests</TabsTrigger>
              <TabsTrigger value="meeting_minutes">Meeting Minutes</TabsTrigger>
              <TabsTrigger value="approval_request">Approval Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="meeting_request" className="mt-6 space-y-4">
              {mockTemplates.meeting_request.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.isDefault && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3" />
                              Default
                            </Badge>
                          )}
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        {!template.isDefault && (
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Used {template.usageCount} times
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="meeting_minutes" className="mt-6 space-y-4">
              {mockTemplates.meeting_minutes.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.isDefault && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3" />
                              Default
                            </Badge>
                          )}
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Used {template.usageCount} times
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="approval_request" className="mt-6 space-y-4">
              {mockTemplates.approval_request.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          {template.isDefault && (
                            <Badge variant="secondary" className="gap-1">
                              <Star className="h-3 w-3" />
                              Default
                            </Badge>
                          )}
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <CardDescription className="mt-1">{template.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        {!template.isDefault && (
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Used {template.usageCount} times
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
