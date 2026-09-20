import jwt from 'jsonwebtoken'
import { AuthPayload } from '@/types'

const SECRET = process.env.JWT_SECRET || 'supreme-collections-secret-key-change-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'jkorm123'


export function createToken(): string {
  const payload: AuthPayload = {
    admin: true,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }
  return jwt.sign(payload, SECRET)
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET) as AuthPayload
    return decoded
  } catch (error) {
    return null
  }
}

export async function validateLogin(username: string, password: string): Promise<boolean> {
  // Default credentials: admin / password from env
  if (username !== 'admin') {
    return false
  }

  // Compare plain text passwords
  return password === ADMIN_PASSWORD
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  if (!authHeader) return null
  
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  
  return parts[1]
}

export function createErrorResponse(message: string, status: number = 400) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return new Response(JSON.stringify({ success: true, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
