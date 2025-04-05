/**
 * Todo
 * - [ ]  Hacer el Drag Overlay sea más simpificado a la hora de moverlo
 * - [ ]  Configurar el SimpleFilter para que tenga un input de campo, un input de valor y un select de union
 */

/*TAREA:
-  que el dragoverlay sea correcto para simple y group
- Que el input componente tenga tres input (campo, union y valor) como Airtable
- Hacer que los botones hagan algo
*/

//React
import {
    useState,
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
    useCallback,
    useMemo,
    useEffect,
} from "react"

// import { createPortal } from "react-dom"

//Dnd Kit
import {
    DndContext as DndContextPrimitive,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    closestCorners,
    useSensors,
    useSensor,
    useDroppable,
    //DragOverlay,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
} from "@dnd-kit/core"

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

//UI
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select"
import { Button } from "~/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"
import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Calendar } from "~/components/ui/calendar"

//Icons
import {
    Trash,
    Plus,
    DotsSixVertical,
    Check,
    CaretUpDown,
    CalendarBlank,
} from "@phosphor-icons/react/dist/ssr"

//Custom Hooks
import {
    type FlattenedFieldValue,
    useNestedFieldArray,
    useNestedFieldArrayItem,
} from "~/components/ui/use-nested-field-array"

//React Hook Form
import { type FieldValues, type Path, useFormContext } from "react-hook-form"

//Utils
import { generateId } from "~/lib/utils/formatters"
import { cn } from "~/lib/utils/classesMerge"

//Hooks
import { useAdvancedFilter } from "~/lib/hooks/use-advanced-filter"
import { useDynamicNumberParser } from "~/lib/hooks/use-dynamic-number-parser"

//Zod & Schemas
import { z } from "zod"
import { durationSchema } from "~/lib/constants/schemas"
import {
    conjunctionSchema,
    simpleFilterCriteriaDataSchema,
    groupFilterCriteriaDataSchema,
} from "~/lib/stores/mockData/flow"

//Types
import type { supportedEntityTypes } from "~/lib/constants/schemas"
import type { Duration } from "~/lib/constants/schemas"
import type { conditionalOperatorsType } from "~/lib/constants/operators"

//Translation
import { useFormatter } from "next-intl"

const AdvancedFilterContext = createContext<
    | null
    | [
          FlattenedFieldValue[],
          Dispatch<SetStateAction<FlattenedFieldValue[]>>,
          supportedEntityTypes,
      ]
>(null)

