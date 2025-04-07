//Zod
import { z } from "zod"

//Entities Schemas
import { contactSchema } from "../stores/mockData/contact"
import { workflowSchema } from "../stores/mockData/workflow"

//Constants
import {
    supportedContactFields,
    supportedCompanyFields,
    supportedWorkflowFields,
} from "../constants/fields"
import { supportedOperators } from "../constants/operators"
import type { supportedEntityTypes } from "../constants/schemas"

//Utils
import { getZodType } from "../utils/zod-utils"
import { useCallback, useMemo } from "react"

export function useAdvancedFilter(entityType: supportedEntityTypes) {
    const entities = useMemo(
        () => ({
            contact: {
                schema: contactSchema,
                fields: supportedContactFields,
            },
            company: {
                schema: z.object({}),
                fields: supportedCompanyFields,
            },
            workflow: {
                schema: workflowSchema,
                fields: supportedWorkflowFields,
            },
        }),
        [],
    )

    const entity = useMemo(() => entities[entityType], [entities, entityType])

    const getFields = useCallback(() => entity.fields, [entity.fields])

    const getFieldType = useCallback(
        (field: keyof typeof entity.schema.shape) => {
            const fieldType = getZodType(entity.schema.shape[field])
            return fieldType
        },
        [entity],
    )

    const getOperators = useCallback(
        (field: keyof typeof entity.schema.shape) => {
            const fieldType = getFieldType(field)
            return supportedOperators[fieldType]
        },
        [entity, getFieldType],
    )

    return {
        getFields,
        getOperators,
        getFieldType,
    }
}
