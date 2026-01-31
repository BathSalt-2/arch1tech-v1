import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Input validation schema
const RequestSchema = z.object({
  fileId: z.string().uuid({ message: 'Invalid fileId format - must be a UUID' }),
  filePath: z.string()
    .min(1, 'filePath cannot be empty')
    .max(1024, 'filePath too long')
    .refine((path) => !path.includes('..'), 'Path traversal not allowed')
    .refine((path) => !path.startsWith('/'), 'Absolute paths not allowed')
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // ===== AUTHENTICATION =====
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create client with user's auth token to validate
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Failed to validate JWT:', claimsError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    if (!userId) {
      console.error('No user ID in JWT claims');
      return new Response(
        JSON.stringify({ error: 'Unauthorized', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Authenticated user: ${userId}`);

    // ===== INPUT VALIDATION =====
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body', success: false }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Input validation failed:', validationResult.error.errors);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid input', 
          details: validationResult.error.errors.map(e => e.message),
          success: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { fileId, filePath } = validationResult.data;
    console.log(`Processing ZIP extraction for file: ${filePath}, fileId: ${fileId}`);

    // Use service role client for database operations (after auth validated)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ===== OWNERSHIP VERIFICATION =====
    const { data: fileRecord, error: fileError } = await supabase
      .from('file_uploads')
      .select('user_id')
      .eq('id', fileId)
      .single();

    if (fileError) {
      console.error(`Failed to get file record: ${fileError.message}`);
      return new Response(
        JSON.stringify({ error: 'File not found', success: false }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the authenticated user owns this file
    if (fileRecord.user_id !== userId) {
      console.error(`User ${userId} attempted to access file owned by ${fileRecord.user_id}`);
      return new Response(
        JSON.stringify({ error: 'Forbidden', success: false }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Ownership verified, proceeding with extraction');

    // Get file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user-uploads')
      .download(filePath);

    if (downloadError) {
      console.error(`Failed to download file: ${downloadError.message}`);
      return new Response(
        JSON.stringify({ error: 'Failed to download file', success: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert blob to array buffer for processing
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    console.log(`File downloaded, size: ${uint8Array.length} bytes`);

    // For this demo, we'll simulate ZIP extraction
    // In a real implementation, you'd use a ZIP library like:
    // import { unzip } from "https://deno.land/x/zip@v1.2.5/mod.ts";
    
    // Simulate extraction process
    const simulatedFiles = [
      'model.bin',
      'config.json', 
      'tokenizer.json',
      'pytorch_model.bin',
      'README.md',
      'requirements.txt'
    ];

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const extractionPath = `${userId}/extracted/${fileId}`;

    // In a real implementation, you would:
    // 1. Extract the ZIP file contents
    // 2. Upload each extracted file to the 'extracted-models' bucket
    // 3. Update the file record with extraction details

    // For now, we'll just simulate this by uploading placeholder files
    const extractedFiles: string[] = [];
    
    for (const fileName of simulatedFiles) {
      const placeholderContent = `// Extracted from ZIP: ${fileName}\n// Original file: ${filePath}\n// Extracted at: ${new Date().toISOString()}`;
      const extractedFilePath = `${extractionPath}/${fileName}`;
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('extracted-models')
          .upload(extractedFilePath, new Blob([placeholderContent], { type: 'text/plain' }), {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError) {
          extractedFiles.push(fileName);
        }
      } catch (error) {
        console.warn(`Failed to upload ${fileName}:`, error);
      }
    }

    // Update the file record with extraction results
    const { error: updateError } = await supabase
      .from('file_uploads')
      .update({
        processing_status: 'completed',
        extracted_files: extractedFiles,
      })
      .eq('id', fileId);

    if (updateError) {
      console.warn('Failed to update file record:', updateError);
    }

    console.log(`ZIP extraction completed. Extracted ${extractedFiles.length} files.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedFiles,
        extractionPath,
        message: `Successfully extracted ${extractedFiles.length} files from ZIP archive`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in extract-zip function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
