/**
 * Todo
 * - [ ]  Hacer el Drag Overlay sea más simpificado a la hora de moverlo
 * - [ ]  Configurar el SimpleFilter para que tenga un input de campo, un input de valor y un select de union
 */

//React
import {
    useState,
    createContext,
    useContext,
    type Dispatch,
    type SetStateAction,
} from "react"

import { createPortal } from "react-dom"

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
    DragOverlay,
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

//Icons
import { Trash, Plus, DotsSixVertical } from "@phosphor-icons/react/dist/ssr"

//Custom Hooks
import {
    type FlattenedFieldValue,
    useNestedFieldArray,
    useNestedFieldArrayItem,
} from "~/components/ui/use-nested-field-array"

//React Hook Form
import { useFormContext } from "react-hook-form"

//Utils
import { generateId } from "~/lib/utils/formatters"

//Zod & Schemas
import type { z } from "zod"
import {
    conjunctionSchema,
    groupFilterCriteriaDataSchema,
    type triggerNodeDataSchema,
} from "../../_nodes/trigger-node"

/*TAREA:
-  que el dragoverlay sea correcto para simple y group
- Que el input componente tenga tres input (campo, union y valor) como Airtable
- Aregar el handle y el delete a simple y group
- Agregar el + a group
- Hacer que los botones hagan algo
*/

const CriteriaSelectorContext = createContext<
    | null
    | [FlattenedFieldValue[], Dispatch<SetStateAction<FlattenedFieldValue[]>>]
>(null)

export function CriteriaSelector() {
    const name = "filterCriteria.filters"
    const key = "filters"
    const [items, setItems] = useNestedFieldArray(name, key)

    const [activeId, setActiveId] = useState<number | string | null>(null)

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

    function DradOverlayComponent() {
        if (!activeId) return null

        const { id, isParent } = items.find((item) => item.id === activeId)!

        return isParent ? (
            <GroupFilter key={id} id={id} />
        ) : (
            <SimpleFilter key={id} id={id} />
        )
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    )

    return (
        <CriteriaSelectorContext.Provider value={[items, setItems]}>
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

                    {createPortal(
                        <DragOverlay>{DradOverlayComponent()}</DragOverlay>,
                        document.body,
                    )}
                </DndContextPrimitive>
            </div>
            <AddCriteriaButtons />
        </CriteriaSelectorContext.Provider>
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
    const [items, setItems] = useContext(CriteriaSelectorContext)!
    const [item] = useNestedFieldArrayItem(items, setItems, id)
    const conjunction = groupFilterCriteriaDataSchema.parse(item).conjunction
    const itemsInParent = items.filter((item) => {
        return item.parentId === id
    })

    return (
        <div
            id={id}
            className="flex w-full flex-row gap-2"
            ref={setNodeRefSortable}
            style={style}
        >
            <ConjunctionInput id={id} />
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
                                            field: "",
                                            values: "",
                                        },
                                    ])
                                }}
                            >
                                <Plus weight="bold" />
                            </div>
                            <div
                                className="  flex aspect-square h-full  flex-initial items-center justify-center rounded-sm bg-transparent p-2 text-neutral-800 hover:bg-danger-300 hover:text-danger-600"
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
    const [, setItems] = useContext(CriteriaSelectorContext)!
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
            <ConjunctionInput id={id} />

            <div className="flex w-fit flex-row items-center divide-x  divide-neutral-300 overflow-clip rounded-md border border-neutral-300 bg-white">
                <div className=" w-fit px-2 ">{id}</div>
                <div
                    className=" flex  h-full items-center justify-center rounded-none bg-transparent px-2 text-neutral-800 hover:bg-danger-100 hover:text-danger-500"
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

function ConjunctionInput({ id }: { id: string }) {
    const [items, setItems] = useContext(CriteriaSelectorContext)!

    const [item] = useNestedFieldArrayItem(items, setItems, id)
    const [parentItem, setParentItem] = useNestedFieldArrayItem(
        items,
        setItems,
        item?.parentId ?? "",
    )

    const { watch, setValue } =
        useFormContext<z.infer<typeof triggerNodeDataSchema>>()

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
        <Select defaultValue={conjunction} onValueChange={onValueChange}>
            <SelectTrigger className="h-fit w-16 border-neutral-300 px-2 py-1 ">
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

function AddCriteriaButtons() {
    const [, setItems] = useContext(CriteriaSelectorContext)!
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
                            field: "",
                            values: "",
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
