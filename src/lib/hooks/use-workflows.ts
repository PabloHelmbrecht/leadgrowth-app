import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type {
    TablesUpdate,
    Tables,
    TablesInsert,
    Enums,
} from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

//TanStack Pacer
import { asyncDebounce } from "@tanstack/pacer"

import {
    type Node as NodePrimitive,
    type Edge as EdgePrimitive,
} from "@xyflow/react"

const client = createClient()

//Hooks
import { type Tag, getTagsQueryKey } from "~/lib/hooks/use-tags"

// Tipos
export type WorkflowUpdate = TablesUpdate<"workflows">

// Tipo extendido para UI (incluye tags y owner)
export interface Node extends NodePrimitive {
    id: string
    type?: Tables<"nodes">["type"]
    data: Record<string, unknown>
    position: { x: number; y: number }
    className: string
    deletable: boolean
    selected: boolean
}

export interface Edge extends EdgePrimitive {
    source: string
    target: string
    type: TablesInsert<"edges">["type"]
    data: Record<string, unknown> & {
        delay: number
        unit: Enums<"time_delay_unit">
        order: number
    }
    animated: boolean
    deletable: boolean
    className: string
    selected: boolean
}

export type Workflow = TablesUpdate<"workflows"> & {
    id: string
    tags?: Tables<"tags">[]
    owner?: Tables<"profiles"> | null
    metrics?: Tables<"workflows_metrics">
    flow?: {
        nodes: Node[]
        edges: Edge[]
    }
}

export type CreateWorkflowInput = Omit<TablesUpdate<"workflows">, "id"> & {
    tags?: string[]
}

// Utilidad para generar la queryKey de forma consistente
function getWorkflowsQueryKey({
    teamId,
    workflowId,
    nodeId,
    edgeId,
}: {
    teamId: string
    workflowId?: string
    nodeId?: string
    edgeId?: string
}) {
    return [
        "workflows",
        {
            teamId,
            ...(workflowId ? { recordId: workflowId } : {}),
            ...(nodeId ? { nodeId } : {}),
            ...(edgeId ? { edgeId } : {}),
        },
    ]
}

