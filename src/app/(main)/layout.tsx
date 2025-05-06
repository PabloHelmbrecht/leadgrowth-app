//Styles
import "~/styles/globals.css"
import "~/styles/react-flow-styles.css"

//UI Components

import { AppSidebar } from "~/components/layout/nav-sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"

//Sitemetadata
export const metadata = {
    title: "Lead Growth",
    description: "Last gen prospecting tool",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="  flex h-screen w-full flex-1 flex-col  gap-[2px]  overflow-hidden bg-white">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
