"use client"

//React
import { useState } from "react"

export function KPI({
    value,
    label,
    onHoverValue,
}: {
    value: string | undefined
    label: string
    onHoverValue?: string | undefined
}) {
    const [isHover, setIsHover] = useState<boolean>(false)

    return (
        <div
            className="flex h-full  flex-col items-center justify-center px-1 text-center text-xs"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <div className="font-semibold">
                {isHover && onHoverValue
                    ? (onHoverValue ?? "-")
                    : (value ?? "-")}
            </div>
            <div>{label}</div>
        </div>
    )
}
