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
import { z } from "zod"

import { type Workflow, tagSchema } from "~/lib/stores/mockData/workflow"

//Atom and Jotai
import { workflowsMockDataAtom } from "~/lib/stores/mockData/workflow"
import { useAtom } from "jotai"

const tableMetaSchema = z.object({
    getTags: z.function().returns(z.array(tagSchema)),
    setWorkflowData: z
        .function()
        .args(z.string(), z.string(), z.unknown())
        .returns(z.void()),
    cloneWorkflow: z.function().args(z.string()),
    archiveWorkflow: z.function().args(z.string()),
})

export function ArchiveWorkflowAction({
    row,
    table,
}: CellContext<Workflow, unknown>) {
    const { toast } = useToast()
    const [workflowsMockData, setWorkflowsMockData] = useAtom(
        workflowsMockDataAtom,
    )

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
                    onClick={() => {
                        try {
                            const oldWorkflowMockData = workflowsMockData
                            tableMetaSchema
                                .parse(table.options.meta)
                                .archiveWorkflow(row.id)

                            toast({
                                title: "Workflow deleted",
                                description: `The selected workflow was successfully deleted from the table`,
                                action: (
                                    <ToastAction
                                        altText="Undo action"
                                        onClick={() =>
                                            setWorkflowsMockData(
                                                oldWorkflowMockData,
                                            )
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
                    className="bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90"
                >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
