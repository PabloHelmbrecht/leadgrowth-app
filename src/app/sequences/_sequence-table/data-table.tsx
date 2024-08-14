"use client"

//NextJS
import Link from "next/link"
//React
import { useEffect } from "react"

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

//Utils
import { cn } from "~/lib/utils"

//Atoms & Jotai
import { useAtom } from "jotai"
import {
  tableSequenceAtom,
  IsAllRowsSelectedAtom,
  columnFiltersAtom,
  rowSelectionAtom,
} from "~/lib/store"
import { tagsMockDataAtom, sequencesMockDataAtom } from "~/lib/mockData"

//Zod and Schemas
import { z } from "zod"
const arrayStringSchema = z.string().array()
import { sequenceSchema } from "~/lib/mockData"

//Types
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
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
      cloneSequence: (rowId: string) => {
        setSequencesMockData((oldSequencesMockData) => {
          const foundSequence = oldSequencesMockData.find(
            (sequence) => sequence.id === rowId,
          )
          if (foundSequence) {
            foundSequence.id = `${foundSequence.id}_copy`
            return [...oldSequencesMockData, foundSequence]
          }

          return oldSequencesMockData
        })
      },
      archiveSequence: (rowId: string) => {
        setSequencesMockData((oldSequencesMockData) =>
          oldSequencesMockData.map((sequence) => {
            if (rowId === sequence.id) {
              return { ...sequence, status: "archived" }
            }
            return sequence
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
                    className="flex w-full items-center justify-between"
                  >
                    {row.getVisibleCells().map((cell) => {
                      if (String(cell.column.id) === "name") {
                        return (
                          <TableCell
                            key={cell.id}
                            className={cn(
                              "flex-1",
                              "flex h-20 max-h-full w-full items-center",
                            )}
                          >
                            <Link href={`/sequences/${row.id}/flow`}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </Link>
                          </TableCell>
                        )
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "flex-initial",
                            "flex h-20 max-h-full items-center",
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      )
                    })}
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
