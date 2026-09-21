import { readSheet, addRowToSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function generateCustomerID(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CUST-${timestamp}-${randomPart}`
}

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function phoneKey(phone: unknown): string {
  return text(phone).replace(/\D/g, '').slice(-9)
}

export async function GET() {
  try {
    const customers = await readSheet('Customers')
    return createSuccessResponse(customers)
  } catch (error) {
    console.error('Error reading customers:', error)
    return createErrorResponse('Failed to read customers', 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>

    const fullName = text(body.Full_Name)
    const phone = text(body.Phone)
    const location = text(body.Location)

    if (!fullName) {
      return createErrorResponse('Missing required field: Full_Name', 400)
    }
    if (!phone || phoneKey(phone).length < 9) {
      return createErrorResponse('Enter a valid phone number', 400)
    }
    if (!location) {
      return createErrorResponse('Missing required field: Location', 400)
    }

    const customers = (await readSheet('Customers')) as any[]
    const key = phoneKey(phone)
    const alreadyCustomer = customers.some((c) => phoneKey(c.Phone) === key)

    if (alreadyCustomer) {
      return createErrorResponse('A customer with this phone number already exists', 409)
    }

    await addRowToSheet('Customers', {
      Customer_ID: generateCustomerID(),
      Full_Name: fullName,
      Phone: phone,
      Location: location,
    })

    return createSuccessResponse({ message: 'Customer recorded successfully' }, 201)
  } catch (error) {
    console.error('Error creating customer:', error)
    return createErrorResponse('Failed to create customer', 500)
  }
}
