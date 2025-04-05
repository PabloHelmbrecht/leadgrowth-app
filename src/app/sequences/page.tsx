"use client"

//UI
import { Button } from "~/components/ui/button"

//Filters
import { OwnerFilter } from "./_sequence-filters/owner-filter"
import { StatusFilter } from "./_sequence-filters/status-filter"
import { TagFilter } from "./_sequence-filters/tag-filter"
import { SelectAllCheckbox } from "./_sequence-actions/selectall-checkbox"
import { TagActionButton } from "./_sequence-actions/tag-actionbutton"
import { OwnerActionButton } from "./_sequence-actions/owner-actionbutton"
import { ArchiveActionButton } from "./_sequence-actions/archive-actionbutton"
import { ClearFilterActionButton } from "./_sequence-actions/clearfilter-actionbutton"
import { AddSequence } from "./_sequence-actions/addsequence-actionbutton"

//Data Table
import { DataTable } from "./_sequence-table/data-table"
import { columns } from "./_sequence-table/columns"

//Icons
import { Gear } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { sequencesMockDataAtom } from "~/lib/stores/mockData/sequence"

export default function SearchPage() {
    const [sequenceMockData] = useAtom(sequencesMockDataAtom)

    return (
        <main className="flex h-full w-full flex-col gap-8 p-12">
            <div className="flex flex-initial items-center justify-between">
                <h1 className=" text-4xl font-bold">Sequences</h1>

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
                            alt={"config sequence button"}
                        />
                        Configure sequences
                    </Button>
                    <AddSequence />
                </div>
            </div>

            <div className="flex flex-initial items-center gap-6 pl-3 ">
                <SelectAllCheckbox />

                <OwnerFilter />
                <StatusFilter />
                <TagFilter />
                <ClearFilterActionButton />
                <TagActionButton />
                <OwnerActionButton />
                <ArchiveActionButton />
            </div>

            <DataTable
                columns={columns}
                data={sequenceMockData.sort(
                    (a, b) =>
                        a.name.localeCompare(b.name) ||
                        a.id.localeCompare(b.id),
                )}
            />
        </main>
    )
}
