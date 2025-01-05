import { Slot, type SlotProps } from "@radix-ui/react-slot"
import { createContext, useContext, useCallback, useState } from "react"
import { AlertDialog } from "./alert-dialog"
import { Dialog } from "./dialog"
import { z } from "zod"
type Maybe<T> = T | null | undefined

const MultiDialogContainerContext = createContext<{
    dialog: unknown
    alert: unknown
}>({ dialog: null, alert: null })
MultiDialogContainerContext.displayName = "MultiDialogContainerContext"

type variant = "dialog" | "alert"

export const useMultiDialog = <T = unknown,>(variant: variant) => {
    const s = z
        .object({ alert: z.unknown(), dialog: z.unknown() })
        .parse(useContext(MultiDialogContainerContext))[variant]
    if (!s)
        throw new Error(
            "Cannot use 'useMultiDialog' outside 'MultiDialogProvider'.",
        )
    return s as [Maybe<T>, React.Dispatch<React.SetStateAction<Maybe<T>>>]
}

export function MultiAlertDialogTrigger<T>({
    value,
    onClick,
    variant,
    ...props
}: SlotProps &
    React.RefAttributes<HTMLElement> & {
        value: T
        variant: variant
    }) {
    const [, open] = useMultiDialog(variant)
    const oc = useCallback<React.MouseEventHandler<HTMLElement>>(
        (e) => {
            open(value)
            onClick && onClick(e)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [value, onClick],
    )
    return <Slot onClick={oc} {...props} />
}

export function MultiDialogContainer<T>({
    value,
    children,
    variant,
}: {
    value: T
    children: React.ReactNode
    variant: variant
}) {
    const [opened] = useMultiDialog(variant)
    return opened === value ? (children ?? null) : null
}

type Builder<T> = {
    Trigger: (
        ...args: Parameters<typeof MultiAlertDialogTrigger<T>>
    ) => React.ReactNode
    Container: (
        ...args: Parameters<typeof MultiDialogContainer<T>>
    ) => React.ReactNode
}

const builder = {
    Trigger: MultiAlertDialogTrigger,
    Container: MultiDialogContainer,
}

export const MultiDialogProvider = <T,>({
    defaultOpen = null,
    children,
}: {
    defaultOpen?: T | null
    children?: React.ReactNode | ((builder: Builder<T>) => React.ReactNode)
}) => {
    const [stateDialog, setStateDialog] = useState<T | null>(defaultOpen)
    const [stateAlert, setStateAlert] = useState<T | null>(defaultOpen)

    return (
        <MultiDialogContainerContext.Provider
            value={{
                dialog: [stateDialog, setStateDialog],
                alert: [stateAlert, setStateAlert],
            }}
        >
            <AlertDialog
                open={stateAlert != null}
                onOpenChange={(v: unknown) => {
                    if (!v) setStateAlert(null)
                }}
            >
                <Dialog
                    open={stateDialog != null}
                    onOpenChange={(v: unknown) => {
                        if (!v) setStateDialog(null)
                    }}
                >
                    {typeof children === "function"
                        ? children(builder)
                        : children}
                </Dialog>
            </AlertDialog>
        </MultiDialogContainerContext.Provider>
    )
}
