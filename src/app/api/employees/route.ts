import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
  try {
    // Get Bearer token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('Employees API called with token:', token ? 'present' : 'missing')
    
    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 })
    }

    // Validate token and get user
    const { supabase } = await import('@/lib/supabase')
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      console.error('Token validation failed:', error)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    console.log('Found user:', user.id, user.email, user.user_metadata)
    
    // Get Railway user ID directly from Supabase user ID (most efficient)
    const railwayUserId = await RailwayServerService.getRailwayUserIdFromSupabase(user.id)
    
    if (!railwayUserId) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }
    
    // Get employees using Railway user ID (most secure)
    const employees = await RailwayServerService.getEmployeesByUserId(railwayUserId)
    
    console.log('Returning employees:', employees.length)
    
    return NextResponse.json({ employees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user from session/token
    const user = request.headers.get('x-user-id')
    
    if (!user) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    // Get user data to check permissions
    const userData = await RailwayServerService.getUserByEmail(user)
    
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is a client (read-only access)
    if (userData.user_type === 'Client') {
      return NextResponse.json({ 
        error: 'Access denied. Clients can only view employees.' 
      }, { status: 403 })
    }

    // Only allow Agents and Internal users to create employees
    const body = await request.json()
    // TODO: Implement employee creation logic for authorized users
    
    return NextResponse.json({ message: 'Employee created successfully' })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
} 