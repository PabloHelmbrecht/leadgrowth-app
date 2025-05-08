//Zod & Types
import type {
    supportedEntityTypes,
    supportedInputTypes,
} from "../schemas/advanced-filter"

//Constants
import {
    supportedContactFields,
    supportedCompanyFields,
    supportedWorkflowFields,
} from "../constants/fields"
import { supportedOperators } from "../schemas/operators"

import { useCallback } from "react"

// Mapas de tipos de campo para cada entidad
const contactFieldTypes: Record<string, supportedInputTypes> = {
    first_name: "string",
    last_name: "string",
    email: "string",
    phone: "string",
    company: "string", // Podría ser un objeto, pero para filtro es string (nombre o id)
    stage: "string", // Id o nombre de stage
    created_at: "date",
}

const companyFieldTypes: Record<string, supportedInputTypes> = {
    name: "string",
    status: "string",
}

const workflowFieldTypes: Record<string, supportedInputTypes> = {
    name: "string",
    status: "string",
}

const entityFieldTypes: Record<
    supportedEntityTypes,
    Record<string, supportedInputTypes>
> = {
    contact: contactFieldTypes,
    company: companyFieldTypes,
    workflow: workflowFieldTypes,
}

const entityFields: Record<
    supportedEntityTypes,
    { label: string; value: string }[]
> = {
    contact: supportedContactFields,
    company: supportedCompanyFields,
    workflow: supportedWorkflowFields,
}

export function useAdvancedFilter(entityType: supportedEntityTypes) {
    // Devuelve los campos soportados para la entidad
    const getFields = useCallback(() => entityFields[entityType], [entityType])

    // Devuelve el tipo de campo (string, number, date, etc) para un campo dado
    const getFieldType = useCallback(
        (field: string): supportedInputTypes => {
            return entityFieldTypes[entityType][field] ?? "unknown"
        },
        [entityType],
    )

    // Devuelve los operadores soportados para el tipo de campo
    const getOperators = useCallback(
        (field: string) => {
            const fieldType = getFieldType(field)
            return supportedOperators[fieldType]
        },
        [getFieldType],
    )

    return {
        getFields,
        getOperators,
        getFieldType,
    }
}
