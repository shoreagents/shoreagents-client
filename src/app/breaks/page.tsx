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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CoffeeIcon, UtensilsIcon, ClockIcon, UsersIcon, UserIcon } from "lucide-react"
import { RailwayService, Employee } from "@/lib/railway"

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
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [employeesLoading, setEmployeesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [employeesError, setEmployeesError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBreakSessions = async () => {
      if (!user?.email) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      try {
        const data = await RailwayService.getBreakSessions()
        setBreakSessions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch break sessions')
      } finally {
        setLoading(false)
      }
    }

    fetchBreakSessions()
  }, [user?.email])

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      if (!user?.email) {
        setEmployeesError("User not authenticated")
        setEmployeesLoading(false)
        return
      }

      try {
        const data = await RailwayService.getEmployees()
        setEmployees(data)
      } catch (err) {
        console.error('Failed to fetch employees:', err)
        setEmployeesError('Failed to load employees')
      } finally {
        setEmployeesLoading(false)
      }
    }

    fetchEmployees()
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
                                    <TableCell className="text-xs font-medium text-center">
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
                                    <TableCell className="text-xs font-medium text-center">
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
                                    <TableCell className="text-xs font-medium text-center">
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
                </div>

                {/* All Employees Section - Full Width */}
                <div>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-lg font-semibold">All Employees</h2>
                          <p className="text-sm text-muted-foreground">
                            Complete list of employees with their current status
                          </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UsersIcon className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      
                      {employeesLoading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-3 p-3">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-60" />
                              </div>
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-6 w-20" />
                            </div>
                          ))}
                        </div>
                      ) : employeesError ? (
                        <div className="text-center py-12">
                          <p className="text-red-600 mb-2">Error loading employees</p>
                          <p className="text-sm text-muted-foreground">{employeesError}</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Employee</TableHead>
                              <TableHead className="text-center">Morning Break</TableHead>
                              <TableHead className="text-center">Lunch Break</TableHead>
                              <TableHead className="text-center">Afternoon Break</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {employees.length > 0 ? (
                              employees.map((employee) => {
                                const fullName = `${employee.first_name || ''} ${employee.middle_name || ''} ${employee.last_name || ''}`.trim() || employee.nickname || 'Unknown'
                                const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase()
                                const isOnBreak = breakSessions.some(session => session.email === employee.email && session.end_time === null)
                                
                                // Check break usage for today
                                const today = new Date().toISOString().split('T')[0]
                                
                                // Debug logging for first employee
                                if (employee.email === employees[0]?.email) {
                                  console.log('=== DATA FILTERING DEBUG ===')
                                  console.log('Today:', today)
                                  console.log('All break sessions:', breakSessions.length)
                                  console.log('Employee email:', employee.email)
                                  if (breakSessions.length > 0) {
                                    console.log('Sample session agent_user_id:', breakSessions[0].agent_user_id)
                                    console.log('Sample session break_date:', breakSessions[0].break_date)
                                    console.log('Sample session date after split:', breakSessions[0].break_date?.split('T')[0])
                                  }
                                }
                                
                                const employeeBreakSessions = breakSessions.filter(session => {
                                  // Extract date part from ISO timestamp string or use as-is if already date format
                                  const sessionDate = session.break_date?.split('T')[0] || session.break_date
                                  
                                  // Use agent_user_id to match with employee.id (proper foreign key relationship)
                                  const userMatch = session.agent_user_id === employee.id
                                  const dateMatch = sessionDate === today
                                  
                                  // Debug logging for first employee
                                  if (employee.email === employees[0]?.email) {
                                    console.log('Filtering session - User ID:', session.agent_user_id, 'vs Employee ID:', employee.id, '=', userMatch)
                                    console.log('Date comparison:', sessionDate, 'vs', today, '=', dateMatch)
                                  }
                                  
                                  return userMatch && dateMatch
                                })
                                
                                // Get break status for each type based on start_time and end_time
                                const getBreakStatus = (breakType: 'Morning' | 'Lunch' | 'Afternoon') => {
                                  const session = employeeBreakSessions.find(session => session.break_type === breakType)
                                  
                                  // Debug logging for first employee
                                  if (employee.email === employees[0]?.email) {
                                    console.log(`=== BREAK STATUS DEBUG for ${breakType} ===`)
                                    console.log('Employee email:', employee.email)
                                    console.log('All employee break sessions:', employeeBreakSessions)
                                    console.log('Looking for break_type:', breakType)
                                    console.log('Found session:', session)
                                    if (session) {
                                      console.log('Session start_time:', session.start_time, typeof session.start_time)
                                      console.log('Session end_time:', session.end_time, typeof session.end_time)
                                      console.log('start_time truthy?', !!session.start_time)
                                      console.log('end_time truthy?', !!session.end_time)
                                      console.log('start_time != null?', session.start_time != null)
                                      console.log('end_time != null?', session.end_time != null)
                                    }
                                    console.log('==========================================')
                                  }
                                  
                                  if (!session) {
                                    return 'Not Yet Used' // No session exists for this break type
                                  }
                                  
                                  // Check if timestamps have valid data (not null, undefined, or empty)
                                  const hasStartTime = session.start_time != null && session.start_time !== undefined
                                  const hasEndTime = session.end_time != null && session.end_time !== undefined
                                  
                                  if (!hasStartTime) {
                                    return 'Not Yet Used' // No start_time data
                                  } else if (hasStartTime && !hasEndTime) {
                                    return 'Used' // Has start_time but no end_time (in progress)
                                  } else if (hasStartTime && hasEndTime) {
                                    return 'Done' // Has both start_time and end_time (completed)
                                  }
                                  
                                  return 'Not Yet Used'
                                }
                                
                                const morningStatus = getBreakStatus('Morning')
                                const lunchStatus = getBreakStatus('Lunch')
                                const afternoonStatus = getBreakStatus('Afternoon')
                                
                                // Get badge styling based on status
                                const getBadgeProps = (status: string, breakType: 'Morning' | 'Lunch' | 'Afternoon') => {
                                  const baseColors = {
                                    'Morning': 'bg-blue-500',
                                    'Lunch': 'bg-orange-500', 
                                    'Afternoon': 'bg-green-500'
                                  }
                                  
                                  switch (status) {
                                    case 'Used':
                                      return {
                                        variant: "default" as const,
                                        className: `${baseColors[breakType]} text-white border-0 rounded-full px-3 py-1`,
                                        text: 'Used'
                                      }
                                    case 'Done':
                                      return {
                                        variant: "default" as const,
                                        className: `${baseColors[breakType]} text-white border-0 rounded-full px-3 py-1`,
                                        text: 'Done'
                                      }
                                    case 'Not Yet Used':
                                    default:
                                      return {
                                        variant: "outline" as const,
                                        className: "bg-gray-100 text-gray-600 border-gray-300 rounded-full px-3 py-1",
                                        text: 'Not Yet Used'
                                      }
                                  }
                                }
                                
                                return (
                                  <TableRow key={employee.id}>
                                    <TableCell>
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                          <AvatarImage src={employee.profile_picture || ''} alt={fullName} />
                                          <AvatarFallback className="bg-gray-100 text-gray-600">
                                            <UserIcon className="h-5 w-5" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <div className="font-medium">{fullName}</div>
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {(() => {
                                        const badgeProps = getBadgeProps(morningStatus, 'Morning')
                                        return (
                                          <Badge variant={badgeProps.variant} className={badgeProps.className}>
                                            {badgeProps.text}
                                          </Badge>
                                        )
                                      })()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {(() => {
                                        const badgeProps = getBadgeProps(lunchStatus, 'Lunch')
                                        return (
                                          <Badge variant={badgeProps.variant} className={badgeProps.className}>
                                            {badgeProps.text}
                                          </Badge>
                                        )
                                      })()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                      {(() => {
                                        const badgeProps = getBadgeProps(afternoonStatus, 'Afternoon')
                                        return (
                                          <Badge variant={badgeProps.variant} className={badgeProps.className}>
                                            {badgeProps.text}
                                          </Badge>
                                        )
                                      })()}
                                    </TableCell>
                                  </TableRow>
                                )
                              })
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-12">
                                  <div className="flex flex-col items-center gap-2">
                                    <UserIcon className="h-12 w-12 text-muted-foreground/50" />
                                    <span className="text-lg font-medium text-muted-foreground">No employees found</span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      )}
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