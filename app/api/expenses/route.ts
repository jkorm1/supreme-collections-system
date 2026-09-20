import { readSheet, addRowToSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'

function generateExpenseID(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `EXP-${timestamp}-${randomPart}`
}

export async function GET() {
  try {
    const expenses = await readSheet('Expenses')
    return createSuccessResponse(expenses)
  } catch (error) {
    console.error('Error reading expenses:', error)
    return createErrorResponse('Failed to read expenses', 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['Category', 'Description', 'Amount']
    
    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return createErrorResponse(`Missing required field: ${field}`, 400)
      }
    }

    // Create expense record
    const expenseRecord = {
      ID: generateExpenseID(),
      Date: new Date(),
      Category: body.Category,
      Description: body.Description,
      Amount: body.Amount,
      Notes: body.Notes || ''
    }

    // Save to Google Sheets
    await addRowToSheet('Expenses', expenseRecord)
    
    return createSuccessResponse({
      id: expenseRecord.ID,
      message: 'Expense recorded successfully'
    }, 201)
  } catch (error) {
    console.error('Error recording expense:', error)
    return createErrorResponse('Failed to record expense', 500)
  }
}
