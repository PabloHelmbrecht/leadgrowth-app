"use client"
//React
import { useMemo } from "react"

//UI
import { Button } from "~/components/ui/button"
import { TriggerAndBreadcrumb } from "~/components/layout/nav-sidebar/trigger-breadcrumb"
import { Separator } from "~/components/ui/separator"
//Filters & Actions
import { TagActionButton } from "./_workflow/actions/tag-actionbutton"
import { OwnerActionButton } from "./_workflow/actions/owner-actionbutton"
import { ArchiveActionButton } from "./_workflow/actions/archive-actionbutton"
import { AddWorkflow } from "./_workflow/actions/addworkflow-actionbutton"
import { TableFilter } from "~/components/layout/table/table-filter"
import { ClearFilterActionButton } from "~/components/layout/table/actions/clean-filters"
import { SelectAllCheckbox } from "~/components/layout/table/actions/select-all"

//Data Table
//import { DataTable } from "./_workflow-table/data-table"
import { DataTable } from "~/components/layout/table/data-table"
import { columns } from "./_workflow/table/columns"
import {
    type TableContext,
    tableContext,
} from "~/components/layout/table/table-context"

//Icons
import { Gear } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/workflow-table"

//Constants
import { workflowStatus } from "~/lib/constants/status"

//Hooks
import { useWorkflows, type Workflow } from "~/lib/hooks/use-workflows"
import { useTags } from "~/lib/hooks/use-tags"
import { useUsers } from "~/lib/hooks/use-users"

export default function HomePage() {
    const { data, isLoading, isError } = useWorkflows({})

    const { data: tags } = useTags({})
    const { data: users } = useUsers({})

    const tagsOptions = useMemo(
        () =>
            tags?.map((tag) => ({
                label: tag.label ?? "",
                value: tag.value ?? "",
                color: tag.color ?? undefined,
            })) ?? [],
        [tags],
    )

    const usersOptions = useMemo(
        () =>
            users?.map((user) => ({
                label: user.profile.first_name + " " + user.profile.last_name,
                value: user.user_id,
            })) ?? [],
        [users],
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
                        options={usersOptions}
                        filterName="owner_id"
                        columnName="Owners"
                    />
                    <TableFilter
                        options={workflowStatus}
                        filterName="status"
                        columnName="Status"
                    />
                    <TableFilter
                        options={tagsOptions}
                        filterName="tags"
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
                                owner_id: false,
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
