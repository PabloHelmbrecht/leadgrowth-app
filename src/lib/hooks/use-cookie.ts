import { useState, useEffect } from "react"

export const useCookie = (cookieName: string) => {
    const [cookieValue, setCookieValue] = useState<string | undefined>(
        undefined,
    )

    useEffect(() => {
        const getCookieValue = (name: string) => {
            const cookies = document.cookie.split("; ")
            const cookie = cookies.find((c) => c.startsWith(`${name}=`))
            return cookie ? cookie.split("=")[1] : undefined
        }

        setCookieValue(getCookieValue(cookieName))
    }, [cookieName])

    return cookieValue
}

export default useCookie
