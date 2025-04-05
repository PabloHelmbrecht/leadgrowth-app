"use client"

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

//NextJS
import { useParams } from "next/navigation"

//Utils
import {
    useSelectorReducerAtom,
    nodeSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"

//Atoms and Reducers
import { sequencesMockDataAtom } from "~/lib/stores/mockData/sequence"

export function DeleteNode({ nodeId }: { nodeId: string }) {
    const { id: sequenceId } = useParams<{ id: string }>()

    const [nodes, setNodes] = useSelectorReducerAtom(
        sequencesMockDataAtom,
        nodeSelectorReducer(sequenceId),
    )

    const { toast } = useToast()

    function onDelete() {
        try {
            const oldNodes = structuredClone(nodes)
            setNodes((nodes) => nodes.filter((node) => node.id !== nodeId))

            toast({
                title: "Node deleted",
                description: `The selected node were successfully deleted from the sequence`,
                action: (
                    <ToastAction
                        altText="Undo action"
                        onClick={() => setNodes(oldNodes)}
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
                description: "There was a problem with your request.",
            })
        }
    }

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the node and remove the data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Delete</AlertDialogCancel>
                <AlertDialogAction
                    onClick={onDelete}
                    className="bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90"
                >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
