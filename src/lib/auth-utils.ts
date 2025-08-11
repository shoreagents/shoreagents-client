import { supabase } from './supabase'

export interface AuthenticatedRequest {
  headers: {
    'Authorization': string
    'Content-Type': string
  }
}

/**
 * Get the current session token for API authentication
 */
export async function getSessionToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token || null
  } catch (error) {
    console.error('Error getting session token:', error)
    return null
  }
}

/**
 * Create authenticated request headers
 */
export async function getAuthHeaders(): Promise<{ 'Authorization': string } | null> {
  const token = await getSessionToken()
  if (!token) return null
  
  return {
    'Authorization': `Bearer ${token}`
  }
}

/**
 * Make an authenticated API request
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authHeaders = await getAuthHeaders()
  
  if (!authHeaders) {
    throw new Error('No authentication token available')
  }

  return fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
} 