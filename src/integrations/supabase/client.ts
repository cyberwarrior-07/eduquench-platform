// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uzdfeertejyzbiggjxui.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZGZlZXJ0ZWp5emJpZ2dqeHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDU0OTAsImV4cCI6MjA0OTkyMTQ5MH0.rjaRsEL9JYlffhwdqBenDBY7kdisKV39V4YvuH2hFRU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);