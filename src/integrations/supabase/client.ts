import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uzdfeertejyzbiggjxui.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZGZlZXJ0ZWp5emJpZ2dqeHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MjI5NzAsImV4cCI6MjAyNTE5ODk3MH0.O2_NQhUNI9HIWz3QG6nq5Z-OIXsHM1zqVmxj4if0RQM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})