"use client"

import { useState, useEffect, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  SearchIcon, 
  MoreHorizontalIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  LoaderIcon,
  UserIcon,
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  PlusIcon,
  FilterIcon,
  DownloadIcon,
  CalendarDaysIcon,
  UsersIcon
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAuth } from "@/contexts/auth-context"
import { RailwayService, Employee } from "@/lib/railway"

// Attendance record interface
interface AttendanceRecord {
  id: number
  employee_id: number
  employee_name: string
  employee_email: string
  date: string
  check_in_time?: string | null
  check_out_time?: string | null
  total_hours?: number
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave'
  department?: string
  job_title?: string
  notes?: string
}

// Mock attendance data for demonstration
const mockAttendanceData: AttendanceRecord[] = [
  {
    id: 1,
    employee_id: 1,
    employee_name: "John Doe",
    employee_email: "john.doe@company.com",
    date: "2024-01-15",
    check_in_time: "09:00",
    check_out_time: "17:00",
    total_hours: 8,
    status: "present",
    department: "Engineering",
    job_title: "Software Engineer"
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: "Jane Smith",
    employee_email: "jane.smith@company.com",
    date: "2024-01-15",
    check_in_time: "08:45",
    check_out_time: "17:15",
    total_hours: 8.5,
    status: "present",
    department: "Marketing",
    job_title: "Marketing Manager"
  },
  {
    id: 3,
    employee_id: 3,
    employee_name: "Mike Johnson",
    employee_email: "mike.johnson@company.com",
    date: "2024-01-15",
    check_in_time: "09:30",
    check_out_time: "17:00",
    total_hours: 7.5,
    status: "late",
    department: "Sales",
    job_title: "Sales Representative"
  },
  {
    id: 4,
    employee_id: 4,
    employee_name: "Sarah Wilson",
    employee_email: "sarah.wilson@company.com",
    date: "2024-01-15",
    check_in_time: null,
    check_out_time: null,
    total_hours: 0,
    status: "absent",
    department: "HR",
    job_title: "HR Specialist"
  },
  {
    id: 5,
    employee_id: 5,
    employee_name: "David Brown",
    employee_email: "david.brown@company.com",
    date: "2024-01-15",
    check_in_time: "09:00",
    check_out_time: "13:00",
    total_hours: 4,
    status: "half-day",
    department: "Finance",
    job_title: "Financial Analyst"
  }
]

// Skeleton component for attendance rows
const AttendanceSkeleton = () => (
  <TableRow>
    <TableCell>
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-16 rounded" />
    </TableCell>
  </TableRow>
)

