/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { ErrorBoundary } from "next/dist/client/components/error-boundary"
import Link from "next/link"
import Image from "next/image"
import { Button } from "~/components/ui/button"

ErrorBoundary
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error(error)
  return (
    <html>
      <body>
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

          <h2>Something went wrong!</h2>
        </div>
      </body>
    </html>
  )
}
