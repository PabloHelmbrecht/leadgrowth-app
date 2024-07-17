import { TopMenu } from "~/components/layout/sequence/top-menu"



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

      <section className="bg-red-500 flex-1">
        <TopMenu/>

        {children}
      </section>

  )
}
