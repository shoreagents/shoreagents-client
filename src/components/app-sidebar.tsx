"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  MapPinIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  BuildingIcon,
  ClockIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/contexts/auth-context"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
  ],
  navTeam: [
    {
      title: "Employees",
      url: "/employees",
      icon: UsersIcon,
    },
    {
      title: "Departments",
      url: "#",
      icon: BuildingIcon,
    },
  ],
  navTracker: [
    {
      title: "Stations",
      url: "/stations",
      icon: MapPinIcon,
    },
    {
      title: "Attendance",
      url: "#",
      icon: ClockIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, member } = useAuth()
  const [companyName, setCompanyName] = React.useState("Loading...")

  React.useEffect(() => {
    // Use member data from auth context if available
    if (member?.company) {
      setCompanyName(member.company)
    } else if (user?.email) {
      // Fallback to API call if member data not available
      const fetchCompanyName = async () => {
        try {
          const email = user.email
          if (!email) {
            setCompanyName("Member Company")
            return
          }
          
          const response = await fetch(`/api/company?email=${encodeURIComponent(email)}`)
          if (response.ok) {
            const data = await response.json()
            setCompanyName(data.company || "Member Company")
          } else {
            setCompanyName("Member Company")
          }
        } catch (error) {
          console.error('Failed to fetch company name:', error)
          setCompanyName("Member Company")
        }
      }

      fetchCompanyName()
    } else {
      setCompanyName("Member Company")
    }
  }, [user?.email, member?.company])

  const isActive = (url: string) => {
    // Normalize both pathname and url by removing trailing slashes
    const normalizedPathname = pathname.replace(/\/$/, '') || '/'
    const normalizedUrl = url.replace(/\/$/, '') || '/'
    
    // Make Dashboard default active for root path
    if (url === "/dashboard" && (normalizedPathname === "/" || normalizedPathname === "/dashboard")) {
      return true
    }
    
    return normalizedPathname === normalizedUrl
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">{companyName}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu>
              {data.navMain.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      style={{
                        backgroundColor: active ? '#f3f4f6' : undefined,
                        color: active ? '#374151' : undefined,
                      }}
                      className={`transition-colors duration-200 h-8 px-2 ${
                        active
                          ? ""
                          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Team Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Team
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu>
              {data.navTeam.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      style={{
                        backgroundColor: active ? '#f3f4f6' : undefined,
                        color: active ? '#374151' : undefined,
                      }}
                      className={`transition-colors duration-200 h-8 px-2 ${
                        active
                          ? ""
                          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tracker Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Tracker
          </SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu>
              {data.navTracker.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      style={{
                        backgroundColor: active ? '#f3f4f6' : undefined,
                        color: active ? '#374151' : undefined,
                      }}
                      className={`transition-colors duration-200 h-8 px-2 ${
                        active
                          ? ""
                          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary Navigation */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent className="flex flex-col gap-1">
            <SidebarMenu>
              {data.navSecondary.map((item) => {
                const active = isActive(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      style={{
                        backgroundColor: active ? '#f3f4f6' : undefined,
                        color: active ? '#374151' : undefined,
                      }}
                      className={`transition-colors duration-200 h-8 px-2 ${
                        active
                          ? ""
                          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
