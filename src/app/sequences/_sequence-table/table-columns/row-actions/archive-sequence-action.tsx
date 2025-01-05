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

import { type Sequence, tagSchema } from "~/lib/stores/mockData"

//Atom and Jotai
import { sequencesMockDataAtom } from "~/lib/stores/mockData"
import { useAtom } from "jotai"

const tableMetaSchema = z.object({
    getTags: z.function().returns(z.array(tagSchema)),
    setSequenceData: z
        .function()
        .args(z.string(), z.string(), z.unknown())
        .returns(z.void()),
    cloneSequence: z.function().args(z.string()),
    archiveSequence: z.function().args(z.string()),
})

export function ArchiveSequenceAction({
    row,
    table,
}: CellContext<Sequence, unknown>) {
    const { toast } = useToast()
    const [sequencesMockData, setSequencesMockData] = useAtom(
        sequencesMockDataAtom,
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
                            const oldSequenceMockData = sequencesMockData
                            tableMetaSchema
                                .parse(table.options.meta)
                                .archiveSequence(row.id)

                            toast({
                                title: "Sequence deleted",
                                description: `The selected sequence was successfully deleted from the table`,
                                action: (
                                    <ToastAction
                                        altText="Undo action"
                                        onClick={() =>
                                            setSequencesMockData(
                                                oldSequenceMockData,
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
