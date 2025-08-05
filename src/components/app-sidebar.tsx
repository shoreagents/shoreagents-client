"use client"

import * as React from "react"
import {
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
  CoffeeIcon,
  ActivityIcon,
  SunIcon,
  MoonIcon,
  CalendarIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Settings Popover Component
const SettingsPopover = () => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Initialize theme on mount
  React.useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <SidebarMenuButton 
          tooltip="Settings" 
          className="h-8 px-2 text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <SettingsIcon className="h-4 w-4" />
          <span>Settings</span>
        </SidebarMenuButton>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-6 shadow-sm rounded-lg" align="start" sideOffset={8} alignOffset={0}>
        <div className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold">Settings</h4>
            <p className="text-sm text-muted-foreground">
              Manage your account and preferences
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
              <div className="space-y-1 flex-1 mr-4">
                <span className="text-sm font-semibold">Theme</span>
                <p className="text-xs text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 ease-in-out border ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 border-teal-600' 
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 border-gray-300'
                }`}
                role="switch"
                aria-checked={theme === 'dark'}
                aria-label="Toggle theme"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out relative ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                  }`}
                >
                  {theme === 'light' && (
                    <SunIcon className="absolute h-3.5 w-3.5 text-yellow-500 transition-colors duration-300" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                  )}
                  {theme === 'dark' && (
                    <MoonIcon className="absolute h-3.5 w-3.5 text-teal-500 transition-colors duration-300" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                  )}
                </span>
              </button>
            </div>

          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

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
      url: "/attendance",
      icon: ClockIcon,
    },
    {
      title: "Breaks",
      url: "/breaks",
      icon: CoffeeIcon,
    },
    {
      title: "Activity",
      url: "/activity",
      icon: ActivityIcon,
    },
  ],
  navRecruitment: [
    {
      title: "Candidates",
      url: "/candidates",
      icon: UsersIcon,
    },
    {
      title: "Jobs",
      url: "/jobs",
      icon: FileTextIcon,
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
              TEAM
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
              TRACKER
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

          {/* Recruitment Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
              RECRUITMENT
            </SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-1">
              <SidebarMenu>
                {data.navRecruitment.map((item) => {
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
                  
                  // Special handling for Settings item
                  if (item.title === "Settings") {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SettingsPopover />
                      </SidebarMenuItem>
                    )
                  }
                  
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
          {/* User avatar moved to header */}
        </SidebarFooter>
      </Sidebar>
  )
}
