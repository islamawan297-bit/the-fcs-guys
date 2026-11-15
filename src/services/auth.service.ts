import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

/**
 * Validates the currently authenticated session on the server.
 * Returns the user and profile with verified roles ('superadmin' | 'editor' | 'contributor').
 */
export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, profile: null, error: authError || new Error('Unauthenticated') };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { user, profile: null, error: profileError || new Error('Profile not found') };
  }

  return { user, profile, error: null };
}

/**
 * Enforces that the current request is from an authorized Administrator or Editor.
 * Throws an error or returns unauthorized response if permissions fail.
 */
export async function requireStaffSession() {
  const { user, profile, error } = await getAuthenticatedUser();

  if (error || !user || !profile) {
    throw new Error('Unauthorized: Authentication required.');
  }

  if (profile.role !== 'superadmin' && profile.role !== 'editor') {
    throw new Error('Forbidden: Insufficient editorial permissions.');
  }

  return { user, profile };
}

