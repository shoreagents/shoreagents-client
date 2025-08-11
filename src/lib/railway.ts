export interface User {
  id: number
  email: string
  user_type: 'Agent' | 'Client' | 'Internal'
  created_at: Date
  updated_at: Date
}

export interface Member {
  id: number
  company: string
  address?: string
  phone?: string
  logo?: string
  service?: string
  status?: string
  badge_color?: string
  country?: string
  website?: string[]
  created_at: Date
  updated_at: Date
}

export interface Employee {
  id: number
  email: string
  user_type: 'Agent' | 'Client' | 'Internal'
  first_name?: string
  middle_name?: string
  last_name?: string
  nickname?: string
  profile_picture?: string
  phone?: string
  birthday?: string
  city?: string
  address?: string
  gender?: string
  employee_id?: string
  job_title?: string
  shift_period?: string
  shift_schedule?: string
  shift_time?: string
  work_setup?: string
  employment_status?: string
  hire_type?: string
  staff_source?: string
  start_date?: string
  exit_date?: string
  work_email?: string
  department_name?: string
  department_description?: string
}

export class RailwayService {
  // Validate client access
  static async validateClientAccess(supabaseUserId: string, email: string): Promise<{ isValid: boolean; user?: User; member?: Member; error?: string }> {
    try {
      const response = await fetch('/api/user-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supabaseUserId, email }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        return { isValid: true, user: data.user, member: data.member }
      } else {
        return { isValid: false, error: data.error }
      }
    } catch (error) {
      console.error('Error validating client access:', error)
      return { isValid: false, error: 'Network error occurred' }
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`/api/user-type?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      
      if (response.ok) {
        return data.user
      }
      return null
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  // Get employees (session-based)
  static async getEmployees(): Promise<Employee[]> {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-utils')
      const response = await authenticatedFetch('/api/employees')
      const data = await response.json()
      
      if (response.ok) {
        return data.employees || []
      }
      return []
    } catch (error) {
      console.error('Error fetching employees:', error)
      return []
    }
  }

  // Get break sessions (session-based)
  static async getBreakSessions(): Promise<any[]> {
    try {
      const { authenticatedFetch } = await import('@/lib/auth-utils')
      const response = await authenticatedFetch('/api/breaks')
      const data = await response.json()
      
      if (response.ok) {
        return data.breakSessions || []
      }
      return []
    } catch (error) {
      console.error('Error fetching break sessions:', error)
      return []
    }
  }

  // Get attendance records
  static async getAttendance(email: string, filters?: {
    date?: string
    status?: string
    department?: string
  }): Promise<{ attendance: any[], stats: any }> {
    try {
      const params = new URLSearchParams({ email })
      if (filters?.date) params.append('date', filters.date)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.department) params.append('department', filters.department)

      const response = await fetch(`/api/attendance?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        return { attendance: data.attendance || [], stats: data.stats || {} }
      }
      return { attendance: [], stats: {} }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      return { attendance: [], stats: {} }
    }
  }

  // Create attendance record
  static async createAttendanceRecord(record: {
    employee_id: number
    date: string
    check_in_time?: string
    check_out_time?: string
    status?: string
    notes?: string
  }): Promise<any> {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      })
      const data = await response.json()
      
      if (response.ok) {
        return data.attendance
      }
      throw new Error(data.error || 'Failed to create attendance record')
    } catch (error) {
      console.error('Error creating attendance record:', error)
      throw error
    }
  }
} 