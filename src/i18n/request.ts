import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = "en"

    return {
        locale,
        messages: (
            (await import(`../../messages../../messages/${locale}.json`)) as {
                default: Record<string, string>
            }
        ).default,
    }
})
