import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
  try {
    // Get Bearer token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('Breaks API called with token:', token ? 'present' : 'missing')
    
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
    
    // Get user data from Railway database
    const railwayUser = await RailwayServerService.getUserByEmail(user.email!)
    
    if (!railwayUser) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
    }

    // Get break sessions for this user's member
    const breakSessions = await RailwayServerService.getBreakSessionsForCurrentUser(railwayUser.id)
    
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