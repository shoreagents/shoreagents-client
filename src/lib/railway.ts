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

  // Get employees
  static async getEmployees(email: string): Promise<Employee[]> {
    try {
      const response = await fetch(`/api/employees?email=${encodeURIComponent(email)}`)
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
} 