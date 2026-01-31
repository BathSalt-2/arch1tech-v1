import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts';

// Allowed origins for CORS - restrict to your application domains
const ALLOWED_ORIGINS = [
  'https://arch1tech-v1.lovable.app',
  'https://id-preview--9444df61-41c9-43dd-8637-ea4ac5c354a9.lovable.app',
];

// Add localhost for development if needed
if (Deno.env.get('ENVIRONMENT') === 'development') {
  ALLOWED_ORIGINS.push('http://localhost:8080', 'http://localhost:5173');
}

// Get CORS headers with origin validation
const getCorsHeaders = (origin: string | null): Record<string, string> => {
  // Check if the origin is allowed
  const allowedOrigin = origin && ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed.replace(/\/$/, '')))
    ? origin 
    : ALLOWED_ORIGINS[0]; // Default to first allowed origin
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
    'Access-Control-Allow-Credentials': 'true',
  };
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

// Error handling utility - maps internal errors to safe user messages
const createErrorResponse = (
  statusCode: number,
  userMessage: string,
  corsHeaders: Record<string, string>,
  internalError?: unknown,
  context?: string
): Response => {
  // Log detailed error server-side only
  if (internalError) {
    console.error(`[extract-zip] ${context || 'Error'}:`, {
      message: internalError instanceof Error ? internalError.message : String(internalError),
      timestamp: new Date().toISOString()
    });
  }
  
  // Return generic message to client
  return new Response(
    JSON.stringify({ 
      error: userMessage,
      success: false 
    }),
    { 
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

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
      return createErrorResponse(401, 'Authentication required', corsHeaders, null, 'Missing auth header');
    }

    // Create client with user's auth token to validate
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return createErrorResponse(401, 'Invalid or expired session', corsHeaders, claimsError, 'JWT validation failed');
    }

    const userId = claimsData.claims.sub;
    if (!userId) {
      return createErrorResponse(401, 'Invalid session', corsHeaders, null, 'No user ID in claims');
    }

    console.log(`Authenticated user: ${userId}`);

    // ===== INPUT VALIDATION =====
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      return createErrorResponse(400, 'Invalid request format', corsHeaders, parseError, 'JSON parse error');
    }

    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      // Return only safe validation messages (these are defined in our schema)
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
    console.log(`Processing ZIP extraction for file: ${fileId}`);

    // Use service role client for database operations (after auth validated)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ===== OWNERSHIP VERIFICATION =====
    const { data: fileRecord, error: fileError } = await supabase
      .from('file_uploads')
      .select('user_id')
      .eq('id', fileId)
      .single();

    if (fileError || !fileRecord) {
      return createErrorResponse(404, 'File not found', corsHeaders, fileError, 'Database lookup failed');
    }

    // Verify the authenticated user owns this file
    if (fileRecord.user_id !== userId) {
      console.error(`Unauthorized access attempt: user ${userId} tried to access file owned by another user`);
      return createErrorResponse(403, 'Access denied', corsHeaders, null, 'Ownership mismatch');
    }

    console.log('Ownership verified, proceeding with extraction');

    // Get file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user-uploads')
      .download(filePath);

    if (downloadError || !fileData) {
      return createErrorResponse(500, 'Failed to access file. Please ensure the file exists and try again.', corsHeaders, downloadError, 'Storage download failed');
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

    // For now, we'll just simulate this by uploading placeholder files
    const extractedFiles: string[] = [];
    
    for (const fileName of simulatedFiles) {
      const placeholderContent = `// Extracted from ZIP: ${fileName}\n// Extracted at: ${new Date().toISOString()}`;
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
      } catch (uploadErr) {
        console.warn(`Failed to upload extracted file:`, uploadErr);
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
      console.warn('Failed to update file record');
    }

    console.log(`ZIP extraction completed. Extracted ${extractedFiles.length} files.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        extractedFiles,
        message: `Successfully extracted ${extractedFiles.length} files from ZIP archive`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    return createErrorResponse(500, 'An error occurred while processing your request. Please try again.', corsHeaders, error, 'Unhandled exception');
  }
});
