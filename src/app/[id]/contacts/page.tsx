"use client"

//UI
// import { Button } from "~/components/ui/button"

//Data Table
import { DataTable } from "./_contacts-table/data-table"
import { columns } from "./_contacts-table/columns"

//Icons
// import { Gear } from "@phosphor-icons/react/dist/ssr"

//Filters
import { SelectAllCheckbox } from "./_contacts-actions/selectall-checkbox"
import { CompanyFilter } from "./_contacts-filters/company-filter"
import { StageFilter } from "./_contacts-filters/stage-filter"
import { StepFilter } from "./_contacts-filters/step-filter"
import { StatusFilter } from "./_contacts-filters/status-filter"

//Actions
import { ClearFilterActionButton } from "./_contacts-actions/clearfilter-actionbutton"

//Atoms & Jotai
import { useAtom } from "jotai"
import { contactsMockDataAtom } from "~/lib/stores/mockData/contact"

export default function SearchPage() {
    const [contactMockData] = useAtom(contactsMockDataAtom)

    return (
        <main className="flex h-full w-full flex-col gap-8 p-12">
            <div className="flex flex-initial items-center  justify-between pl-3 ">
                <div className="flex gap-6">
                    <SelectAllCheckbox />
                    <CompanyFilter />
                    <StageFilter />
                    <StepFilter />
                    <StatusFilter />
                    <ClearFilterActionButton />
                </div>

                <div className="flex gap-6">
                    <SelectAllCheckbox />
                </div>
            </div>

            <DataTable columns={columns} data={contactMockData} />
        </main>
    )
}
