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
import {
    DotsThree,
    EnvelopeSimple,
    Phone,
    Database,
    ListBullets,
    LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr"

//Types
import { type Contact } from "~/lib/stores/mockData/contact"

//Actions
// import { ArchiveWorkflowAction } from "./row-actions/archive-workflow-action"
// import { CloneWorkflowAction } from "./row-actions/clone-workflow-action"

export function ActionsColumn(cellContext: CellContext<Contact, unknown>) {
    enum dialogs {
        Clone = 1,
        Archive = 2,
    }

    return (
        <MultiDialogProvider<dialogs>>
            {({ Trigger }) => (
                <>
                    <DropdownMenu>
                        <div className="flex flex-row items-center divide-x divide-neutral-200 overflow-clip rounded-md">
                            <Button
                                variant="secondary"
                                className="h-fit w-fit rounded-none px-3 py-1"
                            >
                                <span className="sr-only">Open menu</span>
                                <EnvelopeSimple size={16} weight="bold" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-fit w-fit rounded-none px-3 py-1"
                            >
                                <span className="sr-only">Open menu</span>
                                <Phone size={16} weight="bold" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-fit w-fit rounded-none px-3 py-1"
                            >
                                <span className="sr-only">Open menu</span>
                                <LinkedinLogo size={16} weight="bold" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-fit w-fit rounded-none px-3 py-1"
                            >
                                <span className="sr-only">Open menu</span>
                                <ListBullets size={16} weight="bold" />
                            </Button>
                            <Button
                                variant="secondary"
                                className="h-fit w-fit rounded-none px-3 py-1"
                            >
                                <span className="sr-only">Open menu</span>
                                <Database size={16} weight="bold" />
                            </Button>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    className="h-fit w-fit rounded-none px-3 py-1"
                                >
                                    <span className="sr-only">Open menu</span>
                                    <DotsThree size={16} weight="bold" />
                                </Button>
                            </DropdownMenuTrigger>
                        </div>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Link href={`/${cellContext.row.id}/settings`}>
                                    Edit
                                </Link>
                            </DropdownMenuItem>

                            <Trigger value={dialogs.Clone} variant={"dialog"}>
                                <DropdownMenuItem>
                                    <button>Clone</button>
                                </DropdownMenuItem>
                            </Trigger>

                            <Trigger value={dialogs.Archive} variant={"alert"}>
                                <DropdownMenuItem>
                                    <button>Archive</button>
                                </DropdownMenuItem>
                            </Trigger>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* <Container value={dialogs.Clone} variant={"dialog"}>
                        <CloneWorkflowAction {...cellContext} />
                    </Container>
                    <Container value={dialogs.Archive} variant={"alert"}>
                        <ArchiveWorkflowAction {...cellContext} />
                    </Container> */}
                </>
            )}
        </MultiDialogProvider>
    )
}
