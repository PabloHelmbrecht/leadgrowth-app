"use client"

//UI
import { Button } from "~/components/ui/button"
import { TriggerAndBreadcrumb } from "~/components/layout/nav-sidebar/trigger-breadcrumb"
import { Separator } from "~/components/ui/separator"
//Filters & Actions
import { TagActionButton } from "./_workflow_actions/tag-actionbutton"
import { OwnerActionButton } from "./_workflow_actions/owner-actionbutton"
import { ArchiveActionButton } from "./_workflow_actions/archive-actionbutton"
import { AddWorkflow } from "./_workflow_actions/addworkflow-actionbutton"
import { TableFilter } from "~/components/layout/table/table-filter"
import { ClearFilterActionButton } from "~/components/layout/table/actions/clean-filters"
import { SelectAllCheckbox } from "~/components/layout/table/actions/select-all"

//Data Table
//import { DataTable } from "./_workflow-table/data-table"
import { DataTable } from "~/components/layout/table/data-table"
import { columns } from "./_workflow-table/columns"
import {
    type TableContext,
    tableContext,
} from "~/components/layout/table/table-context"

//Icons
import { Gear } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/workflow-table"
import {
    tagsMockDataAtom,
    statusMockDataAtom,
    ownersMockDataAtom,
} from "~/lib/stores/mockData/workflow"

//Hooks
import { useWorkflows, type Workflow } from "~/lib/hooks/use-workflows"

export default function HomePage() {
    const { data, isLoading, isError } = useWorkflows({})

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
                } as TableContext<unknown>
            }
        >
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <TriggerAndBreadcrumb
                    block="Engage"
                    link="/"
                    page="Workflows"
                />
                <div className="flex items-center justify-end gap-3">
                    <Button
                        className="font-regular flex h-fit items-center justify-between gap-2 p-2 text-sm"
                        variant={"outline"}
                    >
                        <Gear
                            size={16}
                            weight="bold"
                            alt={"config workflow button"}
                        />
                        Configure worflows
                    </Button>
                    <AddWorkflow />
                </div>
            </header>
            <Separator orientation="horizontal" className=" hw-full" />
            <main className="flex h-full w-full flex-col gap-6 p-6">
                <div className="flex flex-initial items-center gap-6 pl-3 ">
                    <SelectAllCheckbox />

                    <TableFilter
                        options={useAtom(ownersMockDataAtom)[0]}
                        filterName="owner"
                        columnName="Owners"
                    />
                    <TableFilter
                        options={useAtom(statusMockDataAtom)[0]}
                        filterName="status"
                        columnName="Status"
                    />
                    <TableFilter
                        options={useAtom(tagsMockDataAtom)[0]}
                        filterName="tag"
                        columnName="Tags"
                    />

                    <ClearFilterActionButton />
                    <TagActionButton />
                    <OwnerActionButton />
                    <ArchiveActionButton />
                </div>

                <DataTable<Workflow, unknown>
                    hideHeaders={true}
                    tableOptions={{
                        initialState: {
                            columnVisibility: {
                                owner: false,
                                totalCount: false,
                            },
                        },
                    }}
                    columns={columns}
                />
            </main>
        </tableContext.Provider>
    )
}
