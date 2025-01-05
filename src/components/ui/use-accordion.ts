import { useState, useRef, useEffect } from "react"

export function useAccordion() {
    const [accordionStates, setAccordionStates] = useState<
        Record<string, boolean>
    >({})

    const handleStateChange = (value: string, state: string | null) => {
        setAccordionStates((prevStates) => ({
            ...prevStates,
            [value]: state === "open",
        }))
    }

    const useAccordionItemRef = (value: string) => {
        const ref = useRef<HTMLDivElement>(null)

        useEffect(() => {
            if (ref.current) {
                const updateState = () => {
                    const state =
                        ref.current?.getAttribute("data-state") ?? null
                    handleStateChange(value, state)
                }

                updateState() // Set initial state
                ref.current.addEventListener("transitionend", updateState)

                const current = ref.current

                return () => {
                    current?.removeEventListener("transitionend", updateState)
                }
            }
        }, [value])

        return ref
    }

    return { accordionStates, useAccordionItemRef }
}
