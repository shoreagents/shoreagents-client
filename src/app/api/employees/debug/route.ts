import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'
import { pool } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
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

    // Get member_id
    let memberId = null
    const clientQuery = 'SELECT member_id FROM clients WHERE user_id = $1'
    const clientResult = await pool.query(clientQuery, [user.id])
    
    if (clientResult.rows.length > 0) {
      memberId = clientResult.rows[0].member_id
    } else {
      const agentQuery = 'SELECT member_id FROM agents WHERE user_id = $1'
      const agentResult = await pool.query(agentQuery, [user.id])
      
      if (agentResult.rows.length > 0) {
        memberId = agentResult.rows[0].member_id
      }
    }

    if (!memberId) {
      return NextResponse.json({ error: 'No member_id found' }, { status: 404 })
    }

    // Test simple query
    const debugUsers = await RailwayServerService.debugGetAllUsersForMember(memberId)
    
    return NextResponse.json({ 
      user_id: user.id,
      member_id: memberId,
      debug_users: debugUsers,
      debug_count: debugUsers.length
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Debug failed' },
      { status: 500 }
    )
  }
} 