import { type CellContext } from "@tanstack/react-table"

//UI
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { useToast } from "~/components/ui/use-toast"

//Zod & Schemas & Types
import { type Contact, useContacts } from "~/lib/hooks/use-contacts"

export function DeleteContactAction({ row }: CellContext<Contact, unknown>) {
    const { toast } = useToast()

    const { remove } = useContacts({ contactId: row.id })

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the contact.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={async () => {
                        try {
                            await remove(row.id)
                            toast({
                                title: "Contacto eliminado",
                                description: `El contacto fue eliminado correctamente.`,
                            })
                        } catch (e) {
                            console.error(e)
                            toast({
                                variant: "destructive",
                                title: "Uh oh! Something went wrong.",
                                description:
                                    "There was a problem with your request.",
                            })
                        }
                    }}
                    className="bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90"
                >
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}
