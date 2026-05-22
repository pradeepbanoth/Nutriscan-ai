import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  'https://uxzizhufgmhdkgebdyyt.supabase.co',
  'sb_publishable_ywImJrU78TSYk4whzMafsw_cJAU20QJ'
)