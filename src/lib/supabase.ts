
import { createClient } from '@supabase/supabase-js';

// For development, we'll use default values if environment variables are not set
// In production, these should be properly configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItc3VwYWJhc2UtcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjE2MDgwMDAwLCJleHAiOjE5MzE2NDAwMDB9.example-key';

// Log a warning instead of an error when in development
console.warn('Using fallback Supabase credentials for development. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for production.');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
