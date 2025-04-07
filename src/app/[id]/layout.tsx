import { TopMenu } from "~/components/layout/workflow/top-menu"
import { FlowSideBar } from "~/components/layout/workflow/flow-sidebar"

import { ReactFlowProvider } from "@xyflow/react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex flex-1  gap-[2px]">
            <div className="flex flex-1 flex-col">
                <TopMenu />

                <ReactFlowProvider>{children}</ReactFlowProvider>
            </div>

            <FlowSideBar />
        </section>
    )
}
