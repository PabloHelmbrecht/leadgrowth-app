"use client"

// Tanstack Table
import { type CellContext } from "@tanstack/react-table"

// UI
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"
import { Button } from "~/components/ui/button"
import { useToast } from "~/components/ui/use-toast"
import { useMultiDialog } from "~/components/ui/multi-dialog"
import { WorkflowInput } from "~/components/layout/form/workflow-input"

// Zod & Schemas & Types & Hooks
import { z } from "zod"
import { useWorkflows } from "~/lib/hooks/use-workflows"
import { useContacts, type Contact } from "~/lib/hooks/use-contacts"

// React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const addToSequenceFormSchema = z.object({
    workflowIds: z.array(
        z.string().uuid({
            message: "Debes seleccionar una secuencia válida.",
        }),
    ),
})

export function AddToSequenceAction({ row }: CellContext<Contact, unknown>) {
    const form = useForm<z.infer<typeof addToSequenceFormSchema>>({
        resolver: zodResolver(addToSequenceFormSchema),
        defaultValues: {
            workflowIds: [],
        },
    })

    const [, setOpen] = useMultiDialog("dialog")
    const { toast } = useToast()
    const { addToWorkflow } = useContacts({ contactId: row.id })

    async function onSubmit(values: z.infer<typeof addToSequenceFormSchema>) {
        try {
            await addToWorkflow({
                contactId: row.id,
                workflowId: values.workflowIds,
            })
            toast({
                title: "Contacto agregado a la secuencia",
                description: `El contacto fue agregado correctamente a la secuencia.`,
            })
            setOpen(null)
        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "Error al agregar a la secuencia",
                description:
                    error instanceof Error
                        ? error.message
                        : "Ocurrió un error inesperado.",
            })
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id={`add-to-sequence-form-${row.id}`}
                className="space-y-8"
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Agregar a secuencia</DialogTitle>
                        <DialogDescription>
                            Selecciona la secuencia a la que deseas agregar este
                            contacto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-8">
                        <FormField
                            control={form.control}
                            name="workflowIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Secuencia</FormLabel>

                                    <WorkflowInput
                                        field={field}
                                        form={form}
                                        nameKey={"workflowIds"}
                                    />

                                    <FormDescription>
                                        Elige la secuencia (workflow) a la que
                                        se agregará el contacto.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            form={`add-to-sequence-form-${row.id}`}
                        >
                            Agregar a secuencia
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Form>
    )
}
