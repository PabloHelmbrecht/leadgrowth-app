"use client"

//UI
import { FormControl } from "~/components/ui/form"
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

//Icons
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr"

//Class Merge & id Maker
import { cn } from "~/lib/utils/classesMerge"

//Zod & Schemas & Types & Hooks
import { useUsers } from "~/lib/hooks/use-users"

//React Hook Form & Form Resolver
import { type ControllerRenderProps, type UseFormReturn } from "react-hook-form"

//React
import { useState } from "react"

export function OwnerInput({
    field,
    form,
}: {
    field: ControllerRenderProps<
        { name: string; tags: string[]; owner_id: string },
        "owner_id"
    >
    form: UseFormReturn<{ name: string; tags: string[]; owner_id: string }>
}) {
    //Mock data

    const { data: users } = useUsers({})

    const owner = users?.find((user) => user.user_id === field.value)

    const [open, setOpen] = useState<boolean>(false)

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "flex h-11 max-w-full flex-wrap justify-start overflow-hidden ",
                            !field.value && "text-muted-foreground",
                        )}
                    >
                        <div className="flex flex-1 items-center justify-start font-normal">
                            {owner
                                ? `${owner.profile.first_name} ${owner.profile.last_name}`
                                : "Select owner"}
                        </div>
                        <CaretDown
                            width={16}
                            height={16}
                            weight="bold"
                            className="aspect-square min-w-4 flex-initial"
                            alt={"see all button"}
                        />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0 ">
                <Command>
                    <CommandInput
                        placeholder="Search owner..."
                        className="h-9 "
                    />
                    <CommandList>
                        <CommandEmpty>No owner found.</CommandEmpty>
                        <CommandGroup>
                            {users?.map((owner) => (
                                <CommandItem
                                    value={`${owner.profile.first_name} ${owner.profile.last_name}`}
                                    key={owner.user_id}
                                    onSelect={() => {
                                        form.setValue("owner_id", owner.user_id)
                                        setOpen(false)
                                    }}
                                >
                                    {`${owner.profile.first_name} ${owner.profile.last_name}`}
                                    <Check
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            owner.user_id === field.value
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
