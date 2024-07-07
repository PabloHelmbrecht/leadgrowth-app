"use client"

//React
import { useEffect, useState } from "react"

//Tanstack Table
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table"

//UI
import { Table, TableBody, TableCell, TableRow } from "~/components/ui/table"
import { Checkbox } from "~/components/ui/checkbox"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badge"
import { Switch } from "~/components/ui/switch"

//Utils
import { Color, cn } from "~/lib/utils"

//Icons
import { DotsThree, Star } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import {
  tableSequenceAtom,
  IsAllRowsSelectedAtom,
  columnFiltersAtom,
  rowSelectionAtom,
} from "~/lib/store"
import { tagsMockDataAtom, sequencesMockDataAtom } from "~/lib/mockData"

//Types and Schemas
import { type Sequence, tagSchema, sequenceSchema } from "~/lib/mockData"

//Zod
import { z } from "zod"
const arrayStringSchema = z.string().array()
const tableMetaSchema = z.object({
  getTags: z.function().returns(z.array(tagSchema)),
  setSequenceData: z
    .function()
    .args(z.string(), z.string(), z.unknown())
    .returns(z.void()),
})

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export const columns: ColumnDef<Sequence>[] = [
  {
    id: "select",

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    cell: ({ row, table }) => (
      <div className="flex h-full flex-1 flex-col items-start justify-start gap-2 overflow-clip whitespace-nowrap pl-2">
        {row.getValue("name")}
        <div className=" flex w-full items-start gap-2 overflow-clip ">
          {arrayStringSchema
            .parse(row.getValue("tag"))
            .filter((tag) => tag !== "starred")
            .map((tag, k) => {
              const tags = tableMetaSchema.parse(table.options.meta).getTags()
              const color = new Color(
                tags.find(({ value }) => tag === value)?.color,
              )
              const textColor = color
                .normalizeSB(90)
                .adjustHSB({ hue: 0, saturation: 40, brightness: -40 })
                .getHex()
              const backgroundColor = color
                .normalizeSB(90)
                .adjustHSB({ hue: 0, saturation: -70, brightness: 50 })
                .getHex()

              return (
                <Badge
                  key={k}
                  className="min-w-fit overflow-clip whitespace-nowrap font-normal"
                  style={{
                    backgroundColor,
                    color: textColor,
                  }}
                >
                  {tags.find(({ value }) => tag === value)?.label}
                </Badge>
              )
            })}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "activeProspectsCount",
    cell: ({ row }) => (
      <KPIColumn
        value={String(row.getValue("activeProspectsCount"))}
        label="Active"
      />
    ),
  },
  {
    accessorKey: "pausedProspectsCount",
    cell: ({ row }) => (
      <KPIColumn
        value={String(row.getValue("pausedProspectsCount"))}
        label="Paused"
      />
    ),
  },
  {
    accessorKey: "notSendCount",
    cell: ({ row }) => (
      <KPIColumn
        value={`${Math.round((Number(row.getValue("notSendCount")) / Number(row.getValue("totalCount"))) * 1000) / 10}%`}
        onHoverValue={row.getValue("notSendCount")}
        label="Opens"
      />
    ),
  },
  {
    accessorKey: "openCount",
    cell: ({ row }) => (
      <KPIColumn
        value={`${Math.round((Number(row.getValue("openCount")) / Number(row.getValue("totalCount"))) * 1000) / 10}%`}
        onHoverValue={row.getValue("openCount")}
        label="Opens"
      />
    ),
  },
  {
    accessorKey: "replyCount",
    cell: ({ row }) => (
      <KPIColumn
        value={`${Math.round((Number(row.getValue("replyCount")) / Number(row.getValue("totalCount"))) * 1000) / 10}%`}
        onHoverValue={row.getValue("replyCount")}
        label="Replies"
      />
    ),
  },
  {
    accessorKey: "interestedCount",
    cell: ({ row }) => (
      <KPIColumn
        value={`${Math.round((Number(row.getValue("interestedCount")) / Number(row.getValue("totalCount"))) * 1000) / 10}%`}
        onHoverValue={row.getValue("interestedCount")}
        label="Interested"
      />
    ),
  },

  {
    accessorKey: "totalCount",
    enableHiding: false,
  },
  {
    accessorKey: "status",
    filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
    cell: ({ row, table }) => (
      <Switch
        className={
          row.getValue("status") === "archived"
            ? "data-[state=unchecked]:bg-danger-300"
            : ""
        }
        disabled={row.getValue("status") === "archived"}
        checked={row.getValue("status") === "active"}
        onCheckedChange={(value) => {
          if (value) {
            tableMetaSchema
              .parse(table.options.meta)
              .setSequenceData(row.id, "status", "active")
            return
          }

          tableMetaSchema
            .parse(table.options.meta)
            .setSequenceData(row.id, "status", "paused")
        }}
      />
    ),
  },
  {
    accessorKey: "tag",
    filterFn: "arrIncludesSomeAndShowWithEmptyFilter" as "auto",
    cell: ({ row, table }) => {
      const isStarred = arrayStringSchema
        .parse(row.getValue("tag"))
        .includes("starred")
      const tags = arrayStringSchema.parse(row.getValue("tag"))

      const color = tableMetaSchema
        .parse(table.options.meta)
        .getTags()
        .find(({ value }) => value === "starred")?.color

      return (
        <button
          className="flex h-full items-center justify-center"
          onClick={() => {
            if (isStarred) {
              tableMetaSchema.parse(table.options.meta).setSequenceData(
                row.id,
                "tag",
                tags.filter((tag) => tag !== "starred"),
              )
              return
            }

            tableMetaSchema
              .parse(table.options.meta)
              .setSequenceData(row.id, "tag", [...tags, "starred"])
          }}
        >
          <Star
            size={22}
            weight={isStarred ? "fill" : "regular"}
            className=" text-neutral-900"
            style={{ color: isStarred ? color : "" }}
          />
        </button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-fit w-fit px-3 py-1">
              <span className="sr-only">Open menu</span>
              <DotsThree size={20} weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  {
    accessorKey: "owner",
    enableHiding: false,
    filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
  },
]

function KPIColumn({
  value,
  label,
  onHoverValue,
}: {
  value: string
  label: string
  onHoverValue?: string
}) {
  const [isHover, setIsHover] = useState<boolean>(false)
  return (
    <div
      className="flex h-full  flex-col items-center justify-center px-1 text-center text-xs"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="font-semibold">
        {isHover && onHoverValue ? onHoverValue : value}
      </div>
      <div>{label}</div>
    </div>
  )
}

export function DataTable<Sequence, TValue>({
  columns,
  data,
}: DataTableProps<Sequence, TValue>) {
  //Mock Data
  const [tagsMockData] = useAtom(tagsMockDataAtom)
  const [, setSequencesMockData] = useAtom(sequencesMockDataAtom)

  const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)

  const [, setTableInstance] = useAtom(tableSequenceAtom)
  const [, setIsAllRowsSelected] = useAtom(IsAllRowsSelectedAtom)
  const [columnFilters, setColumnFilters] = useAtom(columnFiltersAtom)

  const table = useReactTable<Sequence>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      arrIncludesSomeAndShowWithEmptyFilter: (row, columnId, filterValue) => {
        if (arrayStringSchema.parse(filterValue).length === 0) return true
        return arrayStringSchema
          .parse(filterValue)
          .some((tag) =>
            arrayStringSchema.parse(row.getValue(columnId)).includes(tag),
          )
      },
      includesStringInArrAndShowWithEmptyFilter: (
        row,
        columnId,
        filterValue,
      ) => {
        if (arrayStringSchema.parse(filterValue).length === 0) return true
        return arrayStringSchema
          .parse(filterValue)
          .includes(String(row.getValue(columnId)))
      },
    },
    getRowId: (row) => sequenceSchema.parse(row).id,
    initialState: {
      columnVisibility: {
        owner: false,
        totalCount: false,
      },
    },
    state: {
      rowSelection,
      columnFilters,
    },
    meta: {
      getTags: () => tagsMockData,
      setSequenceData: (rowId: string, columnId: string, newValue: unknown) => {
        setSequencesMockData((oldSequencesMockData) =>
          oldSequencesMockData.map((row) => {
            if (row.id === rowId) {
              return {
                ...row,
                [columnId]: newValue,
              }
            }

            return row
          }),
        )
      },
    },
  })

  useEffect(() => {
    setTableInstance(table as never),
      setIsAllRowsSelected(
        table.getRowCount() === Object.keys(rowSelection).length,
      )
  }, [table, setTableInstance, setIsAllRowsSelected, rowSelection])

  return (
    <div className="flex  h-0 flex-1 flex-col gap-4">
      <div className=" relative overflow-hidden rounded-lg bg-white ">
        <div className="scroll h-full overflow-auto">
          <Table>
            <TableBody className="h-fit">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="flex items-center justify-between"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          String(cell.column.id) === "name"
                            ? "flex-1"
                            : "flex-initial",
                          "flex h-20 max-h-full items-center",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className=" text-muted-foreground h-fit flex-initial text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  )
}
