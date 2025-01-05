//React
import { useState } from "react"

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

//Custom Hooks
import { useNestedFieldArray } from "~/components/ui/use-nested-field-array"


/*TAREA:
-  Crear un componente para el where|and|or, hacerlo un input también
-  que el dragoverlay sea correcto para simple y group
- Que el input componente tenga tres input (campo, union y valor) como Airtable
- Aregar el handle y el delete a simple y group
- Agregar el + a group
- Hacer que los botones hagan algo
*/


export function CriteriaSelector() {
    const [items, setItems] = useNestedFieldArray(
        "filterCriteria.filters",
        "filters",
    )
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
            <GroupFilter key={id} id={id} items={items} />
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

                            return                         isParent ? (
                                <GroupFilter  key={id} id={id} items={items} />
                            ) : (
                                <SimpleFilter  key={id} id={id} />
                            )
                        })}
                    <SortableItem id={"bottom"} className="-mt-4">
                        <></>
                    </SortableItem>
                </SortableContext>
          


            {/* <DragOverlay>
                <DradOverlayComponent />
            </DragOverlay> */}
        </DndContextPrimitive>
        </div>
    )
}

function SortableItem({
    children,
    id,
    className
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

function GroupFilter({
    id,
    items,
}: {
    id: string
    items: { id: string; parentId?: string }[]
}) {
    const { setNodeRef } = useDroppable({ id })
    const itemsInParent = items.filter((item) => item.parentId === id)

    return (
        <SortableItem id={id}  className="flex w-full flex-row gap-2">
          <div className="w-12 flex-initial">
                                where
                            </div>
            <div ref={setNodeRef} className="flex-1 bg-green-100 p-2">
                <SortableContext
                    items={itemsInParent.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                 
                   {id}
                    <div className="flex flex-col gap-2">
                        {itemsInParent?.map(({ id }) => (
                            <SimpleFilter key={id} id={id} />
                        ))}
                    </div>
                  
                </SortableContext>
            </div>
        </SortableItem>
    )
}

function SimpleFilter({ id }: { id: string }) {
    return (
        <SortableItem id={id} className="flex w-full flex-row gap-2">
          <div className="w-12 flex-initial">
                                where
                            </div>
            <div className="bg-red-200 p-2 flex-1">{id}</div>
        </SortableItem>
    )
}
