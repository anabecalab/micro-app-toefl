import { createClient, type SupabaseClient } from "@supabase/supabase-js"

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error(
                "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set."
            )
        }

        if (!supabaseUrl.startsWith("http")) {
            supabaseUrl = `https://${supabaseUrl}.supabase.co`
        }

        _supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return _supabase
}
