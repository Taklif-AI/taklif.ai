import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Image from "next/image";
import SVGIMG from "../../public/taklif-logo.svg";
import { auth, signOut } from "@/auth";


export async function Navigation() {
  const session = await auth();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-full container flex h-16 items-center justify-between px-4 ">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center space-x-2 text-lg font-bold text-foreground"
          >
            <Image className="w-48" src={SVGIMG} alt={""} />

          </Link>



          <div className="hidden md:flex md:items-center md:gap-5">

          </div>
        </div>

        <div className="flex items-center gap-4">

          {!session && (
            <Link href="/auth/sign-in">
              <Button variant="outline" className="rounded-full bg-transparent	"
              >
                Sign In
              </Button>
            </Link>
          )}

          {session && (
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
              >
                <MenuItem>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
                  >
                    Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <button onClick={async () => {
                    "use server"
                    await signOut();
                  }} className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none">
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}