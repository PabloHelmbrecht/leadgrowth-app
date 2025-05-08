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
import {
    type ControllerRenderProps,
    type UseFormReturn,
    type Path,
    type PathValue,
} from "react-hook-form"

export function TagInput<TForm extends Record<string, unknown>>({
    field,
    form,
    nameKey,
}: {
    field: ControllerRenderProps<TForm, Path<TForm>>
    form: UseFormReturn<TForm>
    nameKey: Path<TForm>
}) {
    const { data } = useTags({})
    const tags = data && Array.isArray(data) ? data : []
    const value = Array.isArray(field.value) ? (field.value as string[]) : []

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl className="hover:bg-white">
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "flex h-11 max-w-full flex-wrap justify-start overflow-hidden ",
                            !value.length && "text-muted-foreground",
                        )}
                    >
                        <div className="flex h-full flex-1 flex-row flex-wrap gap-2 overflow-hidden">
                            {value.map((currentValue) => (
                                <CommandTagSimple
                                    key={currentValue}
                                    className="flex items-center justify-start gap-2 "
                                    onClick={() =>
                                        form.setValue(
                                            nameKey,
                                            value.filter(
                                                (item) => item !== currentValue,
                                            ) as PathValue<TForm, Path<TForm>>,
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
                                            className="aspect-square w-2 rounded-full bg-slate-500"
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
                            alt="ver todos los tags"
                        />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
                <Command>
                    <CommandInput placeholder="Buscar tag..." />
                    {value.length !== 0 && (
                        <CommandTagsGroup>
                            {value.map((currentValue) => (
                                <CommandTag
                                    key={currentValue}
                                    onClick={() =>
                                        form.setValue(
                                            nameKey,
                                            value.filter(
                                                (item) => item !== currentValue,
                                            ) as PathValue<TForm, Path<TForm>>,
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
                                            className="aspect-square w-2 rounded-full bg-slate-500"
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
                        <CommandEmpty>No se encontraron tags.</CommandEmpty>
                        <CommandGroup>
                            {tags
                                .filter(
                                    (tag) =>
                                        tag.value && !value.includes(tag.id),
                                )
                                .map((tag) => (
                                    <CommandItem
                                        key={tag.value}
                                        value={tag.id}
                                        onSelect={(currentValue) => {
                                            if (!value.includes(currentValue)) {
                                                form.setValue(nameKey, [
                                                    ...new Set([
                                                        ...value,
                                                        currentValue,
                                                    ]),
                                                ] as PathValue<
                                                    TForm,
                                                    Path<TForm>
                                                >)
                                            } else {
                                                form.setValue(
                                                    nameKey,
                                                    value.filter(
                                                        (item) =>
                                                            item !==
                                                            currentValue,
                                                    ) as PathValue<
                                                        TForm,
                                                        Path<TForm>
                                                    >,
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
                                                className="aspect-square w-2 rounded-full bg-slate-500"
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
