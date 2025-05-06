import { SignOut, CaretUpDown } from "@phosphor-icons/react/dist/ssr"

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "~/components/ui/sidebar"

//Auth
import { LogoutButton } from "~/components/auth/logout-button"

//Utils
import { supabaseLoader } from "~/lib/utils/supabaseImageLoader"

//Hook
import { useUsers } from "~/lib/hooks/use-users"

export function NavUser() {
    const { isMobile } = useSidebar()

    const { data: users } = useUsers({})

    const user = users?.find((user) => user.isCurrent)?.profile

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage
                                    src={supabaseLoader({
                                        storage: "profile-avatar",
                                        src: String(user?.avatar_url),
                                        width: 45,
                                        quality: 100,
                                    })}
                                    alt={`${user?.first_name} ${user?.last_name}`}
                                />
                                <AvatarFallback className="rounded-lg">
                                    {`${user?.first_name?.[0]}${user?.last_name?.[0]}`}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {user?.first_name}
                                </span>
                                <span className="truncate text-xs">
                                    {user?.email}
                                </span>
                            </div>
                            <CaretUpDown
                                weight="bold"
                                className="ml-auto size-4"
                            />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={supabaseLoader({
                                            storage: "profile-avatar",
                                            src: String(user?.avatar_url),
                                            width: 45,
                                            quality: 100,
                                        })}
                                        alt={`${user?.first_name} ${user?.last_name}`}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        {`${user?.first_name?.[0]}${user?.last_name?.[0]}`}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {`${user?.first_name} ${user?.last_name}`}
                                    </span>
                                    <span className="truncate text-xs">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                            <LogoutButton className="flex flex-row items-center gap-2">
                                <SignOut weight="bold" size={16} />
                                Log out
                            </LogoutButton>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
