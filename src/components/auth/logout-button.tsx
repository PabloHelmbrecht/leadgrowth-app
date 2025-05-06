"use client"

import { createClient } from "~/lib/supabase/client"
import { useRouter } from "next/navigation"
import { cn } from "~/lib/utils/classesMerge"
export function LogoutButton({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    const router = useRouter()

    const logout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/auth/login")
    }

    return (
        <span onClick={logout} className={cn(className)}>
            {children}
        </span>
    )
}
