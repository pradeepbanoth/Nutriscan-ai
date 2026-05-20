import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://uxzizhufgmhdkgebdyyt.supabase.co',
  'sb_publishable_ywImJrU78TSYk4whzMafsw_cJAU20QJ',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }
  }
)