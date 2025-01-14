import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Book } from "lucide-react";

import Image from "next/image";
import SVGIMG from "../../public/taklif-logo.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={session.user.image} alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/assignment-personalization/all-assignments" className="flex items-center">
                    <Book className="mr-2 h-4 w-4" />
                    <span>All Assignments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async()=>{
                  "use server";
                  await signOut();
                }} className="text-red-600 dark:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}