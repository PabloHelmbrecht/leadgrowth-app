import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type { TablesUpdate, Tables } from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

// Tipos
export type Tag = Tables<"tags">
export type TagUpdate = TablesUpdate<"tags">

// Utilidad para la queryKey
export function getTagsQueryKey({
    teamId,
    tagId,
}: {
    teamId: string
    tagId?: string
}) {
    return ["tags", { teamId, ...(tagId ? { recordId: tagId } : {}) }]
}

/**
 * Hook para consultar y mutar tags.
 * @param tagId Opcional, filtra por ID específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useTags({
    tagId,
    injectedTeamId,
}: {
    tagId?: string
    injectedTeamId?: string
}) {
    // Permite inyectar teamId o usar cookie
    const cookieTeamId = useCookie("team_id")!
    const teamId = injectedTeamId ?? cookieTeamId
    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Validación temprana: no ejecutar si falta teamId
    const enabled = Boolean(teamId)
    const queryKey = teamId ? getTagsQueryKey({ teamId, tagId }) : []

    // Query principal: todos los tags o uno específico
    const { data, ...rest } = useQuery<Tag[] | Tag | null>({
        queryKey,
        queryFn: async () => {
            if (!teamId) throw new Error("Falta teamId para consultar tags.")
            let query = client
                .from("tags")
                .select("*")
                .eq("team_id", teamId)
                .order("created_at", { ascending: false })
            if (tagId) query = query.eq("id", tagId)
            const { data, error } = await query
            if (error) throw error
            if (tagId) return data?.[0] ?? null
            return data || []
        },
        enabled,
    })

    // Mutación (update/upsert) con manejo optimista
    const updateMutation = useMutation({
        mutationFn: async (input: TagUpdate) => {
            if (!teamId) throw new Error("Falta teamId para actualizar tag.")
            const { id, ...rest } = input
            const upsertId = tagId ?? id
            if (!upsertId) throw new Error("Falta id para upsert de tag.")
            const upsertData = {
                ...rest,
                id: upsertId,
                team_id: input.team_id ?? teamId,
            }
            const { error } = await client.from("tags").upsert([upsertData])
            if (error) throw error
        },
        onMutate: async (newData: TagUpdate) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getTagsQueryKey({ teamId }),
            })
            await queryClient.cancelQueries({
                queryKey: getTagsQueryKey({ teamId, tagId }),
            })
            const previousGeneral = queryClient.getQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
            )
            const previousSpecific = tagId
                ? queryClient.getQueryData<Tag>(
                      getTagsQueryKey({ teamId, tagId }),
                  )
                : undefined
            const updateFn = (old?: Tag[]) => {
                if (!old) return old
                return old.map((item) =>
                    item.id === (newData.id ?? tagId)
                        ? {
                              ...item,
                              ...newData,
                              team_id: newData.team_id ?? teamId,
                          }
                        : item,
                )
            }
            queryClient.setQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
                updateFn,
            )
            if (tagId) {
                queryClient.setQueryData<Tag>(
                    getTagsQueryKey({ teamId, tagId }),
                    (old) =>
                        old && old.id === (newData.id ?? tagId)
                            ? {
                                  ...old,
                                  ...newData,
                                  team_id: newData.team_id ?? teamId,
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
                | { previousGeneral?: Tag[]; previousSpecific?: Tag }
                | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getTagsQueryKey({ teamId }),
                    context.previousGeneral,
                )
            }
            if (tagId && context?.previousSpecific) {
                queryClient.setQueryData(
                    getTagsQueryKey({ teamId, tagId }),
                    context.previousSpecific,
                )
            }
            toast({
                title: "Error al actualizar el tag",
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
                queryKey: getTagsQueryKey({ teamId }),
            })
            if (tagId) {
                await queryClient.invalidateQueries({
                    queryKey: getTagsQueryKey({ teamId, tagId }),
                })
            }
        },
    })

    // Crear tag
    const createMutation = useMutation({
        mutationFn: async (input: Omit<TagUpdate, "id">) => {
            if (!teamId) throw new Error("Falta teamId para crear tag.")
            const { data, error } = await client
                .from("tags")
                .insert([{ ...input, team_id: teamId }])
                .select()
                .single()
            if (error) throw error
            return data
        },
        onMutate: async (input: Omit<TagUpdate, "id">) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getTagsQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
            )
            const tempId = crypto.randomUUID()
            const tempTag: Partial<Tag> = {
                ...input,
                id: tempId,
                team_id: teamId,
            }
            queryClient.setQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return [tempTag as Tag, ...old]
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _input,
            context: { previous?: Tag[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getTagsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear tag",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getTagsQueryKey({ teamId }),
            })
        },
    })

    // Eliminar tag
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!teamId) throw new Error("Falta teamId para eliminar tag.")
            const { error } = await client.from("tags").delete().eq("id", id)
            if (error) throw error
            return id
        },
        onMutate: async (id: string) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getTagsQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
            )
            queryClient.setQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.filter((tag) => tag.id !== id)
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _id,
            context: { previous?: Tag[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getTagsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al eliminar tag",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getTagsQueryKey({ teamId }),
            })
        },
    })

    return {
        ...rest,
        data,
        update: updateMutation.mutateAsync,
        create: createMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
    }
}
