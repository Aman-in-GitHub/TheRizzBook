import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL! as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY! as string;

if (!supabaseUrl) {
  throw new Error('Supabase URL is missing in the environment variables.');
}

if (!supabaseAnonKey) {
  throw new Error('Supabase Anon Key is missing in the environment variables.');
}

let supabase: SupabaseClient;

try {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
} catch (error) {
  throw new Error(`Supabase initialization failed: ${error}`);
}

export default supabase;
