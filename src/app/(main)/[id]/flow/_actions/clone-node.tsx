"use client"

//UI
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

//Icons
import { CopySimple } from "@phosphor-icons/react/dist/ssr"

//NextJS
import { useParams } from "next/navigation"
//Atoms and Reducers
import { useState } from "react"

//Hooks
import { useWorkflows } from "~/lib/hooks/use-workflows"

export function CloneNode({ nodeId }: { nodeId: string }) {
    const { id: workflowId } = useParams<{ id: string }>()

    const { duplicateNode, deleteNode } = useWorkflows({ workflowId, nodeId })

    const { toast } = useToast()

    const [offset, setOffset] = useState(100)

    async function onClone() {
        try {
            const {
                newNode: { id: clonedNodeId },
            } = await duplicateNode({
                offset: { x: offset, y: offset },
            })

            setOffset(offset + 100)

            toast({
                title: "Workflow cloned",
                description: `The node #${clonedNodeId} was created`,
                action: (
                    <ToastAction
                        altText="Goto schedule to undo"
                        onClick={() => undoOnClone(clonedNodeId)}
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
                            void onClone()
                        }}
                    >
                        Try again
                    </ToastAction>
                ),
            })
        }
    }

    function undoOnClone(nodeId: string) {
        void deleteNode({ nodeId })

        toast({
            title: "Action undone",
            description: "The cloned node was deleted",
        })
    }

    return (
        <CopySimple
            onClick={onClone}
            weight="bold"
            height={14}
            width={14}
            className="premium-transition cursor-pointer hover:text-primary-700"
        />
    )
}
