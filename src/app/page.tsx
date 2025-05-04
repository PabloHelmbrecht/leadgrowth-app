"use client"

//UI
import { Button } from "~/components/ui/button"

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

//Next JS
import Image from "next/image"

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
            <main className="flex h-full w-full flex-col gap-8 p-12">
                <div className="flex flex-initial items-center justify-between">
                    <div className="flex flex-row items-center gap-4">
                        <Image
                            src={"/logo/isologo.png"}
                            alt={"Lead Growth logo"}
                            className={
                                "aspect-auto h-8 min-h-8 w-auto min-w-[32px]"
                            }
                            width={32}
                            height={32}
                            priority
                        />
                        <h1 className=" text-4xl font-bold">Workflows</h1>
                    </div>

                    <div className="flex items-center justify-end gap-6">
                        <Button
                            className="flex items-center justify-between gap-3"
                            variant={"secondary"}
                        >
                            <Gear
                                width={20}
                                height={20}
                                weight="bold"
                                className="aspect-square min-w-5"
                                alt={"config workflow button"}
                            />
                            Configure worflows
                        </Button>
                        <AddWorkflow />
                    </div>
                </div>

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
