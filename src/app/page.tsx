import Link from "next/link"

import { CreatePost } from "~/components/create-post"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/trpc/server"

export default async function Home() {
    //const hello = await api.post.hello({ text: "from tRPC" })
    //const session = await getServerAuthSession()

    return (
        <main className="flex w-full flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    Create <span className="text-[hsl(280,100%,70%)]">T3</span>{" "}
                    App
                </h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
                    <Link
                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                        href="https://create.t3.gg/en/usage/first-steps"
                        target="_blank"
                    >
                        <h3 className="text-2xl font-bold">First Steps →</h3>
                        <div className="text-lg">
                            Just the basics - Everything you need to know to set
                            up your database and authentication.
                        </div>
                    </Link>
                    <Link
                        className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
                        href="https://create.t3.gg/en/introduction"
                        target="_blank"
                    >
                        <h3 className="text-2xl font-bold">Documentation →</h3>
                        <div className="text-lg">
                            Learn more about Create T3 App, the libraries it
                            uses, and how to deploy it.
                        </div>
                    </Link>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <p className="text-center text-2xl text-white"></p>
                    </div>
                </div>

                <CrudShowcase />
            </div>
        </main>
    )
}

async function CrudShowcase() {
    const session = await getServerAuthSession()
    if (!session?.user) return null

    const latestPost = await api.post.getLatest()

    return (
        <div className="w-full max-w-xs">
            {latestPost ? (
                <p className="truncate">
                    Your most recent post: {latestPost.name}
                </p>
            ) : (
                <p>You have no posts yet.</p>
            )}

            <CreatePost />
        </div>
    )
}
