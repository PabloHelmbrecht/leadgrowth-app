//Styles
import "~/styles/globals.css"
import "~/styles/react-flow-styles.css"

//TRPC
import { TRPCReactProvider } from "~/trpc/react"

//UI Components
import { Sidebar } from "~/components/layout/sidebar"
import { TopMenu } from "~/components/layout/top-menu"
import { Toaster } from "~/components/ui/toaster"
import { TooltipProvider } from "~/components/ui/tooltip"

//Fonts
import { Inter } from "next/font/google"

//Translation i18n
import { NextIntlClientProvider } from "next-intl"
import { getLocale } from "next-intl/server"

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
                <TRPCReactProvider>
                    <NextIntlClientProvider>
                        <TooltipProvider delayDuration={400}>
                            <div className="flex gap-[2px] bg-neutral-200">
                                <Sidebar />
                                <div className="flex h-screen w-0 flex-1 flex-col gap-[2px] ">
                                    <TopMenu />
                                    <div className=" flex w-full flex-1 overflow-hidden">
                                        {children}
                                    </div>
                                </div>
                            </div>
                            <Toaster />
                        </TooltipProvider>
                    </NextIntlClientProvider>
                </TRPCReactProvider>
            </body>
        </html>
    )
}
