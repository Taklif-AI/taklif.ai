"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { LogOut, Moon, Sun, User, Book } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
    <Sun className="h-4 w-4" />
  
    <Switch
      checked={theme === "dark"}
      onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
    <Moon className="h-4 w-4" />

  </div>
  );
}