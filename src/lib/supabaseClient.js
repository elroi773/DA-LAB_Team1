import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseSecretKey = import.meta.env.VITE_SUPABASE_SECRET_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey)
