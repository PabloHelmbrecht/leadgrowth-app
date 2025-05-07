import { type CellContext } from "@tanstack/react-table"

//UI
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

//Zod & Schemas & Types
import { type Workflow, useWorkflows } from "~/lib/hooks/use-workflows"

export function ArchiveWorkflowAction({ row }: CellContext<Workflow, unknown>) {
    const { toast } = useToast()

    const { archive, update, data } = useWorkflows({ workflowId: row.id })

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={async () => {
                        try {
                            const oldStatus = data?.[0]?.status

                            await archive({})
                            toast({
                                title: "Workflow deleted",
                                description: `The selected workflow was successfully deleted from the table`,
                                action: (
                                    <ToastAction
                                        altText="Undo action"
                                        onClick={() =>
                                            update({
                                                status: oldStatus ?? "paused",
                                            })
                                        }
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
                                    "There was a problem with your request.",
                            })
                        }
                    }}
                    className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
