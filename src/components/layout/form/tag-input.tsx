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
    CommandTagsGroup,
    CommandTag,
    CommandTagSimple,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"

//Icons
import { CaretDown, Star } from "@phosphor-icons/react/dist/ssr"

//Class Merge & id Maker
import { cn } from "~/lib/utils/classesMerge"

//Zod & Schemas & Types & Hooks
import { useTags } from "~/lib/hooks/use-tags"

//React Hook Form & Form Resolver
import { type ControllerRenderProps, type UseFormReturn } from "react-hook-form"

export function TagInput({
    field,
    form,
}: {
    field: ControllerRenderProps<
        { name: string; tags: string[]; owner_id: string },
        "tags"
    >
    form: UseFormReturn<{ name: string; tags: string[]; owner_id: string }>
}) {
    //Mock data
    const { data } = useTags({})

    const tags = data && Array.isArray(data) ? data : []

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl className="hover:bg-white">
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "flex h-11 max-w-full flex-wrap justify-start overflow-hidden ",
                            !field.value && "text-muted-foreground",
                        )}
                    >
                        <div className="flex h-full flex-1 flex-row flex-wrap gap-2 overflow-hidden">
                            {field.value?.map((currentValue) => (
                                <CommandTagSimple
                                    key={currentValue}
                                    className="flex items-center justify-start gap-2 "
                                    onClick={() =>
                                        form.setValue(
                                            "tags",
                                            field.value.filter(
                                                (item) => item !== currentValue,
                                            ),
                                        )
                                    }
                                >
                                    {tags.find(
                                        (item) => item.id === currentValue,
                                    )?.value === "starred" ? (
                                        <Star
                                            size={14}
                                            weight="fill"
                                            className=" -mx-[3px]"
                                            style={{
                                                color:
                                                    tags.find(
                                                        (item) =>
                                                            item.id ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className=" aspect-square w-2 rounded-full bg-neutral-500"
                                            style={{
                                                backgroundColor:
                                                    tags.find(
                                                        (item) =>
                                                            item.id ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    )}
                                    {
                                        tags.find(
                                            (item) => item.id === currentValue,
                                        )?.label
                                    }
                                </CommandTagSimple>
                            ))}
                        </div>

                        <CaretDown
                            width={16}
                            height={16}
                            weight="bold"
                            className="aspect-square min-w-4 flex-initial"
                            alt={"see all tags button"}
                        />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className=" w-72 p-0">
                <Command>
                    <CommandInput placeholder="Search tags..." />
                    {field.value && field.value.length !== 0 && (
                        <CommandTagsGroup>
                            {field.value.map((currentValue) => (
                                <CommandTag
                                    key={currentValue}
                                    onClick={() =>
                                        form.setValue(
                                            "tags",
                                            field.value.filter(
                                                (item) => item !== currentValue,
                                            ),
                                        )
                                    }
                                    className="flex items-center justify-start gap-2"
                                >
                                    {tags.find(
                                        (item) => item.id === currentValue,
                                    )?.value === "starred" ? (
                                        <Star
                                            size={14}
                                            weight="fill"
                                            className=" -mx-[3px]"
                                            style={{
                                                color:
                                                    tags.find(
                                                        (item) =>
                                                            item.id ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className=" aspect-square w-2 rounded-full bg-neutral-500"
                                            style={{
                                                backgroundColor:
                                                    tags.find(
                                                        (item) =>
                                                            item.id ===
                                                            currentValue,
                                                    )?.color ?? "",
                                            }}
                                        />
                                    )}
                                    {
                                        tags.find(
                                            (item) => item.id === currentValue,
                                        )?.label
                                    }
                                </CommandTag>
                            ))}
                        </CommandTagsGroup>
                    )}
                    <CommandList>
                        <CommandEmpty>No tags found.</CommandEmpty>

                        <CommandGroup>
                            {tags
                                .filter(
                                    (tag) =>
                                        tag.value &&
                                        !field.value?.includes(tag.value),
                                )
                                .map((tag) => (
                                    <CommandItem
                                        key={tag.value}
                                        value={tag.id}
                                        onSelect={(currentValue) => {
                                            if (
                                                !field.value?.includes(
                                                    currentValue,
                                                )
                                            ) {
                                                field.value &&
                                                    form.setValue("tags", [
                                                        ...new Set([
                                                            ...field.value,
                                                            currentValue,
                                                        ]),
                                                    ])
                                            } else {
                                                form.setValue(
                                                    "tags",
                                                    field.value?.filter(
                                                        (item) =>
                                                            item !==
                                                            currentValue,
                                                    ),
                                                )
                                            }
                                        }}
                                        className="flex items-center justify-start gap-2"
                                    >
                                        {tag.value === "starred" ? (
                                            <Star
                                                size={14}
                                                weight="fill"
                                                className=" -mx-[3px]"
                                                style={{
                                                    color:
                                                        tags.find(
                                                            (item) =>
                                                                item.value ===
                                                                tag.value,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className=" aspect-square w-2 rounded-full bg-neutral-500"
                                                style={{
                                                    backgroundColor:
                                                        tags.find(
                                                            (item) =>
                                                                item.value ===
                                                                tag.value,
                                                        )?.color ?? "",
                                                }}
                                            />
                                        )}
                                        {tag.label}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