/**
 * Hook para consultar y mutar workflows con métricas.
 * @param workflowId Opcional, filtra por ID específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useWorkflows({
    workflowId,
    injectedTeamId,
    nodeId,
}: {
    workflowId?: string
    injectedTeamId?: string
    nodeId?: string
}) {
    // Permite inyectar teamId o usar cookie
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!

    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Validación temprana: no ejecutar si falta teamId
    const enabled = Boolean(teamId)
    const queryKey = teamId ? getWorkflowsQueryKey({ teamId, workflowId }) : []

    // Query única a la vista combinada
    const { data, ...rest } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!teamId)
                throw new Error("Falta teamId para consultar workflows.")
            let query = client
                .from("workflows")
                .select(
                    `
                    *,
                    owner:owner_id(*),
                    tags:tags(*),
                    metrics:workflows_metrics(*),
                    flow:workflows_flows(flow)
                `,
                )
                .eq("team_id", teamId)
                .order("created_at", { ascending: false })

            if (workflowId) query = query.eq("id", workflowId)
            const { data, error } =
                await query.overrideTypes<
                    { flow: { flow: { nodes: Node[]; edges: Edge[] } }[] }[]
                >()
            if (error) throw error
            return data.map((wf) => {
                const flow = wf.flow?.[0]?.flow ?? { nodes: [], edges: [] }

                const nodes: Node[] =
                    flow?.nodes?.map((node: Node) => ({
                        ...node,
                        className: "group",
                        deletable: node.type !== "trigger",
                        selected:
                            queryClient
                                .getQueryData<Workflow[]>(queryKey)?.[0]
                                ?.flow?.nodes?.some(
                                    (n) => n.selected && n.id === node.id,
                                ) ?? false,
                    })) ?? []

                const edges: Edge[] =
                    flow?.edges?.map((edge: Edge) => ({
                        ...edge,
                        id: edge.source + edge.target,
                        className: "group",
                        selected:
                            queryClient
                                .getQueryData<Workflow[]>(queryKey)?.[0]
                                ?.flow?.edges?.some(
                                    (e) => e.selected && e.id === edge.id,
                                ) ?? false,
                        deletable: true,
                        animated: false,
                    })) ?? []

                return {
                    ...wf,
                    flow: { nodes, edges },
                }
            })
        },
        enabled,
    })

    // Mutación (update/upsert) sobre la tabla original con actualización optimista
    const updateMutation = useMutation({
        mutationFn: async (data: WorkflowUpdate | WorkflowUpdate[]) => {
            if (!teamId)
                throw new Error("Falta teamId para actualizar workflow.")
            if (Array.isArray(data)) {
                // Bulk upsert
                const upsertData = data.map((wf) => ({
                    ...wf,
                    team_id: wf.team_id ?? teamId,
                }))
                const { error } = await client
                    .from("workflows")
                    .upsert(upsertData)
                if (error) throw error
            } else {
                // Single upsert, prioriza workflowId del hook si existe
                const upsertId = workflowId ?? data.id
                if (!upsertId)
                    throw new Error("Falta id para upsert de workflow.")
                const upsertData = {
                    ...data,
                    id: upsertId,
                    team_id: data.team_id ?? teamId,
                }
                await client
                    .from("workflows")
                    .select("name")
                    .eq("id", upsertId)
                    .single()
                const { error } = await client.from("workflows").upsert({
                    ...upsertData,
                })
                if (error) throw error
            }
        },
        onMutate: async (newData: WorkflowUpdate | WorkflowUpdate[]) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            if (!Array.isArray(newData)) {
                await queryClient.cancelQueries({
                    queryKey: getWorkflowsQueryKey({
                        teamId,
                        workflowId: workflowId ?? newData.id,
                    }),
                })
            }
            const previousGeneral = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )

            // Actualización optimista
            if (Array.isArray(newData)) {
                // Bulk: actualiza todos los workflows afectados
                queryClient.setQueryData<Workflow[]>(
                    getWorkflowsQueryKey({ teamId }),
                    (old) => {
                        if (!old) return old
                        return old.map((item) => {
                            const updated = newData.find(
                                (wf) => wf.id === item.id,
                            )
                            return updated
                                ? {
                                      ...item,
                                      ...updated,
                                      team_id: updated.team_id ?? teamId,
                                  }
                                : item
                        })
                    },
                )
            } else {
                // Single: actualiza solo el workflow correspondiente
                queryClient.setQueryData<Workflow[]>(
                    getWorkflowsQueryKey({ teamId }),
                    (old) => {
                        if (!old) return old
                        return old.map((item) =>
                            item.id === (newData.id ?? workflowId)
                                ? {
                                      ...item,
                                      ...newData,
                                      team_id: newData.team_id ?? teamId,
                                  }
                                : item,
                        )
                    },
                )
                // Opcional: actualiza la cache específica
                if (workflowId) {
                    queryClient.setQueryData<Workflow[]>(
                        getWorkflowsQueryKey({ teamId, workflowId }),
                        (old) => {
                            if (!old) return old
                            return old.map((item) =>
                                item.id === (newData.id ?? workflowId)
                                    ? {
                                          ...item,
                                          ...newData,
                                          team_id: newData.team_id ?? teamId,
                                      }
                                    : item,
                            )
                        },
                    )
                }
            }

            return { previousGeneral }
        },
        onError: (
            err,
            _newData,
            context: { previousGeneral?: Workflow[] } | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previousGeneral,
                )
            }
            toast({
                title: "Error al actualizar el workflow",
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
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
        },
    })

    // --- MUTACIONES DE ACCIÓN (React Query) ---
    // Asignar un tag a un workflow
    const assignTagMutation = useMutation({
        mutationFn: async (
            data:
                | { tagId: string; workflowId?: string }
                | { tagId: string; workflowId: string }[],
        ) => {
            if (!teamId) throw new Error("Falta teamId para asignar tag.")
            if (Array.isArray(data)) {
                // Bulk assign tag
                const inserts = data.map(({ tagId, workflowId }) => ({
                    workflow_id: workflowId,
                    tag_id: tagId,
                }))
                const { error } = await client
                    .from("tags_workflows")
                    .insert(inserts)
                if (error) throw error
            } else {
                const { tagId, workflowId: recordId } = data
                if (!(recordId ?? workflowId))
                    throw new Error(
                        "Falta workflowId para asignar tag. El hook debe usarse con un workflowId específico.",
                    )
                const { error } = await client.from("tags_workflows").insert({
                    workflow_id: recordId ?? workflowId!,
                    tag_id: tagId,
                })
                if (error) throw error
            }
        },
        onMutate: async (
            data:
                | { tagId: string; workflowId?: string }
                | { tagId: string; workflowId: string }[],
        ) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            let affectedIds: string[] = []
            let tagIds: string[] = []
            if (Array.isArray(data)) {
                affectedIds = data
                    .map((d) => d.workflowId)
                    .filter((id): id is string => Boolean(id))
                tagIds = data.map((d) => d.tagId)
            } else {
                affectedIds = [data.workflowId ?? workflowId].filter(
                    (id): id is string => Boolean(id),
                )
                tagIds = [data.tagId]
            }
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )
            const allTags = queryClient.getQueryData<Tag[]>(
                getTagsQueryKey({ teamId }),
            )
            // Actualización optimista bulk
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => {
                        if (affectedIds.includes(wf.id)) {
                            const tags = Array.isArray(wf.tags) ? wf.tags : []
                            // Para bulk, puede haber varios tags
                            const newTags =
                                allTags?.filter((t) => tagIds.includes(t.id)) ??
                                []
                            // Evita duplicados
                            const tagsSet = new Map(tags.map((t) => [t.id, t]))
                            newTags.forEach((t) => tagsSet.set(t.id, t))
                            return {
                                ...wf,
                                tags: Array.from(tagsSet.values()),
                            }
                        }
                        return wf
                    })
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _data,
            context: { previous?: Workflow[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al asignar tag",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_data) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
        },
    })

    // Remover un tag de un workflow
    const removeTagMutation = useMutation({
        mutationFn: async (
            data:
                | { tagId: string; workflowId?: string }
                | { tagId: string; workflowId: string }[],
        ) => {
            if (!teamId) throw new Error("Falta teamId para remover tag.")
            if (Array.isArray(data)) {
                // Bulk remove tag
                const promises = data.map(({ tagId, workflowId }) =>
                    client
                        .from("tags_workflows")
                        .delete()
                        .eq("workflow_id", workflowId)
                        .eq("tag_id", tagId),
                )
                const results = await Promise.all(promises)
                const errors = results.filter((r) => r.error)
                if (errors.length > 0) throw errors.map((e) => e.error)
            } else {
                const { tagId, workflowId: recordId } = data
                if (!(recordId ?? workflowId))
                    throw new Error(
                        "Falta workflowId para remover tag. El hook debe usarse con un workflowId específico.",
                    )
                const { error } = await client
                    .from("tags_workflows")
                    .delete()
                    .eq("workflow_id", recordId ?? workflowId!)
                    .eq("tag_id", tagId)
                if (error) throw error
            }
        },
        onMutate: async (
            data:
                | { tagId: string; workflowId?: string }
                | { tagId: string; workflowId: string }[],
        ) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            let affectedIds: string[] = []
            let tagIds: string[] = []
            if (Array.isArray(data)) {
                affectedIds = data
                    .map((d) => d.workflowId)
                    .filter((id): id is string => Boolean(id))
                tagIds = data.map((d) => d.tagId)
            } else {
                affectedIds = [data.workflowId ?? workflowId].filter(
                    (id): id is string => Boolean(id),
                )
                tagIds = [data.tagId]
            }
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )
            // Actualización optimista bulk
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => {
                        if (affectedIds.includes(wf.id)) {
                            const tags = Array.isArray(wf.tags) ? wf.tags : []
                            // Elimina todos los tagIds indicados
                            return {
                                ...wf,
                                tags: tags.filter(
                                    (t) => !tagIds.includes(t.id),
                                ),
                            }
                        }
                        return wf
                    })
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _data,
            context: { previous?: Workflow[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al remover tag",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_data) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
        },
    })

    // Asignar un owner a un workflow
    const assignOwnerMutation = useMutation({
        mutationFn: async (
            data:
                | { ownerId: string; workflowId?: string }
                | { ownerId: string; workflowId: string }[],
        ) => {
            if (!teamId) throw new Error("Falta teamId para asignar owner.")
            if (Array.isArray(data)) {
                // Bulk assign owner con upsert
                const upsertData = data.map(({ ownerId, workflowId }) => ({
                    id: workflowId,
                    owner_id: ownerId,
                    team_id: teamId,
                }))
                const { error } = await client
                    .from("workflows")
                    .upsert(upsertData)
                if (error) throw error
            } else {
                const { ownerId, workflowId: recordId } = data
                if (!(recordId ?? workflowId))
                    throw new Error(
                        "Falta workflowId para asignar owner. El hook debe usarse con un workflowId específico.",
                    )
                const { error } = await client
                    .from("workflows")
                    .update({ owner_id: ownerId })
                    .eq("id", recordId ?? workflowId!)
                if (error) throw error
            }
        },
        onMutate: async (
            data:
                | { ownerId: string; workflowId?: string }
                | { ownerId: string; workflowId?: string }[],
        ) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            if (!Array.isArray(data)) {
                await queryClient.cancelQueries({
                    queryKey: getWorkflowsQueryKey({
                        teamId,
                        workflowId: data.workflowId ?? workflowId,
                    }),
                })
            }
            const previousGeneral = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )

            // Actualización optimista
            if (Array.isArray(data)) {
                // Bulk: actualiza todos los workflows afectados
                const idMap = new Map(
                    data.map((d) => [d.workflowId ?? workflowId, d.ownerId]),
                )
                queryClient.setQueryData<Workflow[]>(
                    getWorkflowsQueryKey({ teamId }),
                    (old) => {
                        if (!old) return old
                        return old.map((item) =>
                            idMap.has(item.id)
                                ? {
                                      ...item,
                                      owner_id: idMap.get(item.id)!,
                                      owner: {
                                          id: idMap.get(item.id)!,
                                          email: "",
                                          first_name: "",
                                          last_name: "",
                                          avatar_url: "",
                                      },
                                  }
                                : item,
                        )
                    },
                )
            } else {
                // Single: actualiza solo el workflow correspondiente
                queryClient.setQueryData<Workflow[]>(
                    getWorkflowsQueryKey({ teamId }),
                    (old) => {
                        if (!old) return old
                        return old.map((item) =>
                            item.id === (data.workflowId ?? workflowId)
                                ? {
                                      ...item,
                                      owner_id: data.ownerId,
                                      owner: {
                                          id: data.ownerId,
                                          email: "loadingemail@loading.com",
                                          first_name: "Loading",
                                          last_name: "Name",
                                          avatar_url: "",
                                      },
                                  }
                                : item,
                        )
                    },
                )
                // Opcional: actualiza la cache específica
                if (workflowId) {
                    queryClient.setQueryData<Workflow[]>(
                        getWorkflowsQueryKey({ teamId, workflowId }),
                        (old) => {
                            if (!old) return old
                            return old.map((item) =>
                                item.id === (data.workflowId ?? workflowId)
                                    ? {
                                          ...item,
                                          owner_id: data.ownerId,
                                          owner: {
                                              id: data.ownerId,
                                              email: "loadingemail@loading.com",
                                              first_name: "Loading",
                                              last_name: "Name",
                                              avatar_url: "",
                                          },
                                      }
                                    : item,
                            )
                        },
                    )
                }
            }

            return { previousGeneral }
        },
        onError: (
            err,
            _vars,
            context: { previousGeneral?: Workflow[] } | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previousGeneral,
                )
            }
            toast({
                title: "Error al asignar owner",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Archivar un workflow
    const archiveMutation = useMutation({
        mutationFn: async (
            data: { workflowId?: string } | { workflowId?: string }[],
        ) => {
            if (!teamId) throw new Error("Falta teamId para archivar workflow.")
            if (Array.isArray(data)) {
                // Bulk archive con upsert
                const ids = data.map((d) => d.workflowId).filter(Boolean)
                const upsertData = ids.map((id) => {
                    return {
                        id,
                        team_id: teamId,
                        status: "archived" as const,
                    }
                })
                const { error } = await client
                    .from("workflows")
                    .upsert(upsertData)

                if (error) throw error
            } else {
                const recordId = data.workflowId
                if (!(recordId ?? workflowId))
                    throw new Error(
                        "Falta workflowId para archivar workflow. El hook debe usarse con un workflowId específico.",
                    )
                const { error } = await client
                    .from("workflows")
                    .update({ status: "archived" })
                    .eq("id", recordId ?? workflowId!)
                if (error) throw error
            }
        },
        onMutate: async (
            data: { workflowId?: string } | { workflowId?: string }[],
        ) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            if (!Array.isArray(data)) {
                await queryClient.cancelQueries({
                    queryKey: getWorkflowsQueryKey({
                        teamId,
                        workflowId: data.workflowId ?? workflowId,
                    }),
                })
            }
            const previousGeneral = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )

            // Actualización optimista
            if (Array.isArray(data)) {
                // Bulk: actualiza todos los workflows afectados
                const ids = data.map((d) => d.workflowId).filter(Boolean)
                queryClient.setQueryData<Workflow[]>(
                    getWorkflowsQueryKey({ teamId }),
                    (old) => {
                        if (!old) return old
                        return old.map((item) =>
                            ids.includes(item.id)
                                ? {
                                      ...item,
                                      status: "archived",
                                  }
                                : item,
                        )
                    },
                )
            } else {
                // Single: actualiza solo el workflow correspondiente
                queryClient.setQueryData<Workflow[]>(
                    getWorkflowsQueryKey({ teamId }),
                    (old) => {
                        if (!old) return old
                        return old.map((item) =>
                            item.id === (data.workflowId ?? workflowId)
                                ? {
                                      ...item,
                                      status: "archived",
                                  }
                                : item,
                        )
                    },
                )
                // Opcional: actualiza la cache específica
                if (workflowId) {
                    queryClient.setQueryData<Workflow[]>(
                        getWorkflowsQueryKey({ teamId, workflowId }),
                        (old) => {
                            if (!old) return old
                            return old.map((item) =>
                                item.id === (data.workflowId ?? workflowId)
                                    ? {
                                          ...item,
                                          status: "archived",
                                      }
                                    : item,
                            )
                        },
                    )
                }
            }

            return { previousGeneral }
        },
        onError: (
            err,
            _vars,
            context: { previousGeneral?: Workflow[] } | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previousGeneral,
                )
            }
            toast({
                title: "Error al archivar workflow",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Duplicar un workflow (incluye tags asociados)
    const duplicateMutation = useMutation({
        mutationFn: async ({
            tags,
            ...fields
        }: Partial<WorkflowUpdate> & { tags?: string[] } = {}) => {
            if (!teamId) throw new Error("Falta teamId para duplicar workflow.")
            if (!workflowId)
                throw new Error(
                    "Falta workflowId para duplicar workflow. El hook debe usarse con un workflowId específico.",
                )
            // 1. Obtener el workflow original
            const { data: original, error: errorOriginal } = await client
                .from("workflows")
                .select("*", { count: "exact", head: false })
                .eq("id", workflowId)
                .single()
            if (errorOriginal ?? !original)
                throw (
                    errorOriginal ??
                    new Error("No se encontró el workflow a duplicar.")
                )
            // Obtener usuario autenticado para creator_id
            const { data: userData } = await client.auth.getUser()
            const creator_id = userData?.user?.id
            // 2. Crear el nuevo workflow (copiando campos, sobrescribiendo con fields)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, created_at, updated_at, ...restOriginal } = original
            const newWorkflow = {
                ...restOriginal,
                ...fields,
                name: (fields.name ?? original.name) + " (Copia)",
                status: "active" as const,
                team_id: original.team_id,
                creator_id,
            }
            const { data: inserted, error: errorInsert } = await client
                .from("workflows")
                .insert([newWorkflow])
                .select()
                .single()
            if (errorInsert ?? !inserted)
                throw (
                    errorInsert ??
                    new Error("Error al crear el workflow duplicado.")
                )
            // 3. Asociar tags: si se pasan tags como parámetro, sobrescribir; si no, copiar los del original
            let tagsToAssociate: string[] = []
            if (Array.isArray(tags)) {
                tagsToAssociate = tags
            } else {
                // Copiar los tags del workflow original
                const { data: tags, error: errorTags } = await client
                    .from("tags_workflows")
                    .select("tag_id")
                    .eq("workflow_id", workflowId)
                if (errorTags) throw errorTags
                if (tags && tags.length > 0) {
                    tagsToAssociate = tags.map(
                        (t: { tag_id: string }) => t.tag_id,
                    )
                }
            }
            if (tagsToAssociate.length > 0) {
                const tagInserts = tagsToAssociate.map((tagId: string) => ({
                    workflow_id: inserted.id,
                    tag_id: tagId,
                }))
                const { error: errorTagInsert } = await client
                    .from("tags_workflows")
                    .insert(tagInserts)
                if (errorTagInsert) throw errorTagInsert
            }
            return inserted.id
        },
        onMutate: async (fields: Partial<WorkflowUpdate> = {}) => {
            if (!teamId) return
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )
            // Optimista: agregar un workflow "temporal" (sin id real) al cache
            const tempWorkflow: Partial<Workflow> = {
                ...fields,
                id: crypto.randomUUID(),
                status: fields.status ?? "active",
                team_id: teamId,
            }
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return [tempWorkflow as Workflow, ...old]
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _fields,
            context: { previous?: Workflow[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al duplicar workflow",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
        },
    })

    const createMutation = useMutation({
        mutationFn: async (input: CreateWorkflowInput) => {
            if (!teamId) throw new Error("Falta teamId para crear workflow.")
            const { tags, ...workflowFields } = input
            // Obtener usuario autenticado para creator_id
            const { data: userData } = await client.auth.getUser()
            const creator_id = userData?.user?.id
            // Insertar workflow
            if (workflowFields.name === undefined)
                throw new Error("Falta name para crear workflow.")
            const { data: inserted, error } = await client
                .from("workflows")
                .insert({
                    ...workflowFields,
                    team_id: teamId,
                    name: workflowFields.name,
                    creator_id,
                })
                .select()
                .single()
            if (error ?? !inserted)
                throw error ?? new Error("Error al crear el workflow.")
            // Asociar tags si corresponde
            if (tags && tags.length > 0) {
                const tagInserts = tags.map((tagId) => ({
                    workflow_id: inserted.id,
                    tag_id: tagId,
                }))
                const { error: tagError } = await client
                    .from("tags_workflows")
                    .insert(tagInserts)
                if (tagError) throw tagError
            }
            return inserted.id
        },
        onMutate: async (input: CreateWorkflowInput) => {
            if (!teamId) return
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
            )
            // Optimista: agregar un workflow "temporal" (sin id real) al cache
            const { tags, ...inputWithoutTags } = input
            let tagsForTemp: Workflow["tags"] = undefined
            if (Array.isArray(tags) && tags.length > 0) {
                const allTags = queryClient.getQueryData<Tag[]>(
                    getTagsQueryKey({ teamId }),
                )
                if (allTags) {
                    tagsForTemp = allTags.filter((tag) => tags.includes(tag.id))
                }
            }
            const tempWorkflow: Partial<Workflow> = {
                ...inputWithoutTags,
                id: crypto.randomUUID(),
                status: input.status ?? "active",
                team_id: teamId,
                ...(tagsForTemp ? { tags: tagsForTemp } : {}),
            }
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return [tempWorkflow as Workflow, ...old]
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _input,
            context: { previous?: Workflow[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear workflow",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId }),
            })
        },
    })

    // --- MUTACIONES DE NODOS Y EDGES ---
    // Eliminar nodo
    const deleteNodeMutation = useMutation({
        mutationFn: async (params: {
            nodeId?: string
            workflowId?: string
        }) => {
            const effectiveNodeId = params.nodeId ?? nodeId
            if (!effectiveNodeId)
                throw new Error("Falta nodeId para eliminar nodo.")
            const { error } = await client
                .from("nodes")
                .delete()
                .eq("id", effectiveNodeId)
            if (error) throw error
            return {
                nodeId: effectiveNodeId,
                workflowId: params.workflowId ?? workflowId,
            }
        },
        onMutate: async (params: { nodeId?: string; workflowId?: string }) => {
            const effectiveNodeId = params.nodeId ?? nodeId
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: (wf.flow?.nodes ?? []).filter(
                                (n) => n.id !== effectiveNodeId,
                            ),
                            edges: (wf.flow?.edges ?? []).filter(
                                (e) =>
                                    e.source !== effectiveNodeId &&
                                    e.target !== effectiveNodeId,
                            ),
                        },
                    }))
                },
            )
            return {
                previous,
                workflowId: effectiveWorkflowId,
                nodeId: effectiveNodeId,
            }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al eliminar nodo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Duplicar nodo
    const duplicateNodeMutation = useMutation({
        mutationFn: async (params: {
            nodeId?: string
            workflowId?: string
            offset?: { x: number; y: number }
        }) => {
            const effectiveNodeId = params.nodeId ?? nodeId
            const effectiveWorkflowId = params.workflowId ?? workflowId
            if (!effectiveNodeId)
                throw new Error("Falta nodeId para duplicar nodo.")
            // Obtener el nodo original
            const { data: original, error } = await client
                .from("nodes")
                .select("*", { head: false, count: "exact" })
                .eq("id", effectiveNodeId)
                .single()
            if (error ?? !original)
                throw error ?? new Error("No se encontró el nodo a duplicar.")
            // Calcular nueva posición con offset
            const offset = params.offset ?? { x: 40, y: 40 }
            const newNode = {
                ...original,
                position_x: (original.position_x ?? 0) + offset.x,
                position_y: (original.position_y ?? 0) + offset.y,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
            if ("id" in newNode) {
                delete (newNode as { id?: string }).id
            }
            const { data: inserted, error: insertError } = await client
                .from("nodes")
                .insert(newNode)
                .select()
                .single()
            if (insertError) throw insertError
            return { newNode: inserted, workflowId: effectiveWorkflowId }
        },
        onMutate: async (params: {
            nodeId?: string
            workflowId?: string
            offset?: { x: number; y: number }
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )

            // Buscar el nodo original en el cache para obtener su posición y data
            let originalNode: Node | undefined
            if (previous) {
                for (const wf of previous) {
                    originalNode = wf.flow?.nodes?.find(
                        (n) => n.id === (params.nodeId ?? nodeId),
                    )
                    if (originalNode) break
                }
            }
            const offset = params.offset ?? { x: 40, y: 40 }
            const tempNode: Node = {
                id: crypto.randomUUID(),
                type: originalNode?.type,
                data: originalNode?.data ?? {},
                position: {
                    x: (originalNode?.position?.x ?? 0) + offset.x,
                    y: (originalNode?.position?.y ?? 0) + offset.y,
                },
                className: "group",
                deletable: true,
                selected: false,
            }
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: [...(wf.flow?.nodes ?? []), tempNode],
                            edges: wf.flow?.edges ?? [],
                        },
                    }))
                },
            )
            return { previous, workflowId: effectiveWorkflowId }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al duplicar nodo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Crear nodo
    const createNodeMutation = useMutation({
        mutationFn: async (params: {
            workflowId?: string
            node: Omit<Node, "id" | "className" | "deletable" | "selected"> & {
                id?: string
                data: Record<string, unknown>
                type: TablesInsert<"nodes">["type"]
            }
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            if (!effectiveWorkflowId)
                throw new Error("Falta workflowId para crear nodo.")
            const nodeId = params.node.id ?? crypto.randomUUID()
            const { data, type, position } = params.node
            const { error } = await client.from("nodes").insert({
                id: nodeId,
                workflow_id: effectiveWorkflowId,
                data: JSON.stringify(data),
                type: type ?? "placeholder",
                position_x: position?.x ?? 0,
                position_y: position?.y ?? 0,
            })
            if (error) throw error
            return {
                node: { ...params.node, id: nodeId },
                workflowId: effectiveWorkflowId,
            }
        },
        onMutate: async (params: {
            workflowId?: string
            node: Omit<Node, "id" | "className" | "deletable" | "selected"> & {
                id?: string
            }
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: [
                                ...(wf.flow?.nodes ?? []),
                                {
                                    ...params.node,
                                    id: params.node.id ?? crypto.randomUUID(),
                                    className: "group",
                                    deletable: true,
                                    selected: false,
                                },
                            ],
                            edges: wf.flow?.edges ?? [],
                        },
                    }))
                },
            )
            return { previous, workflowId: effectiveWorkflowId }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear nodo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Mover nodo (actualizar posición)
    const moveNodeMutation = useMutation({
        mutationFn: async (params: {
            nodeId?: string
            workflowId?: string
            position: { x: number; y: number }
        }) => {
            try {
                const effectiveNodeId = params.nodeId ?? nodeId
                if (!effectiveNodeId)
                    throw new Error("Falta nodeId para mover nodo.")
                const query = client.from("nodes")

                const debounceQuery = asyncDebounce(
                    async ({ x, y }: { x: number; y: number }) =>
                        await query
                            .update({
                                position_x: x,
                                position_y: y,
                            })
                            .eq("id", effectiveNodeId),
                    {
                        wait: 100,
                    },
                )

                await debounceQuery({
                    x: params.position.x,
                    y: params.position.y,
                })

                return {
                    nodeId: effectiveNodeId,
                    position: params.position,
                    workflowId: params.workflowId ?? workflowId,
                }
            } catch (error) {
                console.error(error)
            }
        },
        onMutate: async (params: {
            nodeId?: string
            workflowId?: string
            position: { x: number; y: number }
        }) => {
            const effectiveNodeId = params.nodeId ?? nodeId
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: (wf.flow?.nodes ?? []).map((n) =>
                                n.id === effectiveNodeId
                                    ? { ...n, position: params.position }
                                    : n,
                            ),
                            edges: wf.flow?.edges ?? [],
                        },
                    }))
                },
            )
            return {
                previous,
                workflowId: effectiveWorkflowId,
                nodeId: effectiveNodeId,
            }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al mover nodo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId, nodeId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId, nodeId }),
            })
        },
    })

    // Editar data del nodo
    const editNodeDataMutation = useMutation({
        mutationFn: async (params: {
            nodeId?: string
            workflowId?: string
            data: Record<string, unknown>
        }) => {
            const effectiveNodeId = params.nodeId ?? nodeId
            if (!effectiveNodeId)
                throw new Error("Falta nodeId para editar data del nodo.")
            const { error } = await client
                .from("nodes")
                .update({ data: JSON.stringify(params.data) })
                .eq("id", effectiveNodeId)
            if (error) throw error
            return {
                nodeId: effectiveNodeId,
                data: params.data,
                workflowId: params.workflowId ?? workflowId,
            }
        },
        onMutate: async (params: {
            nodeId?: string
            workflowId?: string
            data: Record<string, unknown>
        }) => {
            const effectiveNodeId = params.nodeId ?? nodeId
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                    nodeId: effectiveNodeId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: (wf.flow?.nodes ?? []).map((n) =>
                                n.id === effectiveNodeId
                                    ? {
                                          ...n,
                                          data: params.data,
                                      }
                                    : n,
                            ),
                            edges: wf.flow?.edges ?? [],
                        },
                    }))
                },
            )
            return {
                previous,
                workflowId: effectiveWorkflowId,
                nodeId: effectiveNodeId,
            }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al editar data del nodo",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId, nodeId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId, nodeId }),
            })
        },
    })

    // Crear edge
    const createEdgeMutation = useMutation({
        mutationFn: async (params: {
            workflowId?: string
            edge: Omit<
                Edge,
                "id" | "className" | "deletable" | "selected" | "animated"
            > & {
                type: TablesInsert<"edges">["type"]
                data: {
                    delay: number
                    unit: TablesInsert<"edges">["time_delay_unit"]
                }
            }
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            if (!effectiveWorkflowId)
                throw new Error("Falta workflowId para crear edge.")
            const { data, source, target, type } = params.edge
            if (type !== "temporal") {
                const { error } = await client.from("edges").insert({
                    workflow_id: effectiveWorkflowId,
                    source_id: source,
                    target_id: target,
                    time_delay: data?.delay,
                    time_delay_unit: data?.unit,
                    type: type ?? "custom",
                })
                if (error) throw error
            }
            return { edge: { ...params.edge }, workflowId: effectiveWorkflowId }
        },
        onMutate: async (params: {
            workflowId?: string
            edge: Omit<
                Edge,
                "id" | "className" | "deletable" | "selected" | "animated"
            > & { id?: string }
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: wf.flow?.nodes ?? [],
                            edges: [
                                ...(wf.flow?.edges ?? []),
                                {
                                    ...params.edge,
                                    id: params.edge.source + params.edge.target,
                                    className: "group",
                                    deletable: true,
                                    selected: false,
                                    animated:
                                        params.edge.type === "temporal"
                                            ? true
                                            : false,
                                },
                            ],
                        },
                    }))
                },
            )
            return { previous, workflowId: effectiveWorkflowId }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear edge",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Borrar edge
    const deleteEdgeMutation = useMutation({
        mutationFn: async (params: {
            sourceId: string
            targetId: string
            workflowId?: string
        }) => {
            const temporalEdges = queryClient
                .getQueryData<Workflow[]>(
                    getWorkflowsQueryKey({
                        teamId,
                        workflowId: params.workflowId ?? workflowId,
                    }),
                )?.[0]
                ?.flow?.edges.filter((edge) => edge.type === "temporal")

            const isTemporalEdge = temporalEdges?.find(
                (edge) =>
                    edge.source === params.sourceId &&
                    edge.target === params.targetId,
            )

            if (!isTemporalEdge) {
                const { error: _ } = await client
                    .from("edges")
                    .delete()
                    .eq("source_id", params.sourceId)
                    .eq("target_id", params.targetId)
            }

            //BUG: No sé porque tira error cuando elimino
            // if (error) throw error
            return {
                sourceId: params.sourceId,
                targetId: params.targetId,
                workflowId: params.workflowId ?? workflowId,
            }
        },
        onMutate: async (params: {
            sourceId: string
            targetId: string
            workflowId?: string
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: wf.flow?.nodes ?? [],
                            edges: (wf.flow?.edges ?? []).filter(
                                (e) =>
                                    !(
                                        e.source === params.sourceId &&
                                        e.target === params.targetId
                                    ),
                            ),
                        },
                    }))
                },
            )
            return {
                previous,
                workflowId: effectiveWorkflowId,
                sourceId: params.sourceId,
                targetId: params.targetId,
            }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al borrar edge",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Asignar delay a un edge
    const assignEdgeDelayMutation = useMutation({
        mutationFn: async (params: {
            sourceId: string
            targetId: string
            workflowId?: string
            delay: number
            unit: TablesInsert<"edges">["time_delay_unit"]
        }) => {
            const { error } = await client
                .from("edges")
                .update({
                    time_delay: params.delay,
                    time_delay_unit: params.unit,
                })
                .eq("source_id", params.sourceId)
                .eq("target_id", params.targetId)
            if (error) throw error
            return {
                delay: params.delay,
                unit: params.unit,
                workflowId: params.workflowId ?? workflowId,
            }
        },
        onMutate: async (params: {
            sourceId: string
            targetId: string
            workflowId?: string
            delay: number
            unit: Tables<"edges">["time_delay_unit"]
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => ({
                        ...wf,
                        flow: {
                            nodes: wf.flow?.nodes ?? [],
                            edges: (wf.flow?.edges ?? []).map((e) =>
                                e.source === params.sourceId &&
                                e.target === params.targetId
                                    ? {
                                          ...e,
                                          data: {
                                              order: e.data.order,
                                              delay: params.delay,
                                              unit: params.unit,
                                          },
                                      }
                                    : e,
                            ),
                        },
                    }))
                },
            )
            return {
                previous,
                workflowId: effectiveWorkflowId,
                sourceId: params.sourceId,
                targetId: params.targetId,
            }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al asignar delay al edge",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Actualizar múltiples nodos
    const updateNodesMutation = useMutation({
        mutationFn: async (params: { workflowId?: string; nodes: Node[] }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            if (!effectiveWorkflowId)
                throw new Error("Falta workflowId para actualizar nodos.")
            if (!teamId) throw new Error("Falta teamId para actualizar nodos.")

            // Actualizar cada nodo individualmente
            const promises = params.nodes.map((node) => {
                return client.from("nodes").upsert({
                    id: node.id,
                    workflow_id: effectiveWorkflowId,
                    type: node.type ?? "placeholder",
                    position_x: node.position.x,
                    position_y: node.position.y,
                    data: JSON.stringify(node.data),
                })
            })

            const results = await Promise.all(promises)
            const errors = results.filter((r) => r.error)
            if (errors.length > 0) throw errors[0]?.error

            return { nodes: params.nodes, workflowId: effectiveWorkflowId }
        },
        onMutate: async (params: { workflowId?: string; nodes: Node[] }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )

            // Actualización optimista
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => {
                        const flow = wf.flow ?? { nodes: [], edges: [] }
                        return {
                            ...wf,
                            flow: {
                                nodes: params.nodes,
                                edges: flow.edges,
                            },
                        }
                    })
                },
            )
            return { previous, workflowId: effectiveWorkflowId }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al actualizar nodos",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    // Actualizar múltiples edges
    const updateEdgesMutation = useMutation({
        mutationFn: async (params: {
            workflowId?: string
            edges: Omit<
                Edge,
                "className" | "deletable" | "selected" | "animated"
            >[]
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            if (!effectiveWorkflowId)
                throw new Error("Falta workflowId para actualizar edges.")
            if (!teamId) throw new Error("Falta teamId para actualizar edges.")

            // Actualizar cada edge individualmente
            const promises = params.edges
                .filter((edge) => edge.type !== "temporal")
                .map((edge) => {
                    return client.from("edges").upsert({
                        workflow_id: effectiveWorkflowId,
                        source_id: edge.source,
                        target_id: edge.target,
                        type: "custom" as const,
                        time_delay: edge.data?.delay ?? 1,
                        time_delay_unit: edge.data?.unit ?? "days",
                    })
                })

            const results = await Promise.all(promises)
            const errors = results.filter((r) => r.error)
            if (errors.length > 0) throw errors[0]?.error

            return { edges: params.edges, workflowId: effectiveWorkflowId }
        },
        onMutate: async (params: {
            workflowId?: string
            edges: Omit<
                Edge,
                "className" | "deletable" | "selected" | "animated"
            >[]
        }) => {
            const effectiveWorkflowId = params.workflowId ?? workflowId
            await queryClient.cancelQueries({
                queryKey: getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            })
            const previous = queryClient.getQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
            )

            // Actualización optimista
            queryClient.setQueryData<Workflow[]>(
                getWorkflowsQueryKey({
                    teamId,
                    workflowId: effectiveWorkflowId,
                }),
                (old) => {
                    if (!old) return old
                    return old.map((wf) => {
                        const flow = wf.flow ?? { nodes: [], edges: [] }

                        const edges = flow.edges.map((edge) => {
                            const foundEdge = params.edges.find(
                                (e) =>
                                    e.source === edge.source &&
                                    e.target === edge.target,
                            )

                            if (foundEdge) {
                                return {
                                    ...foundEdge,
                                    animated:
                                        edge.type === "temporal" ? true : false,
                                    deletable: true,
                                    className: "group",
                                    selected: false,
                                }
                            }
                            return edge
                        })

                        return {
                            ...wf,
                            flow: {
                                nodes: flow.nodes,
                                edges,
                            },
                        }
                    })
                },
            )
            return { previous, workflowId: effectiveWorkflowId }
        },
        onError: (err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getWorkflowsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al actualizar edges",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async (_vars, _err, { workflowId }) => {
            await queryClient.invalidateQueries({
                queryKey: getWorkflowsQueryKey({ teamId, workflowId }),
            })
        },
    })

    const setSelections = function (params: {
        workflowId?: string
        nodes?: Node[]
        edges?: Edge[]
    }) {
        const effectiveWorkflowId = params.workflowId ?? workflowId
        if (!effectiveWorkflowId)
            throw new Error("Falta workflowId para seleccionar flujo.")

        void queryClient.cancelQueries({
            queryKey: getWorkflowsQueryKey({
                teamId,
                workflowId: effectiveWorkflowId,
            }),
        })

        queryClient.setQueryData<Workflow[]>(
            getWorkflowsQueryKey({
                teamId,
                workflowId: effectiveWorkflowId,
            }),
            (old) => {
                if (!old) return old
                return old.map((wf) => {
                    const flow = wf.flow ?? { nodes: [], edges: [] }
                    flow.nodes = flow.nodes.map((node) => {
                        if (params.nodes?.includes(node)) {
                            return { ...node, selected: true }
                        }
                        return node
                    })

                    flow.edges = flow.edges.map((edge) => {
                        if (params.edges?.includes(edge)) {
                            return { ...edge, selected: true }
                        }
                        return edge
                    })

                    return {
                        ...wf,
                        flow: flow,
                    }
                })
            },
        )
    }

    const clearSelections = function (params: { workflowId?: string }) {
        const effectiveWorkflowId = params.workflowId ?? workflowId
        if (!effectiveWorkflowId)
            throw new Error("Falta workflowId para seleccionar flujo.")

        queryClient.setQueryData<Workflow[]>(
            getWorkflowsQueryKey({
                teamId,
                workflowId: effectiveWorkflowId,
            }),
            (old) => {
                if (!old) return old
                return old.map((wf) => {
                    return {
                        ...wf,
                        flow: {
                            ...wf.flow,
                            nodes:
                                wf.flow?.nodes.map((node) => ({
                                    ...node,
                                    selected: false,
                                })) ?? [],
                            edges:
                                wf.flow?.edges.map((edge) => ({
                                    ...edge,
                                    selected: false,
                                })) ?? [],
                        },
                    }
                })
            },
        )
    }

    return {
        ...rest,
        data,
        update: updateMutation.mutateAsync,
        assignTag: assignTagMutation.mutateAsync,
        removeTag: removeTagMutation.mutateAsync,
        assignOwner: assignOwnerMutation.mutateAsync,
        archive: archiveMutation.mutateAsync,
        duplicate: duplicateMutation.mutateAsync,
        create: createMutation.mutateAsync,
        // Mutaciones de nodos y edges
        deleteNode: deleteNodeMutation.mutateAsync,
        duplicateNode: duplicateNodeMutation.mutateAsync,
        createNode: createNodeMutation.mutateAsync,
        moveNode: moveNodeMutation.mutateAsync,
        editNodeData: editNodeDataMutation.mutateAsync,
        createEdge: createEdgeMutation.mutateAsync,
        deleteEdge: deleteEdgeMutation.mutateAsync,
        assignEdgeDelay: assignEdgeDelayMutation.mutateAsync,
        // Nuevas mutaciones para actualización masiva
        updateNodes: updateNodesMutation.mutateAsync,
        updateEdges: updateEdgesMutation.mutateAsync,
        setSelections: setSelections,
        clearSelections: clearSelections,
    }
}
