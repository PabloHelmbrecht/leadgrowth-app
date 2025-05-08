"use client"

//UI
import { DialogConstructor as DialogConstructorPrimitive } from "~/components/layout/dialog-constructor"

import { useMultiDialog } from "~/components/ui/multi-dialog"

//NextJS
import { useParams } from "next/navigation"

//React Hook Form & Form Resolver
import { type DefaultValues as FormDefaultValues } from "react-hook-form"

//Zod & Schemas
import { type infer as ZodInfer, type ZodSchema } from "zod"

//Hooks
import { useWorkflows, type Node } from "~/lib/hooks/use-workflows"

//React
import { useMemo } from "react"

export function DialogConstructor<
    SchemaType extends ZodSchema<Node["data"]>,
    DefaultValues extends FormDefaultValues<ZodInfer<SchemaType>>,
>({
    nodeId,
    ...props
}: {
    schema: SchemaType
    nodeId: string
    title?: string
    description?: string
    children?: React.ReactNode
}) {
    const [, setOpen] = useMultiDialog("dialog")
    const { id: workflowId } = useParams<{ id: string }>()
    const { data: workflows, editNodeData } = useWorkflows({
        workflowId,
        nodeId,
    })

    const nodeData = useMemo(() => {
        return workflows?.[0]?.flow?.nodes.find(({ id }) => id === nodeId)?.data
    }, [workflows, nodeId])

    function handleSubmit(submitData: ZodInfer<SchemaType>) {
        void editNodeData({
            data: props.schema?.parse({ ...nodeData, ...submitData }),
        })
        setOpen(false)
    }

    return (
        <DialogConstructorPrimitive
            onSubmit={handleSubmit}
            defaultValues={nodeData as DefaultValues}
            {...props}
        >
            {props.children}
        </DialogConstructorPrimitive>
    )
}
