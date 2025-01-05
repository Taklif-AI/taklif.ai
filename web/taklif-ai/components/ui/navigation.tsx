'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { signOut, useSession } from "next-auth/react";
import { FileText, Settings, Sparkles } from "lucide-react";

export function Navigation() {
  const session = useSession();

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-full container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center space-x-2 text-lg font-bold text-foreground"
          >
            <FileText className="h-6 w-6 text-violet-600" />
            <span>Taklif.ai</span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-5">

          </div>
        </div>

        <div className="flex items-center gap-4">
          {session.status === 'authenticated' && (
            <Button onClick={() => signOut()} type="submit" size="sm" className="rounded-full w-full sm:w-auto text-white-500 bg-violet-600 hover:bg-violet-700">
              Sign out
            </Button>
          )}
          <Link href="../profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}