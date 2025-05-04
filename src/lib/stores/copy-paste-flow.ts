import { atom } from "jotai"

//Types
import type { Node, Edge } from "../hooks/use-workflows"

//Atoms
export const copyPasteFlowAtom = atom<{ nodes: Node[]; edges: Edge[] }>({
    nodes: [],
    edges: [],
})
