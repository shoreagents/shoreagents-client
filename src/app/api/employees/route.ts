import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    console.log('Employees API called with email:', email)
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get user data to find their member_id
    const user = await RailwayServerService.getUserByEmail(email)
    
    console.log('Found user:', user?.id, user?.email, user?.user_type)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get employees for this user's member
    const employees = await RailwayServerService.getEmployeesForCurrentUser(user.id)
    
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
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get user data
    const user = await RailwayServerService.getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is a client (read-only access)
    if (user.user_type === 'Client') {
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