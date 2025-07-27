"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MoreHorizontalIcon,
  EyeIcon,
  MapPinIcon,
  ActivityIcon,
  UsersIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Mock data for stations - replace with actual data fetching
interface Station {
  id: string
  name: string
  location: string
  status: 'active' | 'inactive' | 'maintenance'
  capacity: number
  current_occupancy: number
  last_updated: string
}

const mockStations: Station[] = [
  {
    id: "1",
    name: "Central Station",
    location: "Downtown Area",
    status: "active",
    capacity: 150,
    current_occupancy: 120,
    last_updated: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "North Terminal",
    location: "North District",
    status: "active",
    capacity: 200,
    current_occupancy: 180,
    last_updated: "2024-01-15T10:25:00Z"
  },
  {
    id: "3",
    name: "South Hub",
    location: "South Quarter",
    status: "maintenance",
    capacity: 100,
    current_occupancy: 0,
    last_updated: "2024-01-15T09:15:00Z"
  },
  {
    id: "4",
    name: "East Station",
    location: "East Side",
    status: "inactive",
    capacity: 75,
    current_occupancy: 0,
    last_updated: "2024-01-14T16:45:00Z"
  }
]

// Skeleton component for station rows
const StationSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-24" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-8 rounded" />
    </TableCell>
  </TableRow>
)

export default function StationsPage() {
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(true)

  // Simulate data fetching
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true)
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStations(mockStations)
      } catch (err) {
        console.error('Failed to fetch stations:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStations()
  }, [])



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>
      case 'maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getOccupancyPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100)
  }

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2 h-full">
              <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3 h-full">
                {/* Header Skeleton */}
                <div className="px-2 lg:px-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-8 w-32" />
                      </div>
                    </div>

                    {/* Search Skeleton */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <Skeleton className="h-9 w-64" />
                    </div>
                  </div>
                </div>

                {/* Table Skeleton */}
                <div className="px-2 lg:px-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            <Skeleton className="h-4 w-20" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-24" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-20" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 4 }).map((_, index) => (
                          <StationSkeleton key={index} />
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col h-full">
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="@container/main flex flex-1 flex-col gap-2 h-full">
              <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3 h-full">
                {/* Header */}
                <div className="px-2 lg:px-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                      </div>
                    </div>


                  </div>
                </div>

                {/* Two Column Layout */}
                <div className="px-2 lg:px-4 flex-1">
                  <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 h-full">
                    {/* Left Column - 70% width */}
                    <div className="lg:col-span-7 h-full">
                      <div className="rounded-lg border h-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Station</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Occupancy</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {stations.length > 0 ? (
                              stations.map((station) => (
                                <TableRow key={station.id}>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded bg-blue-100 flex items-center justify-center">
                                        <MapPinIcon className="h-4 w-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="font-medium">{station.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                          Capacity: {station.capacity}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="text-muted-foreground">{station.location}</div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(station.status)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm font-medium">
                                            {station.current_occupancy}/{station.capacity}
                                          </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                          <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${getOccupancyPercentage(station.current_occupancy, station.capacity)}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                          <span className="sr-only">Open menu</span>
                                          <MoreHorizontalIcon className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                          <EyeIcon className="mr-2 h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <ActivityIcon className="mr-2 h-4 w-4" />
                                          View Activity
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                  No stations found.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* Right Column - 30% width */}
                    <div className="lg:col-span-3 h-full">
                      <div className="flex flex-col gap-2 h-full">
                        {/* Row 1 - 80% height */}
                        <Card className="p-3 flex flex-col justify-center" style={{ height: '80%' }}>
                          <Tabs defaultValue="online" className="h-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="online">Online</TabsTrigger>
                              <TabsTrigger value="offline">Offline</TabsTrigger>
                              <TabsTrigger value="break">Standby</TabsTrigger>
                            </TabsList>
                            <TabsContent value="online" className="mt-4 h-full">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  {stations.filter(s => s.status === 'active').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Online Stations</div>
                              </div>
                            </TabsContent>
                            <TabsContent value="offline" className="mt-4 h-full">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                  {stations.filter(s => s.status === 'inactive').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Offline Stations</div>
                              </div>
                            </TabsContent>
                            <TabsContent value="break" className="mt-4 h-full">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                  {stations.filter(s => s.status === 'maintenance').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Standby Stations</div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </Card>
                        {/* Row 2 - 20% height */}
                        <Card className="p-3 flex flex-col justify-center" style={{ height: '20%' }}>
                          <div className="text-center">
                            <div className="text-sm text-muted-foreground">Quick Actions</div>
                            <div className="text-xs text-muted-foreground mt-1">Coming soon...</div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 