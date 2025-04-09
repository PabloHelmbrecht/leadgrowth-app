"use client"

//Data Table
import { columns } from "./_table-columns"

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

//Atoms & Jotai
import { useAtom } from "jotai"
import {
    companiesMockDataAtom,
    stagesMockDataAtom,
    stepsMockDataAtom,
    statusMockDataAtom,
    contactsMockDataAtom as dataAtom,
} from "~/lib/stores/mockData/contact"
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/contact-table"

export default function ContactsTable() {
    return (
        <tableContext.Provider
            value={
                {
                    dataAtom,
                    IsAllRowsSelectedAtom,
                    columnFiltersAtom,
                    rowSelectionAtom,
                    resetAllFiltersAtom,
                    tableAtom,
                } as TableContext
            }
        >
            <main className="flex h-full w-full flex-col gap-8 p-12">
                <div className="flex flex-initial items-center  justify-between pl-3 ">
                    <div className="flex gap-6">
                        <SelectAllCheckbox />
                        <TableFilter
                            options={useAtom(companiesMockDataAtom)[0]}
                            filterName="company"
                            columnName="Companies"
                        />
                        <TableFilter
                            options={useAtom(stagesMockDataAtom)[0]}
                            filterName="stage"
                            columnName="Stages"
                        />
                        <TableFilter
                            options={useAtom(stepsMockDataAtom)[0]}
                            filterName="step"
                            columnName="Steps"
                        />
                        <TableFilter
                            options={useAtom(statusMockDataAtom)[0]}
                            filterName="status"
                            columnName="Status"
                        />
                        <ClearFilterActionButton />
                    </div>

                    <div className="flex gap-6">
                        <SelectAllCheckbox />
                    </div>
                </div>

                <DataTable columns={columns} />
            </main>
        </tableContext.Provider>
    )
}
