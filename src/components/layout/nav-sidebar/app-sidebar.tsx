"use client"

import * as React from "react"

import {
    Buildings,
    Users,
    PaperPlaneTilt,
} from "@phosphor-icons/react/dist/ssr"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "~/components/ui/sidebar"

const menuItems = [
    {
        label: "Explore",
        items: [
            {
                title: "Companies",
                url: "#",
                icon: Buildings,
                isActive: true,
            },
            {
                title: "People",
                url: "#",
                icon: Users,
            },
        ],
    },

    {
        label: "Engage",
        items: [
            {
                title: "Workflows",
                url: "#",
                icon: PaperPlaneTilt,
                isActive: true,
            },
        ],
    },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((item) => (
                    <NavMain
                        key={item.label}
                        items={item.items}
                        label={item.label}
                    />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
