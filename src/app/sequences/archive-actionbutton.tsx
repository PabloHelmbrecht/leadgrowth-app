"use client"

//UI
import { Button } from "~/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

//Class Merge
import { cn } from "~/lib/utils"

//Icons
import { Archive } from "@phosphor-icons/react/dist/ssr"

//Atoms & Jotai
import { useAtom } from "jotai"
import { rowSelectionAtom } from "~/lib/store"
import { sequencesMockDataAtom } from "~/lib/mockData"

export function ArchiveActionButton() {
  const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom)
  const [, setSequencesMockData] = useAtom(sequencesMockDataAtom)

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={"secondary"}
          size={"sm"}
          className={cn(
            " font-regular flex h-fit w-fit items-center gap-2  rounded-full px-3 py-1   transition-all hover:bg-red-500 hover:text-neutral-50",
            Object.keys(rowSelection).length === 0 && "hidden",
          )}
        >
          <Archive
            width={16}
            height={16}
            weight="bold"
            className="aspect-square min-w-4"
            alt={"config sequence button"}
          />
          Archive Sequences
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              const idRowsSelected = Object.keys(rowSelection).filter(
                (id) => rowSelection[id],
              )
              setSequencesMockData((oldSequencesMockData) =>
                oldSequencesMockData.map((sequence) => {
                  if (idRowsSelected.includes(sequence.id)) {
                    return { ...sequence, status: "archived" }
                  }
                  return sequence
                }),
              )
              setRowSelection({})
            }}
            className="bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
