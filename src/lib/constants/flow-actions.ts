//Icon
import {
    Envelope,
    UserPlus,
    Eye,
    ThumbsUp,
    ChatCircle,
    Phone,
    CheckSquare,
    ArrowsSplit,
    DiceFive,
    QuestionMark,
    ArrowsClockwise,
    Bell,
    PaperPlaneRight,
    Robot,
} from "@phosphor-icons/react/dist/ssr"
import { type Icon } from "@phosphor-icons/react"

//Colors
import config from "tailwind.config"
import baseColors from "tailwindcss/colors"
const colors = { ...baseColors, ...config.theme.extend.colors }

//Utils
import { capitalizeWords } from "../utils/formatters"

//Types
export type flowAction = {
    block:
        | "emails"
        | "linkedin"
        | "calls"
        | "tasks"
        | "internal actions"
        | "flow control"
    icon: Icon
    name: string
    type: string
    queryValue?: string
    bgColor: string
    textColor: string
}

export const flowActions: flowAction[] = [
    {
        block: "emails",
        icon: Robot,
        name: "Automatic Email",
        type: "automaticEmail",
        bgColor: colors.success[100],
        textColor: colors.success[600],
    },
    {
        block: "emails",
        icon: Envelope,
        name: "Manual Email",
        type: "manualEmail",
        bgColor: colors.success[100],
        textColor: colors.success[600],
    },
    {
        block: "linkedin",
        icon: UserPlus,
        name: "Connection Request",
        queryValue: "Linkedin Connection Request",
        type: "linkedinConnection",
        bgColor: colors.primary[100],
        textColor: colors.primary[600],
    },
    {
        block: "linkedin",
        icon: ChatCircle,
        name: "Linkedin Message",
        type: "linkedinMessage",
        bgColor: colors.primary[100],
        textColor: colors.primary[600],
    },
    {
        block: "linkedin",
        icon: Eye,
        name: "View Profile",
        queryValue: "View Linkedin Profile",
        type: "linkedinViewProfile",
        bgColor: colors.primary[100],
        textColor: colors.primary[600],
    },
    {
        block: "linkedin",
        icon: ThumbsUp,
        name: "Interact With Post",
        queryValue: "Interact With Linkedin Post",
        type: "linkedinPostInteraction",
        bgColor: colors.primary[100],
        textColor: colors.primary[600],
    },
    {
        block: "calls",
        icon: Phone,
        name: "Phone Call",
        type: "phoneCall",
        bgColor: colors.purple[100],
        textColor: colors.purple[600],
    },
    {
        block: "tasks",
        icon: CheckSquare,
        name: "Manual Task",
        type: "manualTask",
        bgColor: colors.amber[100],
        textColor: colors.amber[600],
    },
    {
        block: "flow control",
        icon: DiceFive,
        name: "Testing A/B",
        type: "testingAB",
        bgColor: colors.slate[100],
        textColor: colors.slate[600],
    },
    {
        block: "flow control",
        icon: QuestionMark,
        name: "Conditional",
        type: "conditional",
        bgColor: colors.slate[100],
        textColor: colors.slate[600],
    },
    {
        block: "flow control",
        icon: ArrowsSplit,
        name: "Splitter",
        type: "splitter",
        bgColor: colors.slate[100],
        textColor: colors.slate[600],
    },
    {
        block: "flow control",
        icon: Envelope,
        name: "Internal Email",
        type: "internalEmail",
        bgColor: colors.rose[100],
        textColor: colors.rose[600],
    },
    {
        block: "flow control",
        icon: ArrowsClockwise,
        name: "Update Field",
        type: "updateField",
        bgColor: colors.rose[100],
        textColor: colors.rose[600],
    },
    {
        block: "flow control",
        icon: Bell,
        name: "App Notification",
        type: "appNotification",
        bgColor: colors.rose[100],
        textColor: colors.rose[600],
    },
    {
        block: "flow control",
        icon: PaperPlaneRight,
        name: "Manage Workflows",
        type: "manageWorkflows",
        bgColor: colors.rose[100],
        textColor: colors.rose[600],
    },
]

export const flowActionMap = flowActions.reduce(
    (map: Map<flowAction["type"], flowAction>, action: flowAction) =>
        map.set(action.type, action),
    new Map<flowAction["type"], flowAction>(),
)

export type flowActionBlock = {
    title: string
    items: Omit<flowAction, "block">[]
}

export const flowActionsBlocks = Array.from(
    flowActions.reduce(
        (
            acc: Map<flowActionBlock["title"], flowActionBlock["items"]>,
            action: flowAction,
        ) => {
            const actionBlockTitle = capitalizeWords(action.block)
            if (!acc.has(actionBlockTitle)) {
                acc.set(actionBlockTitle, [])
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { block, ...rest } = action
            acc.get(actionBlockTitle)?.push(rest)
            return acc
        },
        new Map<flowActionBlock["title"], flowActionBlock["items"]>(),
    ),
    ([title, items]) => ({ title, items }),
)
