import { readSheet, addRowToSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'
import { OrderRequest, Order } from '@/types'

function generateOrderID(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${randomPart}`
}

export async function GET() {
  try {
    const orders = await readSheet('Orders')
    return createSuccessResponse(orders)
  } catch (error) {
    console.error('Error reading orders:', error)
    return createErrorResponse('Failed to read orders', 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest

    // Validate required fields
    const requiredFields = [
      'Product_ID',
      'Customer_Name',
      'Phone',
      'Delivery_Address',
      'Size',
      'Quantity',
    ]
    for (const field of requiredFields) {
      if (!body[field as keyof OrderRequest]) {
        return createErrorResponse(`Missing required field: ${field}`, 400)
      }
    }

    // Read product to get current price
    const products = await readSheet('Products')
    const product = products.find((p: any) => p.Product_ID === body.Product_ID)
    
    if (!product) {
      return createErrorResponse('Product not found', 404)
    }

    // Create order
    const order: Order = {
      Order_ID: generateOrderID(),
      Date: new Date(),
      Customer_Name: body.Customer_Name,
      Phone: body.Phone,
      Delivery_Address: body.Delivery_Address,
      Product_ID: body.Product_ID,
      Product_Name: product.Product_Name,
      Size: body.Size,
      Quantity: body.Quantity,
      Unit_Price: product.Price,
      Total_Price: product.Price * body.Quantity,
      Special_Instructions: body.Special_Instructions || '',
    }

    // Save to Google Sheets
    await addRowToSheet('Orders', order as any)

    // Add to Customers sheet if new customer
    const customers = await readSheet('Customers')
    const existingCustomer = customers.find((c: any) => c.Phone === body.Phone)

    if (!existingCustomer) {
      const customerID = `CUST-${Date.now().toString(36).toUpperCase()}`
      const newCustomer = {
        Customer_ID: customerID,
        Full_Name: body.Customer_Name,
        Phone: body.Phone,
        Location: body.Location,
        Email: '',
        Date_Joined: new Date(),
        Total_Orders: 1,
        Total_Spent: order.Total_Price,
        Last_Purchase_Date: new Date(),
        Status: 'Active',
      }
      await addRowToSheet('Customers', newCustomer)
    }

    return createSuccessResponse(
      {
        orderID: order.Order_ID,
        total: order.Total_Price,
        message: 'Order placed successfully',
      },
      201
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return createErrorResponse('Failed to create order', 500)
  }
}
