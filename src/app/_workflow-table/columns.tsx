"use client"

//Tanstack Table
import { type CellContext, type ColumnDef } from "@tanstack/react-table"

//UI
import { Checkbox } from "~/components/ui/checkbox"

//Utils
import { getPercentage } from "~/lib/utils/formatters"

//Types
import { type Workflow as Workflow } from "~/lib/hooks/use-workflows"

//Actions
import { ArchiveWorkflowAction } from "./table-columns/row-actions/archive-workflow-action"
import { CloneWorkflowAction } from "./table-columns/row-actions/clone-workflow-action"

//Data Table Column Components
import { StatusColumn } from "./table-columns/status-column"
import { WorkflowNameColumn } from "./table-columns/name-column"
import { TagColumn } from "./table-columns/tag-column"
import { SettingsColumn } from "~/components/layout/table/columns/settings-column"
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
            <WorkflowNameColumn {...cellContext} />
        ),
        size: 300,
    },
    {
        accessorKey: "activeProspectsCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(
                    getPercentage(
                        typeof row.original.metrics?.active === "number"
                            ? row.original.metrics.active
                            : 0,
                        typeof row.original.metrics?.total === "number"
                            ? row.original.metrics.total
                            : 0,
                    ),
                )}
                onHoverValue={String(
                    typeof row.original.metrics?.active === "number"
                        ? row.original.metrics.active
                        : 0,
                )}
                label="Active"
            />
        ),
    },
    {
        accessorKey: "pausedProspectsCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(
                    getPercentage(
                        typeof row.original.metrics?.paused === "number"
                            ? row.original.metrics.paused
                            : 0,
                        typeof row.original.metrics?.total === "number"
                            ? row.original.metrics.total
                            : 0,
                    ),
                )}
                onHoverValue={String(
                    typeof row.original.metrics?.paused === "number"
                        ? row.original.metrics.paused
                        : 0,
                )}
                label="Paused"
            />
        ),
    },
    {
        accessorKey: "notSendCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(
                    getPercentage(
                        typeof row.original.metrics?.unsubscribed === "number"
                            ? row.original.metrics.unsubscribed
                            : 0,
                        typeof row.original.metrics?.total === "number"
                            ? row.original.metrics.total
                            : 0,
                    ),
                )}
                onHoverValue={String(
                    typeof row.original.metrics?.unsubscribed === "number"
                        ? row.original.metrics.unsubscribed
                        : 0,
                )}
                label="Not Send"
            />
        ),
    },
    {
        accessorKey: "bouncedCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(
                    getPercentage(
                        typeof row.original.metrics?.bounced === "number"
                            ? row.original.metrics.bounced
                            : 0,
                        typeof row.original.metrics?.total === "number"
                            ? row.original.metrics.total
                            : 0,
                    ),
                )}
                onHoverValue={String(
                    typeof row.original.metrics?.bounced === "number"
                        ? row.original.metrics.bounced
                        : 0,
                )}
                label="Bounced"
            />
        ),
    },
    {
        accessorKey: "spamCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(
                    getPercentage(
                        typeof row.original.metrics?.spam === "number"
                            ? row.original.metrics.spam
                            : 0,
                        typeof row.original.metrics?.total === "number"
                            ? row.original.metrics.total
                            : 0,
                    ),
                )}
                onHoverValue={String(
                    typeof row.original.metrics?.spam === "number"
                        ? row.original.metrics.spam
                        : 0,
                )}
                label="Spam"
            />
        ),
    },
    {
        accessorKey: "finishedCount",
        cell: ({ row }: CellContext<Workflow, unknown>) => (
            <KPIColumn
                value={String(
                    getPercentage(
                        typeof row.original.metrics?.finished === "number"
                            ? row.original.metrics.finished
                            : 0,
                        typeof row.original.metrics?.total === "number"
                            ? row.original.metrics.total
                            : 0,
                    ),
                )}
                onHoverValue={String(
                    typeof row.original.metrics?.finished === "number"
                        ? row.original.metrics.finished
                        : 0,
                )}
                label="Finished"
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
            <SettingsColumn
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