export function AdvancedFilter<T extends FieldValues>({
    name,
    criteriaKey,
    entityType,
}: {
    name: Path<T>
    criteriaKey: string
    entityType: supportedEntityTypes
}) {
    const [items, setItems] = useNestedFieldArray(name, criteriaKey)

    const [, setActiveId] = useState<number | string | null>(null)

    function handleDragStart({ active }: DragStartEvent) {
        setActiveId(active.id)
    }

    function handleDragOver(event: DragOverEvent) {
        const { active, over } = event

        if (active.id === over?.id) return
        const activeIndex = items.findIndex((filter) => filter.id === active.id)
        const overIndex = items.findIndex((filter) => filter.id === over?.id)
        const overParent = items[overIndex]?.parentId

        if (!items[activeIndex]?.isParent && over && items[activeIndex])
            items[activeIndex].parentId = items[overIndex]?.isParent
                ? String(over.id)
                : overParent

        if (active.id === overParent) return

        let newIndex = overIndex ?? 0
        if (over?.id === "top") newIndex = 0
        if (over?.id === "bottom") newIndex = items.length - 1

        setItems((prev) => arrayMove(prev, activeIndex, newIndex))
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        setItems((prev) => {
            const activeIndex = prev.findIndex(
                (filter) => filter.id === active.id,
            )
            const overIndex = prev.findIndex((filter) => filter.id === over?.id)
            let newIndex = overIndex ?? 0
            if (over?.id === "top") newIndex = 0
            if (over?.id === "bottom") newIndex = items.length - 1

            setActiveId(null)
            if (activeIndex !== overIndex) {
                return arrayMove(prev, activeIndex, newIndex)
            }

            return prev
        })
    }

    // function DradOverlayComponent() {
    //     if (!activeId) return null

    //     const { id, isParent } = items.find((item) => item.id === activeId)!

    //     return isParent ? (
    //         <GroupFilter key={id} id={id} />
    //     ) : (
    //         fv
    //     )
    // }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    return (
        <AdvancedFilterContext.Provider value={[items, setItems, entityType]}>
            <div className="scroll flex  max-h-[40vh] flex-col gap-4 overflow-x-hidden overflow-y-scroll   py-2 pr-1">
                <DndContextPrimitive
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext
                        items={items.map((filter) => filter.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <SortableItem id={"top"} className="-mb-4">
                            <></>
                        </SortableItem>
                        {items
                            .filter((item) => item.parentId === undefined)
                            .map((item) => {
                                const { id, isParent } = item

                                return isParent ? (
                                    <GroupFilter key={id} id={id} />
                                ) : (
                                    <SimpleFilter key={id} id={id} />
                                )
                            })}
                        <SortableItem id={"bottom"} className="-mt-4">
                            <></>
                        </SortableItem>
                    </SortableContext>

                    {/* {createPortal(
                        <DragOverlay>{DradOverlayComponent()}</DragOverlay>,
                        document.body,
                    )} */}
                </DndContextPrimitive>
            </div>
            <FilterAdder />
        </AdvancedFilterContext.Provider>
    )
}

function SortableItem({
    children,
    id,
    className,
}: {
    children: React.ReactNode
    id: string | number
    className?: string
}) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            id={String(id)}
            className={className}
        >
            {children}
        </div>
    )
}

function GroupFilter({ id }: { id: string }) {
    const {
        attributes,
        listeners,
        setNodeRef: setNodeRefSortable,
        transform,
        transition,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    }
    const { setNodeRef } = useDroppable({ id })
    const [items, setItems, entityType] = useContext(AdvancedFilterContext)!
    const [item] = useNestedFieldArrayItem(items, setItems, id)
    const conjunction = groupFilterCriteriaDataSchema.parse(item).conjunction
    const itemsInParent = items.filter((item) => {
        return item.parentId === id
    })

    const { getFields, getOperators } = useAdvancedFilter(entityType)

    const defaultField = getFields()[0]?.value ?? null
    const defaultOperator = defaultField
        ? (getOperators(defaultField as never)?.[0]?.value ?? null)
        : null

    return (
        <div
            id={id}
            className="flex w-full flex-row gap-2"
            ref={setNodeRefSortable}
            style={style}
        >
            <JoinConditionSelector id={id} />
            <div
                ref={setNodeRef}
                className="flex-1 rounded-md border border-neutral-300 bg-neutral-200 p-2 "
            >
                <SortableContext
                    items={itemsInParent.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2">
                        <div className="flex w-full flex-row items-center gap-0 ">
                            <div className=" flex-1 pl-2 text-neutral-500">
                                {itemsInParent.length === 0
                                    ? "Drag conditions here to add them to this group"
                                    : conjunction === "AND"
                                      ? "All of the following are true…"
                                      : "Any of the following are true.."}
                            </div>
                            <div
                                className="  flex aspect-square h-full  flex-initial items-center justify-center rounded-sm bg-transparent p-2 text-neutral-800 hover:bg-neutral-300"
                                onClick={() => {
                                    setItems((prev) => [
                                        ...prev,
                                        {
                                            id: generateId(),
                                            isParent: false,
                                            parentId: id,
                                            type: "simple",
                                            field: defaultField,
                                            operator: defaultOperator,
                                            value: null,
                                        },
                                    ])
                                }}
                            >
                                <Plus weight="bold" />
                            </div>
                            <div
                                className="  flex aspect-square h-full  flex-initial items-center justify-center rounded-sm bg-transparent p-2 text-neutral-800 hover:bg-neutral-300 "
                                onClick={() => {
                                    setItems((prev) =>
                                        prev.filter(
                                            (item) =>
                                                item.id !== id &&
                                                item.parentId !== id,
                                        ),
                                    )
                                }}
                            >
                                <Trash weight="bold" />
                            </div>
                            <div
                                {...listeners}
                                {...attributes}
                                className="  flex aspect-square h-full  flex-initial items-center justify-center rounded-sm bg-transparent p-2 text-neutral-800 hover:bg-neutral-300"
                            >
                                <DotsSixVertical weight="bold" />
                            </div>
                        </div>

                        {itemsInParent?.map(({ id }) => (
                            <SimpleFilter key={id} id={id} />
                        ))}
                    </div>
                </SortableContext>
            </div>
        </div>
    )
}

function SimpleFilter({ id }: { id: string }) {
    const [, setItems] = useContext(AdvancedFilterContext)!
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
    }

    return (
        <div
            id={id}
            className="flex w-full flex-row gap-2 "
            ref={setNodeRef}
            style={style}
        >
            <JoinConditionSelector id={id} />

            <div className="flex w-fit flex-row items-center divide-x  divide-neutral-300 overflow-clip rounded-md border border-neutral-300 bg-white">
                <FieldSelector id={id} />
                <OperatorSelector id={id} />
                <ValueSelector id={id} />

                <div
                    className=" flex aspect-square items-center justify-center rounded-none bg-transparent px-2 text-neutral-800 hover:bg-neutral-100 hover:text-neutral-900"
                    onClick={() => {
                        setItems((prev) =>
                            prev.filter((item) => item.id !== id),
                        )
                    }}
                >
                    <Trash weight="bold" />
                </div>
                <div
                    className=" flex  h-full items-center justify-center rounded-none bg-transparent px-2 text-neutral-800 hover:bg-neutral-100"
                    {...attributes}
                    {...listeners}
                >
                    <DotsSixVertical weight="bold" />
                </div>
            </div>
        </div>
    )
}

