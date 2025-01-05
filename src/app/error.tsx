"use client" // Error components must be Client Components

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "~/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-full w-full flex-col items-center justify-center gap-8">
            <Image
                src={"/illustrations/error.png"}
                alt={"Error Illustration"}
                width={400}
                height={300}
            />
            <h1 className=" text-4xl font-bold text-primary-800">
                Something went wrong!
            </h1>
            <p>It seems there is an error on the website</p>
            <Link href="/">
                <Button
                    onClick={() => reset()}
                    variant={"default"}
                    size={"lg"}
                    className="bg-primary-500"
                >
                    Try again
                </Button>
            </Link>
        </div>
    )
}
