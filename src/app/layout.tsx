//Styles
import "~/styles/globals.css"
import "~/styles/react-flow-styles.css"

//UI Components
// import { Sidebar } from "~/components/layout/sidebar"
// import { TopMenu } from "~/components/layout/top-menu"
import { Toaster } from "~/components/ui/toaster"
import { TooltipProvider } from "~/components/ui/tooltip"
import { QueryProvider } from "~/components/providers/query-provider"

//Fonts
import { Inter } from "next/font/google"

//Translation i18n
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

//React Query
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
})

//Sitemetadata
export const metadata = {
    title: "Lead Growth",
    description: "Last gen prospecting tool",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const locale = await getLocale()
    return (
        <html lang={locale} className={`${inter.variable}`}>
            <body>
                <QueryProvider>
                    <NextIntlClientProvider>
                        <TooltipProvider delayDuration={400}>
                            {children}

                            <Toaster />
                            <div id="portal-root"></div>

                            <ReactQueryDevtools initialIsOpen={false} />
                        </TooltipProvider>
                    </NextIntlClientProvider>
                </QueryProvider>
            </body>
        </html>
    )
}
