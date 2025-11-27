import { createClient } from '@supabase/supabase-js';

// ⚠️ PENTING: Ganti nilai ini dengan URL dan Anon Key dari Project Supabase Anda.
// Anda bisa menemukannya di Settings > API pada dashboard Supabase.

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'; 
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);