function JoinConditionSelector({ id }: { id: string }) {
    const [items, setItems] = useContext(AdvancedFilterContext)!

    const [item] = useNestedFieldArrayItem(items, setItems, id)
    const [parentItem, setParentItem] = useNestedFieldArrayItem(
        items,
        setItems,
        item?.parentId ?? "",
    )

    const { watch, setValue } = useFormContext()

    const conjunctionDictionary = {
        AND: "and",
        OR: "or",
    }

    let conjunction: z.infer<typeof conjunctionSchema> =
        conjunctionSchema.parse(watch("filterCriteria.conjunction"))

    let isNotFirst =
        item && items.filter((item) => !item.parentId).indexOf(item) !== 0

    if (parentItem) {
        conjunction =
            groupFilterCriteriaDataSchema.parse(parentItem).conjunction

        isNotFirst =
            item &&
            items
                .filter((item) => item.parentId === parentItem.id)
                .indexOf(item) !== 0
    }

    if (!isNotFirst) {
        return <div className=" h-fit w-16 flex-initial px-2 py-1">Where</div>
    }

    const onValueChange = (conjunction: z.infer<typeof conjunctionSchema>) => {
        if (parentItem) {
            setParentItem((prev) => ({
                ...prev,
                conjunction,
            }))
        } else {
            setValue("filterCriteria.conjunction", conjunction)
        }
    }

    return (
        <Select value={conjunction} onValueChange={onValueChange}>
            <SelectTrigger className="h-fit w-16 border-neutral-300 px-2 py-[0.33rem] ">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {Object.entries(conjunctionDictionary).map(
                        ([key, value]) => (
                            <SelectItem key={key} value={key}>
                                {value}
                            </SelectItem>
                        ),
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

function FilterAdder() {
    const [, setItems, entityType] = useContext(AdvancedFilterContext)!
    const { getFields, getOperators } = useAdvancedFilter(entityType)

    const defaultField = getFields()[0]?.value ?? null
    const defaultOperator = defaultField
        ? (getOperators(defaultField as never)?.[0]?.value ?? null)
        : null

    return (
        <div className="flex flex-row gap-4">
            <Button
                className="flex h-fit w-fit flex-row   items-center gap-2 text-xs"
                variant={"quaternary"}
                onClick={() => {
                    setItems((prev) => [
                        ...prev,
                        {
                            id: generateId(),
                            isParent: false,
                            parentId: undefined,
                            type: "simple",
                            field: defaultField,
                            operator: defaultOperator,
                            value: null,
                        },
                    ])
                }}
            >
                <Plus weight="bold" />
                Add condition
            </Button>
            <Button
                className="flex h-fit w-fit flex-row   items-center gap-2 bg-neutral-500 text-xs"
                variant={"quaternary"}
                onClick={() => {
                    setItems((prev) => [
                        ...prev,
                        {
                            id: generateId(),
                            isParent: true,
                            parentId: undefined,
                            type: "group",
                            conjunction: "AND",
                            filters: [],
                        },
                    ])
                }}
            >
                <Plus weight="bold" />
                Add condition group
            </Button>
        </div>
    )
}

function FieldSelector({ id }: { id: string }) {
    const [items, setItems, entityType] = useContext(AdvancedFilterContext)!
    const { getFields, getOperators } = useAdvancedFilter(entityType)

    const [item, setItem] = useNestedFieldArrayItem(items, setItems, id)
    const [open, setOpen] = useState(false)

    const { field: simpleFilterField } =
        simpleFilterCriteriaDataSchema.parse(item)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="h-full w-36 justify-between rounded-none border-none p-0 px-2 text-xs"
                >
                    {simpleFilterField
                        ? getFields().find(
                              (field) => field.value === simpleFilterField,
                          )?.label
                        : "Select field..."}
                    <CaretUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search field..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No field found.</CommandEmpty>
                        <CommandGroup>
                            {getFields().map((field) => (
                                <CommandItem
                                    key={field.value}
                                    value={field.value}
                                    onSelect={(newField) => {
                                        setItem((filterCriteria) => ({
                                            ...filterCriteria,
                                            field: newField,
                                            operator:
                                                getOperators(
                                                    newField as never,
                                                )?.[0]?.value ?? null,
                                            value: null,
                                        }))
                                        setOpen(false)
                                    }}
                                >
                                    {field.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            simpleFilterField === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function OperatorSelector({ id }: { id: string }) {
    const [items, setItems, entityType] = useContext(AdvancedFilterContext)!
    const [item, setItem] = useNestedFieldArrayItem(items, setItems, id)
    const [open, setOpen] = useState(false)

    const { getOperators } = useAdvancedFilter(entityType)

    const {
        field: simpleFilterField,
        operator: simpleFilterOperator,
        value,
    } = simpleFilterCriteriaDataSchema.parse(item)

    const operators = getOperators(simpleFilterField as never)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="h-full w-36 justify-between rounded-none  border-y-0 p-0 px-2 text-xs"
                >
                    {simpleFilterOperator
                        ? operators?.find(
                              (operator) =>
                                  operator.value === simpleFilterOperator,
                          )?.label
                        : "Select operator..."}
                    <CaretUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search operator..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No field found.</CommandEmpty>
                        <CommandGroup>
                            {operators?.map(
                                (operator) =>
                                    operator.value && (
                                        <CommandItem
                                            key={operator.value}
                                            value={operator.value}
                                            onSelect={(newOperator) => {
                                                setItem((filterCriteria) => ({
                                                    ...filterCriteria,
                                                    operator: newOperator,
                                                    value,
                                                }))
                                                setOpen(false)
                                            }}
                                        >
                                            {operator.label}
                                            <Check
                                                className={cn(
                                                    "ml-auto",
                                                    simpleFilterOperator ===
                                                        operator.value
                                                        ? "opacity-100"
                                                        : "opacity-0",
                                                )}
                                            />
                                        </CommandItem>
                                    ),
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function ValueSelector({ id }: { id: string }) {
    const [items, setItems, entityType] = useContext(AdvancedFilterContext)!
    const [item, setItem] = useNestedFieldArrayItem(items, setItems, id)
    const { getFieldType } = useAdvancedFilter(entityType)

    const { value, field, operator } =
        simpleFilterCriteriaDataSchema.parse(item)

    const fieldType = getFieldType(field as never)

    const setValue = useCallback(
        (
            newValue: typeof value | ((oldValue: typeof value) => typeof value),
        ) => {
            setItem((oldItem) => ({
                ...oldItem,
                value:
                    typeof newValue === "function"
                        ? newValue(
                              simpleFilterCriteriaDataSchema.parse(oldItem)
                                  .value,
                          )
                        : newValue,
            }))
        },
        [setItem],
    )

    if (operator === "is empty" || operator === "is not empty") return <></>
    if (
        typeof value === "boolean" ||
        (value === null && fieldType === "boolean")
    )
        return <CheckboxField value={value ?? false} setValue={setValue} />
    if (typeof value === "string" || (value === null && fieldType === "string"))
        return <InputField value={value ?? ""} setValue={setValue} />
    if (typeof value === "number" || (value === null && fieldType === "number"))
        return <NumberField value={value} setValue={setValue} />
    if (
        !Array.isArray(value) &&
        (value instanceof Date ||
            durationSchema.safeParse(value).success ||
            (value === null && fieldType === "date"))
    )
        return (
            <DateField value={value} setValue={setValue} operator={operator} />
        )

    return <></>
}

//Value Types
const CheckboxField = ({
    value,
    setValue,
}: {
    value: boolean
    setValue: (value: boolean) => void
}) =>
    typeof value === "boolean" && (
        <Button
            variant="outline"
            role="checkbox"
            className="flex h-full flex-row items-center justify-center rounded-none  border-y-0 p-0 px-4 text-xs"
        >
            <Checkbox
                checked={value}
                onCheckedChange={() => setValue(!value)}
                className="border-neutral-400 hover:border-neutral-500 data-[state=checked]:border-neutral-700 data-[state=checked]:bg-neutral-700 "
            />
        </Button>
    )

const InputField = ({
    value,
    setValue,
    placeholder = "Enter a value...",
}: {
    value: string
    setValue: (value: string) => void
    placeholder?: string
}) => (
    <Input
        role="input"
        className=" flex h-full w-36 flex-row items-center justify-center rounded-none border border-y-0 border-neutral-200 bg-white p-0 px-4 text-xs hover:bg-neutral-100 hover:text-neutral-900  dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
    />
)

const NumberField = ({
    value,
    setValue,
    placeholder = "Enter a value...",
}: {
    value: number | null
    setValue: (value: number | null) => void
    placeholder?: string
}) => {
    const { parseNumber } = useDynamicNumberParser()

    return (
        <Input
            role="input"
            className=" flex h-full w-36 flex-row items-center justify-center rounded-none border border-y-0 border-neutral-200 bg-white p-0 px-4 text-xs hover:bg-neutral-100 hover:text-neutral-900  dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            value={value ?? ""}
            onChange={(e) => {
                const parsedValue = parseNumber(e.target.value)
                setValue(isNaN(parsedValue) ? null : parsedValue)
            }}
            placeholder={placeholder}
        />
    )
}

const DateField = ({
    value,
    setValue,
    operator,
}: {
    value: Date | Duration | null
    setValue: (value: Date | Duration) => void
    operator: conditionalOperatorsType
}) => {
    const durationOptionSchema = durationSchema
        .or(z.literal("date"))
        .or(z.literal("days from now"))
        .or(z.literal("days ago"))

    type DurationOption = z.infer<typeof durationOptionSchema>
    const durationOptions: {
        label: string
        value: DurationOption
        isRange: boolean
    }[] = [
        { label: "today", value: { days: 0 }, isRange: false },
        { label: "tomorrow", value: { days: 1 }, isRange: false },
        { label: "yesterday", value: { days: -1 }, isRange: false },
        { label: "one week ago", value: { weeks: -1 }, isRange: false },
        { label: "one week from now", value: { weeks: 1 }, isRange: false },
        { label: "one month ago", value: { months: -1 }, isRange: false },
        { label: "one month from now", value: { months: 1 }, isRange: false },
        { label: "number of days ago", value: "days from now", isRange: false },
        { label: "number of days from now", value: "days ago", isRange: false },
        { label: "exact date", value: "date", isRange: false },
        { label: "the past week", value: { weeks: -1 }, isRange: true },
        { label: "the past month", value: { months: -1 }, isRange: true },
        { label: "the past year", value: { years: -1 }, isRange: true },
        { label: "the next week", value: { weeks: 1 }, isRange: true },
        { label: "the next month", value: { months: 1 }, isRange: true },
        { label: "the next year", value: { years: 1 }, isRange: true },
        { label: "this calendar week", value: { weeks: 0 }, isRange: true },
        { label: "this calendar month", value: { months: 0 }, isRange: true },
        { label: "this calendar year", value: { years: 0 }, isRange: true },
        {
            label: "the next number of days",
            value: "days from now",
            isRange: true,
        },
        {
            label: "the past number of days",
            value: "days ago",
            isRange: true,
        },
    ]

    const filteredDurationOptions = useMemo(
        () =>
            durationOptions.filter(
                ({ isRange }) => isRange === Boolean(operator === "is within"),
            ),
        [operator],
    )

    const [open, setOpen] = useState(false)
    const [timeFrame, setTimeFrame] = useState<DurationOption>(
        filteredDurationOptions[0]!.value,
    )

    const [days, setDays] = useState<number | null>(null)

    useEffect(() => {
        if (days === null) return
        if (timeFrame === "days from now") return setValue({ days: days })
        if (timeFrame === "days ago") return setValue({ days: -1 * days })

        return setDays(null)
    }, [days, setValue, timeFrame])

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="h-full w-44 justify-between rounded-none  border-y-0 p-0 px-2 text-xs"
                    >
                        {
                            filteredDurationOptions.find(
                                (duration) =>
                                    JSON.stringify(duration.value) ===
                                    JSON.stringify(timeFrame),
                            )?.label
                        }
                        <CaretUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search timeframe..."
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No timeframe found.</CommandEmpty>
                            <CommandGroup>
                                {filteredDurationOptions.map((duration) => (
                                    <CommandItem
                                        key={duration.label}
                                        value={JSON.stringify(duration.value)}
                                        onSelect={(currentValue: string) => {
                                            const parsedValue =
                                                durationOptionSchema.parse(
                                                    JSON.parse(currentValue),
                                                )

                                            const durationParsedValue =
                                                durationSchema.safeParse(
                                                    parsedValue,
                                                )

                                            if (durationParsedValue.success) {
                                                setValue(
                                                    durationParsedValue.data,
                                                )
                                            }
                                            setTimeFrame(parsedValue)
                                            setOpen(false)
                                        }}
                                    >
                                        {duration.label}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === duration.value
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {timeFrame === "date" && (
                <CalendarField value={value} setValue={setValue} />
            )}

            {timeFrame === "days from now" && (
                <NumberField value={days} setValue={setDays} placeholder="Enter amount of days" />
            )}
        </>
    )
}

const CalendarField = ({
    value,
    setValue,
}: {
    value: Date | Duration | null
    setValue: (value: Date | Duration) => void
}) => {
    const format = useFormatter()

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="calendar"
                    className="h-full w-36 justify-between rounded-none  border-y-0 p-0 px-2 text-xs  font-normal"
                >
                    {value ? (
                        format.dateTime(z.date().parse(value), {
                            dateStyle: "medium",
                        })
                    ) : (
                        <span className=" text-neutral-500">Pick a date</span>
                    )}
                    <CalendarBlank className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" p-0">
                <Calendar
                    mode="single"
                    selected={z.date().nullable().parse(value) ?? undefined}
                    onSelect={(date) => {
                        if (date) {
                            setValue(date)
                        }
                    }}
                    disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
