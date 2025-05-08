"use client"

//React
import { useMemo } from "react"

//Data Table
import { columns } from "./columns"

//Table & UI
import { TableFilter } from "~/components/layout/table/table-filter"
import {
    type TableContext,
    tableContext,
} from "~/components/layout/table/table-context"
import { DataTable } from "~/components/layout/table/data-table"

//Actions
import { ClearFilterActionButton } from "~/components/layout/table/actions/clean-filters"
import { SelectAllCheckbox } from "~/components/layout/table/actions/select-all"

//Consts
import { flowActions } from "~/lib/constants/flow-actions"
import { contactStatus } from "~/lib/constants/status"

//Atoms & Jotai
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/contact-table"

//NextJs
import { useParams } from "next/navigation"

//Hooks
import { useContacts } from "~/lib/hooks/use-contacts"
import { useCompanies } from "~/lib/hooks/use-companies"
import { useContactStages } from "~/lib/hooks/use-contacts-stages"

export default function ContactsTable() {
    const { id: workflowId } = useParams<{ id: string }>()

    const { data, isLoading, isError } = useContacts({
        workflowId,
    })

    const { data: companies } = useCompanies({})
    const { data: stagesOptions } = useContactStages({})

    const companiesOptions = useMemo(
        () =>
            companies?.map((company) => ({
                label: company.name ?? "",
                value: company.id,
            })) ?? [],
        [companies],
    )

    const stepsOptions = useMemo(
        () =>
            flowActions.map((step) => ({
                label: step.name ?? "",
                value: step.type,
            })) ?? [],
        [],
    )

    return (
        <tableContext.Provider
            value={
                {
                    data,
                    isLoading,
                    isError,
                    IsAllRowsSelectedAtom,
                    columnFiltersAtom,
                    rowSelectionAtom,
                    resetAllFiltersAtom,
                    tableAtom,
                } as unknown as TableContext<unknown>
            }
        >
            <main className="flex h-full w-full flex-col gap-8 p-12">
                <div className="flex flex-initial items-center  justify-between pl-3 ">
                    <div className="flex gap-6">
                        <SelectAllCheckbox />
                        <TableFilter
                            options={companiesOptions}
                            filterName="company"
                            columnName="Companies"
                        />
                        <TableFilter
                            options={stagesOptions ?? []}
                            filterName="stage"
                            columnName="Stages"
                        />
                        <TableFilter
                            options={stepsOptions}
                            filterName="step"
                            columnName="Steps"
                        />
                        <TableFilter
                            options={contactStatus}
                            filterName="status"
                            columnName="Status"
                        />
                        <ClearFilterActionButton />
                    </div>

                    <div className="flex gap-6"></div>
                </div>

                <DataTable columns={columns} />
            </main>
        </tableContext.Provider>
    )
}
