import { TopMenu } from "~/components/layout/sequence/top-menu"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="flex-1 bg-red-500">
      <TopMenu />

      {children}
    </section>
  )
}
