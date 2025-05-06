import { useCallback } from "react"

export const useCookie = (cookieName: string) => {
    const getCookieValue = (name: string) => {
        const cookies =
            typeof document !== "undefined" ? document.cookie.split("; ") : []
        const cookie = cookies.find((c) => c.startsWith(`${name}=`))
        return cookie ? cookie.split("=")[1] : undefined
    }

    const cookieValue = getCookieValue(cookieName)

    const setCookie = useCallback(
        (value: string) => {
            document.cookie = `${cookieName}=${value}; path=/`
        },
        [cookieName],
    )

    return { cookie: cookieValue, setCookie }
}

export default useCookie
