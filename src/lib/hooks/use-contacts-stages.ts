import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type { TablesUpdate, Tables } from "../supabase/database.types"

//Const
import { contactStageType } from "../constants/status"

//Colors
import { slate } from "tailwindcss/colors"

const client = createClient()

// Tipos
export interface ContactStage extends Tables<"contacts_stages"> {
    color: string
}
export type ContactStageUpdate = TablesUpdate<"contacts_stages">

// Utilidad para la queryKey
function getContactStagesQueryKey({
    teamId,
}: {
    teamId: string
    companyId?: string
    workflowId?: string
}) {
    return [
        "contacts_stages",
        {
            teamId,
        },
    ]
}

/**
 * Hook para consultar y mutar contactos.
 * @param contactId Opcional, filtra por ID específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useContactStages({
    injectedTeamId,
}: {
    injectedTeamId?: string
}) {
    // Permite inyectar teamId o usar cookie
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!

    // Validación temprana: no ejecutar si falta teamId
    const enabled = Boolean(teamId)
    const queryKey = teamId ? getContactStagesQueryKey({ teamId }) : []

    // Query principal: todos los contactos o uno específico
    const { data, ...rest } = useQuery<ContactStage[]>({
        queryKey,
        queryFn: async () => {
            if (!teamId) throw new Error("Falta teamId para consultar stages.")
            const { data, error } = await client
                .from("contacts_stages")
                .select(`*`)
                .eq("team_id", teamId)
                .order("created_at", { ascending: false })

            const dataParsed = data?.map((stage) => {
                return {
                    ...stage,
                    color: contactStageType[stage.type] ?? slate[500],
                }
            })
            if (error) throw error
            return dataParsed ?? []
        },
        enabled,
    })

    return {
        ...rest,
        data,
    }
}
