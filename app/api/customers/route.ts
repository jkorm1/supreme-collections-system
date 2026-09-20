import { readSheet, addRowToSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'

function generateCustomerID(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CUST-${timestamp}-${randomPart}`
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
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['Full_Name', 'Phone', 'Location']
    for (const field of requiredFields) {
      if (!body[field]) {
        return createErrorResponse(`Missing required field: ${field}`, 400)
      }
    }

    // Check if customer with this phone already exists
    const existingCustomers = await readSheet('Customers')
    const existingCustomer = existingCustomers.find((c: any) => c.Phone === body.Phone)
    
    if (existingCustomer) {
      return createErrorResponse('Customer with this phone number already exists', 400)
    }

    // Create customer record
    const customer = {
      Customer_ID: generateCustomerID(),
      Full_Name: body.Full_Name,
      Phone: body.Phone,
      Location: body.Location,
      Date_Joined: new Date(),
      Status: 'Active'
    }

    // Save to Google Sheets
    await addRowToSheet('Customers', customer)
    
    return createSuccessResponse({
      id: customer.Customer_ID,
      message: 'Customer recorded successfully'
    }, 201)
  } catch (error) {
    console.error('Error recording customer:', error)
    return createErrorResponse('Failed to record customer', 500)
  }
}
