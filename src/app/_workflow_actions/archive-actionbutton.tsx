"use client"

//UI
import { Button } from "~/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//Icons
import { Archive } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { rowSelectionAtom } from "~/lib/stores/workflow-table"
import { useWorkflows, type Workflow } from "~/lib/hooks/use-workflows"
import { useRef } from "react"

export function ArchiveActionButton() {
    const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)
    const { archive, update, data: workflows } = useWorkflows({})
    const { toast } = useToast()
    const prevWorkflowsRef = useRef<Record<string, Workflow["status"]>>({})

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1   transition-all hover:bg-red-500 hover:text-neutral-50",
                        Object.keys(rowSelection).length === 0 && "hidden",
                    )}
                >
                    <Archive
                        width={16}
                        height={16}
                        weight="bold"
                        className="aspect-square min-w-4"
                        alt={"config workflow button"}
                    />
                    Archive Workflows
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will archive the
                        selected workflows.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={async () => {
                            const idRowsSelected = Object.keys(
                                rowSelection,
                            ).filter((id) => rowSelection[id])
                            try {
                                // 1. Guardar estado previo de los workflows seleccionados
                                prevWorkflowsRef.current = (
                                    workflows ?? []
                                ).reduce(
                                    (acc, wf) => {
                                        if (idRowsSelected.includes(wf.id)) {
                                            acc[wf.id] = wf.status
                                        }
                                        return acc
                                    },
                                    {} as Record<string, Workflow["status"]>,
                                )
                                // 2. Archivar
                                await archive(
                                    idRowsSelected.map((id) => ({
                                        workflowId: id,
                                    })),
                                )
                                setRowSelection({})
                                toast({
                                    title: "Workflows archived",
                                    description: `The selected workflows were successfully archived.`,
                                    action: (
                                        <ToastAction
                                            altText="Undo action"
                                            onClick={async () => {
                                                await update(
                                                    Object.entries(
                                                        prevWorkflowsRef.current,
                                                    ).map(([id, status]) => ({
                                                        id,
                                                        status,
                                                    })),
                                                )
                                                toast({
                                                    title: "Undo successful",
                                                    description:
                                                        "The workflows were restored to their previous state.",
                                                })
                                            }}
                                        >
                                            Undo
                                        </ToastAction>
                                    ),
                                })
                            } catch (e) {
                                console.error(e)
                                toast({
                                    variant: "destructive",
                                    title: "Uh oh! Something went wrong.",
                                    description:
                                        "There was a problem archiving the workflows.",
                                })
                            }
                        }}
                        className="bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90"
                    >
                        Archive
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
