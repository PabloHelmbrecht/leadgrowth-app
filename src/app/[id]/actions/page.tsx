"use client"

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

//Atoms & Jotai
import { useAtom } from "jotai"
import { actionsMockDataAtom as dataAtom } from "~/lib/stores/mockData/actions"
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/tasks-table"
import { statusMockDataAtom } from "~/lib/stores/mockData/system"

//Constants
import { flowActions } from "~/lib/constants/flow-actions"

export default function ActionsTable() {
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
                } as TableContext<unknown>
            }
        >
            <main className="flex h-full w-full flex-col gap-8 p-12">
                <div className="flex flex-initial items-center  justify-between pl-3 ">
                    <div className="flex gap-6">
                        <SelectAllCheckbox />
                        <TableFilter
                            options={useAtom(statusMockDataAtom)[0]}
                            filterName="status"
                            columnName="Status"
                        />
                        <TableFilter
                            options={flowActions.map((a) => ({
                                label: a.name,
                                value: a.type,
                                color: a.textColor,
                            }))}
                            filterName="type"
                            columnName="Type"
                        />

                        <ClearFilterActionButton />
                    </div>

                    <div className="flex gap-6"></div>
                </div>

                <DataTable
                    columns={columns}
                    filterData={(action) =>
                        action.status !== "pending" &&
                        action.status !== "skipped"
                    }
                />
            </main>
        </tableContext.Provider>
    )
}
