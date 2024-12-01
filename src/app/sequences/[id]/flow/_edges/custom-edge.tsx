//React
import { useMemo, useState } from "react"

//NextJS
import { useParams } from "next/navigation"

//UI
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { ToastAction } from "~/components/ui/toast"
import { useToast } from "~/components/ui/use-toast"
import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

//Utils
import { getBezierEdgePosition } from "~/lib/utils/bezier"
import { numberToLetters } from "~/lib/utils/formatters"
import { useSelectorReducerAtom } from "~/lib/utils/reducerAtom"

//React Flow
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react"

//React Hook Form & Form Resolver
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

//Icons
import { ClockCountdown, PencilSimple } from "@phosphor-icons/react/dist/ssr"

//Zod
import { z } from "zod"

//Atoms and Reducers
import {
  sequencesMockDataAtom,
  uniqueEdgeSelectorReducer,
} from "~/lib/stores/mockData"

//Schemas & Types
const timeUnitsLabels = ["hours", "days", "weeks"] as const
const timeUnitsValues = ["hours", "days", "weeks"] as const
const timeUnits = timeUnitsValues.map((t, i) => ({
  label: timeUnitsLabels[i],
  value: t,
}))
export const customDataSchema = z.object({
  delay: z.number(),
  unit: z.enum(timeUnitsValues),
  order: z.number().optional(),
})

export type CustomEdge = Edge<z.infer<typeof customDataSchema>, "custom">

export function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  data,
  id,
}: EdgeProps<CustomEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  //Top Label x,y position and angle calculated based on t parameter using Bezier Cubic Function
  const distanceFromSource = 30
  const diagonal = useMemo(
    () =>
      Math.sqrt(
        Math.abs(sourceX - targetX) ** 2 + Math.abs(sourceY - targetY) ** 2,
      ),
    [sourceX, sourceY, targetX, targetY],
  )
  const t = distanceFromSource / diagonal
  const [topLabelX, topLabelY] = useMemo(
    () => getBezierEdgePosition({ sourceX, sourceY, targetX, targetY, t }),
    [sourceX, sourceY, targetX, targetY, t],
  )
  const [derivativeTopLabelX, derivativeTopLabelY] = useMemo(
    () =>
      getBezierEdgePosition({ sourceX, sourceY, targetX, targetY, t: t * 1.1 }),
    [sourceX, sourceY, targetX, targetY, t],
  )

  const topLabelAngle = useMemo(
    () =>
      Math.atan(
        (topLabelY - derivativeTopLabelY) / (topLabelX - derivativeTopLabelX),
      ) +
      (topLabelX < derivativeTopLabelX ? 0 : Math.PI) -
      Math.PI / 2,

    [topLabelX, topLabelY, derivativeTopLabelX, derivativeTopLabelY],
  )

  const topLabelLetter = numberToLetters(data?.order ?? 0)

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        className=" !stroke-neutral-400 !stroke-2 transition-colors  group-[.selected]:!stroke-primary-700 "
      />

      <EdgeLabelRenderer>
        {topLabelLetter && (
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${topLabelX}px,${topLabelY}px) rotate(${topLabelAngle}rad) `,
              pointerEvents: "all",
            }}
            className="nodrag nopan absolute h-fit w-auto  rounded-md bg-neutral-100 p-2 text-xs font-semibold"
          >
            {topLabelLetter}
          </div>
        )}
        {data && (
          <DelayLabel {...data} labelX={labelX} labelY={labelY} id={id} />
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export function DelayLabel({
  delay,
  unit,
  labelX,
  labelY,
  id,
}: z.infer<typeof customDataSchema> & {
  labelX: number
  labelY: number
  id: string
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [skipDelay, setSkipDelay] = useState<boolean>(false)
  const { id: sequenceId } = useParams<{ id: string }>()
  const [, setEdge] = useSelectorReducerAtom(
    sequencesMockDataAtom,
    uniqueEdgeSelectorReducer(sequenceId, id),
  )

  const form = useForm<z.infer<typeof customDataSchema>>({
    resolver: zodResolver(customDataSchema),
    defaultValues: {
      delay,
      unit,
    },
  })

  const { toast } = useToast()

  const handleSkipDelayChange = (checked: boolean) => {
    setSkipDelay(checked)
  }

  const onSubmit = (data: z.infer<typeof customDataSchema>) => {
    try {
      setEdge((edge) => {
        if (skipDelay) {
          data.delay = 0
          data.unit = "days"
        }
        return {
          ...edge,
          data: { ...customDataSchema?.parse(edge.data), ...data },
        }
      })
      setOpen(false)
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => {
              onSubmit(data)
            }}
          >
            Try again
          </ToastAction>
        ),
      })
    }
  }

  if (delay === undefined || unit === undefined) return
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan absolute -translate-x-1/2 -translate-y-1/2"
        >
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex items-center gap-1  rounded-md bg-neutral-100 p-2 text-xs font-semibold  transition-colors hover:text-primary-700 group-[.selected]:!bg-primary-200"
          >
            {isHovered ? (
              <PencilSimple weight="bold" height={14} width={14} />
            ) : (
              <ClockCountdown weight="bold" height={14} width={14} />
            )}
            {delay === 0
              ? `immediately after`
              : `${delay} ${delay > 1 ? unit : unit.slice(0, -1)}`}
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Sequence Delay</DialogTitle>
          <DialogDescription>
            Set the delay between two steps in the sequence or choose to skip
            the delay.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipDelay"
                checked={skipDelay}
                onCheckedChange={handleSkipDelayChange}
              />
              <Label htmlFor="skipDelay">
                Skip delay and execute next step immediately
              </Label>
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="delay"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4 space-y-0 ">
                    <FormLabel className="min-w-10">Delay</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                        min={1}
                        disabled={skipDelay}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-4  space-y-0 ">
                    <FormLabel className="min-w-10">Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={skipDelay}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
