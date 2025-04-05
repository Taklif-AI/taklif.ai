"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Book, Zap } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { auth, signOut } from "@/auth";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/hooks/use-current-user";

export function Navigation() {
  const { data: session } = useSession();
  const user = useCurrentUser();
  const { setTheme } = useTheme();
  useEffect(() => {
    if (user && user?.theme) {
      setTheme(user.theme);
    } else {
      setTheme("dark");
    }
  }, [user, setTheme]);
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/theme-toggles@4.10.1/css/around.min.css"
      />

      <nav className="max-w-full container flex h-16 items-center justify-between pl-6 pr-9">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex sm:w-48 w-28 items-center space-x-2 text-lg font-bold text-foreground"
          >
            <Logo />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-5"></div>
        </div>

        <div className="flex items-center gap-4">
          {session && (
            <Link href="/assignment-personalization">
              <Button
                variant="ghost"
                className="rounded-full p-0 h-9 w-[40px] sm:w-[120px] bg-purple-500 text-white transition-colors hover:outline-none "
              >
                <span className="hidden sm:inline">Try Now</span>
                <Zap className="sm:ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          )}
          
          <div className="hidden md:flex md:items-center md:gap-5"></div>

          {!session && (
            <Link href="/auth/sign-in">
              <Button
                variant="ghost"
                className="rounded-full w-[130px] outline outline-1 hover:bg-purple-600 hover:text-white transition-colors hover:outline-none"
              >
                Sign In
              </Button>
            </Link>
          )}

          {session && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={session?.user?.image || "/default-avatar.jpg"}
                      alt="Profile"
                    />
                    <AvatarFallback style={{ fontFamily: "Noto Color Emoji" }}>
                      ⚙️
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={5} className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/assignment-personalization/my-assignments"
                    className="flex items-center cursor-pointer"
                  >
                    <Book className="mr-2 h-4 w-4" />
                    <span>My Assignments</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
    </header>
  );
}
