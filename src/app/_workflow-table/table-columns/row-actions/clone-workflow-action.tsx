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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandTagsGroup,
    CommandTag,
    CommandTagSimple,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { useMultiDialog } from "~/components/ui/multi-dialog"

//Icons
import { CaretDown, Star, Check } from "@phosphor-icons/react/dist/ssr"

//Class Merge & id Maker
import { cn } from "~/lib/utils/classesMerge"
import { generateId } from "~/lib/utils/formatters"

//Atoms & Jotai
import { useAtom } from "jotai"
import {
    ownersMockDataAtom,
    workflowsMockDataAtom,
    tagsMockDataAtom,
} from "~/lib/stores/mockData/workflow"

//Zod & Schemas & Types
import { z } from "zod"
import { type Workflow, workflowSchema } from "~/lib/stores/mockData/workflow"

const cloneWorkflowFormSquema = z.object({
    name: workflowSchema.shape.name.min(2, {
        message: "Name must be at least 2 characters.",
    }),
    tag: workflowSchema.shape.tag,
    owner: workflowSchema.shape.owner.min(1, {
        message: "Workflow must have an owner",
    }),
})

//React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import {
    type ControllerRenderProps,
    useForm,
    type UseFormReturn,
} from "react-hook-form"
import { useState } from "react"

