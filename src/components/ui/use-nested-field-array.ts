/* eslint-disable @typescript-eslint/no-unused-vars */
//React
import {
    type Dispatch,
    useCallback,
    useEffect,
    useState,
    type SetStateAction,
} from "react"

//React Hook Forms
import {
    type FieldValues,
    type Path,
    type PathValue,
    useFormContext,
} from "react-hook-form"

//Utils
import { generateId } from "~/lib/utils/formatters"

//Zod & Schemas
import { map, z } from "zod"

const flattenedFieldValueSchema = z.object({
    id: z.string(),
    parentId: z.string().optional(),
    isParent: z.boolean(),
})

//Types
type FlattenedFieldValue = z.infer<typeof flattenedFieldValueSchema>

export const useNestedFieldArray = <T extends FieldValues>(
    name: Path<T>,
    key: string,
): [
    fields: FlattenedFieldValue[],
    setFields: Dispatch<SetStateAction<FlattenedFieldValue[]>>,
] => {
    const { watch, setValue } = useFormContext<T>()
    const fieldValue = watch(name)

    type FieldValueElement<T> = {
        [K in typeof key]: PathValue<T, Path<T>>[]
    }

    type FieldValue<T> = FieldValueElement<T>[]

    const [flattenedFieldValue, setFlattenedFieldValue] = useState<
        FlattenedFieldValue[]
    >(flattenFieldValue(fieldValue))

    function flattenFieldValue(
        fieldValue: FieldValue<T>,
        parentId?: string,
    ): FlattenedFieldValue[] {
        return fieldValue.reduce(
            (accumulatedValue: FlattenedFieldValue[], value) => {
                if (!Array.isArray(value[key])) {
                    accumulatedValue.push({
                        id: generateId(),
                        parentId,
                        isParent: false,
                        ...value,
                    })
                }

                if (Array.isArray(value[key]) && value[key].length > 0) {
                    const id = generateId()
                    const nestedValues = flattenFieldValue(value[key], id)

                    accumulatedValue.push({
                        id,
                        parentId: undefined,
                        isParent: true,
                        ...value,
                    })

                    accumulatedValue.push(...nestedValues)
                }

                return accumulatedValue
            },
            [],
        )
    }

    const unflattenFieldValue = useCallback(
        (flattenedArray: FlattenedFieldValue[], key: string): FieldValue<T> => {
            type FlattenedFieldValueMap = FlattenedFieldValue & {
                children: FlattenedFieldValue[]
            }

         
            const flattenedArrayMap = new Map<string, FlattenedFieldValueMap>(
                flattenedArray.map((value) => [
                    value.id,
                    { ...value, children: [] },
                ]),
            )

            const fieldValue: FieldValue<T> = []

            flattenedArray.forEach((value) => {
                if (value.parentId) {
                    const parent = flattenedArrayMap.get(value.parentId)!
                    parent.children.push(value)
                }
            })

            flattenedArrayMap.forEach((mapValue) => {
                const { id, parentId, children, isParent, ...value } = mapValue
                if (mapValue.isParent) {
                    const valueChildren: PathValue<T, Path<T>>[] = children.map(
                        (child) => {
                            const {
                                id,
                                parentId,
                                children,
                                isParent,
                                ...childValue
                            } = child as FlattenedFieldValueMap

                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            return childValue as PathValue<T, Path<T>>
                        },
                    )

                    fieldValue.push({ ...value, [key]: valueChildren })
                } 

                if(!mapValue.isParent && mapValue.parentId === undefined){
                    fieldValue.push(value)
                }
            })

            return fieldValue
        },
        [],
    )

    useEffect(() => {
        const value = unflattenFieldValue(
            flattenedFieldValue,
            key,
        ) as PathValue<T, Path<T>>

        setValue(name, value)
    }, [flattenedFieldValue, key, name, setValue, unflattenFieldValue])

    return [flattenedFieldValue, setFlattenedFieldValue]
}
