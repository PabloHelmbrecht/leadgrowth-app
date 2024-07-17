//Next JS
import Link from "next/link"


//Class Merge
import { cn } from "~/lib/utils"

//UI
import { Button } from "~/components/ui/button"

//Icons
import { CaretLeft, PaperPlaneRight, Users,CheckSquare, Newspaper, Gear } from "@phosphor-icons/react/dist/ssr"



const actionButtons = [{ icon: PaperPlaneRight, name: "Flow", subPath: "/view" },
  { icon: Users, name: "Contacts", subPath: "/view" },
  { icon: CheckSquare, name: "Tasks", subPath: "/tasks" },
  { icon: Newspaper, name: "Actions", subPath: "/actions" },
  { icon: Gear, name: "Settings", subPath: "/settings" }
]


export function TopMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex flex-initial flex-row items-center justify-between bg-white px-8 py-4",
        className,
      )}
      {...props}
    >
      <Link href={'/sequences'}>
      <Button
        variant={"secondary"}
        size={"sm"}
        className={cn(
          " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1",
        )}
      >
        <CaretLeft
          width={16}
          height={16}
          weight="bold"
          className="aspect-square min-w-4"
          alt={"config sequence button"}
        />
        Return to sequences
      </Button>
      </Link>



    </div>
  )
}

