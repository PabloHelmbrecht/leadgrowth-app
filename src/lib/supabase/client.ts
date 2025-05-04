import { createBrowserClient } from "@supabase/ssr"

//Types
import { type Database } from "./database.types"

//Env Variables
import { env } from "~/env"

export function createClient() {
    return createBrowserClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    )
}
