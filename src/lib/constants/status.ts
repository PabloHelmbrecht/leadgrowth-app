import { type Enums } from "../supabase/database.types"

import config from "tailwind.config"
const { colors: extendColors } = config.theme.extend
import primaryColors from "tailwindcss/colors"

const colors = { ...extendColors, ...primaryColors }

export const workflowStatus: {
    value: Enums<"workflow_status">
    label: string
    color: string
    className: string
}[] = [
    {
        value: "active",
        label: "Active",
        color: colors.success[500],
        className: "bg-success-100 text-success-800",
    },
    {
        value: "paused",
        label: "Paused",
        color: colors.slate[500],
        className: "bg-slate-100 text-slate-800",
    },
    {
        value: "archived",
        label: "Archived",
        color: colors.danger[500],
        className: "bg-danger-100 text-danger-800",
    },
]

export const contactStatus: {
    value: Enums<"contact_status">
    label: string
    color: string
    className: string
}[] = [
    {
        value: "active",
        label: "Active",
        color: colors.primary[500],
        className: "bg-primary-100 text-primary-800",
    },
    {
        value: "paused",
        label: "Paused",
        color: colors.slate[500],
        className: "bg-slate-100 text-slate-800",
    },
    {
        value: "unsubscribed",
        label: "Unsubscribed",
        color: colors.danger[500],
        className: "bg-danger-100 text-danger-800",
    },
    {
        value: "bounced",
        label: "Bounced",
        color: colors.danger[500],
        className: "bg-danger-100 text-danger-800",
    },
    {
        value: "spam",
        label: "Spam",
        color: colors.danger[500],
        className: "bg-danger-100 text-danger-800",
    },
    {
        value: "finished",
        label: "Finished",
        color: colors.success[500],
        className: "bg-success-100 text-success-800",
    },
]

export const actionStatus: {
    value: Enums<"action_status">
    label: string
    color: string
    className: string
}[] = [
    {
        value: "pending",
        label: "Pending",
        color: colors.warning[500],
        className: "bg-warning-100 text-warning-800",
    },
    {
        value: "scheduled",
        label: "In progress",
        color: colors.primary[500],
        className: "bg-primary-100 text-primary-800",
    },
    {
        value: "completed",
        label: "Completed",
        color: colors.success[500],
        className: "bg-success-100 text-success-800",
    },
    {
        value: "delayed",
        label: "Delayed",
        color: colors.warning[500],
        className: "bg-warning-100 text-warning-800",
    },
    {
        value: "error",
        label: "Error",
        color: colors.danger[500],
        className: "bg-danger-100 text-danger-800",
    },
    {
        value: "skipped",
        label: "Skipped",
        color: colors.slate[500],
        className: "bg-slate-100 text-slate-800",
    },
]

export const contactStageType: Record<Enums<"stage_type">, string> = {
    "no category": colors.slate[500],
    "in progress": colors.primary[500],
    succeded: colors.success[500],
    "not succeded": colors.danger[500],
}
