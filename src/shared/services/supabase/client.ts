import { createClient } from '@supabase/supabase-js';
import { configs } from '@/shared/services/http/configs';

// Derive the Supabase project URL from the Edge Functions URL.
// e.g. https://xxxx.supabase.co/functions/v1 → https://xxxx.supabase.co
const supabaseUrl =
  configs.SUPABASE_FUNCTIONS_URL?.replace(/\/functions\/v1\/?$/, '') ?? '';

const supabaseAnonKey = configs.SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? '';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }
});
