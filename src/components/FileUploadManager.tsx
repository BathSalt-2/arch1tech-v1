import React, { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  File, 
  Archive, 
  Trash2, 
  Download,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  Loader2,
  HardDrive,
  Zap
} from 'lucide-react';

interface FileUpload {
  id: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  upload_status: string;
  processing_status: string;
  extraction_path?: string;
  metadata: any;
  created_at: string;
}

const FileUploadManager = () => {
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const loadUploads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('file_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploads(data || []);
    } catch (error) {
      console.error('Error loading uploads:', error);
    }
  }, []);

  React.useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File) => {
    try {
      const fileId = crypto.randomUUID();
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Create file upload record
      const { error: dbError } = await supabase
        .from('file_uploads')
        .insert({
          id: fileId,
          user_id: userId,
          original_filename: file.name,
          file_size: file.size,
          file_type: file.type,
          storage_path: `${userId}/${fileId}/${file.name}`,
          upload_status: 'uploading',
          processing_status: 'pending'
        });

      if (dbError) throw dbError;

      // Set initial progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Upload to storage with progress tracking
      const filePath = `${userId}/${fileId}/${file.name}`;
      
      // For large files, we'll use chunked upload simulation
      const chunkSize = 5 * 1024 * 1024; // 5MB chunks
      const totalChunks = Math.ceil(file.size / chunkSize);
      
      if (file.size > chunkSize) {
        // Simulate chunked upload for large files
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, file.size);
          const chunk = file.slice(start, end);
          
          // Upload chunk (in real implementation, this would be actual chunked upload)
          await new Promise(resolve => setTimeout(resolve, 100)); // Simulate upload time
          
          const progress = ((i + 1) / totalChunks) * 100;
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        }
      }

      // Final upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Update status to completed
      await supabase
        .from('file_uploads')
        .update({ 
          upload_status: 'completed',
          processing_status: file.name.endsWith('.zip') ? 'extracting' : 'ready'
        })
        .eq('id', fileId);

      // If it's a ZIP file, trigger extraction
      if (file.name.endsWith('.zip')) {
        try {
          const { error: extractError } = await supabase.functions.invoke('extract-zip', {
            body: { fileId, filePath }
          });
          
          if (extractError) {
            console.error('Extraction error:', extractError);
            await supabase
              .from('file_uploads')
              .update({ processing_status: 'extraction_failed' })
              .eq('id', fileId);
          }
        } catch (extractError) {
          console.error('Failed to trigger extraction:', extractError);
        }
      }

      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      
      toast({
        title: "Upload Complete",
        description: `${file.name} has been uploaded successfully.`,
        variant: "default"
      });

      // Reload uploads
      loadUploads();
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}. Please try again.`,
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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const deleteFile = async (upload: FileUpload) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-uploads')
        .remove([upload.storage_path]);

      if (storageError) throw storageError;

      // Delete record
      const { error: dbError } = await supabase
        .from('file_uploads')
        .delete()
        .eq('id', upload.id);

      if (dbError) throw dbError;

      toast({
        title: "File Deleted",
        description: `${upload.original_filename} has been deleted.`,
        variant: "default"
      });

      loadUploads();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete file. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (upload: FileUpload) => {
    if (upload.upload_status === 'uploading') {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
    if (upload.processing_status === 'extracting') {
      return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
    }
    if (upload.processing_status === 'extraction_failed') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (upload.upload_status === 'completed') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-gray-500" />;
  };

  const getStatusText = (upload: FileUpload) => {
    if (upload.upload_status === 'uploading') return 'Uploading...';
    if (upload.processing_status === 'extracting') return 'Extracting...';
    if (upload.processing_status === 'extraction_failed') return 'Extraction Failed';
    if (upload.processing_status === 'extracted') return 'Extracted';
    if (upload.upload_status === 'completed') return 'Ready';
    return 'Processing...';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          File Upload Manager
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload and manage your files, including large ZIP archives up to 20GB with automatic extraction
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
            Drag and drop files or click to select. Supports files up to 20GB including ZIP archives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <HardDrive className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supports all file types, up to 20GB per file
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mt-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      <Card className="holographic-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            Uploaded Files ({uploads.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <File className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {upload.original_filename.endsWith('.zip') ? (
                        <Archive className="w-6 h-6 text-amber-500" />
                      ) : (
                        <File className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{upload.original_filename}</p>
                        {getStatusIcon(upload)}
                        <Badge variant="secondary" className="text-xs">
                          {getStatusText(upload)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(upload.file_size)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(upload.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {uploadProgress[upload.id] !== undefined && uploadProgress[upload.id] < 100 && (
                        <Progress value={uploadProgress[upload.id]} className="mt-2" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {upload.processing_status === 'extracted' && (
                      <Button variant="ghost" size="sm">
                        <FolderOpen className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteFile(upload)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Files</p>
                <p className="text-2xl font-bold">{uploads.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Archive className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ZIP Archives</p>
                <p className="text-2xl font-bold">
                  {uploads.filter(u => u.original_filename.endsWith('.zip')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Zap className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ready Files</p>
                <p className="text-2xl font-bold">
                  {uploads.filter(u => u.processing_status === 'ready' || u.processing_status === 'extracted').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUploadManager;