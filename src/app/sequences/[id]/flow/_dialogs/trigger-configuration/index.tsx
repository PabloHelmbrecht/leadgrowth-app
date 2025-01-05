import { Fragment } from "react"

//UI
import { Button } from "~/components/ui/button"
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "~/components/ui/form"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"
import { useAccordion } from "~/components/ui/use-accordion"
import { TriggerSelector } from "./trigger-selector"
import { CriteriaSelector } from "./criteria-selector"

//Icons
import { Plus } from "@phosphor-icons/react/dist/ssr"

//Utils
import { cn } from "~/lib/utils/classesMerge"

//React Hook Form
import { useFieldArray, useFormContext } from "react-hook-form"

//Zod & Schemas
import type { z } from "zod"
import {
    type triggerNodeDataSchema,
    triggerDataSchema,
} from "../../_nodes/trigger-node"

export function TriggerConfiguration() {
    const triggers = useFieldArray<z.infer<typeof triggerNodeDataSchema>>({
        name: "triggers",
        rules: { minLength: 1 },
    })

    const filters = useFieldArray<z.infer<typeof triggerNodeDataSchema>>({
        name: "filterCriteria.filters",
        rules: { minLength: 1 },
    })

    const {
        formState: { errors },
    } = useFormContext<z.infer<typeof triggerNodeDataSchema>>()

    const { accordionStates, useAccordionItemRef } = useAccordion()


    return (
        <Accordion type="single" className="space-y-4" collapsible>
            <AccordionItem
                ref={useAccordionItemRef("triggers")}
                value="triggers"
                className="flex flex-col gap-4 rounded-lg bg-neutral-100 p-4 px-4"
            >
                <AccordionTrigger
                    className={cn(
                        " p-0 font-semibold hover:no-underline",
                        accordionStates.triggers ? "" : "font-normal",
                    )}
                >
                    Run the sequence when
                    {accordionStates.triggers
                        ? `...`
                        : triggers.fields.length === 1
                          ? " a contact is manually added."
                          : ` 1 of ${triggers.fields.length} events occurrs.`}
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-4 ">
                    <div className="scroll flex max-h-[40vh] flex-col gap-4 overflow-x-clip  overflow-y-scroll py-2  pr-1 ">
                        {triggers.fields.map((trigger, index) => {
                            const { data: triggerData } =
                                triggerDataSchema.safeParse(trigger)
                            const triggerError = errors.triggers?.[index]

                            return (
                                <Fragment key={trigger.id}>
                                    {index !== 0 && (
                                        <div className="flex w-full items-center justify-center">
                                            OR
                                        </div>
                                    )}
                                    <div
                                        className={cn(
                                            "w-full rounded-lg bg-white p-4",
                                            triggerError &&
                                                "border-2 border-danger-400",
                                        )}
                                    >
                                        <FormItem>
                                            <FormLabel>Event</FormLabel>
                                            <FormControl>
                                                <div>
                                                    {triggerData?.type ===
                                                    "manualActivation" ? (
                                                        <div className="flex h-10 w-full items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300 [&>span]:line-clamp-1">
                                                            Manual Activation
                                                        </div>
                                                    ) : (
                                                        <TriggerSelector
                                                            index={index}
                                                        />
                                                    )}

                                                    {triggerError && (
                                                        <p className="pt-2 text-sm font-medium text-red-500 dark:text-red-900">
                                                            Invalid trigger
                                                        </p>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </div>
                                </Fragment>
                            )
                        })}
                    </div>

                    <Button
                        className="flex h-fit w-fit flex-row   items-center gap-2 text-xs"
                        variant={"quaternary"}
                        onClick={() => {
                            triggers.append({
                                type: "",
                                parameters: {},
                            })
                        }}
                    >
                        <Plus weight="bold" />
                        Add event
                    </Button>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem
                ref={useAccordionItemRef("filters")}
                value="filters"
                className="flex flex-col gap-4 rounded-lg bg-neutral-100 p-4 px-4"
            >
                <AccordionTrigger
                    className={cn(
                        " p-0 font-semibold hover:no-underline ",
                        accordionStates.filters ? "" : "font-normal",
                    )}
                >
                    {filters.fields.length === 0
                        ? "For any saved contacts"
                        : "If the following criteria are met"}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 ">
                    <CriteriaSelector />

                    <div className="flex flex-row gap-4">
                        <Button
                            className="flex h-fit w-fit flex-row   items-center gap-2 text-xs"
                            variant={"quaternary"}
                            onClick={() => {
                                filters.append({
                                    type: "",
                                    parameters: {},
                                })
                            }}
                        >
                            <Plus weight="bold" />
                            Add condition
                        </Button>
                        <Button
                            className="flex h-fit w-fit flex-row   items-center gap-2 bg-neutral-500 text-xs"
                            variant={"quaternary"}
                            onClick={() => {
                                filters.append({
                                    type: "",
                                    parameters: {},
                                })
                            }}
                        >
                            <Plus weight="bold" />
                            Add condition group
                        </Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
