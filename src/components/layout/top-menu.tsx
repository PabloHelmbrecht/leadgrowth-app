"use client"

//React
import { useState } from "react"

//UI
import { Button } from "~/components/ui/button"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "~/components/ui/sheet"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

import { Badge } from "~/components/ui/badge"

import { ScrollArea } from "~/components/ui/scroll-area"

//Next
import Link from "next/link"

//DayJS
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

//Atoms & Jotai
import { useAtom } from "jotai"
import { sideBarAtom } from "~/lib/stores/sidebar"
import {
    activitiesMockDataAtom,
    notificationsMockDataAtom,
} from "~/lib/stores/mockData/system"

//Types
import type { Activity, Notification } from "~/lib/stores/mockData/system"

//Class Merge
import { cn } from "~/lib/utils/classesMerge"

//Icons
import {
    MagnifyingGlass,
    CaretLeft,
    Gear,
    User,
    Bell,
    Check,
    CursorClick,
    Note,
    Clock,
    Prohibit,
    HandPalm,
    Phone,
    LinkedinLogo,
    Fire,
    BellRinging,
    ArrowUDownLeft,
} from "@phosphor-icons/react/dist/ssr"
import {
    CreditCard,
    Keyboard,
    Users,
    UserPlus,
    EnvelopeSimple,
    PlusCircle,
    Plus,
    GithubLogo,
    Lifebuoy,
    Cloud,
    Chat,
    SignOut,
    Eye,
    PaperPlaneRight,
} from "@phosphor-icons/react/dist/ssr"

export function TopMenu({
    className: className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "relative flex flex-initial flex-row items-center justify-between bg-white px-8 py-4",
                className,
            )}
            {...props}
        >
            <SidebarButton />

            <div className="">
                <SearchBar />
            </div>

            <div className="flex flex-row items-center gap-4">
                <SettingsButton />
                <NotificationsButton />
                <ProfileButton />
            </div>
        </div>
    )
}

function SidebarButton() {
    const [isOpen, setIsOpen] = useAtom(sideBarAtom)
    return (
        <Button
            variant={"secondary"}
            className="dark:hover:text-primary-50 aspect-square p-2 hover:text-primary-700"
            size={"sm"}
            onClick={() => setIsOpen(!isOpen)}
        >
            <CaretLeft
                width={20}
                height={20}
                weight="bold"
                alt="Close Sidebar"
                className={cn(`${isOpen || "rotate-180"} premium-transition	`)}
            />
        </Button>
    )
}

function SearchBar() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const frameworks = [
        {
            value: "next.js",
            label: "Next.js",
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
        {
            value: "astro",
            label: "Astro",
        },
    ]

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className=" w-64 justify-between font-normal"
                    size={"sm"}
                >
                    {value
                        ? frameworks.find(
                              (framework) => framework.value === value,
                          )?.label
                        : "Search prospects..."}
                    <MagnifyingGlass
                        className="ml-2 h-4 w-4 shrink-0 opacity-50"
                        alt="Search Prospects"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
                <Command>
                    <CommandInput placeholder="Search prospects..." />
                    <CommandList>
                        <CommandEmpty>No prospects found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue,
                                        )
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function SettingsButton() {
    return (
        <Link href={"/settings"}>
            <Button
                variant={"secondary"}
                className="dark:hover:text-primary-50 aspect-square p-2 hover:text-primary-700"
                size={"sm"}
            >
                <Gear width={20} height={20} weight="bold" alt="Settings" />
            </Button>
        </Link>
    )
}

