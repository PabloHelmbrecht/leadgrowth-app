import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type { TablesInsert, Tables } from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

export interface Action extends Tables<"actions"> {
    owner: Tables<"profiles">
    contact: Tables<"contacts"> | null
    company: Tables<"companies"> | null
    events: Tables<"events">[]
}

// Utilidad para la queryKey
function getActionsQueryKey({
    teamId,
    workflowId,
    actionId,
}: {
    teamId: string
    workflowId?: string
    actionId?: string
}) {
    return [
        "actions",
        {
            teamId,
            ...(workflowId ? { workflowId } : {}),
            ...(actionId ? { recordId: actionId } : {}),
        },
    ]
}

/**
 * Hook para consultar y mutar acciones.
 * @param actionId Opcional, filtra por ID específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useActions({
    actionId,
    injectedTeamId,
    workflowId,
}: {
    actionId?: string
    injectedTeamId?: string
    workflowId?: string
}) {
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const enabled = Boolean(teamId)
    const queryKey = teamId
        ? getActionsQueryKey({ teamId, actionId, workflowId })
        : []

    // Query principal: todas las acciones o una específica
    const { data, ...rest } = useQuery<Action[]>({
        queryKey,
        queryFn: async () => {
            if (!teamId)
                throw new Error("Falta teamId para consultar acciones.")
            let query = client
                .from("actions")
                .select(
                    `
                *,
                owner:profiles!actions_owner_id_fkey(*),
                contact:contacts!actions_contact_id_fkey(
                *,
                companies(*)
                ),
                events:events(*)
                `,
                )
                .eq("team_id", teamId)
            if (actionId) query = query.eq("id", actionId)
            const { data, error } = await query
            if (error) throw error
            return (
                data.map((action) => {
                    let company = null
                    let contact = null
                    if (action.contact) {
                        company = action.contact.companies ?? null
                        const { companies: _, ...contactRest } = action.contact
                        contact = contactRest
                    }
                    return {
                        ...action,
                        contact,
                        company,
                        events: action.events ?? [],
                        owner: action.owner,
                    }
                }) ?? []
            )
        },
        enabled,
    })

    // Mutación (update/upsert) con manejo optimista
    const updateMutation = useMutation({
        mutationFn: async (input: TablesInsert<"actions">) => {
            if (!teamId) throw new Error("Falta teamId para actualizar acción.")
            const { id, ...rest } = input
            const upsertId = actionId ?? id
            if (!upsertId) throw new Error("Falta id para upsert de acción.")
            const upsertData = {
                ...rest,
                id: upsertId,
                workflow_id: input.workflow_id ?? workflowId,
                team_id: input.team_id ?? teamId,
            }
            const { error } = await client.from("actions").upsert([upsertData])
            if (error) throw error
        },
        onMutate: async (newData: TablesInsert<"actions">) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
            await queryClient.cancelQueries({
                queryKey: getActionsQueryKey({ teamId, actionId }),
            })
            const previous = queryClient.getQueryData<Action[]>(
                getActionsQueryKey({ teamId, actionId }),
            )

            const updateFn = (old?: Action[]) => {
                if (!old) return old
                return old.map((item) =>
                    item.id === (newData.id ?? actionId)
                        ? {
                              ...item,
                              ...newData,
                              team_id: newData.team_id ?? teamId,
                          }
                        : item,
                )
            }
            queryClient.setQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
                updateFn,
            )
            if (actionId) {
                queryClient.setQueryData<Action>(
                    getActionsQueryKey({ teamId, actionId }),
                    (old) =>
                        old && old.id === (newData.id ?? actionId)
                            ? {
                                  ...old,
                                  ...newData,
                                  team_id: newData.team_id ?? teamId,
                              }
                            : old,
                )
            }
            return { previous }
        },
        onError: (
            err,
            _newData,
            context: { previous?: Action[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getActionsQueryKey({ teamId, actionId }),
                    context.previous,
                )
            }

            toast({
                title: "Error al actualizar la acción",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            if (!teamId) return
            await queryClient.invalidateQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
            if (actionId) {
                await queryClient.invalidateQueries({
                    queryKey: getActionsQueryKey({ teamId, actionId }),
                })
            }
        },
    })

    // Crear acción
    const createMutation = useMutation({
        mutationFn: async (input: Omit<TablesInsert<"actions">, "id">) => {
            if (!teamId) throw new Error("Falta teamId para crear acción.")
            const { data, error } = await client
                .from("actions")
                .insert([
                    {
                        ...input,
                        team_id: teamId,
                        workflow_id: input.workflow_id ?? workflowId,
                    },
                ])
                .select()
                .single()
            if (error) throw error
            return data
        },
        onMutate: async (input: Omit<TablesInsert<"actions">, "id">) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
            )
            const tempId = crypto.randomUUID()
            const tempAction: Partial<Action> = {
                ...input,
                id: tempId,
                team_id: teamId,
            }
            queryClient.setQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return [tempAction as Action, ...old]
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _input,
            context: { previous?: Action[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getActionsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear acción",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
        },
    })

    // Eliminar acción
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!teamId) throw new Error("Falta teamId para eliminar acción.")
            const { error } = await client.from("actions").delete().eq("id", id)
            if (error) throw error
            return id
        },
        onMutate: async (id: string) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
            )
            queryClient.setQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.filter((action) => action.id !== id)
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _id,
            context: { previous?: Action[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getActionsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al eliminar acción",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
        },
    })

    // Mutación para setear el status y el timestamp correspondiente de forma idempotente
    const setStatusMutation = useMutation({
        mutationFn: async ({
            id,
            status,
        }: {
            id?: string
            status: Tables<"actions">["status"]
        }) => {
            if (!teamId)
                throw new Error(
                    "Falta teamId para actualizar status de acción.",
                )

            const recordId = id ?? actionId

            if (!recordId)
                throw new Error("Falta id para actualizar status de acción.")
            // Obtener la acción actual para saber si el timestamp ya está seteado
            const { data: current, error: fetchError } = await client
                .from("actions")
                .select("*", { count: "exact", head: false })
                .eq("id", recordId)
                .single()
            if (fetchError) throw fetchError
            if (!current) throw new Error("Acción no encontrada.")

            // Determinar el campo de timestamp a actualizar según el status
            const now = new Date().toISOString()
            const update: Record<string, string> = { status }
            if (status === "completed" && !current.completed_at) {
                update.completed_at = now
                update.executed_at = now
            } else if (status === "skipped" && !current.skipped_at) {
                update.skipped_at = now
            } else if (status === "error" && current.executed_at) {
                update.executed_at = now
            }
            // Solo actualiza el status y el timestamp relevante si corresponde
            const { error } = await client
                .from("actions")
                .update(update)
                .eq("id", recordId)
            if (error) throw error
            return { id: recordId, ...update }
        },
        onMutate: async ({ id, status }) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
            await queryClient.cancelQueries({
                queryKey: getActionsQueryKey({ teamId, actionId: id }),
            })
            const previous = queryClient.getQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
            )
            // Update optimista
            queryClient.setQueryData<Action[]>(
                getActionsQueryKey({ teamId }),
                (old) =>
                    old?.map((item) =>
                        item.id === id
                            ? {
                                  ...item,
                                  status,
                                  completed_at:
                                      status === "completed" &&
                                      !item.completed_at
                                          ? new Date().toISOString()
                                          : item.completed_at,
                                  skipped_at:
                                      status === "skipped" && !item.skipped_at
                                          ? new Date().toISOString()
                                          : item.skipped_at,
                                  executed_at:
                                      status === "error" ||
                                      status === "completed"
                                          ? new Date().toISOString()
                                          : item.executed_at,
                              }
                            : item,
                    ) ?? old,
            )
            queryClient.setQueryData<Action>(
                getActionsQueryKey({ teamId, actionId: id }),
                (old) =>
                    old && old.id === id
                        ? {
                              ...old,
                              status,
                              completed_at:
                                  status === "completed" && !old.completed_at
                                      ? new Date().toISOString()
                                      : old.completed_at,
                              skipped_at:
                                  status === "skipped" && !old.skipped_at
                                      ? new Date().toISOString()
                                      : old.skipped_at,
                              executed_at:
                                  status === "error" || status === "completed"
                                      ? new Date().toISOString()
                                      : old.executed_at,
                          }
                        : old,
            )
            return { previous }
        },
        onError: (
            err,
            _input,
            context: { previous?: Action[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getActionsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al actualizar el status de la acción",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_data, _error, variables) => {
            if (!teamId) return
            await queryClient.invalidateQueries({
                queryKey: getActionsQueryKey({ teamId }),
            })
            if (variables?.id) {
                await queryClient.invalidateQueries({
                    queryKey: getActionsQueryKey({
                        teamId,
                        actionId: variables.id,
                    }),
                })
            }
        },
    })

    return {
        ...rest,
        data,
        update: updateMutation.mutateAsync,
        create: createMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        setStatus: setStatusMutation.mutateAsync,
    }
}
