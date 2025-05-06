"use client"

import * as React from "react"
import { CaretUpDown } from "@phosphor-icons/react/dist/ssr"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "~/components/ui/sidebar"

//Next JS
import Image from "next/image"

//Utils
import { supabaseLoader } from "~/lib/utils/supabaseImageLoader"

//Hooks
import { useTeams, type Team } from "~/lib/hooks/use-teams"

export function TeamSwitcher() {
    const { isMobile } = useSidebar()

    const { data, switchTeam } = useTeams({})

    const teams = data ?? []
    const activeTeam = teams.find((team: Team) => team.isCurrent)

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {activeTeam && (
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground  "
                            >
                                <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <Image
                                        src={supabaseLoader({
                                            storage: "team-logo",
                                            src: String(activeTeam.logo_url),
                                            width: 45,
                                            quality: 100,
                                        })}
                                        alt={String(activeTeam.name)}
                                        width={45}
                                        height={45}
                                    />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {activeTeam.name}
                                    </span>
                                </div>
                                <CaretUpDown
                                    weight="bold"
                                    className="ml-auto data-[state=open]:hidden"
                                />
                            </SidebarMenuButton>
                        )}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-slate-500 dark:text-slate-400">
                            Teams
                        </DropdownMenuLabel>
                        {teams?.map((team: Team) => (
                            <DropdownMenuItem
                                key={team.id}
                                onClick={() => switchTeam(team.id)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center overflow-hidden rounded-sm border">
                                    <Image
                                        src={supabaseLoader({
                                            storage: "team-logo",
                                            src: String(team.logo_url),
                                            width: 45,
                                            quality: 100,
                                        })}
                                        alt={String(team.name)}
                                        width={45}
                                        height={45}
                                    />
                                </div>
                                {team.name}
                                <DropdownMenuShortcut>
                                    {/* ⌘{index + 1} */}
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ))}
                        {/* <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                                <Plus weight="bold" className="size-4" />
                            </div>
                            <div className="font-medium text-slate-500 dark:text-slate-400">
                                Add team
                            </div>
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
