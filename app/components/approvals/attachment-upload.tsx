'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Paperclip,
  Upload,
  X,
  File,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Attachment } from '@/app/lib/stores/approvals-store';

interface AttachmentUploadProps {
  attachments: Attachment[];
  onUpload: (files: File[]) => Promise<void>;
  onRemove: (id: string) => void;
  evidencePolicy: 'required' | 'optional' | 'none';
  maxFiles?: number;
  maxSizeBytes?: number;
  acceptedTypes?: string[];
  uploading?: boolean;
}

// Format bytes to human-readable
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Get file icon based on mime type
function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon;
  if (mimeType.includes('pdf')) return FileText;
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet;
  return File;
}

export function AttachmentUpload({
  attachments,
  onUpload,
  onRemove,
  evidencePolicy,
  maxFiles = 10,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx'],
  uploading = false,
}: AttachmentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFiles = (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];

    // Check max files
    if (attachments.length + files.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`);
      return { valid, errors };
    }

    for (const file of files) {
      // Check size
      if (file.size > maxSizeBytes) {
        errors.push(`${file.name}: File too large (max ${formatBytes(maxSizeBytes)})`);
        continue;
      }

      // Check type
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type);
        }
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', ''));
        }
        return file.type === type;
      });

      if (!isAccepted) {
        errors.push(`${file.name}: File type not accepted`);
        continue;
      }

      valid.push(file);
    }

    return { valid, errors };
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    if (valid.length > 0) {
      try {
        await onUpload(valid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = Array.from(e.target.files || []);
    const { valid, errors } = validateFiles(files);

    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    if (valid.length > 0) {
      try {
        await onUpload(valid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (evidencePolicy === 'none') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments
              {evidencePolicy === 'required' && (
                <span className="text-destructive">*</span>
              )}
            </CardTitle>
            <CardDescription>
              {evidencePolicy === 'required'
                ? 'Required: Upload supporting documents or evidence'
                : 'Optional: Attach supporting documents'}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {attachments.length} / {maxFiles}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload area */}
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed p-6 transition-colors',
            dragActive && 'border-primary bg-primary/5',
            uploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Drag and drop files here, or{' '}
                <button
                  type="button"
                  onClick={handleClick}
                  className="text-primary hover:underline"
                  disabled={uploading}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                Max {formatBytes(maxSizeBytes)} per file
              </p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="mt-1 text-xs text-center text-muted-foreground">
                Uploading...
              </p>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Upload Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Evidence requirement warning */}
        {evidencePolicy === 'required' && attachments.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Evidence Required</AlertTitle>
            <AlertDescription>
              You must attach at least one file to submit this request.
            </AlertDescription>
          </Alert>
        )}

        {/* Attached files */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Attached Files</p>
            <div className="space-y-2">
              {attachments.map((file) => {
                const Icon = getFileIcon(file.mimeType);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{file.filename}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{file.mimeType.split('/')[1]?.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(file.id)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Accepted types */}
        <p className="text-xs text-muted-foreground">
          Accepted file types: Images, PDF, Word, Excel
        </p>
      </CardContent>
    </Card>
  );
}