function NotificationsButton() {
    const [activitiesMockData] = useAtom(activitiesMockDataAtom)
    const [notificationsMockData] = useAtom(notificationsMockDataAtom)
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant={"secondary"}
                    className="dark:hover:text-primary-50 relative aspect-square p-2 hover:text-primary-700"
                    size={"sm"}
                >
                    <Bell
                        width={20}
                        height={20}
                        weight="bold"
                        alt="Activities and Notifications"
                    />
                    <div className="absolute -right-1 -top-1 aspect-square w-3 rounded-full bg-danger-500" />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col divide-y divide-neutral-200">
                <SheetHeader className=" pb-6">
                    <SheetTitle>Activities & Notifications</SheetTitle>
                    <SheetDescription>
                        Review your most recent activities and notifications
                    </SheetDescription>
                </SheetHeader>
                <Tabs
                    defaultValue="activities"
                    className="h-fill-available flex w-full flex-col py-6"
                >
                    <TabsList className="grid w-full flex-initial grid-cols-2">
                        <TabsTrigger value="activities">Activities</TabsTrigger>
                        <TabsTrigger value="notifications">
                            Notifications
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        value="activities"
                        className="  mb-28 mt-5  w-[calc(100%+1rem)] flex-1 overflow-y-scroll  "
                    >
                        <ScrollArea className="h-full w-full overflow-x-visible overscroll-x-none">
                            <div className="flex flex-col items-start justify-start gap-4 pr-4 ">
                                {activitiesMockData.map((activity, key) => (
                                    <ActivityBlock {...activity} key={key} />
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent
                        value="notifications"
                        className="  mb-28 mt-5  w-[calc(100%+1rem)] flex-1 overflow-y-scroll  "
                    >
                        <ScrollArea className="h-full w-full overflow-x-visible overscroll-x-none">
                            <div className="flex flex-col items-start justify-start gap-4 pr-4 ">
                                {notificationsMockData
                                    .sort((a, b) => {
                                        return (
                                            Number(b.unseen === true) -
                                            Number(a.unseen === true)
                                        )
                                    })
                                    .map((notification, key) => (
                                        <NotificationBlock
                                            {...notification}
                                            key={key}
                                        />
                                    ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}

function ProfileButton() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={"terciary"}
                    className="aspect-square p-2 "
                    size={"sm"}
                >
                    <User width={20} height={20} weight="bold" alt="Settings" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="absolute -right-5 w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Gear className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Keyboard className="mr-2 h-4 w-4" />
                        <span>Keyboard shortcuts</span>
                        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Team</span>
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Invite users</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>
                                    <EnvelopeSimple className="mr-2 h-4 w-4" />
                                    <span>Email</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Chat className="mr-2 h-4 w-4" />
                                    <span>Message</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span>More...</span>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem>
                        <Plus className="mr-2 h-4 w-4" />
                        <span>New Team</span>
                        <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <GithubLogo className="mr-2 h-4 w-4" />
                    <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Lifebuoy className="mr-2 h-4 w-4" />
                    <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                    <Cloud className="mr-2 h-4 w-4" />
                    <span>API</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <SignOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function ActivityBlock({
    type,
    timestamp,
    title,
    description,
    path,
    className = "",
}: Activity & { className?: string }) {
    const typeParams = {
        system: {
            icon: <Gear weight="bold" />,
            color: "bg-slate-100 text-slate-600 ",
        },
        note: {
            icon: <Note weight="bold" />,
            color: "bg-slate-100 text-slate-600 ",
        },
        click: {
            icon: <CursorClick weight="bold" />,
            color: "bg-success-100 text-success-600 ",
        },
        open: {
            icon: <Eye weight="bold" />,
            color: "bg-success-100 text-success-600 ",
        },
        reply: {
            icon: <ArrowUDownLeft weight="bold" />,
            color: "bg-success-100 text-success-600 ",
        },
        "email sent": {
            icon: <PaperPlaneRight weight="bold" />,
            color: "bg-success-100 text-success-600 ",
        },
        "email scheduled": {
            icon: <Clock weight="bold" />,
            color: "bg-success-100 text-success-600 ",
        },
        unsubscription: {
            icon: <HandPalm weight="bold" />,
            color: "bg-danger-100 text-danger-600 ",
        },
        "email bounced": {
            icon: <Prohibit weight="bold" />,
            color: "bg-danger-100 text-danger-600 ",
        },
        call: {
            icon: <Phone weight="bold" />,
            color: "bg-violet-100 text-violet-600 ",
        },
        linkedin: {
            icon: <LinkedinLogo weight="bold" />,
            color: "bg-primary-100 text-primary-600 ",
        },
    }

    let activityBlock = (
        <Alert
            className={cn(
                "flex flex-row items-start justify-start gap-3",
                path ? "" : className,
            )}
        >
            <div
                className={cn(
                    "flex aspect-square items-center justify-center overflow-clip rounded-full [&>svg]:aspect-square [&>svg]:w-7",
                    typeParams[type]?.color,
                )}
            >
                {typeParams[type]?.icon}
            </div>
            <div>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                    {description}
                    <div className="flex w-full flex-row items-center justify-start">
                        <Badge className="w-fit text-xs" variant={"secondary"}>
                            {dayjs(timestamp).fromNow()}
                        </Badge>
                    </div>
                </AlertDescription>
            </div>
        </Alert>
    )

    if (path) {
        activityBlock = (
            <Link href={path} className={className}>
                {activityBlock}
            </Link>
        )
    }

    return activityBlock
}

function NotificationBlock({
    priority,
    timestamp,
    title,
    description,
    unseen = false,
    className = "",
    path,
}: Notification & { className?: string }) {
    const priorityParams = {
        low: {
            icon: <Bell weight="bold" />,
            color: "bg-success-100 text-success-600 ",
        },
        medium: {
            icon: <BellRinging weight="bold" />,
            color: "bg-warning-100 text-warning-600 ",
        },
        high: {
            icon: <Fire weight="bold" />,
            color: "bg-danger-100 text-danger-600 ",
        },
    }

    let notificationBlock = (
        <Alert
            className={cn(
                "relative flex flex-row items-start justify-start gap-3",
                path ? "" : className,
            )}
        >
            <div
                className={cn(
                    "flex aspect-square items-center justify-center overflow-clip rounded-full [&>svg]:aspect-square [&>svg]:w-7",
                    priorityParams[priority]?.color,
                )}
            >
                {priorityParams[priority]?.icon}
            </div>
            <div>
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription className="flex flex-col gap-2">
                    {description}
                    <div className="flex w-full flex-row items-center justify-start">
                        <Badge className="w-fit text-xs" variant={"secondary"}>
                            {dayjs(timestamp).fromNow()}
                        </Badge>
                    </div>
                </AlertDescription>
            </div>
            {unseen && (
                <div className="absolute right-3 top-3 aspect-square  w-3 rounded-full bg-primary-300" />
            )}
        </Alert>
    )

    if (path) {
        notificationBlock = (
            <Link href={path} className={className}>
                {notificationBlock}
            </Link>
        )
    }

    return notificationBlock
}
