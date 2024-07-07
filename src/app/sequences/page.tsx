"use client"

//UI
import { Button } from "~/components/ui/button"

//Filters
import { OwnerFilter } from "./owner-filter"
import { StatusFilter } from "./status-filter"
import { TagFilter } from "./tag-filter"
import { SelectAllCheckbox } from "./selectall-checkbox"
import { TagActionButton } from "./tag-actionbutton"
import { OwnerActionButton } from "./owner-actionbutton"
import { ArchiveActionButton } from "./archive-actionbutton"
import { ClearFilterActionButton } from "./clearfilter-actionbutton"

//Data Table
import { DataTable, columns } from "./data-table"

//Icons
import { Gear, Plus } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { sequencesMockDataAtom } from "~/lib/mockData"

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
          <Button className="flex items-center justify-between gap-3 ">
            <Plus
              width={20}
              height={20}
              weight="bold"
              className="aspect-square min-w-5"
              alt={"config sequence button"}
            />
            Add new sequence
          </Button>
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

      <DataTable columns={columns} data={sequenceMockData} />
    </main>
  )
}
