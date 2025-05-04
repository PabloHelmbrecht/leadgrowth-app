import { useState, useEffect } from "react"

/**
 * Hook para obtener la posición global del mouse en la ventana.
 *
 * @returns {{ x: number; y: number }} Un objeto con las coordenadas x e y del mouse.
 *
 * @example
 * const { x, y } = useMousePosition()
 */
export function useMousePosition() {
    const [position, setPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    })

    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            setPosition({ x: event.clientX, y: event.clientY })
        }
        window.addEventListener("mousemove", handleMouseMove)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [])

    return position
}

export default useMousePosition
