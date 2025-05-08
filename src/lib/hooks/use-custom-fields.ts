import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { createClient } from "../supabase/client"
import { useCookie } from "~/lib/hooks/use-cookie"
import type {
    Tables,
    TablesUpdate,
    TablesInsert,
    Enums,
} from "../supabase/database.types"
import { useToast } from "~/components/ui/use-toast"

const client = createClient()

// Tipos para custom fields y valores
export type CustomField = Tables<"custom_fields">
export type CustomFieldUpdate = TablesUpdate<"custom_fields">
export type CustomFieldInsert = TablesInsert<"custom_fields">
export type CustomFieldValue = Tables<"custom_field_values">
export type CustomFieldValueUpdate = TablesUpdate<"custom_field_values">
export type CustomFieldValueInsert = TablesInsert<"custom_field_values">
export type EntityType = Enums<"entity_type">
export type FieldType = Enums<"field_type">

// Utilidad para la queryKey
export function getCustomFieldsQueryKey({
    teamId,
    entityType,
    fieldId,
}: {
    teamId: string
    entityType?: EntityType
    fieldId?: string
}) {
    return [
        "custom_fields",
        {
            teamId,
            ...(entityType ? { entityType } : {}),
            ...(fieldId ? { fieldId } : {}),
        },
    ]
}

export function getCustomFieldValuesQueryKey({
    teamId,
    entityType,
    fieldId,
}: {
    teamId: string
    entityType: EntityType
    fieldId: string
}) {
    return ["custom_field_values", { teamId, entityType, fieldId }]
}

/**
 * Hook para gestionar campos personalizados (custom fields) y sus valores.
 * Permite consultar, crear, actualizar y eliminar campos, así como consultar y actualizar valores para una entidad.
 * @param entityType Tipo de entidad ("contact", "company", "workflow")
 * @param entityId Opcional, id de la entidad para consultar/actualizar valores
 * @param fieldId Opcional, id de campo específico
 * @param injectedTeamId Opcional, permite inyectar teamId (por defecto usa cookie)
 */
export function useCustomFields({
    entityType,
    fieldId,
    injectedTeamId,
}: {
    entityType: EntityType
    fieldId?: string
    injectedTeamId?: string
}) {
    const { cookie: cookieTeamId } = useCookie("team_id")
    const teamId = injectedTeamId ?? cookieTeamId!
    const queryClient = useQueryClient()
    const { toast } = useToast()

    // Validación temprana
    const enabled = Boolean(teamId && entityType)
    const fieldsQueryKey = teamId
        ? getCustomFieldsQueryKey({ teamId, entityType, fieldId })
        : []

    // Query: obtener campos personalizados para la entidad
    const { data, ...fieldsRest } = useQuery<CustomField[]>({
        queryKey: fieldsQueryKey,
        queryFn: async () => {
            if (!teamId)
                throw new Error("Falta teamId para consultar custom fields.")
            let query = client
                .from("custom_fields")
                .select("*")
                .eq("team_id", teamId)
                .eq("entity_type", entityType)
                .order("created_at", { ascending: true })
            if (fieldId) query = query.eq("id", fieldId)
            const { data, error } = await query
            if (error) throw error
            return data || []
        },
        enabled,
    })

    // Mutación: crear/actualizar campo personalizado
    const upsertFieldMutation = useMutation({
        mutationFn: async (input: CustomFieldInsert) => {
            if (!teamId)
                throw new Error("Falta teamId para upsert de custom field.")
            if (!input.field_type)
                throw new Error("Falta field_type para el campo personalizado.")
            const upsertData: CustomFieldInsert = {
                ...input,
                team_id: input.team_id ?? teamId,
                entity_type: entityType,
                field_type: input.field_type,
                created_at: input.created_at ?? new Date().toISOString(),
                is_required: input.is_required ?? false,
                label: input.label ?? "",
                options: input.options ?? null,
                node_id: input.node_id ?? null,
                workflow_id: input.workflow_id ?? null,
                creator_id: input.creator_id ?? null,
            }
            const { error } = await client
                .from("custom_fields")
                .upsert([upsertData])
            if (error) throw error
        },
        onMutate: async (input) => {
            await queryClient.cancelQueries({ queryKey: fieldsQueryKey })
            const previous =
                queryClient.getQueryData<CustomField[]>(fieldsQueryKey)
            // Optimista: actualiza o agrega
            queryClient.setQueryData<CustomField[]>(fieldsQueryKey, (old) => {
                if (!old) return old
                const idx = old.findIndex((f) => f.id === input.id)
                const newField: CustomField = {
                    ...input,
                    id: input.id ?? crypto.randomUUID(),
                    team_id: input.team_id ?? teamId,
                    entity_type: entityType,
                    field_type: input.field_type,
                    created_at: input.created_at ?? new Date().toISOString(),
                    is_required: input.is_required ?? false,
                    label: input.label ?? "",
                    options: input.options ?? null,
                    node_id: input.node_id ?? null,
                    workflow_id: input.workflow_id ?? null,
                    creator_id: input.creator_id ?? null,
                }
                if (idx >= 0) {
                    return old.map((f, i) => (i === idx ? newField : f))
                }
                return [newField, ...old]
            })
            return { previous }
        },
        onError: (
            err,
            _input,
            context: { previous?: CustomField[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(fieldsQueryKey, context.previous)
            }
            toast({
                title: "Error al guardar campo personalizado",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: fieldsQueryKey })
        },
    })

    // Mutación: eliminar campo personalizado
    const removeFieldMutation = useMutation({
        mutationFn: async (id: string) => {
            if (!teamId)
                throw new Error("Falta teamId para eliminar custom field.")
            const { error } = await client
                .from("custom_fields")
                .delete()
                .eq("id", id)
            if (error) throw error
            return id
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: fieldsQueryKey })
            const previous =
                queryClient.getQueryData<CustomField[]>(fieldsQueryKey)
            queryClient.setQueryData<CustomField[]>(fieldsQueryKey, (old) => {
                if (!old) return old
                return old.filter((f) => f.id !== id)
            })
            return { previous }
        },
        onError: (
            err,
            _id,
            context: { previous?: CustomField[] } | undefined,
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(fieldsQueryKey, context.previous)
            }
            toast({
                title: "Error al eliminar campo personalizado",
                description:
                    err instanceof Error
                        ? err.message
                        : "Ocurrió un error inesperado.",
                variant: "destructive",
            })
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: fieldsQueryKey })
        },
    })

    return {
        // Campos personalizados
        data,
        ...fieldsRest,
        upsert: upsertFieldMutation.mutateAsync,
        remove: removeFieldMutation.mutateAsync,
    }
}
