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
import { CaretDown } from "@phosphor-icons/react/dist/ssr"

//Class Merge & id Maker
import { cn } from "~/lib/utils/classesMerge"

//Zod & Schemas & Types & Hooks
import { useWorkflows } from "~/lib/hooks/use-workflows"

//React Hook Form & Form Resolver
import {
    type ControllerRenderProps,
    type UseFormReturn,
    type Path,
    type PathValue,
} from "react-hook-form"

export function WorkflowInput<TForm extends Record<string, unknown>>({
    field,
    form,
    nameKey,
}: {
    field: ControllerRenderProps<TForm, Path<TForm>>
    form: UseFormReturn<TForm>
    nameKey: Path<TForm>
}) {
    const { data } = useWorkflows({})
    const workflows = data && Array.isArray(data) ? data : []
    const value = Array.isArray(field.value) ? (field.value as string[]) : []

    return (
        <Popover>
            <PopoverTrigger asChild>
                <FormControl className="hover:bg-white">
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "flex h-11 w-full flex-wrap justify-start overflow-hidden ",
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
                                    {workflows.find(
                                        (item) => item.id === currentValue,
                                    )?.name ?? currentValue}
                                </CommandTagSimple>
                            ))}
                        </div>
                        <CaretDown
                            width={16}
                            height={16}
                            weight="bold"
                            className="aspect-square min-w-4 flex-initial"
                            alt={"ver todas las secuencias"}
                        />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="min-w-72 max-w-96 p-0">
                <Command>
                    <CommandInput placeholder="Buscar secuencia..." />
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
                                    {workflows.find(
                                        (item) => item.id === currentValue,
                                    )?.name ?? currentValue}
                                </CommandTag>
                            ))}
                        </CommandTagsGroup>
                    )}
                    <CommandList>
                        <CommandEmpty>
                            No se encontraron secuencias.
                        </CommandEmpty>
                        <CommandGroup>
                            {workflows
                                .filter(
                                    (workflow) =>
                                        workflow.id &&
                                        !value.includes(workflow.id),
                                )
                                .map((workflow) => (
                                    <CommandItem
                                        key={workflow.id}
                                        value={workflow.id}
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
                                        {workflow.name ?? workflow.id}
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
