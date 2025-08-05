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
import { CoffeeIcon, UtensilsIcon, ClockIcon, UsersIcon, UserIcon } from "lucide-react"

// Skeleton component for break cards
const BreakCardSkeleton = ({ title, icon: Icon, color }: { title: string; icon: any; color: string }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-8 w-12" />
          </div>
          <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Timer component for break duration
const BreakTimer = ({ startTime, breakType }: { startTime: string; breakType: 'Morning' | 'Lunch' | 'Afternoon' }) => {
  const [elapsedTime, setElapsedTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isActive, setIsActive] = useState(false)

  // Set duration based on break type
  const getDurationMinutes = () => {
    switch (breakType) {
      case 'Morning':
      case 'Afternoon':
        return 15
      case 'Lunch':
        return 60
      default:
        return 15
    }
  }

  const durationMinutes = getDurationMinutes()

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date()
      const start = new Date(startTime)
      
      const diffMs = now.getTime() - start.getTime()
      const diffSeconds = Math.floor(diffMs / 1000)
      const diffHours = Math.floor(diffSeconds / 3600)
      const diffMinutes = Math.floor((diffSeconds % 3600) / 60)
      const remainingSeconds = diffSeconds % 60
      
      if (diffSeconds >= 0) {
        setElapsedTime({ hours: diffHours, minutes: diffMinutes, seconds: remainingSeconds })
        setIsActive(true)
      } else {
        setIsActive(false)
      }
    }

    calculateElapsed()
    const interval = setInterval(calculateElapsed, 1000) // Update every second

    return () => clearInterval(interval)
  }, [startTime])

  // Calculate if timer is nearing duration limit (within 2 minutes)
  const totalElapsedMinutes = elapsedTime.hours * 60 + elapsedTime.minutes
  const isNearingLimit = totalElapsedMinutes >= (durationMinutes - 2) && totalElapsedMinutes < durationMinutes
  const isOverLimit = totalElapsedMinutes >= durationMinutes

  return (
    <div className="flex items-center justify-end">
      <div className={`text-xs font-mono ${
        isOverLimit ? 'text-red-600' : 
        isNearingLimit ? 'text-red-500' : 
        'text-muted-foreground'
      }`}>
        {elapsedTime.hours.toString().padStart(2, '0')}:{elapsedTime.minutes.toString().padStart(2, '0')}:{elapsedTime.seconds.toString().padStart(2, '0')}
      </div>
    </div>
  )
}

interface BreakSession {
  id: number
  agent_user_id: number
  break_type: 'Morning' | 'Lunch' | 'Afternoon'
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  pause_time: string | null
  resume_time: string | null
  pause_used: boolean
  time_remaining_at_pause: number | null
  break_date: string
  email: string
  first_name: string | null
  last_name: string | null
  full_name: string
}

