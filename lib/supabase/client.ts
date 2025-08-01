import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:')
    console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***' : 'NOT SET')
    throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
  }

  console.log('Creating Supabase client with URL:', supabaseUrl)
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
} 