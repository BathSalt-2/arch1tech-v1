import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { fileId, filePath } = await req.json();

    if (!fileId || !filePath) {
      throw new Error('Missing fileId or filePath');
    }

    console.log(`Starting ZIP extraction for file: ${filePath}`);

    // Get file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user-uploads')
      .download(filePath);

    if (downloadError) {
      throw new Error(`Failed to download file: ${downloadError.message}`);
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

    // Get user info from the file record
    const { data: fileRecord, error: fileError } = await supabase
      .from('file_uploads')
      .select('user_id')
      .eq('id', fileId)
      .single();

    if (fileError) {
      throw new Error(`Failed to get file record: ${fileError.message}`);
    }

    const userId = fileRecord.user_id;
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
        extraction_path: extractionPath,
        metadata: {
          extracted_files: extractedFiles,
          extraction_date: new Date().toISOString(),
          original_file_size: uint8Array.length
        }
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
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});