"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
import { getPercentage } from "~/lib/utils"

//Types and Schemas
import { type Sequence } from "~/lib/mockData"

//Data Table Column Components
import { KPIColumn } from "./table-columns/kpi-column"
import { StatusColumn } from "./table-columns/status-column"
import { NameColumn } from "./table-columns/name-column"
import { TagColumn } from "./table-columns/tag-column"
import { ActionsColumn } from "./table-columns/actions-column"

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
    cell: (cellContext: CellContext<Sequence, unknown>) => (
      <NameColumn {...cellContext} />
    ),
  },
  {
    accessorKey: "activeProspectsCount",
    cell: ({ row }: CellContext<Sequence, unknown>) => (
      <KPIColumn
        value={String(row.getValue("activeProspectsCount")??"-")}
        label="Active"
      />
    ),
  },
  {
    accessorKey: "pausedProspectsCount",
    cell: ({ row }: CellContext<Sequence, unknown>) => (
      <KPIColumn
        value={String(row.getValue("pausedProspectsCount")??"-")}
        label="Paused"
      />
    ),
  },
  {
    accessorKey: "notSendCount",
    cell: ({ row }: CellContext<Sequence, unknown>) => (
      <KPIColumn
        value={getPercentage(
          row.getValue("notSendCount"),
          row.getValue("totalCount"),
        )}
        onHoverValue={row.getValue("notSendCount")}
        label="Not Send"
      />
    ),
  },
  {
    accessorKey: "openCount",
    cell: ({ row }: CellContext<Sequence, unknown>) => (
      <KPIColumn
        value={getPercentage(
          row.getValue("openCount"),
          row.getValue("totalCount"),
        )}
        onHoverValue={row.getValue("openCount")}
        label="Opens"
      />
    ),
  },
  {
    accessorKey: "replyCount",
    cell: ({ row }: CellContext<Sequence, unknown>) => (
      <KPIColumn
        value={getPercentage(
          row.getValue("replyCount"),
          row.getValue("totalCount"),
        )}
        onHoverValue={row.getValue("replyCount")}
        label="Replies"
      />
    ),
  },
  {
    accessorKey: "interestedCount",
    cell: ({ row }: CellContext<Sequence, unknown>) => (
      <KPIColumn
        value={getPercentage(
          row.getValue("interestedCount"),
          row.getValue("totalCount"),
        )}
        onHoverValue={row.getValue("interestedCount")}
        label="Interested"
      />
    ),
  },
  {
    accessorKey: "status",
    filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
    cell: (cellContext: CellContext<Sequence, unknown>) => (
      <StatusColumn {...cellContext} />
    ),
  },
  {
    accessorKey: "tag",
    filterFn: "arrIncludesSomeAndShowWithEmptyFilter" as "auto",
    cell: (cellContext: CellContext<Sequence, unknown>) => (
      <TagColumn {...cellContext} />
    ),
  },
  {
    id: "actions",
    cell: (cellContext: CellContext<Sequence, unknown>) => (
      <ActionsColumn {...cellContext} />
    ),
  },
  {
    accessorKey: "owner",
    enableHiding: false,
    filterFn: "includesStringInArrAndShowWithEmptyFilter" as "auto",
  },
  {
    accessorKey: "totalCount",
    enableHiding: false,
  },
]
