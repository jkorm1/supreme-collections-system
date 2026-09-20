import { validateLogin, createToken, createSuccessResponse, createErrorResponse } from '@/lib/auth'
import { LoginRequest } from '@/types'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginRequest

    if (!body.username || !body.password) {
      return createErrorResponse('Username and password required', 400)
    }

    const isValid = await validateLogin(body.username, body.password)
    if (!isValid) {
      return createErrorResponse('Invalid credentials', 401)
    }

    const token = createToken()
    return createSuccessResponse(
      {
        token,
        expiresIn: 24 * 60 * 60,
        admin: true,
      },
      200
    )
  } catch (error) {
    console.error('Login error:', error)
    return createErrorResponse('Login failed', 500)
  }
}
