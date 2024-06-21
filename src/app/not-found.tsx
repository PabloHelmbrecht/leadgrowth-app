import Link from "next/link"
import Image from "next/image"
import { Button } from "~/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <Image
        src={"/illustrations/404.png"}
        alt={"404 Illustration"}
        width={400}
        height={300}
      />
      <h1 className=" text-4xl font-bold text-primary-800">Page Not Found</h1>
      <p>Could not find requested resource</p>
      <Link href="/">
        <Button variant={"default"} size={"lg"} className="bg-primary-500">
          Return Home
        </Button>
      </Link>
    </div>
  )
}
