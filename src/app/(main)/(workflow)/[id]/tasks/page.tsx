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

//Atoms & Jotai
import {
    IsAllRowsSelectedAtom,
    columnFiltersAtom,
    rowSelectionAtom,
    resetAllFiltersAtom,
    tableAtom,
} from "~/lib/stores/tasks-table"

//Hooks
import { useActions } from "~/lib/hooks/use-actions"
import { useUsers } from "~/lib/hooks/use-users"
import { useContacts } from "~/lib/hooks/use-contacts"
import { useCompanies } from "~/lib/hooks/use-companies"

//NextJs
import { useParams } from "next/navigation"

//Constants
import { flowActions } from "~/lib/constants/flow-actions"
import { actionStatus } from "~/lib/constants/status"
import { priorityOptions } from "~/lib/constants/priority"

export default function TasksTable() {
    const { id: workflowId } = useParams<{ id: string }>()

    const { data, isLoading, isError } = useActions({ workflowId })

    const { data: users } = useUsers({})
    const { data: contacts } = useContacts({})
    const { data: companies } = useCompanies({})

    const usersOptions = useMemo(
        () =>
            users?.map((user) => ({
                label: user.profile.first_name + " " + user.profile.last_name,
                value: user.user_id,
            })) ?? [],
        [users],
    )

    const contactsOptions = useMemo(
        () =>
            contacts?.map((contact) => ({
                label: `${contact.first_name} ${contact.last_name}`,
                value: contact.id,
            })) ?? [],
        [contacts],
    )

    const companiesOptions = useMemo(
        () =>
            companies?.map((company) => ({
                label: company.name ?? "",
                value: company.id,
            })) ?? [],
        [companies],
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
                            options={flowActions
                                .filter((a) => a.generatesTask)
                                .map((a) => ({
                                    label: a.name,
                                    value: a.type,
                                    color: a.textColor,
                                }))}
                            filterName="type"
                            columnName="Action"
                        />
                        <TableFilter
                            options={actionStatus.filter((a) =>
                                ["pending", "skipped", "completed"].includes(
                                    a.value,
                                ),
                            )}
                            filterName="status"
                            columnName="Status"
                        />
                        <TableFilter
                            options={priorityOptions}
                            filterName="priority"
                            columnName="Priority"
                        />
                        <TableFilter
                            options={contactsOptions}
                            filterName="contact"
                            columnName="Contacts"
                        />
                        <TableFilter
                            options={companiesOptions}
                            filterName="company"
                            columnName="Companies"
                        />
                        <TableFilter
                            options={usersOptions}
                            filterName="user"
                            columnName="Owners"
                        />

                        <ClearFilterActionButton />
                    </div>

                    <div className="flex gap-6"></div>
                </div>

                <DataTable
                    columns={columns}
                    filterData={(action) => action.due_at !== undefined}
                    tableOptions={{
                        initialState: {
                            columnVisibility: {
                                company: false,
                            },
                        },
                    }}
                />
            </main>
        </tableContext.Provider>
    )
}
