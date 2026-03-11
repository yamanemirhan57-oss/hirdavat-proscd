import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wrhphiaiydujnlsdqmui.supabase.co'
const supabaseAnonKey = 'sb_publishable_oDELFjiqmsZ-9LfbCTLSxA_3rzJMx6K'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
