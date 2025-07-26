import { NextRequest, NextResponse } from 'next/server'
import { RailwayServerService } from '@/lib/railway-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get user data to find their member_id
    const user = await RailwayServerService.getUserByEmail(email)
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get company data based on user's member_id
    const companyData = await RailwayServerService.getCompanyByUserId(user.id)
    
    if (!companyData) {
      return NextResponse.json({ error: 'Company data not found' }, { status: 404 })
    }

    return NextResponse.json({
      company: companyData.company,
      address: companyData.address,
      phone: companyData.phone,
      logo: companyData.logo,
      service: companyData.service,
      status: companyData.status,
      badge_color: companyData.badge_color,
      country: companyData.country,
      website: companyData.website
    })
  } catch (error) {
    console.error('Error fetching company data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch company data' },
      { status: 500 }
    )
  }
} 