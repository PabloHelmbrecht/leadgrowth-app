"use client"

//UI
import { DialogConstructor as DialogConstructorPrimitive } from "~/components/layout/dialog-constructor"

import { useMultiDialog } from "~/components/ui/multi-dialog"

//NextJS
import { useParams } from "next/navigation"

//React Hook Form & Form Resolver
import { type DefaultValues as FormDefaultValues } from "react-hook-form"

//Atoms and Reducers
import { workflowsMockDataAtom } from "~/lib/stores/mockData/workflow"
import type { Node } from "~/lib/stores/mockData/flow"

//Zod & Schemas
import { type infer as ZodInfer, type ZodSchema } from "zod"

//Utils
import {
    useSelectorReducerAtom,
    uniqueNodeSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"

export function DialogConstructor<
    SchemaType extends ZodSchema<Node["data"]>,
    DefaultValues extends FormDefaultValues<ZodInfer<SchemaType>>,
>(props: {
    schema: SchemaType
    nodeId: string
    title?: string
    description?: string
    children?: React.ReactNode
}) {
    const [, setOpen] = useMultiDialog("dialog")
    const { id: workflowId } = useParams<{ id: string }>()
    const [node, setNode] = useSelectorReducerAtom(
        workflowsMockDataAtom,
        uniqueNodeSelectorReducer(workflowId, props.nodeId),
    )

    function handleSubmit(submitData: ZodInfer<SchemaType>) {
        setNode((node) => ({
            ...node,
            data: props.schema?.parse({ ...node.data, ...submitData }),
        }))
        setOpen(false)
    }

    return (
        <DialogConstructorPrimitive
            onSubmit={handleSubmit}
            defaultValues={node?.data as DefaultValues}
            {...props}
        >
            {props.children}
        </DialogConstructorPrimitive>
    )
}
