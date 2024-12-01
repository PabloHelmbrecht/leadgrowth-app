"use client"

//UI
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"

//Icons
import { CopySimple } from "@phosphor-icons/react/dist/ssr"

//NextJS
import { useParams } from "next/navigation"

//Utils
import { useSelectorReducerAtom } from "~/lib/utils/reducerAtom"
import { makeId } from "~/lib/utils/formatters"

//Atoms and Reducers
import {
  sequencesMockDataAtom,
  nodeSelectorReducer,
} from "~/lib/stores/mockData"
import { useState } from "react"

export function CloneNodeAction({ nodeId }: { nodeId: string }) {
  const { id: sequenceId } = useParams<{ id: string }>()

  const [nodes, setNodes] = useSelectorReducerAtom(
    sequencesMockDataAtom,
    nodeSelectorReducer(sequenceId),
  )

  const { toast } = useToast()

  const [offset, setOffset] = useState(50)

  function onClone() {
    try {
      const clonedNodeId = makeId(4).toUpperCase()

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
