"use client"

//UI
import { Button } from "~/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import { Form } from "~/components/ui/form"

import { useMultiDialog } from "~/components/ui/multi-dialog"

//NextJS
import { useParams } from "next/navigation"

//React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useForm,
    type DefaultValues as FormDefaultValues,
} from "react-hook-form"

//Atoms and Reducers
import {
    sequencesMockDataAtom,
    uniqueNodeSelectorReducer,
    type Node,
} from "~/lib/stores/mockData"

//Zod & Schemas
import { type infer as ZodInfer, type ZodSchema } from "zod"

//Utils
import { useSelectorReducerAtom } from "~/lib/utils/reducerAtom"

export function DialogConstructor<
    SchemaType extends ZodSchema<Node["data"]>,
    DefaultValues extends FormDefaultValues<ZodInfer<SchemaType>>,
>({
    schema,
    nodeId,
    title,
    description,
    children,
}: {
    schema: SchemaType
    nodeId: string
    title?: string
    description?: string
    children?: React.ReactNode
}) {
    const [, setOpen] = useMultiDialog("dialog")
    const { id: sequenceId } = useParams<{ id: string }>()
    const [node, setNode] = useSelectorReducerAtom(
        sequencesMockDataAtom,
        uniqueNodeSelectorReducer(sequenceId, nodeId),
    )

    const form = useForm<ZodInfer<SchemaType>>({
        resolver: zodResolver(schema),
        defaultValues: node?.data as DefaultValues,
    })

    function handleSubmit(submitData: ZodInfer<SchemaType>) {
        setNode((node) => ({
            ...node,
            data: schema?.parse({ ...node.data, ...submitData }),
        }))
        setOpen(false)
    }

    return (
        <DialogContent aria-describedby="header" className="sm:max-w-[800px]">
            <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && (
                    <DialogDescription>{description}</DialogDescription>
                )}
            </DialogHeader>
            <Form {...form}>
                {children}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={form.handleSubmit(handleSubmit)}
                    >
                        Save
                    </Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    )
}
