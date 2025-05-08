"use client"

//UI
import {
    Dialog,
    DialogTrigger,
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

//Icons
import { Plus } from "@phosphor-icons/react/dist/ssr"

//Hooks
import { useWorkflows } from "~/lib/hooks/use-workflows"

//Zod & Schemas & Types
import { z } from "zod"

const addWorkflowSchema = z.object({
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

//React
import { useState } from "react"

export function AddWorkflow() {
    const form = useForm<z.infer<typeof addWorkflowSchema>>({
        resolver: zodResolver(addWorkflowSchema),
        defaultValues: {
            tags: [],
        },
    })

    const { toast } = useToast()

    const { create, archive } = useWorkflows({})

    const [open, setOpen] = useState<boolean>(false)

    function onSubmit(values: z.infer<typeof addWorkflowSchema>) {
        create({ ...values, status: "paused" })
            .then((newWorkflowId) => {
                toast({
                    title: "Workflow created",
                    description: `The workflow ${values.name} was created`,
                    action: (
                        <ToastAction
                            altText="Goto schedule to undo"
                            onClick={() => undoCreateWorkflow(newWorkflowId)}
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

        setOpen(false)
    }

    async function undoCreateWorkflow(id: string) {
        await archive({ workflowId: id })

        toast({
            title: "Action undone",
            description: "The cloned workflow was archived",
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <div>
                <DialogTrigger asChild>
                    <Button className="flex h-fit items-center justify-between gap-2 p-2 text-sm font-normal ">
                        <Plus
                            size={16}
                            weight="bold"
                            alt={"config workflow button"}
                        />
                        Add new workflow
                    </Button>
                </DialogTrigger>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        id={`form-create-workflow`}
                        className="space-y-8"
                    >
                        <DialogContent className="sm:max-w-[525px]">
                            <DialogHeader>
                                <DialogTitle>Create Workflow</DialogTitle>
                                <DialogDescription>
                                    Create a new workflow here. Click create
                                    workflow when youre done.
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
                                                This is your new workflow name.
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
                                            <FormLabel className="pb-1">
                                                Tags
                                            </FormLabel>
                                            <TagInput
                                                field={field}
                                                form={form}
                                                nameKey="tags"
                                            />
                                            <FormDescription>
                                                This are your workflow tags.
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
                                                This is the new workflow owner.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    form={`form-create-workflow`}
                                >
                                    Create Workflow
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </form>
                </Form>
            </div>
        </Dialog>
    )
}
