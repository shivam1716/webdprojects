import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase credentials missing. Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env')
}

// We use the service_role key to bypass RLS for server-side administrative actions.
// If you implement RLS and user JWTs later, you can switch to the anon key and pass the user's token.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)
