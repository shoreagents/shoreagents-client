import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    console.log('Breaks API called with email:', email)
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get user data to find their user_id
    const user = await RailwayServerService.getUserByEmail(email)
    
    console.log('Found user:', user?.id, user?.email, user?.user_type)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get break sessions for this user's member
    const breakSessions = await RailwayServerService.getBreakSessionsForCurrentUser(user.id)
    
    console.log('Returning break sessions:', breakSessions.length)
    
    return NextResponse.json({ breakSessions })
  } catch (error) {
    console.error('Error fetching break sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch break sessions' },
      { status: 500 }
    )
  }
} 