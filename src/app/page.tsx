"use client"

//UI
import { Button } from "~/components/ui/button"

//Filters

import { SelectAllCheckbox } from "./_workflow_actions/selectall-checkbox"
import { TagActionButton } from "./_workflow_actions/tag-actionbutton"
import { OwnerActionButton } from "./_workflow_actions/owner-actionbutton"
import { ArchiveActionButton } from "./_workflow_actions/archive-actionbutton"
import { ClearFilterActionButton } from "./_workflow_actions/clearfilter-actionbutton"
import { AddWorkflow } from "./_workflow_actions/addworkflow-actionbutton"
import { TableFilter } from "~/components/layout/tables/table-filter"

//Data Table
import { DataTable } from "./_workflow-table/data-table"
import { columns } from "./_workflow-table/columns"

//Icons
import { Gear } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { workflowsMockDataAtom } from "~/lib/stores/mockData/workflow"
import {
    tagsMockDataAtom,
    statusMockDataAtom,
    ownersMockDataAtom,
} from "~/lib/stores/mockData/workflow"

export default function HomePage() {
    const [workflowMockData] = useAtom(workflowsMockDataAtom)

    return (
        <main className="flex h-full w-full flex-col gap-8 p-12">
            <div className="flex flex-initial items-center justify-between">
                <h1 className=" text-4xl font-bold">Workflows</h1>

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

            <DataTable
                columns={columns}
                data={workflowMockData.sort(
                    (a, b) =>
                        a.name.localeCompare(b.name) ||
                        a.id.localeCompare(b.id),
                )}
            />
        </main>
    )
}
