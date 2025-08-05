import { Pool } from 'pg'

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required for Railway database connection')
}

// Railway database connection (server-side only)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Test the connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export interface User {
  id: number
  email: string
  user_type: 'Agent' | 'Client' | 'Internal'
  created_at: Date
  updated_at: Date
}

export class RailwayServerService {
  // Test database connection and table structure
  static async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      // Test basic connection
      const client = await pool.connect()
      await client.query('SELECT NOW()')
      client.release()
      
      // Check if users table exists
      const tableCheck = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        )
      `)
      
      if (!tableCheck.rows[0].exists) {
        return { success: false, error: 'Users table does not exist' }
      }
      
      // Check table structure
      const structureCheck = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      
      console.log('Users table structure:', structureCheck.rows)
      
      return { success: true }
    } catch (error) {
      console.error('Database connection test failed:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error', details: error }
    }
  }

  // Check if user exists and is a client
  static async validateClientAccess(supabaseUserId: string, email: string): Promise<{ isValid: boolean; user?: User; error?: string; member?: any }> {
    try {
      console.log('Validating client access for email:', email)
      
      // Check if user exists in our database
      const query = 'SELECT * FROM users WHERE email = $1'
      const result = await pool.query(query, [email])
      
      console.log('Database query result:', result.rows)
      
      if (result.rows.length === 0) {
        return { 
          isValid: false, 
          error: 'User not found. Please contact your administrator to create an account.' 
        }
      }
      
      const user = result.rows[0]
      console.log('Found user:', user)
      
      // Check if user is a client
      if (user.user_type !== 'Client') {
        return { 
          isValid: false, 
          error: 'Access denied. Only clients can log in to this application.' 
        }
      }
      
      // Get member data for the user
      const memberData = await this.getCompanyByUserId(user.id)
      
      return { isValid: true, user, member: memberData }
    } catch (error) {
      console.error('Error validating client access:', error)
      return { isValid: false, error: 'Database connection error. Please try again later.' }
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1'
      const result = await pool.query(query, [email])
      
      if (result.rows.length > 0) {
        return result.rows[0]
      }
      return null
    } catch (error) {
      console.error('Error fetching user by email:', error)
      return null
    }
  }

  // Create new user (for registration)
  static async createUser(email: string, userType: 'Agent' | 'Client' | 'Internal' = 'Client'): Promise<User | null> {
    try {
      const query = `
        INSERT INTO users (email, user_type, created_at, updated_at)
        VALUES ($1, $2, NOW(), NOW())
        RETURNING *
      `
      const result = await pool.query(query, [email, userType])
      
      if (result.rows.length > 0) {
        return result.rows[0]
      }
      return null
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  // Get user personal info
  static async getUserPersonalInfo(userId: number): Promise<any> {
    try {
      const query = 'SELECT * FROM personal_info WHERE user_id = $1'
      const result = await pool.query(query, [userId])
      
      if (result.rows.length > 0) {
        return result.rows[0]
      }
      return null
    } catch (error) {
      console.error('Error fetching user personal info:', error)
      return null
    }
  }

  // Get company data by user ID
  static async getCompanyByUserId(userId: number): Promise<any> {
    try {
      // First get the user's member_id from clients or agents table
      let memberId = null
      
      // Check if user is a client
      const clientQuery = 'SELECT member_id FROM clients WHERE user_id = $1'
      const clientResult = await pool.query(clientQuery, [userId])
      
      if (clientResult.rows.length > 0) {
        memberId = clientResult.rows[0].member_id
      } else {
        // Check if user is an agent
        const agentQuery = 'SELECT member_id FROM agents WHERE user_id = $1'
        const agentResult = await pool.query(agentQuery, [userId])
        
        if (agentResult.rows.length > 0) {
          memberId = agentResult.rows[0].member_id
        }
      }
      
      if (!memberId) {
        console.log('No member_id found for user:', userId)
        return null
      }
      
      // Get company data from members table
      const companyQuery = 'SELECT * FROM members WHERE id = $1'
      const companyResult = await pool.query(companyQuery, [memberId])
      
      if (companyResult.rows.length > 0) {
        return companyResult.rows[0]
      }
      
      return null
    } catch (error) {
      console.error('Error fetching company data by user ID:', error)
      return null
    }
  }

  // Get all employees for a member
  static async getEmployeesByMemberId(memberId: number): Promise<any[]> {
    try {
      // Get only agents for this member with their personal and job info
      const query = `
        SELECT 
          u.id,
          u.email,
          u.user_type,
          pi.first_name,
          pi.middle_name,
          pi.last_name,
          pi.nickname,
          pi.profile_picture,
          pi.phone,
          pi.birthday,
          pi.city,
          pi.address,
          pi.gender,
          ji.employee_id,
          ji.job_title,
          ji.shift_period,
          ji.shift_schedule,
          ji.shift_time,
          ji.work_setup,
          ji.employment_status,
          ji.hire_type,
          ji.staff_source,
          ji.start_date,
          ji.exit_date,
          d.name as department_name,
          d.description as department_description
        FROM users u
        LEFT JOIN personal_info pi ON u.id = pi.user_id
        LEFT JOIN job_info ji ON u.id = ji.agent_user_id
        LEFT JOIN agents a ON u.id = a.user_id
        LEFT JOIN departments d ON a.department_id = d.id
        WHERE a.member_id = $1
        AND u.user_type = 'Agent'
        ORDER BY COALESCE(pi.last_name, '') || COALESCE(pi.first_name, '') || u.email
      `
      
      console.log('Fetching agents for member_id:', memberId)
      const result = await pool.query(query, [memberId])
      console.log('Found agents:', result.rows.length)
      return result.rows
    } catch (error) {
      console.error('Error fetching agents by member ID:', error)
      return []
    }
  }

  // Get employees for current user's member
  static async getEmployeesForCurrentUser(userId: number): Promise<any[]> {
    try {
      console.log('Getting employees for user_id:', userId)
      
      // First get the user's member_id
      let memberId = null
      
      // Check if user is a client
      const clientQuery = 'SELECT member_id FROM clients WHERE user_id = $1'
      const clientResult = await pool.query(clientQuery, [userId])
      
      if (clientResult.rows.length > 0) {
        memberId = clientResult.rows[0].member_id
        console.log('Found member_id from clients table:', memberId)
      } else {
        // Check if user is an agent
        const agentQuery = 'SELECT member_id FROM agents WHERE user_id = $1'
        const agentResult = await pool.query(agentQuery, [userId])
        
        if (agentResult.rows.length > 0) {
          memberId = agentResult.rows[0].member_id
          console.log('Found member_id from agents table:', memberId)
        }
      }
      
      if (!memberId) {
        console.log('No member_id found for user:', userId)
        return []
      }
      
      // Get employees for this member
      const employees = await this.getEmployeesByMemberId(memberId)
      console.log('Total employees found:', employees.length)
      return employees
    } catch (error) {
      console.error('Error fetching employees for current user:', error)
      return []
    }
  }

  // Debug method to test simple query
  static async debugGetAllUsersForMember(memberId: number): Promise<any[]> {
    try {
      console.log('Debug: Getting all agents for member_id:', memberId)
      
      // Simple query to see all agents
      const simpleQuery = `
        SELECT u.id, u.email, u.user_type, a.member_id as agent_member_id
        FROM users u
        LEFT JOIN agents a ON u.id = a.user_id
        WHERE a.member_id = $1
        AND u.user_type = 'Agent'
        ORDER BY u.email
      `
      
      const result = await pool.query(simpleQuery, [memberId])
      console.log('Debug: Found agents:', result.rows.length)
      console.log('Debug: Agents:', result.rows)
      return result.rows
    } catch (error) {
      console.error('Debug: Error fetching agents:', error)
      return []
    }
  }

  // Get break sessions for current user's member
  static async getBreakSessionsForCurrentUser(userId: number): Promise<any[]> {
    try {
      console.log('Getting break sessions for user_id:', userId)
      
      // First get the user's member_id
      let memberId = null
      
      // Check if user is a client
      const clientQuery = 'SELECT member_id FROM clients WHERE user_id = $1'
      const clientResult = await pool.query(clientQuery, [userId])
      
      if (clientResult.rows.length > 0) {
        memberId = clientResult.rows[0].member_id
        console.log('Found member_id from clients table:', memberId)
      } else {
        // Check if user is an agent
        const agentQuery = 'SELECT member_id FROM agents WHERE user_id = $1'
        const agentResult = await pool.query(agentQuery, [userId])
        
        if (agentResult.rows.length > 0) {
          memberId = agentResult.rows[0].member_id
          console.log('Found member_id from agents table:', memberId)
        }
      }
      
      if (!memberId) {
        console.log('No member_id found for user:', userId)
        return []
      }
      
      // Get break sessions for agents in this member
      const query = `
        SELECT 
          bs.id,
          bs.agent_user_id,
          bs.break_type,
          bs.start_time,
          bs.end_time,
          bs.duration_minutes,
          bs.pause_time,
          bs.resume_time,
          bs.pause_used,
          bs.time_remaining_at_pause,
          bs.break_date,
          bs.created_at,
          u.email,
          pi.first_name,
          pi.last_name,
          COALESCE(pi.first_name, '') || ' ' || COALESCE(pi.last_name, '') as full_name
        FROM break_sessions bs
        JOIN agents a ON bs.agent_user_id = a.user_id
        JOIN users u ON bs.agent_user_id = u.id
        LEFT JOIN personal_info pi ON u.id = pi.user_id
        WHERE a.member_id = $1
        AND bs.break_date = CURRENT_DATE
        AND bs.end_time IS NULL
        ORDER BY bs.start_time DESC
      `
      
      console.log('Fetching break sessions for member_id:', memberId)
      const result = await pool.query(query, [memberId])
      console.log('Found break sessions:', result.rows.length)
      return result.rows
    } catch (error) {
      console.error('Error fetching break sessions:', error)
      return []
    }
  }
} 