//Icons
import {
  EnvelopeSimple,
  Clock,
  CheckCircle,
  WarningCircle,
  Eye,
  PencilSimple,
  Trash,
} from "@phosphor-icons/react/dist/ssr"

//UI
import { MultiDialogProvider } from "~/components/ui/multi-dialog"
import { EmailComposer } from "~/components/nodes/email-composer"
import { DeleteNodeDialog } from "~/components/nodes/delete-node-dialog"
import { CloneNodeAction } from "~/components/nodes/clone-node-action"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

//React Flow
import { type Node, type NodeProps, Position } from "@xyflow/react"

//Handles
import { Handle } from "../_handles/handle"

//Utils
import { reduceText } from "~/lib/utils/formatters"

//Zod
import { z } from "zod"
import { useNodeValidator } from "~/components/nodes/nodeValidator"
import { cn } from "~/lib/utils/classesMerge"

//Schemas
import { emailComposerSchema } from "~/lib/stores/mockData"

const type = "manualEmail"
export const manualEmailDataSchema = z.object({
  subject: z.string(),
  body: z.string(),
  isReply: z.boolean().default(false).optional(),
  includeSignature: z.boolean().default(false).optional(),
  pending: z.number().optional(),
  finished: z.number().optional(),
  errors: z.number().optional(),
  isComplete: z.boolean().optional(),
})
export type ManualEmailNode = Node<
  z.infer<typeof manualEmailDataSchema>,
  typeof type
>

//Types
enum dialogs {
  Edit = 1,
  Delete = 2,
}

export function ManualEmailNode({ data, id }: NodeProps<ManualEmailNode>) {
  try {
    const schemass = emailComposerSchema.safeParse(data)

    const isComplete = schemass.success
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useNodeValidator(id, isComplete)

    console.log({ schemass })
    console.log({ data })
  } catch (e) {
    console.error(`Error validating node ${id}`)
  }

  return (
    <div
      className={cn(
        "group flex w-96 flex-col overflow-hidden rounded border-2 bg-white  text-sm transition-colors group-[.selected]:border-primary-700   ",
        !data.isComplete &&
          "danger border-danger-400 group-[.selected]:border-danger-400",
      )}
    >
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
          <div className="flex-1 font-semibold">Manual Email</div>
          {data.isComplete ? (
            <div className="flex-initial text-xs font-semibold text-neutral-500">
              {`#${id}`}
            </div>
          ) : (
            <div className="h-full flex-col items-start justify-start">
              <Tooltip>
                <TooltipTrigger asChild>
                  <WarningCircle
                    className="text-danger-500"
                    weight="fill"
                    height={24}
                    width={24}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className=" w-36 text-pretty">
                    Complete all the field required for this step
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="flex w-full flex-col items-start gap-4 rounded bg-neutral-100 p-2">
          <div className="flex flex-col items-start gap-1">
            <span className={data.isReply ? "italic" : "font-semibold"}>
              {data.isReply
                ? "Reply email"
                : data.subject || "Type an email subject"}
            </span>
            <span>
              {reduceText(data.body || "Here goes your email body", 60)}
            </span>
          </div>
          <div className="flex items-center justify-start gap-3">
            <div className="flex items-center gap-1 text-xs font-bold">
              <Clock weight="bold" height={14} width={14} />
              {data.pending ?? 0}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <CheckCircle weight="bold" height={14} width={14} />
              {data.finished ?? 0}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold">
              <WarningCircle weight="bold" height={14} width={14} />
              {data.errors ?? 0}
            </div>
          </div>
        </div>
        <div className="flex w-full flex-initial items-center justify-between text-xs font-semibold text-neutral-500">
          <div className="premium-transition flex items-center gap-1 hover:text-primary-700">
            <Eye weight="bold" height={14} width={14} />
            Ver métricas
          </div>
          <MultiDialogProvider<dialogs>>
            {({ Trigger, Container }) => (
              <div className="flex items-center gap-3">
                <CloneNodeAction nodeId={id} />
                <Trigger value={dialogs.Edit} variant={"dialog"}>
                  <PencilSimple
                    weight="bold"
                    height={14}
                    width={14}
                    className="premium-transition  hover:text-primary-700"
                  />
                </Trigger>
                <Trigger value={dialogs.Delete} variant={"alert"}>
                  <Trash
                    weight="bold"
                    height={14}
                    width={14}
                    className="premium-transition  hover:text-danger-500"
                  />
                </Trigger>

                <Container value={dialogs.Edit} variant={"dialog"}>
                  <EmailComposer nodeId={id} />
                </Container>
                <Container value={dialogs.Delete} variant={"alert"}>
                  <DeleteNodeDialog nodeId={id} />
                </Container>
              </div>
            )}
          </MultiDialogProvider>
        </div>
      </div>

      <Handle
        type="source"
        id={"default"}
        nodeId={id}
        position={Position.Bottom}
      />
      <Handle type="target" nodeId={id} position={Position.Top} />
    </div>
  )
}