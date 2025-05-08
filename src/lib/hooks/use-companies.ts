import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type { TablesUpdate, Tables } from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

// Tipos
export interface Company extends Tables<"companies"> {
    custom_fields: Record<string, unknown>
}
export type CompanyUpdate = TablesUpdate<"companies">

// Utilidad para la queryKey
function getCompaniesQueryKey({
    teamId,
    companyId,
    workflowId,
}: {
    teamId: string
    companyId?: string
    workflowId?: string
}) {
    return [
        "companies",
        {
            teamId,
            ...(companyId ? { recordId: companyId } : {}),
            ...(workflowId ? { workflowId: workflowId } : {}),
        },
    ]
}

/**
 * Hook para consultar y mutar contactos.
 * @param contactId Opcional, filtra por ID específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useCompanies({
    companyId,
    injectedTeamId,
}: {
    companyId?: string
    injectedTeamId?: string
}) {
    // Permite inyectar teamId o usar cookie
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!
    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Validación temprana: no ejecutar si falta teamId
    const enabled = Boolean(teamId)
    const queryKey = teamId ? getCompaniesQueryKey({ teamId, companyId }) : []

    // Query principal: todos los contactos o uno específico
    const { data, ...rest } = useQuery<Company[]>({
        queryKey,
        queryFn: async () => {
            if (!teamId)
                throw new Error("Falta teamId para consultar empresas.")
            let query = client
                .from("companies")
                .select(
                    `*,
                    custom_fields:companies_custom_fields(custom_fields)
                `,
                )
                .eq("team_id", teamId)
                .order("created_at", { ascending: false })
            if (companyId) query = query.eq("id", companyId)

            const { data, error } = await query

            const dataParsed = data?.map((company) => {
                return {
                    ...company,
                    custom_fields: (
                        company.custom_fields as {
                            custom_fields: Record<string, unknown>
                        }[]
                    ).reduce(
                        (acc: Record<string, unknown>, { custom_fields }) => ({
                            ...acc,
                            ...custom_fields,
                        }),
                        {},
                    ),
                }
            })
            if (error) throw error
            return dataParsed ?? []
        },
        enabled,
    })

    // Mutación (update/upsert) con manejo optimista
    const updateMutation = useMutation({
        mutationFn: async (input: CompanyUpdate) => {
            if (!teamId)
                throw new Error("Falta teamId para actualizar empresa.")
            const { id, ...rest } = input
            const upsertId = companyId ?? id
            if (!upsertId) throw new Error("Falta id para upsert de empresa.")
            const upsertData = {
                ...rest,
                id: upsertId,
                team_id: input.team_id ?? teamId,
            }
            const { error } = await client
                .from("companies")
                .upsert([upsertData])
            if (error) throw error
        },
        onMutate: async (newData: CompanyUpdate) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getCompaniesQueryKey({ teamId }),
            })
            await queryClient.cancelQueries({
                queryKey: getCompaniesQueryKey({ teamId, companyId }),
            })
            const previousGeneral = queryClient.getQueryData<Company[]>(
                getCompaniesQueryKey({ teamId }),
            )
            const previousSpecific = companyId
                ? queryClient.getQueryData<Company>(
                      getCompaniesQueryKey({ teamId, companyId }),
                  )
                : undefined
            const updateFn = (old?: Company[]) => {
                if (!old) return old
                return old.map((item) =>
                    item.id === (newData.id ?? companyId)
                        ? {
                              ...item,
                              ...newData,
                              team_id: newData.team_id ?? teamId,
                          }
                        : item,
                )
            }
            queryClient.setQueryData<Company[]>(
                getCompaniesQueryKey({ teamId }),
                updateFn,
            )
            if (companyId) {
                queryClient.setQueryData<Company>(
                    getCompaniesQueryKey({ teamId, companyId }),
                    (old) =>
                        old && old.id === (newData.id ?? companyId)
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
                | { previousGeneral?: Company[]; previousSpecific?: Company }
                | undefined,
        ) => {
            if (context?.previousGeneral) {
                queryClient.setQueryData(
                    getCompaniesQueryKey({ teamId }),
                    context.previousGeneral,
                )
            }
            if (companyId && context?.previousSpecific) {
                queryClient.setQueryData(
                    getCompaniesQueryKey({ teamId, companyId }),
                    context.previousSpecific,
                )
            }
            toast({
                title: "Error al actualizar la empresa",
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
                queryKey: getCompaniesQueryKey({ teamId }),
            })
            if (companyId) {
                await queryClient.invalidateQueries({
                    queryKey: getCompaniesQueryKey({ teamId, companyId }),
                })
            }
        },
    })

    // Crear contacto
    const createMutation = useMutation({
        mutationFn: async (input: Omit<CompanyUpdate, "id">) => {
            if (!teamId) throw new Error("Falta teamId para crear empresa.")
            const { data, error } = await client
                .from("companies")
                .insert([{ ...input, team_id: teamId }])
                .select()
                .single()
            if (error) throw error
            return data
        },
        onMutate: async (input: Omit<CompanyUpdate, "id">) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getCompaniesQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Company[]>(
                getCompaniesQueryKey({ teamId }),
            )
            const tempId = crypto.randomUUID()
            const tempContact: Partial<Company> = {
                ...input,
                id: tempId,
                team_id: teamId,
            }
            queryClient.setQueryData<Company[]>(
                getCompaniesQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return [tempContact as Company, ...old]
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _input,
            context: { previous?: Company[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getCompaniesQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al crear empresa",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getCompaniesQueryKey({ teamId }),
            })
        },
    })

    // Eliminar contacto
    const removeMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!teamId) throw new Error("Falta teamId para eliminar empresa.")
            const { error } = await client
                .from("companies")
                .delete()
                .eq("id", id)
            if (error) throw error
            return id
        },
        onMutate: async (id: string) => {
            if (!teamId) return
            await queryClient.cancelQueries({
                queryKey: getCompaniesQueryKey({ teamId }),
            })
            const previous = queryClient.getQueryData<Company[]>(
                getCompaniesQueryKey({ teamId }),
            )
            queryClient.setQueryData<Company[]>(
                getCompaniesQueryKey({ teamId }),
                (old) => {
                    if (!old) return old
                    return old.filter((company) => company.id !== id)
                },
            )
            return { previous }
        },
        onError: (
            err: unknown,
            _id,
            context: { previous?: Company[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    getCompaniesQueryKey({ teamId }),
                    context.previous,
                )
            }
            toast({
                title: "Error al eliminar empresa",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: getCompaniesQueryKey({ teamId }),
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
