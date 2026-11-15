/**
 * CLI Utility to provision an initial Superadmin account securely.
 * Usage:
 *   node --loader ts-node/esm scripts/setup-admin.ts <email> <password> <fullName>
 * Or with tsx:
 *   npx tsx scripts/setup-admin.ts <email> <password> <fullName>
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function setupSuperadmin() {
  const args = process.argv.slice(2);
  const email = args[0];
  const password = args[1];
  const fullName = args[2] || 'Lead Editor';

  if (!email || !password) {
    console.error('Usage: npx tsx scripts/setup-admin.ts <email> <password> [fullName]');
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey.includes('mock')) {
    console.error('Error: Please configure real NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`[Admin Setup] Creating Superadmin user: ${email}...`);

  // 1. Create or invite user in Supabase auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) {
    console.error('Failed to create auth user:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`[Admin Setup] User created in Auth (ID: ${userId}). Granting Superadmin role in profiles...`);

  // 2. Insert or update profile with superadmin privileges
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    full_name: fullName,
    role: 'superadmin',
  });

  if (profileError) {
    console.error('Failed to update superadmin role in profiles:', profileError.message);
    process.exit(1);
  }

  console.log(`✅ Superadmin provisioned successfully for: ${email}`);
}

setupSuperadmin().catch((err) => {
  console.error('Fatal setup error:', err);
  process.exit(1);
});