export default function BreaksPage() {
  const { user } = useAuth()
  const [breakSessions, setBreakSessions] = useState<BreakSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBreakSessions = async () => {
      if (!user?.email) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/breaks?email=${encodeURIComponent(user.email)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch break sessions')
        }
        
        const data = await response.json()
        setBreakSessions(data.breakSessions || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch break sessions')
      } finally {
        setLoading(false)
      }
    }

    fetchBreakSessions()
  }, [user?.email])

  const getBreakSessionsByType = (breakType: 'Morning' | 'Lunch' | 'Afternoon') => {
    return breakSessions.filter(session => session.break_type === breakType)
  }

  const getActiveBreakSessions = (breakType: 'Morning' | 'Lunch' | 'Afternoon') => {
    return breakSessions.filter(session => 
      session.break_type === breakType && 
      session.end_time === null
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3">
              <div className="flex flex-col gap-4 p-4">

                {/* Break Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between">
                  {loading ? (
                    <>
                      <BreakCardSkeleton 
                        title="Morning Break" 
                        icon={CoffeeIcon} 
                        color="bg-blue-100" 
                      />
                      <BreakCardSkeleton 
                        title="Lunch Break" 
                        icon={UtensilsIcon} 
                        color="bg-orange-100" 
                      />
                      <BreakCardSkeleton 
                        title="Afternoon Break" 
                        icon={ClockIcon} 
                        color="bg-green-100" 
                      />
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
                              <p className="text-sm font-medium text-muted-foreground">Morning Break</p>
                              <p className="text-2xl font-bold text-blue-600">
                                {getActiveBreakSessions('Morning').length}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <CoffeeIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Name</TableHead>
                                <TableHead className="text-xs text-center">Started</TableHead>
                                <TableHead className="text-xs text-right">Elapsed</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getActiveBreakSessions('Morning').length > 0 ? (
                                getActiveBreakSessions('Morning').map((session) => (
                                  <TableRow key={session.id}>
                                    <TableCell className="text-xs">{session.full_name}</TableCell>
                                    <TableCell className="text-xs font-medium">
                                      {new Date(session.start_time).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </TableCell>
                                    <TableCell className="text-xs text-right">
                                      <BreakTimer 
                                        startTime={session.start_time} 
                                        breakType={session.break_type} 
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-xs text-muted-foreground text-center py-8">
                                    <div className="flex flex-col items-center gap-2">
                                      <UserIcon className="h-8 w-8 text-muted-foreground/50" />
                                      <span>No employees on morning break</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Lunch Break</p>
                              <p className="text-2xl font-bold text-orange-600">
                                {getActiveBreakSessions('Lunch').length}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <UtensilsIcon className="h-5 w-5 text-orange-600" />
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Name</TableHead>
                                <TableHead className="text-xs text-center">Started</TableHead>
                                <TableHead className="text-xs text-right">Elapsed</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getActiveBreakSessions('Lunch').length > 0 ? (
                                getActiveBreakSessions('Lunch').map((session) => (
                                  <TableRow key={session.id}>
                                    <TableCell className="text-xs">{session.full_name}</TableCell>
                                    <TableCell className="text-xs font-medium">
                                      {new Date(session.start_time).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </TableCell>
                                    <TableCell className="text-xs text-right">
                                      <BreakTimer 
                                        startTime={session.start_time} 
                                        breakType={session.break_type} 
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-xs text-muted-foreground text-center py-8">
                                    <div className="flex flex-col items-center gap-2">
                                      <UserIcon className="h-8 w-8 text-muted-foreground/50" />
                                      <span>No employees on lunch break</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Afternoon Break</p>
                              <p className="text-2xl font-bold text-green-600">
                                {getActiveBreakSessions('Afternoon').length}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <ClockIcon className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Name</TableHead>
                                <TableHead className="text-xs text-center">Started</TableHead>
                                <TableHead className="text-xs text-right">Elapsed</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {getActiveBreakSessions('Afternoon').length > 0 ? (
                                getActiveBreakSessions('Afternoon').map((session) => (
                                  <TableRow key={session.id}>
                                    <TableCell className="text-xs">{session.full_name}</TableCell>
                                    <TableCell className="text-xs font-medium">
                                      {new Date(session.start_time).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                      })}
                                    </TableCell>
                                    <TableCell className="text-xs text-right">
                                      <BreakTimer 
                                        startTime={session.start_time} 
                                        breakType={session.break_type} 
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell colSpan={3} className="text-xs text-muted-foreground text-center py-8">
                                    <div className="flex flex-col items-center gap-2">
                                      <UserIcon className="h-8 w-8 text-muted-foreground/50" />
                                      <span>No employees on afternoon break</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {/* Employee Table */}
                  <Card className="mt-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">All Employees</p>
                          <p className="text-2xl font-bold">
                            {breakSessions.length}
                          </p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <UsersIcon className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Name</TableHead>
                            <TableHead className="text-xs">Email</TableHead>
                            <TableHead className="text-xs text-center">Break Type</TableHead>
                            <TableHead className="text-xs text-center">Started</TableHead>
                            <TableHead className="text-xs text-right">Elapsed</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {breakSessions.length > 0 ? (
                            breakSessions.map((session) => (
                              <TableRow key={session.id}>
                                <TableCell className="text-xs">{session.full_name}</TableCell>
                                <TableCell className="text-xs">{session.email}</TableCell>
                                <TableCell className="text-xs text-center">
                                  <Badge 
                                    variant={session.break_type === 'Morning' ? 'default' : 
                                           session.break_type === 'Lunch' ? 'secondary' : 'outline'}
                                    className={session.break_type === 'Morning' ? 'bg-blue-100 text-blue-700' :
                                             session.break_type === 'Lunch' ? 'bg-orange-100 text-orange-700' :
                                             'bg-green-100 text-green-700'}
                                  >
                                    {session.break_type}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-center font-medium">
                                  {new Date(session.start_time).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                  })}
                                </TableCell>
                                <TableCell className="text-xs text-right">
                                  <BreakTimer 
                                    startTime={session.start_time} 
                                    breakType={session.break_type} 
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-xs text-muted-foreground text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <UserIcon className="h-8 w-8 text-muted-foreground/50" />
                                  <span>No employees on break</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 