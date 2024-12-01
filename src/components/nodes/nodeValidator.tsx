"use client"

//NextJS
import { useParams } from "next/navigation"

//Zod & Schemas
import { nodeTypesDataSchemas } from "~/app/sequences/[id]/flow/_nodes/node-types"

//Atoms and Reducers
import {
  sequencesMockDataAtom,
  uniqueNodeSelectorReducer,
} from "~/lib/stores/mockData"

//Utils
import { useSelectorReducerAtom } from "~/lib/utils/reducerAtom"

export function useNodeValidator(nodeId: string, isComplete: boolean) {
  const { id: sequenceId } = useParams<{ id: string }>()

  const [node, setNode] = useSelectorReducerAtom(
    sequencesMockDataAtom,
    uniqueNodeSelectorReducer(sequenceId, nodeId),
  )

  const dataSchema = nodeTypesDataSchemas[String(node?.type)]

  const data = dataSchema?.safeParse(node?.data)

  if (!data?.success) return

  if (isComplete !== node?.data.isComplete) {
    setNode((node) => ({ ...node, data: { ...node.data, isComplete } }))
  }
}
