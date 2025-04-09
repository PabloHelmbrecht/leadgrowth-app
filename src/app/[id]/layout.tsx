import { TopMenu } from "~/components/layout/workflow/top-menu"
import { FlowSideBar } from "~/components/layout/workflow/flow-sidebar"

import { ReactFlowProvider } from "@xyflow/react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex h-full flex-1 flex-col gap-[3px]">
            <TopMenu />
            <div className="flex h-0  flex-1 ">
                <ReactFlowProvider>{children}</ReactFlowProvider>

                <FlowSideBar />
            </div>
        </section>
    )
}
