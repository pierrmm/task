"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      className={`w-full text-zinc-900 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800 ${!isSidebarOpen ? 'justify-center px-0' : 'justify-start'}`}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      title={!isSidebarOpen ? "Toggle theme" : undefined}
    >
      <Sun className={`h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ${isSidebarOpen && 'mr-2'}`} />
      <Moon className={`absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ${isSidebarOpen ? 'left-3' : ''}`} />
      {isSidebarOpen && <span className="ml-4 text-left flex-1">Toggle Theme</span>}
    </Button>
  )
}
