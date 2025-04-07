import { TopMenu } from "~/components/layout/workflow/top-menu"
import { FlowSideBar } from "~/components/layout/workflow/flow-sidebar"

import { ReactFlowProvider } from "@xyflow/react"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
            <section className="flex flex-1 flex-col gap-[3px] h-full">
                <TopMenu />
        <div className="flex flex-1  h-0 ">

                <ReactFlowProvider>{children}</ReactFlowProvider>

            <FlowSideBar />
            </div>
        </section>
    )
}
