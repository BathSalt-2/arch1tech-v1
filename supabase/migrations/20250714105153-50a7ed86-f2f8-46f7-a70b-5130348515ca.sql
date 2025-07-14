-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('project-files', 'project-files', false),
  ('extracted-models', 'extracted-models', false),
  ('user-uploads', 'user-uploads', false);

-- Create policies for project files bucket
CREATE POLICY "Users can view their own project files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own project files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for extracted models bucket
CREATE POLICY "Users can view their own extracted models" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'extracted-models' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own extracted models" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'extracted-models' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own extracted models" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'extracted-models' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own extracted models" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'extracted-models' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for user uploads bucket
CREATE POLICY "Users can view their own uploads" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own uploads" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own uploads" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create a table to track file uploads and processing status
CREATE TABLE public.file_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'uploading',
  processing_status TEXT DEFAULT 'pending',
  extraction_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on file_uploads table
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for file_uploads table
CREATE POLICY "Users can view their own file uploads" 
ON public.file_uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own file uploads" 
ON public.file_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own file uploads" 
ON public.file_uploads 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own file uploads" 
ON public.file_uploads 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_file_uploads_updated_at
BEFORE UPDATE ON public.file_uploads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();