//Next JS
import Link from "next/link"

//Tanstack Table
import { type CellContext } from "@tanstack/react-table"

//UI
import { Button } from "~/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import { MultiDialogProvider } from "~/components/ui/multi-dialog"

//Icons
import { DotsThree } from "@phosphor-icons/react/dist/ssr"

export function ActionsColumn<Entity>({
    actions,
    ...cellContext
}: {
    actions: {
        name: string
        type: "dialog" | "alert" | "link"
        component?: React.JSXElementConstructor<CellContext<Entity, unknown>>
        href?: string
    }[]
} & CellContext<Entity, unknown>) {
    return (
        <MultiDialogProvider>
            {({ Trigger, Container }) => (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="secondary"
                                className="h-fit w-fit px-3 py-1"
                            >
                                <span className="sr-only">Open menu</span>
                                <DotsThree size={16} weight="bold" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {actions.map((action, index) => {
                                const { name, type, href } = action

                                if (type === "link") {
                                    return (
                                        <DropdownMenuItem key={index}>
                                            <Link href={href ?? ""}>Edit</Link>
                                        </DropdownMenuItem>
                                    )
                                }

                                return (
                                    <Trigger
                                        value={index}
                                        key={index}
                                        variant={type}
                                    >
                                        <DropdownMenuItem>
                                            <button>{name}</button>
                                        </DropdownMenuItem>
                                    </Trigger>
                                )
                            })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {actions.map((action, index) =>
                        action.type === "link" ? (
                            <></>
                        ) : (
                            <Container
                                value={index}
                                variant={action.type}
                                key={index}
                            >
                                {action.component && (
                                    <action.component {...cellContext} />
                                )}
                            </Container>
                        ),
                    )}
                </>
            )}
        </MultiDialogProvider>
    )
}
