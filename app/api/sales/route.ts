import { readSheet, addRowToSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'

function generateSalesID(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `SALE-${timestamp}-${randomPart}`
}

// Fixed percentages
const SALES_PERCENTAGES = {
  'Cost of production': 0.5,
  Savings: 0.333,
  Tithe: 0.1,
  'Sales payroll': 0.2
}

export async function GET() {
  try {
    const sales = await readSheet('Sales')
    return createSuccessResponse(sales)
  } catch (error) {
    console.error('Error reading sales:', error)
    return createErrorResponse('Failed to read sales', 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = [
      'Employee',
      'Product',
      'Quantity',
      'Price',
      'Event'
    ]
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return createErrorResponse(`Missing required field: ${field}`, 400)
      }
    }

    // Calculate total sales
    const totalSales = body.Quantity * body.Price

    // Calculate amounts based on fixed percentages
    const amounts = {
      'Cost of production': totalSales * SALES_PERCENTAGES['Cost of production'],
      Savings: totalSales * SALES_PERCENTAGES.Savings,
      Tithe: totalSales * SALES_PERCENTAGES.Tithe,
      'Sales payroll': totalSales * SALES_PERCENTAGES['Sales payroll']
    }

    // Create sales record
    const salesRecord = {
      ID: generateSalesID(),
      Date: new Date(),
      Employee: body.Employee,
      Product: body.Product,
      Quantity: body.Quantity,
      Price: body.Price,
      'Total Sales': totalSales,
      Event: body.Event || '',
      'Production Cost': amounts['Cost of production'],
      'Business Savings': amounts.Savings,
      'Sales Payroll': amounts['Sales payroll'],
      Tithe: amounts.Tithe
    }

    // Save to Google Sheets
    await addRowToSheet('Sales', salesRecord)
    
    return createSuccessResponse({
      id: salesRecord.ID,
      totalSales,
      amounts,
      message: 'Sales recorded successfully'
    }, 201)
  } catch (error) {
    console.error('Error recording sales:', error)
    return createErrorResponse('Failed to record sales', 500)
  }
}
