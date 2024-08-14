//Icons
import {
  EnvelopeSimple,
  Clock,
  CheckCircle,
  WarningCircle,
  Eye,
  CopySimple,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr"

import { type Node, type NodeProps, Position } from "@xyflow/react"
import { Handle } from "../_handles/handle"

type TextNode = Node<{ label: string }, "custom">

export function DefaultNode({ data }: NodeProps<TextNode>) {
  return (
    <div className=" flex w-96 flex-col overflow-hidden rounded border-2 bg-white  text-sm transition-colors group-[.selected]:border-primary-700   ">
      <div className=" !z-20 flex flex-col items-center justify-start gap-4 !border-none bg-white p-4   ">
        <div className="flex w-full items-center justify-start gap-2 ">
          <div className="aspect-square h-fit w-fit flex-initial rounded-md bg-success-100 p-1 text-success-600">
            <EnvelopeSimple
              weight="bold"
              width={16}
              height={16}
              className="aspect-square"
            />
          </div>
          <div className="flex-1 font-semibold">{data.label}</div>
          <div className="flex-initial text-xs font-semibold text-neutral-500">
            Step 1
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-100 p-2">
          <div>
            first_name, quiero hacer una alianza estratégica contigo | Empresas
            S.A.
          </div>
          <div className="flex items-center justify-start gap-3">
            <div className="flex items-center gap-1 text-xs font-bold">
              <Clock weight="bold" height={14} width={14} />
              121
            </div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <CheckCircle weight="bold" height={14} width={14} />
              455
            </div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <WarningCircle weight="bold" height={14} width={14} />
              34
            </div>
          </div>
        </div>
        <div className="flex w-full flex-initial items-center justify-between text-xs font-semibold text-neutral-500">
          <div className="premium-transition flex items-center gap-1 hover:text-primary-700">
            <Eye weight="bold" height={14} width={14} />
            Ver métricas
          </div>
          <div className="flex items-center gap-3">
            <CopySimple
              weight="bold"
              height={14}
              width={14}
              className="premium-transition  hover:text-primary-700"
            />
            <PencilSimple
              weight="bold"
              height={14}
              width={14}
              className="premium-transition  hover:text-primary-700"
            />
            <Trash
              weight="bold"
              height={14}
              width={14}
              className="premium-transition  hover:text-danger-500"
            />
          </div>
        </div>
      </div>

      <Handle type="source" id={"default"} position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  )
}
