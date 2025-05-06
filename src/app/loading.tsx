import { CircleNotch } from "@phosphor-icons/react/dist/ssr"

export default function Loading() {
    return (
        <div className="flex h-screen w-screen flex-row items-center justify-center gap-2">
            <CircleNotch
                className="animate-spin text-primary-700"
                weight="bold"
                width={20}
                height={20}
            />
            Loading...
        </div>
    )
}
