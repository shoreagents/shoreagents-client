"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const pathname = usePathname()

  // Get page title based on current path
  const getPageTitle = () => {
    // Normalize pathname by removing trailing slash
    const normalizedPathname = pathname.replace(/\/$/, '') || '/'
    
    switch (normalizedPathname) {
      case "/dashboard":
      case "/":
        return "Dashboard"
      case "/employees":
        return "Employees"
      case "/stations":
        return "Stations"
      default:
        // For any other paths, try to extract a meaningful title
        if (normalizedPathname.startsWith("/employees")) {
          return "Employees"
        }
        if (normalizedPathname.startsWith("/dashboard")) {
          return "Dashboard"
        }
        if (normalizedPathname.startsWith("/stations")) {
          return "Stations"
        }
        return "Dashboard" // Default to Dashboard instead of Documents
    }
  }

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear bg-background z-50 rounded-t-xl">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{getPageTitle()}</h1>
      </div>
    </header>
  )
}
