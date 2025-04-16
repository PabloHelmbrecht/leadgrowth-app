//React
import React from "react"

//React Flow
import {
    Handle as HandlePrimitve,
    useHandleConnections,
    type HandleProps,
    Position,
} from "@xyflow/react"

//Utilities
import { cn } from "~/lib/utils/classesMerge"

//Env Variables
import { env } from "~/env"

export function Handle(props: HandleProps) {
    const connections = useHandleConnections({
        type: props.type,
        id: props.id,
    })


    return (
        <div
            className={cn(
                "group/handler absolute left-1/2  aspect-square w-20 -translate-x-1/2  rounded-full bg-transparent",
                props?.position === Position.Top
                    ? "!top-0 !-translate-y-1/2 "
                    : "!bottom-0 !translate-y-1/2 ",
            )}
        >
            <HandlePrimitve
                {...props}
                type={props.type}
                isConnectable={
                    !env.NEXT_PUBLIC_SINGLE_CONNECTION_MODE ||
                    (props.type === "source" ? connections.length < 1 : true)
                }
                className={cn(
                    "absolute !left-1/2 !top-1/2  !z-10 !h-1 !w-3 !-translate-x-1/2 !-translate-y-1/2 transform  !rounded-none !border-none  !bg-primary-700 transition-all group-hover/handler:!h-6 group-hover/handler:!w-6 group-hover/handler:!rounded-full  group-[.danger]:!bg-danger-500 ",
                    props?.position === Position.Top
                        ? "!rounded-t-sm"
                        : "!rounded-b-sm",
                )}
            />
        </div>
    )
}
