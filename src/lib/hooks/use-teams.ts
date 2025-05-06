import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type { TablesUpdate, Tables } from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

// Tipos
export interface Team extends Tables<"teams"> {
    isCurrent: boolean
}
export type TeamUpdate = TablesUpdate<"teams">

// Utilidad para la queryKey
export function getTeamsQueryKey({ teamId }: { teamId?: string }) {
    return ["teams", { ...(teamId ? { recordId: teamId } : {}) }]
}

/**
 * Hook para consultar y mutar equipos.
 * @param teamId Opcional, filtra por ID específico
 */
export function useTeams({ initialTeamId }: { initialTeamId?: string }) {
    const queryClient = useQueryClient()
    const { toast } = useToast()
    const { setCookie, cookie: cookieTeamId } = useCookie("team_id")

    const teamId = initialTeamId ?? cookieTeamId

    // Query principal: todos los equipos o uno específico
    const { data, ...rest } = useQuery<Team[]>({
        queryKey: getTeamsQueryKey({ teamId }),
        queryFn: async () => {
            const { data, error } = await client
                .from("teams")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            return (
                data.map((team) => ({
                    ...team,
                    isCurrent: team.id === teamId,
                })) || []
            )
        },
    })

    // Función para cambiar de equipo
    const switchTeam = async (newTeamId: string) => {
        try {
            // Actualizar la cookie con el nuevo teamId
            setCookie(newTeamId)

            await queryClient.invalidateQueries()
        } catch (error) {
            // Manejo de errores
            toast({
                title: "Error al cambiar de equipo",
                description:
                    error instanceof Error
                        ? error.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        }
    }

    // Mutación (update/upsert) con manejo optimista
    const updateMutation = useMutation({
        mutationFn: async (input: TeamUpdate) => {
            const { id, ...rest } = input
            const upsertId = teamId ?? id
            if (!upsertId) throw new Error("Falta id para upsert de equipo.")
            const upsertData = {
                ...rest,
                id: upsertId,
            }
            const { error } = await client.from("teams").upsert([upsertData])
            if (error) throw error
        },
        onMutate: async (newData: TeamUpdate) => {
            await queryClient.cancelQueries({
                queryKey: getTeamsQueryKey({}),
            })
            await queryClient.cancelQueries({
                queryKey: getTeamsQueryKey({ teamId }),
            })
            const previousGeneral = queryClient.getQueryData<Team[]>(
                getTeamsQueryKey({}),
            )
            const previousSpecific = teamId
                ? queryClient.getQueryData<Team>(getTeamsQueryKey({ teamId }))
                : undefined
            const updateFn = (old?: Team[]) => {
                if (!old) return old
                return old.map((item) =>
                    item.id === (newData.id ?? teamId)
                        ? {
                              ...item,
                              ...newData,
                          }
                        : item,
                )
            }
            queryClient.setQueryData<Team[]>(getTeamsQueryKey({}), updateFn)
            if (teamId) {
                queryClient.setQueryData<Team>(
                    getTeamsQueryKey({ teamId }),
                    (old) =>
                        old && old.id === (newData.id ?? teamId)
                            ? {
                                  ...old,
                                  ...newData,
                              }
                            : old,
                )
            }
            return { previousGeneral, previousSpecific }
        },
        onError: (
            err,
            _newData,
            context:
                | { previousGeneral?: Team[]; previousSpecific?: Team }
                | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getTeamsQueryKey({}),
                    context.previousGeneral,
                )
            }
            if (teamId && context?.previousSpecific) {
                queryClient.setQueryData(
                    getTeamsQueryKey({ teamId }),
                    context.previousSpecific,
                )
            }
            toast({
                title: "Error al actualizar el equipo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getTeamsQueryKey({}),
            })
            if (teamId) {
                await queryClient.invalidateQueries({
                    queryKey: getTeamsQueryKey({ teamId }),
                })
            }
        },
    })

    // Crear equipo
    const createMutation = useMutation({
        mutationFn: async (input: Omit<TeamUpdate, "id">) => {
            const { data, error } = await client
                .from("teams")
                .insert([input])
                .select()
                .single()
            if (error) throw error
            return data
        },
        onMutate: async (input: Omit<TeamUpdate, "id">) => {
            await queryClient.cancelQueries({
                queryKey: getTeamsQueryKey({}),
            })
            const previous = queryClient.getQueryData<Team[]>(
                getTeamsQueryKey({}),
            )
            const tempId = crypto.randomUUID()
            const tempTeam: Partial<Team> = {
                ...input,
                id: tempId,
            }
            queryClient.setQueryData<Team[]>(getTeamsQueryKey({}), (old) => {
                if (!old) return old
                return [tempTeam as Team, ...old]
            })
            return { previous }
        },
        onError: (
            err: unknown,
            _input,
            context: { previous?: Team[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(getTeamsQueryKey({}), context.previous)
            }
            toast({
                title: "Error al crear equipo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getTeamsQueryKey({}),
            })
        },
    })

    // Eliminar equipo
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await client.from("teams").delete().eq("id", id)
            if (error) throw error
            return id
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({
                queryKey: getTeamsQueryKey({}),
            })
            const previous = queryClient.getQueryData<Team[]>(
                getTeamsQueryKey({}),
            )
            queryClient.setQueryData<Team[]>(getTeamsQueryKey({}), (old) => {
                if (!old) return old
                return old.filter((team) => team.id !== id)
            })
            return { previous }
        },
        onError: (
            err: unknown,
            _id,
            context: { previous?: Team[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(getTeamsQueryKey({}), context.previous)
            }
            toast({
                title: "Error al eliminar equipo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getTeamsQueryKey({}),
            })
        },
    })

    return {
        ...rest,
        data,
        update: updateMutation.mutateAsync,
        create: createMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        switchTeam, // Añadido el método switchTeam
    }
}
