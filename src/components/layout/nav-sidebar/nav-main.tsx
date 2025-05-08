"use client"

import { type Icon } from "@phosphor-icons/react"

//Next
import Link from "next/link"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "~/components/ui/sidebar"

export function NavMain({
    items,
    label,
}: {
    items: {
        title: string
        url: string
        icon?: Icon
        isActive?: boolean
    }[]
    label: string
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton tooltip={item.title}>
                            {item.icon && <item.icon weight="bold" />}
                            <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
