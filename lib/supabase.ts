import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtmjbftdytobvikkauas.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10bWpiZnRkeXRvYnZpa2thdWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY0NDk3MjUsImV4cCI6MjEwMjAyNTcyNX0.WID-k8a7LlppU2I7lHCALfG9uixbPIjXPNwssbOkpjg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
