"use client"

//UI
// import { Button } from "~/components/ui/button"

//Data Table
import { DataTable } from "./_contacts-table/data-table"
import { columns } from "./_contacts-table/columns"

//Icons
// import { Gear } from "@phosphor-icons/react/dist/ssr"

//Filters
import { TableFilter } from "~/components/layout/table/table-filter"
import {
    type TableContext,
    tableContext,
} from "~/components/layout/table/table-context"

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
    contactsMockDataAtom,
} from "~/lib/stores/mockData/contact"
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/contact-table"

export default function SearchPage() {
    const [contactMockData] = useAtom(contactsMockDataAtom)

    return (
        <tableContext.Provider
            value={
                {
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

                <DataTable columns={columns} data={contactMockData} />
            </main>
        </tableContext.Provider>
    )
}
