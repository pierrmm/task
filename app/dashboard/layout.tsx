"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
    { name: "Candidates", href: "/dashboard/candidates", icon: Users },
  ];

  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-black flex relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:translate-x-0 md:w-20'
        } fixed md:relative shrink-0 h-full bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out z-30 shadow-xl md:shadow-none`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className={`flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-50 ${!isSidebarOpen && 'md:hidden'}`}>
            <Briefcase className="w-5 h-5" />
            <span>RecruitPro</span>
          </div>
          {!isSidebarOpen && (
            <Briefcase className="hidden md:block w-5 h-5 mx-auto text-zinc-900 dark:text-zinc-50" />
          )}
          {/* Close button for mobile */}
          <button 
            className="md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-medium"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                } ${!isSidebarOpen && 'md:justify-center md:px-0'}`}
                title={!isSidebarOpen ? item.name : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {(isSidebarOpen || (typeof window !== "undefined" && window.innerWidth < 768)) && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          {isSidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-md bg-zinc-100 dark:bg-zinc-900/50">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-900 dark:text-zinc-50">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Admin</span>
                <span className="text-xs text-zinc-500">admin@recruiter.com</span>
              </div>
            </div>
          )}
          <ThemeToggle isSidebarOpen={isSidebarOpen} />
          <Button 
            variant="ghost" 
            className={`w-full text-zinc-900 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800 ${!isSidebarOpen ? 'md:justify-center md:px-0' : 'justify-start'}`}
            onClick={handleLogout}
            title={!isSidebarOpen ? "Sign Out" : undefined}
          >
            <LogOut className={`w-4 h-4 ${isSidebarOpen && 'mr-2'}`} />
            {(isSidebarOpen || (typeof window !== "undefined" && window.innerWidth < 768)) && "Sign Out"}
          </Button>
        </div>
        
        {/* Toggle Button for Desktop */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden md:block absolute -right-3 top-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-full p-1 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors shadow-sm"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white dark:bg-black relative z-10 w-full">
        <header className="h-16 flex items-center px-4 md:px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 p-1"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 capitalize">
              {pathname.split("/").pop() === "dashboard" ? "Overview" : pathname.split("/").pop()}
            </h2>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-6 bg-zinc-50 dark:bg-black">
          {children}
        </div>
      </main>
    </div>
  );
}
