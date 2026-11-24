import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('mock') || supabaseAnonKey.includes('mock')) {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      console.error(
        '[Supabase Client] Missing production Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are not configured in Vercel.'
      );
    }
  }

  return createBrowserClient<Database>(
    supabaseUrl || 'https://mock-fcs-guys.supabase.co',
    supabaseAnonKey || 'mock-anon-key'
  );
}


