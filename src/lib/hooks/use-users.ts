import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type {
    Tables,
    TablesUpdate,
    TablesInsert,
} from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

// Tipos
export interface Member extends Tables<"members"> {
    isCurrent: boolean
}
export type Profile = Tables<"profiles">
export type MemberWithProfile = Member & {
    profile: Profile
    isCurrent: boolean
}
export type MemberUpdate = TablesUpdate<"members">
export type MemberInsert = TablesInsert<"members">

// Utilidad para generar la queryKey de forma consistente
function getUsersQueryKey({
    teamId,
    userId,
}: {
    teamId: string
    userId?: string
}) {
    return ["users", { teamId, ...(userId ? { userId } : {}) }]
}

/**
 * Hook para consultar y mutar usuarios (members) de un equipo.
 * Permite crear, editar y cambiar status (no eliminar físico).
 * @param userId Opcional, filtra por usuario específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useUsers({
    userId,
    injectedTeamId,
}: {
    userId?: string
    injectedTeamId?: string
}) {
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const enabled = Boolean(teamId)
    const queryKey = teamId ? getUsersQueryKey({ teamId, userId }) : []

    // Query: obtener miembros + perfil
    const { data, ...rest } = useQuery<MemberWithProfile[]>({
        queryKey,
        queryFn: async () => {
            if (!teamId)
                throw new Error("Falta teamId para consultar usuarios.")
            const {
                data: { user },
            } = await client.auth.getUser()

            let query = client
                .from("members")
                .select(`*, profile:user_id(*)`) // join con profiles
                .eq("team_id", teamId)
            if (userId) query = query.eq("user_id", userId)
            const { data, error } = await query
            if (error) throw error
            return data.map((member) => ({
                ...member,
                isCurrent: member.user_id === user?.id,
            }))
        },
        enabled,
    })

    // Editar usuario (profile)
    type UpdateUserInput = {
        user_id: string
        email?: string
        first_name?: string | null
        last_name?: string | null
    }
    const updateMutation = useMutation({
        mutationFn: async (input: UpdateUserInput) => {
            const { user_id, ...fields } = input
            // Actualiza solo el profile
            const { error } = await client
                .from("profiles")
                .update(fields)
                .eq("id", user_id)
            if (error) throw error
        },
        onMutate: (input: UpdateUserInput) => {
            if (!teamId) return
            const previous = queryClient.getQueryData<MemberWithProfile[]>(
                getUsersQueryKey({ teamId }),
            )
            // Optimista: actualizar profile en cache
            queryClient.setQueryData<MemberWithProfile[]>(
                getUsersQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.map((u) =>
                        u.user_id === input.user_id
                            ? {
                                  ...u,
                                  profile: {
                                      ...u.profile,
                                      ...input,
                                  },
                              }
                            : u,
                    )
                },
            )
            return { previous }
        },
        onError: (
            err,
            _input,
            context: { previous?: MemberWithProfile[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getUsersQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al editar usuario",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getUsersQueryKey({ teamId }),
            })
        },
    })

    // Cambiar status (soft delete)
    type ChangeStatusInput = {
        user_id: string
        status: Member["status"] // "active" | "disabled" | "deleted"
    }
    const changeStatusMutation = useMutation({
        mutationFn: async (input: ChangeStatusInput) => {
            const { user_id, status } = input
            const { error } = await client
                .from("members")
                .update({ status })
                .eq("user_id", user_id)
                .eq("team_id", teamId)
            if (error) throw error
        },
        onMutate: (input: ChangeStatusInput) => {
            if (!teamId) return
            const previous = queryClient.getQueryData<MemberWithProfile[]>(
                getUsersQueryKey({ teamId }),
            )
            // Optimista: cambiar status en cache
            queryClient.setQueryData<MemberWithProfile[]>(
                getUsersQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.map((u) =>
                        u.user_id === input.user_id
                            ? { ...u, status: input.status }
                            : u,
                    )
                },
            )
            return { previous }
        },
        onError: (
            err,
            _input,
            context: { previous?: MemberWithProfile[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getUsersQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al cambiar status",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getUsersQueryKey({ teamId }),
            })
        },
    })

    return {
        ...rest,
        data,
        update: updateMutation.mutateAsync,
        changeStatus: changeStatusMutation.mutateAsync,
    }
}
