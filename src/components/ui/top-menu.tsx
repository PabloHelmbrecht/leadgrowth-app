"use client"

//Activities Data


//Notifications Data

//UI
import { Button } from "~/components/ui/button"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

//React
import { useState } from "react"

//Next
import Link from "next/link"

//Atoms & Jotai
import { useAtom } from "jotai"
import { sideBarAtom } from "~/lib/store"

//Class Merge
import { cn } from "~/lib/utils"

//Icons
import {
  MagnifyingGlass,
  CaretLeft,
  Gear,
  User,
  Bell,
  Check,
} from "@phosphor-icons/react/dist/ssr"
import {
  CreditCard,
  Keyboard,
  Users,
  UserPlus,
  EnvelopeSimple,
  PlusCircle,
  Plus,
  GithubLogo,
  Lifebuoy,
  Cloud,
  Chat,
  SignOut,
} from "@phosphor-icons/react/dist/ssr"

function TopMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex flex-row items-center justify-between bg-white px-8 py-4",
        className,
      )}
      {...props}
    >
      <SidebarButton />

      <div className="">
        <SearchBar />
      </div>

      <div className="flex flex-row items-center gap-4">
        <SettingsButton />
        <NotificationsButton />
        <ProfileButton />
      </div>
    </div>
  )
}

function SidebarButton() {
  const [isOpen, setIsOpen] = useAtom(sideBarAtom)
  return (
    <Button
      variant={"secondary"}
      className="aspect-square p-2"
      size={'sm'}
      onClick={() => setIsOpen(!isOpen)}
    >
      <CaretLeft
        width={20}
        height={20}
        weight="bold"
        alt="close sidebar icon"
        className={cn(`${isOpen || "rotate-180"} premium-transition	`)}
      />
    </Button>
  )
}

function SearchBar() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" w-64 justify-between"
          size={'sm'}
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Search prospects..."}
          <MagnifyingGlass className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search prospects..." />
          <CommandList>
            <CommandEmpty>No prospects found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function SettingsButton() {
  return (
    <Link href={"/settings"}>
      <Button variant={"secondary"} className="aspect-square p-2" size={'sm'}>
        <Gear width={20} height={20} weight="bold" alt="close sidebar icon" />
      </Button>
    </Link>
  )
}

function NotificationsButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"secondary"} className="aspect-square p-2" size={'sm'}>
          <Bell
            width={20}
            height={20}
            weight="bold"
            alt="open notifications button"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="divide-y divide-neutral-200 ">
        <SheetHeader className="pb-6">
          <SheetTitle>Activities & Notifications</SheetTitle>
          <SheetDescription>
            Review your most recent activities and notifications
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4 pt-6">
          <Tabs defaultValue="activities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="activities">activities</TabsContent>
            <TabsContent value="notifications">notifications</TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function ProfileButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"terciary"} className="aspect-square p-2 " size={'sm'}>
          <User width={20} height={20} weight="bold" alt="close sidebar icon" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="absolute -right-5 w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Gear className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Users className="mr-2 h-4 w-4" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <EnvelopeSimple className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Chat className="mr-2 h-4 w-4" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <GithubLogo className="mr-2 h-4 w-4" />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Lifebuoy className="mr-2 h-4 w-4" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <SignOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export { TopMenu }
