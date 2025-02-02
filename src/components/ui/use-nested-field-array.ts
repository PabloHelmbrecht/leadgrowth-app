/* eslint-disable @typescript-eslint/no-unused-vars */
//React
import {
    type Dispatch,
    useCallback,
    useEffect,
    useState,
    type SetStateAction,
    useMemo,
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
export type FlattenedFieldValue = z.infer<typeof flattenedFieldValueSchema>

export const useNestedFieldArray = <T extends FieldValues>(
    name: Path<T>,
    key: string,
): [
    fields: FlattenedFieldValue[],
    setFields: Dispatch<SetStateAction<FlattenedFieldValue[]>>,
] => {
    type FieldValueElement<T> = {
        [K in typeof key]: PathValue<T, Path<T>>[]
    }
    type FieldValue<T> = FieldValueElement<T>[]

    const { watch, setValue } = useFormContext<T>()
    const fieldValue = watch(name)

    const flattenFieldValue = useCallback(
        (
            fieldValue: FieldValue<T>,
            parentId?: string,
        ): FlattenedFieldValue[] => {
            return fieldValue.reduce(
                (accumulatedValue: FlattenedFieldValue[], value, index) => {
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
        },
        [key],
    )

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

                if (!mapValue.isParent && mapValue.parentId === undefined) {
                    fieldValue.push(value)
                }
            })

            return fieldValue
        },
        [],
    )

    const [flattenedFieldValue, setFlattenedFieldValue] = useState<
        FlattenedFieldValue[]
    >(flattenFieldValue(fieldValue))

    useEffect(() => {
        const value = unflattenFieldValue(
            flattenedFieldValue,
            key,
        ) as PathValue<T, Path<T>>

        setValue(name, value)
    }, [flattenedFieldValue, key, name, setValue, unflattenFieldValue])

    return [flattenedFieldValue, setFlattenedFieldValue]
}

export const useNestedFieldArrayItem = (
    items: FlattenedFieldValue[],
    setItems: Dispatch<SetStateAction<FlattenedFieldValue[]>>,
    id: string,
): [
    item: FlattenedFieldValue | undefined,
    setItem: Dispatch<SetStateAction<FlattenedFieldValue>>,
] => {
    const item: FlattenedFieldValue | undefined = useMemo(
        () => items.find((item) => item.id === id),
        [items, id],
    )

    const setItem: Dispatch<SetStateAction<FlattenedFieldValue>> = useCallback(
        (
            newItem:
                | FlattenedFieldValue
                | ((item: FlattenedFieldValue) => FlattenedFieldValue),
        ) => {
            const newItems = items.map((item) => {
                if (item.id === id) {
                    return newItem instanceof Function ? newItem(item) : newItem
                }

                return item
            })

            setItems(newItems)
        },
        [id, items, setItems],
    )

    return [item, setItem]
}
