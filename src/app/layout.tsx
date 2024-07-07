//Styles
import "~/styles/globals.css"

//TRPC
import { TRPCReactProvider } from "~/trpc/react"

//UI Components
import { Sidebar } from "~/components/layout/sidebar"
import { TopMenu } from "~/components/layout/top-menu"

//Fonts
import { Inter } from "next/font/google"

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <TRPCReactProvider>
          <div className="flex gap-[2px] bg-neutral-200">
            <Sidebar />
            <div className="flex h-screen w-0 flex-1 flex-col gap-[2px] ">
              <TopMenu />
              <div className=" flex w-full flex-1 overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
