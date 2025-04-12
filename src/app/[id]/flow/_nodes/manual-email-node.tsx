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
import { EmailComposer } from "../_dialogs"
import { DeleteNode, CloneNode } from "../_actions"
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

//Hooks
import { useNodePosition } from "~/lib/hooks/use-node-position"

//Zod
import { z } from "zod"
import { cn } from "~/lib/utils/classesMerge"

//Schemas
import { emailComposerSchema } from "../_dialogs/email-composer"

const type = "manualEmail"
export const emailDataSchema = z.object({
    subject: z.string(),
    body: z.string(),
    isReply: z.boolean().default(false).optional(),
    includeSignature: z.boolean().default(false).optional(),
    pending: z.number().optional(),
    finished: z.number().optional(),
    errors: z.number().optional(),
})
export type ManualEmailNode = Node<z.infer<typeof emailDataSchema>, typeof type>

//Types
enum dialogs {
    Edit = 1,
    Delete = 2,
}

export function ManualEmailNode({ data, id }: NodeProps<ManualEmailNode>) {
    const { success: isComplete } = emailComposerSchema.safeParse(data)

    const nodePosition = useNodePosition(id)

    return (
        <div
            className={cn(
                "group flex w-[30rem] flex-col overflow-hidden rounded-xl border-2   text-sm transition-colors group-[.selected]:border-primary-700   ",
                !isComplete &&
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
                    {isComplete ? (
                        <div className="flex-initial text-xs font-semibold text-neutral-500">
                            {`#${nodePosition}`}
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
                                        Complete all the field required for this
                                        step
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )}
                </div>
                <div className="flex w-full flex-col items-start gap-4 rounded-md bg-neutral-100 p-2">
                    <div className="flex flex-col items-start gap-1">
                        <span
                            className={
                                data.isReply ? "italic" : "font-semibold"
                            }
                        >
                            {data.isReply
                                ? "Reply email"
                                : data.subject || "Type an email subject"}
                        </span>
                        <span>
                            {reduceText(
                                data.body || "Here goes your email body",
                                60,
                            )}
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
                            <WarningCircle
                                weight="bold"
                                height={14}
                                width={14}
                            />
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
                                <CloneNode nodeId={id} />
                                <Trigger
                                    value={dialogs.Edit}
                                    variant={"dialog"}
                                >
                                    <PencilSimple
                                        weight="bold"
                                        height={14}
                                        width={14}
                                        className="premium-transition  hover:text-primary-700"
                                    />
                                </Trigger>
                                <Trigger
                                    value={dialogs.Delete}
                                    variant={"alert"}
                                >
                                    <Trash
                                        weight="bold"
                                        height={14}
                                        width={14}
                                        className="premium-transition  hover:text-danger-500"
                                    />
                                </Trigger>

                                <Container
                                    value={dialogs.Edit}
                                    variant={"dialog"}
                                >
                                    <EmailComposer nodeId={id} />
                                </Container>
                                <Container
                                    value={dialogs.Delete}
                                    variant={"alert"}
                                >
                                    <DeleteNode nodeId={id} />
                                </Container>
                            </div>
                        )}
                    </MultiDialogProvider>
                </div>
            </div>

            <Handle type="source" id={"default"} position={Position.Bottom} />
            <Handle type="target" position={Position.Top} />
        </div>
    )
}
