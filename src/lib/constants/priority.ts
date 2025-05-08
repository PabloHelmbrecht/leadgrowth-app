import { type Enums } from "../supabase/database.types"

import config from "tailwind.config"
const { colors: extendColors } = config.theme.extend
import primaryColors from "tailwindcss/colors"

const colors = { ...extendColors, ...primaryColors }

export const priorityOptions: {
    label: string
    value: Enums<"priority">
    color: string
    className: string
}[] = [
    {
        label: "High",
        value: "high",
        color: colors.danger[500],
        className: "bg-danger-100 text-danger-800",
    },
    {
        label: "Medium",
        value: "medium",
        color: colors.warning[500],
        className: "bg-warning-100 text-warning-800",
    },
    {
        label: "Low",
        value: "low",
        color: colors.slate[500],
        className: "bg-slate-100 text-slate-800",
    },
]
