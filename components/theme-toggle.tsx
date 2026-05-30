"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle({ isSidebarOpen }: { isSidebarOpen: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-10 w-full animate-pulse bg-zinc-100 dark:bg-zinc-900 rounded-lg"></div>
  }

  const isDark = theme === "dark" || (theme === "system" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <div className={`flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 mb-2 ${!isSidebarOpen ? 'flex-col gap-1' : 'w-full'}`}>
      <button
        onClick={() => setTheme("light")}
        className={`flex items-center justify-center rounded-md p-1.5 transition-all ${!isDark ? 'bg-white shadow-sm text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'} ${isSidebarOpen ? 'w-1/2' : 'w-full'}`}
        title="Light Mode"
      >
        <Sun className="h-4 w-4" />
        {isSidebarOpen && <span className="ml-2 text-xs font-medium">Light</span>}
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`flex items-center justify-center rounded-md p-1.5 transition-all ${isDark ? 'bg-zinc-800 shadow-sm text-zinc-50' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'} ${isSidebarOpen ? 'w-1/2' : 'w-full'}`}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4" />
        {isSidebarOpen && <span className="ml-2 text-xs font-medium">Dark</span>}
      </button>
    </div>
  )
}
