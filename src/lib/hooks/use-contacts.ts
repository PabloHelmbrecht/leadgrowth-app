import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type { TablesUpdate, Tables } from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

type Action = Tables<"actions"> & {
    nodes: Pick<Tables<"nodes">, "id" | "type"> | null
    events: Tables<"events">[]
}

// Tipos
export interface Contact extends Tables<"contacts"> {
    events: Tables<"events">[]
    executions: Tables<"executions">[]
    company: Tables<"companies"> | null
    actions: Action[]
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    stage: Tables<"contacts_stages"> | null
    custom_fields: Record<string, unknown>
}
export type ContactUpdate = TablesUpdate<"contacts">

// Utilidad para la queryKey
function getContactsQueryKey({
    teamId,
    contactId,
    workflowId,
}: {
    teamId: string
    contactId?: string
    workflowId?: string
}) {
    return [
        "contacts",
        {
            teamId,
            ...(contactId ? { recordId: contactId } : {}),
            ...(workflowId ? { workflowId: workflowId } : {}),
        },
    ]
}

/**
 * Hook para consultar y mutar contactos.
 * @param contactId Opcional, filtra por ID específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useContacts({
    contactId,
    injectedTeamId,
    workflowId,
}: {
    contactId?: string
    injectedTeamId?: string
    workflowId?: string
}) {
    // Permite inyectar teamId o usar cookie
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!
    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Validación temprana: no ejecutar si falta teamId
    const enabled = Boolean(teamId)
    const queryKey = teamId ? getContactsQueryKey({ teamId, contactId }) : []

    // Query principal: todos los contactos o uno específico
    const { data, ...rest } = useQuery<Contact[] | Contact | null>({
        queryKey,
        queryFn: async () => {
            if (!teamId)
                throw new Error("Falta teamId para consultar contactos.")
            let query = client
                .from("contacts")
                .select(
                    `*,
                    custom_fields:contacts_custom_fields(custom_fields),
                    actions:actions(*, events:events(*), nodes(*)),
                    executions!inner(*),
                    company:companies(*),
                    stage:contacts_stages(*)
                `,
                )
                .eq("team_id", teamId)
                .order("created_at", { ascending: false })
            if (contactId) query = query.eq("id", contactId)
            if (workflowId)
                query = query.eq("executions.workflow_id", workflowId)
            const { data, error } = await query

            const dataParsed = data?.map((contact) => {
                return {
                    ...contact,
                    events:
                        contact.actions?.flatMap((action) => action.events) ??
                        [],
                    custom_fields: contact.custom_fields.reduce(
                        (acc, { custom_fields }) => ({
                            ...acc,
                            ...(custom_fields as Record<string, unknown>),
                        }),
                        {},
                    ),
                    actions: workflowId
                        ? contact.actions?.filter(
                              (action) => action.workflow_id === workflowId,
                          )
                        : contact.actions,
                    execution: workflowId
                        ? contact.executions?.filter(
                              (execution) =>
                                  execution.workflow_id === workflowId,
                          )
                        : contact.executions,
                }
            })
            if (error) throw error
            if (contactId) return dataParsed ?? null
            return dataParsed ?? []
        },
        enabled,
    })

    // Mutación (update/upsert) con manejo optimista
    const updateMutation = useMutation({
        mutationFn: async (input: ContactUpdate) => {
            if (!teamId)
                throw new Error("Falta teamId para actualizar contacto.")
            const { id, ...rest } = input
            const upsertId = contactId ?? id
            if (!upsertId) throw new Error("Falta id para upsert de contacto.")
            const upsertData = {
                ...rest,
                id: upsertId,
                team_id: input.team_id ?? teamId,
            }
            const { error } = await client.from("contacts").upsert([upsertData])
            if (error) throw error
        },
        onMutate: async (newData: ContactUpdate) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getContactsQueryKey({ teamId }),
            })
            await queryClient.cancelQueries({
                queryKey: getContactsQueryKey({ teamId, contactId }),
            })
            const previousGeneral = queryClient.getQueryData<Contact[]>(
                getContactsQueryKey({ teamId }),
            )
            const previousSpecific = contactId
                ? queryClient.getQueryData<Contact>(
                      getContactsQueryKey({ teamId, contactId }),
                  )
                : undefined
            const updateFn = (old?: Contact[]) => {
                if (!old) return old
                return old.map((item) =>
                    item.id === (newData.id ?? contactId)
                        ? {
                              ...item,
                              ...newData,
                              team_id: newData.team_id ?? teamId,
                          }
                        : item,
                )
            }
            queryClient.setQueryData<Contact[]>(
                getContactsQueryKey({ teamId }),
                updateFn,
            )
            if (contactId) {
                queryClient.setQueryData<Contact>(
                    getContactsQueryKey({ teamId, contactId }),
                    (old) =>
                        old && old.id === (newData.id ?? contactId)
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
                | { previousGeneral?: Contact[]; previousSpecific?: Contact }
                | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getContactsQueryKey({ teamId }),
                    context.previousGeneral,
                )
            }
            if (contactId && context?.previousSpecific) {
                queryClient.setQueryData(
                    getContactsQueryKey({ teamId, contactId }),
                    context.previousSpecific,
                )
            }
            toast({
                title: "Error al actualizar el contacto",
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
                queryKey: getContactsQueryKey({ teamId }),
            })
            if (contactId) {
                await queryClient.invalidateQueries({
                    queryKey: getContactsQueryKey({ teamId, contactId }),
                })
            }
        },
    })

    // Crear contacto
    const createMutation = useMutation({
        mutationFn: async (input: Omit<ContactUpdate, "id">) => {
            if (!teamId) throw new Error("Falta teamId para crear contacto.")
            const { data, error } = await client
                .from("contacts")
                .insert([{ ...input, team_id: teamId }])
                .select()
                .single()
            if (error) throw error
            return data
        },
        onMutate: async (input: Omit<ContactUpdate, "id">) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getContactsQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Contact[]>(
                getContactsQueryKey({ teamId }),
            )
            const tempId = crypto.randomUUID()
            const tempContact: Partial<Contact> = {
                ...input,
                id: tempId,
                team_id: teamId,
            }
            queryClient.setQueryData<Contact[]>(
                getContactsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return [tempContact as Contact, ...old]
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _input,
            context: { previous?: Contact[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getContactsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear contacto",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getContactsQueryKey({ teamId }),
            })
        },
    })

    // Eliminar contacto
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!teamId) throw new Error("Falta teamId para eliminar contacto.")
            const { error } = await client
                .from("contacts")
                .delete()
                .eq("id", id)
            if (error) throw error
            return id
        },
        onMutate: async (id: string) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getContactsQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Contact[]>(
                getContactsQueryKey({ teamId }),
            )
            queryClient.setQueryData<Contact[]>(
                getContactsQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.filter((contact) => contact.id !== id)
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _id,
            context: { previous?: Contact[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getContactsQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al eliminar contacto",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getContactsQueryKey({ teamId }),
            })
        },
    })

    // --- MUTACIONES DE ACCIÓN (React Query) ---
    // Agregar contacto a un workflow
    /**
     * Agrega un contacto a un workflow.
     * @param params.contactId ID del contacto
     * @param params.workflowId ID del workflow
     * @param params.currentStep ID del nodo inicial del workflow (obligatorio)
     * @param params.status Estado del contacto en el workflow (por defecto 'active')
     */
    const addToWorkflowMutation = useMutation({
        mutationFn: async ({
            contactId,
            workflowId,
            currentStep,
            status = "active",
        }: {
            contactId: string
            workflowId: string
            currentStep: string
            status?:
                | "active"
                | "paused"
                | "unsubscribed"
                | "bounced"
                | "spam"
                | "finished"
        }) => {
            if (!teamId)
                throw new Error(
                    "Falta teamId para agregar contacto a workflow.",
                )
            if (!contactId || !workflowId || !currentStep)
                throw new Error(
                    "Faltan IDs obligatorios para la relación contacto-workflow.",
                )
            const { error } = await client.from("executions").insert({
                contact_id: contactId,
                workflow_id: workflowId,
                current_step: currentStep,
                status,
            })
            if (error) throw error
        },
        onError: (err: unknown) => {
            toast({
                title: "Error al agregar contacto al workflow",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
    })

    /**
     * Remueve un contacto de un workflow.
     * @param params.contactId ID del contacto
     * @param params.workflowId ID del workflow
     */
    const removeFromWorkflowMutation = useMutation({
        mutationFn: async ({
            contactId,
            workflowId,
        }: {
            contactId: string
            workflowId: string
        }) => {
            if (!teamId)
                throw new Error(
                    "Falta teamId para remover contacto de workflow.",
                )
            if (!contactId || !workflowId)
                throw new Error(
                    "Faltan IDs para la relación contacto-workflow.",
                )
            const { error } = await client
                .from("executions")
                .delete()
                .eq("contact_id", contactId)
                .eq("workflow_id", workflowId)
            if (error) throw error
        },
        onError: (err: unknown) => {
            toast({
                title: "Error al remover contacto del workflow",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
    })

    return {
        ...rest,
        data,
        update: updateMutation.mutateAsync,
        create: createMutation.mutateAsync,
        remove: removeMutation.mutateAsync,
        addToWorkflow: addToWorkflowMutation.mutateAsync,
        removeFromWorkflow: removeFromWorkflowMutation.mutateAsync,
    }
}
