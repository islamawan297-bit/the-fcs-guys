import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * Returns a static, anonymous Supabase client without reading request cookies.
 * Safe for use in static prerendering, SSG, and public unauthenticated data fetching.
 */
export function createPublicSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-fcs-guys.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
