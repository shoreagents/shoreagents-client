import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await RailwayServerService.getUserByEmail(email)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ 
      error: 'Database connection error. Please try again later.' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { supabaseUserId, email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const validation = await RailwayServerService.validateClientAccess(supabaseUserId || '', email)
    
    if (!validation.isValid) {
      return NextResponse.json({ 
        error: validation.error || 'Access denied' 
      }, { status: 403 })
    }

    return NextResponse.json({ 
      message: 'Client access validated successfully',
      user: validation.user,
      member: validation.member
    })
  } catch (error) {
    console.error('Error validating client access:', error)
    
    // Check if it's a database connection error
    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json({ 
        error: 'Database configuration error. Please check your environment variables.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: 'Database connection error. Please try again later.' 
    }, { status: 500 })
  }
} 