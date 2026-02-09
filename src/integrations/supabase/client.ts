import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yamtqvmekavsaquossah.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbXRxdm1la2F2c2FxdW9zc2FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1Nzc5NTIsImV4cCI6MjA4NjE1Mzk1Mn0.8Tl64Uo5iBOTdAnJzf3RSUZRnc8D1NHnc8QDYdKTP14';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