// Table columns definition
const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: "employee_name",
    header: "Employee",
    cell: ({ row }) => {
      const record = row.original
      const initials = record.employee_name.split(' ').map(n => n[0]).join('').toUpperCase()
      
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={record.employee_name} />
            <AvatarFallback className="text-xs bg-gray-100 text-gray-600">
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{record.employee_name}</div>
            <div className="text-sm text-muted-foreground">{record.employee_email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string)
      return (
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
          <span>{date.toLocaleDateString()}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "check_in_time",
    header: "Check In",
    cell: ({ row }) => {
      const checkIn = row.getValue("check_in_time") as string | null
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <span>{checkIn || "Not checked in"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "check_out_time",
    header: "Check Out",
    cell: ({ row }) => {
      const checkOut = row.getValue("check_out_time") as string | null
      return (
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
          <span>{checkOut || "Not checked out"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "total_hours",
    header: "Hours",
    cell: ({ row }) => {
      const hours = row.getValue("total_hours") as number
      return (
        <div className="font-medium">
          {hours > 0 ? `${hours}h` : "0h"}
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const getStatusConfig = (status: string) => {
        switch (status) {
          case 'present':
            return { label: 'Present', variant: 'default', icon: CheckCircleIcon }
          case 'absent':
            return { label: 'Absent', variant: 'destructive', icon: XCircleIcon }
          case 'late':
            return { label: 'Late', variant: 'secondary', icon: AlertCircleIcon }
          case 'half-day':
            return { label: 'Half Day', variant: 'outline', icon: AlertCircleIcon }
          case 'leave':
            return { label: 'Leave', variant: 'outline', icon: CalendarIcon }
          default:
            return { label: 'Unknown', variant: 'outline', icon: AlertCircleIcon }
        }
      }
      
      const config = getStatusConfig(status)
      const IconComponent = config.icon
      
      return (
        <Badge variant={config.variant as any} className="flex items-center gap-1">
          <IconComponent className="h-3 w-3" />
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.getValue("department") as string
      return <div className="text-muted-foreground">{department || 'Not assigned'}</div>
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
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
              <ClockIcon className="mr-2 h-4 w-4" />
              Edit Time
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <XCircleIcon className="mr-2 h-4 w-4" />
              Mark Absent
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AttendancePage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  // Fetch attendance data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch employees and attendance data
        const [employeeData, attendanceResponse] = await Promise.all([
          RailwayService.getEmployees(user.email),
          RailwayService.getAttendance(user.email, {
            date: dateFilter || undefined,
            status: statusFilter !== "all" ? statusFilter : undefined,
            department: departmentFilter !== "all" ? departmentFilter : undefined,
          })
        ])
        
        setEmployees(employeeData)
        setAttendanceData(attendanceResponse.attendance)
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load attendance data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.email, dateFilter, statusFilter, departmentFilter])

  // Get unique departments for filter options
  const uniqueDepartments = useMemo(() => {
    const departments = attendanceData
      .map(record => record.department)
      .filter(dept => dept && dept.trim() !== '')
    return [...new Set(departments)].sort()
  }, [attendanceData])

  // Filter attendance data
  const filteredAttendanceData = useMemo(() => {
    let filtered = attendanceData

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter)
    }

    // Filter by department
    if (departmentFilter !== "all") {
      filtered = filtered.filter(record => record.department === departmentFilter)
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter(record => record.date === dateFilter)
    }

    return filtered
  }, [attendanceData, statusFilter, departmentFilter, dateFilter])

  const table = useReactTable({
    data: filteredAttendanceData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  })

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const total = attendanceData.length
    const present = attendanceData.filter(record => record.status === 'present').length
    const absent = attendanceData.filter(record => record.status === 'absent').length
    const late = attendanceData.filter(record => record.status === 'late').length
    const halfDay = attendanceData.filter(record => record.status === 'half-day').length

    return {
      total,
      present,
      absent,
      late,
      halfDay,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0
    }
  }, [attendanceData])

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3">
                {/* Header Skeleton */}
                <div className="px-2 lg:px-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64 mt-2" />
                      </div>
                    </div>

                    {/* Stats Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-24 w-full" />
                      ))}
                    </div>

                    {/* Search and Filters Skeleton */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
                      <Skeleton className="h-9 w-64" />
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-32" />
                      </div>
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
                            <Skeleton className="h-4 w-20" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-20" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-24" />
                          </TableHead>
                          <TableHead>
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <AttendanceSkeleton key={index} />
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

  if (error) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3">
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="text-red-600 mb-2">Error loading attendance data</div>
                    <Button onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
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
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-2 py-2 md:gap-3 md:py-3">
                {/* Header */}
                <div className="px-2 lg:px-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
                        <p className="text-muted-foreground">
                          Track and manage employee attendance records
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                        <Button size="sm">
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add Record
                        </Button>
                      </div>
                    </div>

                    {/* Attendance Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{attendanceStats.total}</div>
                          <p className="text-xs text-muted-foreground">
                            Today's attendance
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Present</CardTitle>
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                          <p className="text-xs text-muted-foreground">
                            {attendanceStats.presentPercentage}% attendance rate
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Absent</CardTitle>
                          <XCircleIcon className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                          <p className="text-xs text-muted-foreground">
                            Not present today
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Late</CardTitle>
                          <AlertCircleIcon className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                          <p className="text-xs text-muted-foreground">
                            Arrived late today
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
                      <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Search attendance records..."
                          value={globalFilter ?? ""}
                          onChange={(event) => setGlobalFilter(event.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="present">Present</SelectItem>
                            <SelectItem value="absent">Absent</SelectItem>
                            <SelectItem value="late">Late</SelectItem>
                            <SelectItem value="half-day">Half Day</SelectItem>
                            <SelectItem value="leave">Leave</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Department..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {uniqueDepartments.map((dept) => (
                              <SelectItem key={dept} value={dept || ''}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          type="date"
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="w-[150px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Table */}
                <div className="px-2 lg:px-4">
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id}>
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              No attendance records found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-2 py-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {table.getFilteredSelectedRowModel().rows.length} of{" "}
                      {table.getFilteredRowModel().rows.length} row(s) selected.
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeftIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeftIcon className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-center px-3 py-1 text-sm font-medium">
                        Page {table.getState().pagination.pageIndex + 1} of{" "}
                        {table.getPageCount()}
                      </div>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                      >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRightIcon className="h-4 w-4" />
                      </Button>
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