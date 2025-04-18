import * as React from "react"

import { cn } from "~/lib/utils/classesMerge"

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

//Cambié ring-2 por ring-0 y el ringoffset también

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className: className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-neutral-950 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300",
                    className,
                )}
                ref={ref}
                {...props}
            />
        )
    },
)
Textarea.displayName = "Textarea"

export { Textarea }
