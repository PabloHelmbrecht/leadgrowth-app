/**
 * TODO:
 * - [ ] Add trigger configuration for each type
 * - [ ] El plan es que el trigger configuration se vuelva gris al seleccionar uno y se expanda con las config adentro (como el GroupFilter)
 */

//UI
import { Button } from "~/components/ui/button"
import { FormControl, FormItem, FormMessage } from "~/components/ui/form"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "~/components/ui/accordion"
import { useAccordion } from "~/components/ui/use-accordion"
import { TriggerSelector } from "./trigger-selector"
import { AdvancedFilter } from "~/components/ui/advanced-filter"

//Icons
import { Plus } from "@phosphor-icons/react/dist/ssr"

//Utils
import { cn } from "~/lib/utils/classesMerge"

//React Hook Form
import { useFieldArray, useFormContext } from "react-hook-form"

//Zod & Schemas
import type { z } from "zod"
import { type triggerNodeDataSchema } from "../../_nodes/trigger-node"

export function TriggerConfiguration() {
    const triggers = useFieldArray<z.infer<typeof triggerNodeDataSchema>>({
        name: "triggers",
        rules: { minLength: 1 },
    })

    // const triggerFields: Record

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
                    Run the workflow when
                    {accordionStates.triggers
                        ? `...`
                        : triggers.fields.length === 1
                          ? " a contact is manually added."
                          : ` 1 of ${triggers.fields.length + 1} events occurrs.`}
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-4 ">
                    <div className="scroll flex max-h-[40vh] flex-col gap-4 overflow-x-clip  overflow-y-scroll py-2  pr-1 ">
                        <div className="w-full rounded border border-neutral-300 bg-neutral-50 px-2 py-[0.33rem] font-medium">
                            Manual Activation
                        </div>

                        {triggers.fields.map((trigger, index) => {
                            const triggerError = errors.triggers?.[index]

                            return (
                                <FormItem key={trigger.id}>
                                    <FormControl>
                                        <div>
                                            <div className="flex w-full flex-row items-center gap-3">
                                                <div className="w-fit">or</div>
                                                <TriggerSelector
                                                    index={index}
                                                    triggers={triggers}
                                                />
                                            </div>

                                            {triggerError && (
                                                <p className="pt-2 text-sm font-medium text-red-500 dark:text-red-900">
                                                    Invalid trigger
                                                </p>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
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
                    <AdvancedFilter
                        name={"filterCriteria.filters"}
                        criteriaKey={"filters"}
                        entityType="contact"
                    />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
