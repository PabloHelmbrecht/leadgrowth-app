import { cn } from "~/lib/utils/classesMerge"

function Skeleton({
    className: className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-neutral-100 dark:bg-neutral-800",
                className,
            )}
            {...props}
        />
    )
}

export { Skeleton }
