"use client"

//React
import { useEffect, useContext } from "react"

//Tanstack Table
import {
    type ColumnDef,
    type TableOptions,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
} from "@tanstack/react-table"

//UI
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "~/components/ui/table"

//Atoms & Jotai
import { useAtom } from "jotai"
import { type TableContext, tableContext } from "./table-context"

//Zod and Schemas
import { z } from "zod"
const arrayStringSchema = z.string().array()

//Types
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
}

export function DataTable<Entity extends { id: string }, TValue>({
    columns,
    hideHeaders = false,
    tableOptions
}: DataTableProps<Entity, TValue> & {
    hideHeaders?: boolean
    tableOptions?: Partial<TableOptions<Entity>>
}) {
    //Mock Data
    const {
        dataAtom,
        tableAtom,
        IsAllRowsSelectedAtom,
        columnFiltersAtom,
        rowSelectionAtom,
    } = useContext(tableContext) ?? ({} as TableContext)
    const [data] = useAtom(dataAtom)

    const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)

    const [, setTableInstance] = useAtom(tableAtom)
    const [, setIsAllRowsSelected] = useAtom(IsAllRowsSelectedAtom)
    const [columnFilters, setColumnFilters] = useAtom(columnFiltersAtom)

    const table = useReactTable<Entity>({
        data: data as Entity[],
        columns,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        filterFns: {
            arrIncludesSomeAndShowWithEmptyFilter: (
                row,
                columnId,
                filterValue,
            ) => {
                if (arrayStringSchema.parse(filterValue).length === 0)
                    return true
                return arrayStringSchema
                    .parse(filterValue)
                    .some((tag) =>
                        arrayStringSchema
                            .parse(row.getValue(columnId))
                            .includes(tag),
                    )
            },
            includesStringInArrAndShowWithEmptyFilter: (
                row,
                columnId,
                filterValue,
            ) => {
                if (arrayStringSchema.parse(filterValue).length === 0)
                    return true
                return arrayStringSchema
                    .parse(filterValue)
                    .includes(String(row.getValue(columnId)))
            },
        },
        getRowId: (row: Entity) => row.id,
        state: {
            rowSelection,
            columnFilters,
        },
        ...tableOptions
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
                        {hideHeaders || (
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext(),
                                                          )}
                                                </TableHead>
                                            )
                                        })}
                                    </TableRow>
                                ))}
                            </TableHeader>
                        )}
                        <TableBody className="h-fit">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
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
