import { type Enums } from "../supabase/database.types"

import config from "tailwind.config"
const { colors: extendColors } = config.theme.extend
import primaryColors from "tailwindcss/colors"

const colors = { ...extendColors, ...primaryColors }

export const workflowStatus: {
    value: Enums<"workflow_status">
    label: string
    color: string
}[] = [
    {
        value: "active",
        label: "Active",
        color: colors.success[500],
    },
    {
        value: "paused",
        label: "Paused",
        color: colors.slate[500],
    },
    {
        value: "archived",
        label: "Archived",
        color: colors.danger[500],
    },
]

export const contactStatus: {
    value: Enums<"contact_status">
    label: string
    color: string
}[] = [
    {
        value: "active",
        label: "Active",
        color: colors.primary[500],
    },
    {
        value: "paused",
        label: "Paused",
        color: colors.slate[500],
    },
    {
        value: "unsubscribed",
        label: "Unsubscribed",
        color: colors.danger[500],
    },
    {
        value: "bounced",
        label: "Bounced",
        color: colors.danger[500],
    },
    {
        value: "spam",
        label: "Spam",
        color: colors.danger[500],
    },
    {
        value: "finished",
        label: "Finished",
        color: colors.success[500],
    },
]

export const contactStageType: Record<Enums<"stage_type">, string> = {
    "no category": colors.slate[500],
    "in progress": colors.primary[500],
    succeded: colors.success[500],
    "not succeded": colors.danger[500],
}
