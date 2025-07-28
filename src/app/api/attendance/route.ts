import { NextRequest, NextResponse } from 'next/server'

// Mock attendance data - in a real implementation, this would come from your database
const mockAttendanceData = [
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
  },
  {
    id: 6,
    employee_id: 6,
    employee_name: "Emily Davis",
    employee_email: "emily.davis@company.com",
    date: "2024-01-15",
    check_in_time: "08:30",
    check_out_time: "17:30",
    total_hours: 9,
    status: "present",
    department: "Engineering",
    job_title: "Frontend Developer"
  },
  {
    id: 7,
    employee_id: 7,
    employee_name: "Robert Wilson",
    employee_email: "robert.wilson@company.com",
    date: "2024-01-15",
    check_in_time: "09:15",
    check_out_time: "17:00",
    total_hours: 7.75,
    status: "late",
    department: "Sales",
    job_title: "Account Manager"
  },
  {
    id: 8,
    employee_id: 8,
    employee_name: "Lisa Anderson",
    employee_email: "lisa.anderson@company.com",
    date: "2024-01-15",
    check_in_time: null,
    check_out_time: null,
    total_hours: 0,
    status: "leave",
    department: "Marketing",
    job_title: "Content Creator"
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const date = searchParams.get('date')
    const status = searchParams.get('status')
    const department = searchParams.get('department')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Validate the user's access to this company's data
    // 2. Query your database for attendance records
    // 3. Apply filters based on the parameters

    let filteredData = [...mockAttendanceData]

    // Apply date filter
    if (date) {
      filteredData = filteredData.filter(record => record.date === date)
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredData = filteredData.filter(record => record.status === status)
    }

    // Apply department filter
    if (department && department !== 'all') {
      filteredData = filteredData.filter(record => record.department === department)
    }

    // Calculate attendance statistics
    const total = filteredData.length
    const present = filteredData.filter(record => record.status === 'present').length
    const absent = filteredData.filter(record => record.status === 'absent').length
    const late = filteredData.filter(record => record.status === 'late').length
    const halfDay = filteredData.filter(record => record.status === 'half-day').length
    const leave = filteredData.filter(record => record.status === 'leave').length

    const stats = {
      total,
      present,
      absent,
      late,
      halfDay,
      leave,
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0
    }

    return NextResponse.json({
      attendance: filteredData,
      stats,
      success: true
    })

  } catch (error) {
    console.error('Error fetching attendance data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendance data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employee_id, date, check_in_time, check_out_time, status, notes } = body

    // Validate required fields
    if (!employee_id || !date) {
      return NextResponse.json(
        { error: 'Employee ID and date are required' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Validate the user's permissions
    // 2. Insert the attendance record into your database
    // 3. Return the created record

    const newRecord = {
      id: Date.now(), // In real implementation, this would be generated by the database
      employee_id,
      date,
      check_in_time,
      check_out_time,
      total_hours: calculateHours(check_in_time, check_out_time),
      status: status || 'present',
      notes,
      created_at: new Date().toISOString()
    }

    return NextResponse.json({
      attendance: newRecord,
      success: true
    })

  } catch (error) {
    console.error('Error creating attendance record:', error)
    return NextResponse.json(
      { error: 'Failed to create attendance record' },
      { status: 500 }
    )
  }
}

// Helper function to calculate hours worked
function calculateHours(checkIn: string | null, checkOut: string | null): number {
  if (!checkIn || !checkOut) return 0
  
  const checkInTime = new Date(`2000-01-01T${checkIn}`)
  const checkOutTime = new Date(`2000-01-01T${checkOut}`)
  
  const diffMs = checkOutTime.getTime() - checkInTime.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  
  return Math.round(diffHours * 100) / 100 // Round to 2 decimal places
} 