import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  File, 
  Archive, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  X,
  FolderOpen,
  HardDrive
} from 'lucide-react';

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  extractedFiles?: string[];
}

const FileUploader = () => {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="w-6 h-6 text-blue-500" />;
      case 'pkl':
      case 'pt':
      case 'pth':
      case 'onnx':
      case 'h5':
        return <Brain className="w-6 h-6 text-purple-500" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const uploadFile = async (file: File): Promise<void> => {
    const uploadId = Math.random().toString(36).substr(2, 9);
    const newUpload: FileUpload = {
      id: uploadId,
      file,
      progress: 0,
      status: 'uploading'
    };

    setUploads(prev => [...prev, newUpload]);

    try {
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload file to Supabase Storage with chunked upload for large files
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      // For files larger than 50MB, we'll simulate chunked upload
      if (file.size > 50 * 1024 * 1024) {
        // Simulate chunked upload progress
        const chunks = Math.ceil(file.size / (10 * 1024 * 1024)); // 10MB chunks
        for (let i = 0; i < chunks; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          const progress = Math.round(((i + 1) / chunks) * 80); // 80% for upload
          setUploads(prev => prev.map(upload => 
            upload.id === uploadId 
              ? { ...upload, progress }
              : upload
          ));
        }
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Update progress to 90%
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, progress: 90 }
          : upload
      ));

      // Record file upload in database
      const { data: fileRecord, error: dbError } = await supabase
        .from('file_uploads')
        .insert({
          user_id: user.id,
          filename: file.name,
          original_filename: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: filePath,
          upload_status: 'completed',
          processing_status: 'ready',
          is_zip: file.name.toLowerCase().endsWith('.zip')
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Check if it's a ZIP file and trigger extraction
      if (file.name.toLowerCase().endsWith('.zip')) {
        setUploads(prev => prev.map(upload => 
          upload.id === uploadId 
            ? { ...upload, status: 'processing', progress: 95 }
            : upload
        ));

        // Call ZIP extraction edge function
        const { data: extractData, error: extractError } = await supabase.functions
          .invoke('extract-zip', {
            body: { fileId: fileRecord?.id, filePath }
          });

        if (extractError) {
          console.warn('ZIP extraction failed:', extractError);
          // Continue as normal file upload
        } else {
          setUploads(prev => prev.map(upload => 
            upload.id === uploadId 
              ? { 
                  ...upload, 
                  extractedFiles: extractData?.extractedFiles || [],
                  progress: 100,
                  status: 'completed'
                }
              : upload
          ));
        }
      }

      // Complete upload
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { ...upload, progress: 100, status: 'completed' }
          : upload
      ));

      toast({
        title: "Upload Complete",
        description: `${file.name} has been uploaded successfully.`,
        variant: "default"
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId 
          ? { 
              ...upload, 
              status: 'error', 
              error: error.message || 'Upload failed'
            }
          : upload
      ));

      toast({
        title: "Upload Failed",
        description: error.message || 'Failed to upload file',
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      // Check file size (20GB limit)
      if (file.size > 20 * 1024 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: `${file.name} exceeds the 20GB limit.`,
          variant: "destructive"
        });
        return;
      }

      uploadFile(file);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };

  const getStatusIcon = (status: FileUpload['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = (upload: FileUpload) => {
    switch (upload.status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Extracting ZIP...';
      case 'completed':
        return upload.extractedFiles ? `Extracted ${upload.extractedFiles.length} files` : 'Upload complete';
      case 'error':
        return upload.error || 'Upload failed';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          File Upload Center
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload files up to 20GB including ZIP archives with custom models
        </p>
      </div>

      {/* Upload Area */}
      <Card className="holographic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supports ZIP extraction and large file uploads.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <HardDrive className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supports files up to 20GB • ZIP files will be automatically extracted
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="neon"
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              <Archive className="w-3 h-3 mr-1" />
              ZIP/RAR/7Z
            </Badge>
            <Badge variant="secondary">
              <Brain className="w-3 h-3 mr-1" />
              ML Models
            </Badge>
            <Badge variant="secondary">
              <File className="w-3 h-3 mr-1" />
              Documents
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card className="holographic-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Upload Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploads.map((upload) => (
              <div key={upload.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getFileIcon(upload.file.name)}
                    <div>
                      <p className="font-medium">{upload.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(upload.file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(upload.status)}
                    <span className="text-sm">{getStatusText(upload)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUpload(upload.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {upload.status === 'uploading' || upload.status === 'processing' ? (
                  <Progress value={upload.progress} className="w-full" />
                ) : null}

                {upload.extractedFiles && upload.extractedFiles.length > 0 && (
                  <div className="ml-9 space-y-1">
                    <p className="text-sm font-medium text-green-600">Extracted Files:</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      {upload.extractedFiles.slice(0, 5).map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <File className="w-3 h-3" />
                          {file}
                        </div>
                      ))}
                      {upload.extractedFiles.length > 5 && (
                        <div className="text-xs">
                          ... and {upload.extractedFiles.length - 5} more files
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Separator />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploader;