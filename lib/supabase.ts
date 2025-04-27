import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function connect() {
    if (supabaseInstance) return supabaseInstance
    
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
    }
    
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    return supabaseInstance
}
