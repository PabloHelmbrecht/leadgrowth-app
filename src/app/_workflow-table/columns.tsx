"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
import { getPercentage } from "~/lib/utils/formatters"

//Types and Schemas
import { type Workflow } from "~/lib/stores/mockData/workflow"

//Actions
import { ArchiveWorkflowAction } from "./table-columns/row-actions/archive-workflow-action"
import { CloneWorkflowAction } from "./table-columns/row-actions/clone-workflow-action"

//Data Table Column Components
import { StatusColumn } from "./table-columns/status-column"
import { NameColumn } from "./table-columns/name-column"
import { TagColumn } from "./table-columns/tag-column"
import { ActionsColumn } from "~/components/layout/table/columns/actions-column"
import { KPIColumn } from "~/components/layout/table/columns/kpi-column"

export const columns: ColumnDef<Workflow>[] = [
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
        cell: (cellContext: CellContext<Workflow, unknown>) => (
            <NameColumn {...cellContext} />
        ),
        size: 300,
    },
    {
        accessorKey: "activeProspectsCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(row.getValue("activeProspectsCount") ?? "-")}
                label="Active"
            />
        ),
    },
    {
        accessorKey: "pausedProspectsCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(row.getValue("pausedProspectsCount") ?? "-")}
                label="Paused"
            />
        ),
    },
    {
        accessorKey: "notSendCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
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
        cell: ({ row }: CellContext<Workflow, unknown>) => (
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
        cell: ({ row }: CellContext<Workflow, unknown>) => (
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
        cell: ({ row }: CellContext<Workflow, unknown>) => (
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
        cell: (cellContext: CellContext<Workflow, unknown>) => (
            <StatusColumn {...cellContext} />
        ),
    },
    {
        accessorKey: "tag",
        filterFn: "arrIncludesSomeAndShowWithEmptyFilter" as "auto",
        cell: (cellContext: CellContext<Workflow, unknown>) => (
            <TagColumn {...cellContext} />
        ),
    },
    {
        id: "actions",
        cell: (cellContext: CellContext<Workflow, unknown>) => (
            <ActionsColumn
                actions={[
                    {
                        name: "Edit",
                        type: "link",
                        href: `/${cellContext.row.id}/settings`,
                    },
                    {
                        name: "Clone",
                        type: "dialog",
                        component: CloneWorkflowAction,
                    },
                    {
                        name: "Archive",
                        type: "alert",
                        component: ArchiveWorkflowAction,
                    },
                ]}
                {...cellContext}
            />
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
