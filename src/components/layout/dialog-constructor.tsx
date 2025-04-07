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

//React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import {
    useForm,
    type FieldValues,
    type DefaultValues as FormDefaultValues,
} from "react-hook-form"

//Zod & Schemas
import { type infer as ZodInfer, type ZodSchema } from "zod"

export function DialogConstructor<
    Data extends FieldValues,
    SchemaType extends ZodSchema<Data>,
    DefaultValues extends FormDefaultValues<ZodInfer<SchemaType>>,
>({
    schema,
    title,
    description,
    children,
    onSubmit,
    defaultValues,
}: {
    schema: SchemaType
    title?: string
    description?: string
    children?: React.ReactNode
    onSubmit: (data: ZodInfer<SchemaType>) => void
    defaultValues: DefaultValues
}) {
    const [, setOpen] = useMultiDialog("dialog")

    const form = useForm<ZodInfer<SchemaType>>({
        resolver: zodResolver(schema),
        defaultValues,
    })

    return (
        <DialogContent
            aria-describedby="header"
            className="sm:max-w-[900px]"
            onWheel={(e) => e.stopPropagation()}
        >
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
                    <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                        Save
                    </Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    )
}
