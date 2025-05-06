//UI
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

//Utils
import { supabaseLoader } from "~/lib/utils/supabaseImageLoader"

//Types
import { type Profile } from "~/lib/hooks/use-users"

export function AvatarColumn({ profile }: { profile?: Profile | null }) {
    return (
        <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
                src={supabaseLoader({
                    storage: "profile-avatar",
                    src: String(profile?.avatar_url),
                    width: 45,
                    quality: 100,
                })}
                alt={`${profile?.first_name} ${profile?.last_name}`}
            />
            <AvatarFallback className="rounded-lg">
                {`${profile?.first_name?.[0]}${profile?.last_name?.[0]}`}
            </AvatarFallback>
        </Avatar>
    )
}
