"use client"

//React
import { useMemo } from "react"

//UI
import { Button } from "~/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//Icons
import { User, Check } from "@phosphor-icons/react/dist/ssr"

//Hooks
import { useWorkflows } from "~/lib/hooks/use-workflows"
import { useUsers } from "~/lib/hooks/use-users"

//Atoms & Jotai
import { useAtom } from "jotai"
import { rowSelectionAtom } from "~/lib/stores/workflow-table"

export function OwnerActionButton() {
    //Mock data
    const [rowSelection] = useAtom(rowSelectionAtom)

    const { data: workflows, assignOwner } = useWorkflows({})
    const { data: users } = useUsers({})

    const selectedWorkflows = useMemo(
        () =>
            (workflows ?? [])
                .filter((workflow) =>
                    Object.keys(rowSelection)
                        .filter((id) => rowSelection[id])
                        .includes(workflow.id),
                )
                .filter(
                    (workflow) =>
                        typeof workflow.owner === "object" ||
                        workflow.owner == null,
                ),
        [workflows, rowSelection],
    )

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    size={"sm"}
                    className={cn(
                        " font-regular flex h-fit w-fit items-center gap-2 rounded-full px-3 py-1",
                        Object.keys(rowSelection).length === 0 && "hidden",
                    )}
                >
                    <User
                        width={16}
                        height={16}
                        weight="bold"
                        className="aspect-square min-w-4"
                        alt={"config workflow button"}
                    />
                    Set Owner
                </Button>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput placeholder="Select owner..." />

                    <CommandList>
                        <CommandEmpty>No owners found.</CommandEmpty>

                        <CommandGroup>
                            {users?.map((owner) => (
                                <CommandItem
                                    key={owner.user_id}
                                    value={`${owner.profile.first_name} ${owner.profile.last_name}`}
                                    onSelect={async () => {
                                        await assignOwner(
                                            (selectedWorkflows ?? []).map(
                                                (workflow) => ({
                                                    ownerId: owner.user_id,
                                                    workflowId: workflow.id,
                                                }),
                                            ),
                                        )
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            (selectedWorkflows ?? [])
                                                .map(
                                                    (workflow) =>
                                                        workflow.owner_id,
                                                )
                                                .includes(owner.user_id)
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {`${owner.profile.first_name} ${owner.profile.last_name}`}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
