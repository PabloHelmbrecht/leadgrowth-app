import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { createClient } from "../supabase/client";

const client = createClient()

export function useWorkflows() {
    return useQuery(client
        .from("profile").select("*"))
}