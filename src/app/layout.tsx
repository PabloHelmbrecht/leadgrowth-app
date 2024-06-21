import "~/styles/globals.css"

import { TRPCReactProvider } from "~/trpc/react"
import { Sidebar } from "~/components/ui/sidebar"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

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
            <div className="flex flex-shrink flex-grow flex-col gap-[2px] ">
              <div className="bg-white"> Header</div>
              <div className="">{children}</div>
            </div>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
