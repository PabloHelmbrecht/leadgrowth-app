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

//zzzTypes
import { type Sequence } from "~/lib/mockData"

//Actions
import { ArchiveSequenceAction } from "./row-actions/archive-sequence-action"
import { CloneSequenceAction } from "./row-actions/clone-sequence-action"

export function ActionsColumn(cellContext: CellContext<Sequence, unknown>) {
  enum dialogs {
    Clone = 1,
    Archive = 2,
  }

  return (
    <MultiDialogProvider<dialogs>>
      {({ Trigger, Container }) => (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="h-fit w-fit px-3 py-1">
                <span className="sr-only">Open menu</span>
                <DotsThree size={20} weight="bold" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/${cellContext.row.id}/settings`}>Edit</Link>
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

          <Container value={dialogs.Clone} variant={"dialog"}>
            <CloneSequenceAction {...cellContext} />
          </Container>
          <Container value={dialogs.Archive} variant={"alert"}>
            <ArchiveSequenceAction {...cellContext} />
          </Container>
        </>
      )}
    </MultiDialogProvider>
  )
}
