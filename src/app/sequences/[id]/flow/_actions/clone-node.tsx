"use client"

//UI
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

//Icons
import { CopySimple } from "@phosphor-icons/react/dist/ssr"

//NextJS
import { useParams } from "next/navigation"

//Utils
import {
    useSelectorReducerAtom,
    nodeSelectorReducer,
} from "~/lib/hooks/use-selector-reducer-atom"
import { generateId } from "~/lib/utils/formatters"

//Atoms and Reducers
import { sequencesMockDataAtom } from "~/lib/stores/mockData/sequence"
import { useState } from "react"

export function CloneNode({ nodeId }: { nodeId: string }) {
    const { id: sequenceId } = useParams<{ id: string }>()

    const [nodes, setNodes] = useSelectorReducerAtom(
        sequencesMockDataAtom,
        nodeSelectorReducer(sequenceId),
    )

    const { toast } = useToast()

    const [offset, setOffset] = useState(50)

    function onClone() {
        try {
            const clonedNodeId = generateId()

            const foundNode = nodes.find((node) => node.id === nodeId)

            if (!foundNode) return

            setNodes((nodes) => [
                ...nodes,
                {
                    ...foundNode,
                    id: clonedNodeId,
                    position: {
                        x: foundNode.position.x + offset,
                        y: foundNode.position.y + offset,
                    },
                },
            ])

            setOffset(offset + 50)

            toast({
                title: "Sequence cloned",
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
                            onClone()
                        }}
                    >
                        Try again
                    </ToastAction>
                ),
            })
        }
    }

    function undoOnClone(nodeId: string) {
        setNodes((nodes) => nodes.filter((node) => node.id !== nodeId))

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
            className="premium-transition  hover:text-primary-700"
        />
    )
}
