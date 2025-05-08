"use client"

//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
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
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { TagInput } from "~/components/layout/form/tag-input"
import { OwnerInput } from "~/components/layout/form/owner-input"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { useMultiDialog } from "~/components/ui/multi-dialog"

//Zod & Schemas & Types & Hooks
import { z } from "zod"
import { useWorkflows, type Workflow } from "~/lib/hooks/use-workflows"

const cloneWorkflowFormSquema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    tags: z.string().array(),
    owner_id: z.string().uuid({
        message: "Workflow must have an owner",
    }),
})

//React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

export function CloneWorkflowAction({ row }: CellContext<Workflow, unknown>) {
    const form = useForm<z.infer<typeof cloneWorkflowFormSquema>>({
        resolver: zodResolver(cloneWorkflowFormSquema),
        defaultValues: {
            name: `${row.original.name} (Copy)`,
            tags: row.original.tags?.map((tag) => tag.id ?? undefined) ?? [],
            owner_id: row.original.owner?.id ?? "",
        },
    })

    const [, setOpen] = useMultiDialog("dialog")
    const { toast } = useToast()

    const { duplicate, archive } = useWorkflows({ workflowId: row.id })

    function onSubmit(values: z.infer<typeof cloneWorkflowFormSquema>) {
        duplicate(values)
            .then((clonedWorkflowId) => {
                toast({
                    title: "Workflow cloned",
                    description: `The workflow ${values.name} was created`,
                    action: (
                        <ToastAction
                            altText="Goto schedule to undo"
                            onClick={() => undoClonedWorkflow(clonedWorkflowId)}
                        >
                            Undo
                        </ToastAction>
                    ),
                })
            })
            .catch((error) => {
                console.error(error)

                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                    action: (
                        <ToastAction
                            altText="Try again"
                            onClick={() => {
                                onSubmit(values)
                            }}
                        >
                            Try again
                        </ToastAction>
                    ),
                })
            })

        setOpen(null)
    }

    async function undoClonedWorkflow(id: string) {
        await archive({ workflowId: id })

        toast({
            title: "Action undone",
            description: "The cloned workflow was archived",
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                id={`form-${row.id}`}
                className="space-y-8"
            >
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Clone Workflow</DialogTitle>
                        <DialogDescription>
                            Make changes to your new cloned workflow here. Click
                            create workflow when youre done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Workflow Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Select a workflow name..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This is your cloned workflow name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-0 ">
                                    <FormLabel className="pb-1">Tags</FormLabel>
                                    <TagInput
                                        field={field}
                                        form={form}
                                        nameKey="tags"
                                    />
                                    <FormDescription>
                                        This are your cloned tags.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="owner_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-0 ">
                                    <FormLabel className="pb-1">
                                        Owner
                                    </FormLabel>
                                    <OwnerInput
                                        field={field}
                                        form={form}
                                        nameKey="owner_id"
                                    />
                                    <FormDescription>
                                        This is the cloned workflows owner.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" form={`form-${row.id}`}>
                            Create Workflow
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Form>
    )
}
