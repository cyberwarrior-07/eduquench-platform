import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { TextToSpeechClient } from "https://esm.sh/@google-cloud/speech@6.0.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl, targetLanguage = 'en' } = await req.json();
    const GOOGLE_CLOUD_API_KEY = Deno.env.get('GOOGLE_CLOUD_API_KEY');

    if (!GOOGLE_CLOUD_API_KEY) {
      throw new Error('Google Cloud API key not configured');
    }

    // Initialize the client
    const client = new TextToSpeechClient({ 
      credentials: { client_email: '', private_key: '' },
      projectId: '',
      apiEndpoint: 'speech.googleapis.com',
      apiKey: GOOGLE_CLOUD_API_KEY
    });

    // Configure the recognition settings
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: targetLanguage,
      enableWordTimeOffsets: true,
    };

    // Create the recognition request
    const audio = {
      uri: videoUrl,
    };

    const request = {
      config,
      audio,
    };

    console.log('Starting transcription for video:', videoUrl);
    
    // Perform the transcription
    const [operation] = await client.longRunningRecognize(request);
    const [response] = await operation.promise();

    // Process the response
    const transcription = response.results
      .map(result => ({
        text: result.alternatives[0].words.map(word => word.word).join(' '),
        start: result.alternatives[0].words[0].startTime.seconds,
        end: result.alternatives[0].words[result.alternatives[0].words.length - 1].endTime.seconds
      }));

    console.log('Transcription completed successfully');

    return new Response(JSON.stringify({ transcription }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Transcription error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});