export function CloneWorkflowAction({ row }: CellContext<Workflow, unknown>) {
    const form = useForm<z.infer<typeof cloneWorkflowFormSquema>>({
        resolver: zodResolver(cloneWorkflowFormSquema),
        defaultValues: {
            name: `${String(row.getValue("name"))} - Copy`,
            tag: row.getValue("tag"),
            owner: row.getValue("owner"),
        },
    })

    const [, setOpen] = useMultiDialog("dialog")
    const { toast } = useToast()
    const [, setWorkflowsMockData] = useAtom(workflowsMockDataAtom)

    function onSubmit(values: z.infer<typeof cloneWorkflowFormSquema>) {
        try {
            const clonedWorkflowId = generateId()
            setWorkflowsMockData((oldWorkflowMockData) => {
                const ogWorkflow = oldWorkflowMockData.find(
                    (workflow) => workflow.id === row.id,
                )

                if (ogWorkflow === undefined) {
                    console.error(`Workflow ${row.id} not found`)
                    return oldWorkflowMockData
                }

                return [
                    ...oldWorkflowMockData,
                    {
                        ...ogWorkflow,
                        ...values,
                        id: clonedWorkflowId,
                    },
                ]
            })

            setOpen(null)

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
        } catch (e) {
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
        }
    }

    function undoClonedWorkflow(id: string) {
        setWorkflowsMockData((oldWorkflowMockData) =>
            oldWorkflowMockData.filter((workflow) => workflow.id !== id),
        )

        toast({
            title: "Action undone",
            description: "The cloned workflow was deleted",
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
                            name="tag"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-0 ">
                                    <FormLabel className="pb-1">Tags</FormLabel>

                                    <TagInput field={field} form={form} />

                                    <FormDescription>
                                        This are your cloned tags.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="owner"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-0 ">
                                    <FormLabel className="pb-1">
                                        Owner
                                    </FormLabel>

                                    <OwnerInput field={field} form={form} />

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

export function TagInput({
    field,
    form,
}: {
    field: ControllerRenderProps<z.infer<typeof cloneWorkflowFormSquema>, "tag">
    form: UseFormReturn<z.infer<typeof cloneWorkflowFormSquema>>
}) {
    //Mock data
    const [tagsMockData] = useAtom(tagsMockDataAtom)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl className="hover:bg-white">
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "flex h-11 max-w-full flex-wrap justify-start overflow-hidden ",
                            !field.value && "text-muted-foreground",
                        )}
                    >
                        <div className="flex h-full flex-1 flex-row flex-wrap gap-2 overflow-hidden">
                            {field.value.map((currentValue) => (
                                <CommandTagSimple
                                    key={currentValue}
                                    className="flex items-center justify-start gap-2 "
                                    onClick={() =>
                                        form.setValue(
                                            "tag",
                                            field.value.filter(
                                                (item) => item !== currentValue,
                                            ),
                                        )
                                    }
                                >
                                    {currentValue === "starred" ? (
                                        <Star
                                            size={14}
                                            weight="fill"
                                            className=" -mx-[3px]"
                                            style={{
                                                color:
                                                    tagsMockData.find(
                                                        (item) =>
                                                            item.value ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className=" aspect-square w-2 rounded-full bg-neutral-500"
                                            style={{
                                                backgroundColor:
                                                    tagsMockData.find(
                                                        (item) =>
                                                            item.value ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    )}
                                    {
                                        tagsMockData.find(
                                            (item) =>
                                                item.value === currentValue,
                                        )?.label
                                    }
                                </CommandTagSimple>
                            ))}
                        </div>

                        <CaretDown
                            width={16}
                            height={16}
                            weight="bold"
                            className="aspect-square min-w-4 flex-initial"
                            alt={"see all tags button"}
                        />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput placeholder="Search tags..." />
                    {field.value.length !== 0 && (
                        <CommandTagsGroup>
                            {field.value.map((currentValue) => (
                                <CommandTag
                                    key={currentValue}
                                    onClick={() =>
                                        form.setValue(
                                            "tag",
                                            field.value.filter(
                                                (item) => item !== currentValue,
                                            ),
                                        )
                                    }
                                    className="flex items-center justify-start gap-2"
                                >
                                    {currentValue === "starred" ? (
                                        <Star
                                            size={14}
                                            weight="fill"
                                            className=" -mx-[3px]"
                                            style={{
                                                color:
                                                    tagsMockData.find(
                                                        (item) =>
                                                            item.value ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className=" aspect-square w-2 rounded-full bg-neutral-500"
                                            style={{
                                                backgroundColor:
                                                    tagsMockData.find(
                                                        (item) =>
                                                            item.value ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    )}
                                    {
                                        tagsMockData.find(
                                            (item) =>
                                                item.value === currentValue,
                                        )?.label
                                    }
                                </CommandTag>
                            ))}
                        </CommandTagsGroup>
                    )}
                    <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>

                        <CommandGroup>
                            {tagsMockData
                                .filter(
                                    (tag) => !field.value.includes(tag.value),
                                )
                                .map((tag) => (
                                    <CommandItem
                                        key={tag.value}
                                        value={tag.value}
                                        onSelect={(currentValue) => {
                                            if (
                                                !field.value.includes(
                                                    currentValue,
                                                )
                                            ) {
                                                form.setValue("tag", [
                                                    ...new Set([
                                                        ...field.value,
                                                        currentValue,
                                                    ]),
                                                ])
                                            } else {
                                                form.setValue(
                                                    "tag",
                                                    field.value.filter(
                                                        (item) =>
                                                            item !==
                                                            currentValue,
                                                    ),
                                                )
                                            }
                                        }}
                                        className="flex items-center justify-start gap-2"
                                    >
                                        {tag.value === "starred" ? (
                                            <Star
                                                size={14}
                                                weight="fill"
                                                className=" -mx-[3px]"
                                                style={{
                                                    color:
                                                        tagsMockData.find(
                                                            (item) =>
                                                                item.value ===
                                                                tag.value,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className=" aspect-square w-2 rounded-full bg-neutral-500"
                                                style={{
                                                    backgroundColor:
                                                        tagsMockData.find(
                                                            (item) =>
                                                                item.value ===
                                                                tag.value,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        )}
                                        {tag.label}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export function OwnerInput({
    field,
    form,
}: {
    field: ControllerRenderProps<
        z.infer<typeof cloneWorkflowFormSquema>,
        "owner"
    >
    form: UseFormReturn<z.infer<typeof cloneWorkflowFormSquema>>
}) {
    //Mock data
    const [ownersMockData] = useAtom(ownersMockDataAtom)

    const [open, setOpen] = useState<boolean>(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "flex h-11 max-w-full flex-wrap justify-start overflow-hidden ",
                            !field.value && "text-muted-foreground",
                        )}
                    >
                        <div className="flex flex-1 items-center justify-start font-normal">
                            {field.value
                                ? ownersMockData.find(
                                      (owner) => owner.value === field.value,
                                  )?.label
                                : "Select owner"}
                        </div>
                        <CaretDown
                            width={16}
                            height={16}
                            weight="bold"
                            className="aspect-square min-w-4 flex-initial"
                            alt={"see all button"}
                        />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
                <Command>
                    <CommandInput
                        placeholder="Search owner..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No owner found.</CommandEmpty>
                        <CommandGroup>
                            {ownersMockData.map((owner) => (
                                <CommandItem
                                    value={owner.label}
                                    key={owner.value}
                                    onSelect={() => {
                                        form.setValue("owner", owner.value)
                                        setOpen(false)
                                    }}
                                >
                                    {owner.label}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            owner.value === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
