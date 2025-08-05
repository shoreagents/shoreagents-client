"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ActivityIcon, 
  ClockIcon, 
  UserIcon, 
  MapPinIcon, 
  CoffeeIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon
} from "lucide-react"

// Skeleton component for activity cards
const ActivityCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface ActivityItem {
  id: number
  type: 'login' | 'break' | 'attendance' | 'station' | 'system'
  user: string
  action: string
  timestamp: string
  status: 'success' | 'warning' | 'info'
  location?: string
}

export default function ActivityPage() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.email) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Generate dummy activity data
        const now = new Date()
        const dummyActivities: ActivityItem[] = [
          {
            id: 1,
            type: 'login',
            user: 'Alexandra Lopez',
            action: 'Logged in',
            timestamp: new Date(now.getTime() - 5 * 60 * 1000).toLocaleTimeString(),
            status: 'success',
            location: 'Main Office'
          },
          {
            id: 2,
            type: 'break',
            user: 'Remiah Nepal',
            action: 'Started lunch break',
            timestamp: new Date(now.getTime() - 15 * 60 * 1000).toLocaleTimeString(),
            status: 'info',
            location: 'Break Room'
          },
          {
            id: 3,
            type: 'attendance',
            user: 'Sheryl Pagunsan',
            action: 'Clock in',
            timestamp: new Date(now.getTime() - 30 * 60 * 1000).toLocaleTimeString(),
            status: 'success',
            location: 'Station A'
          },
          {
            id: 4,
            type: 'station',
            user: 'Jeffrey Ramos',
            action: 'Moved to Station B',
            timestamp: new Date(now.getTime() - 45 * 60 * 1000).toLocaleTimeString(),
            status: 'warning',
            location: 'Station B'
          },
          {
            id: 5,
            type: 'system',
            user: 'System',
            action: 'Backup completed',
            timestamp: new Date(now.getTime() - 60 * 60 * 1000).toLocaleTimeString(),
            status: 'success'
          },
          {
            id: 6,
            type: 'break',
            user: 'Katelyn Samson',
            action: 'Ended morning break',
            timestamp: new Date(now.getTime() - 75 * 60 * 1000).toLocaleTimeString(),
            status: 'info',
            location: 'Break Room'
          }
        ]
        
        setActivities(dummyActivities)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch activities')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [user?.email])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <UserIcon className="h-4 w-4" />
      case 'break':
        return <CoffeeIcon className="h-4 w-4" />
      case 'attendance':
        return <ClockIcon className="h-4 w-4" />
      case 'station':
        return <MapPinIcon className="h-4 w-4" />
      case 'system':
        return <ActivityIcon className="h-4 w-4" />
      default:
        return <InfoIcon className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircleIcon className="h-3 w-3 mr-1" />Success</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertCircleIcon className="h-3 w-3 mr-1" />Warning</Badge>
      case 'info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800"><InfoIcon className="h-3 w-3 mr-1" />Info</Badge>
      default:
        return <Badge variant="outline">Info</Badge>
    }
  }

  const getActivityStats = () => {
    const total = activities.length
    const today = activities.filter(a => {
      const activityDate = new Date(a.timestamp)
      const today = new Date()
      return activityDate.toDateString() === today.toDateString()
    }).length
    const activeUsers = new Set(activities.filter(a => a.type !== 'system').map(a => a.user)).size

    return { total, today, activeUsers }
  }

  const stats = getActivityStats()

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3">
              <div className="flex flex-col gap-4 p-4">
                
                {/* Activity Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {loading ? (
                    <>
                      <ActivityCardSkeleton />
                      <ActivityCardSkeleton />
                      <ActivityCardSkeleton />
                    </>
                  ) : error ? (
                    <div className="col-span-3 flex items-center justify-center py-8">
                      <p className="text-destructive">{error}</p>
                    </div>
                  ) : (
                    <>
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Total Activities</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {stats.total}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <ActivityIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            All time activity count
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Today's Activities</p>
                              <p className="text-2xl font-bold text-green-600">
                                {stats.today}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <ClockIcon className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Activities in the last 24 hours
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {stats.activeUsers}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-orange-600" />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Users with recent activity
                          </p>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Activity Log */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      View recent system activities and user actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center space-x-4">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-48" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border bg-card">
                            <div className="flex-shrink-0">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {activity.user}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {activity.action}
                                {activity.location && ` • ${activity.location}`}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(activity.status)}
                              <span className="text-xs text-muted-foreground">
                                {activity.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 