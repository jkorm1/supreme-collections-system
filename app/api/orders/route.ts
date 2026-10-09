import { readSheet, addRowToSheet,  updateRowInSheet, updateRowById } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'
import { sendOrderNotification } from '@/lib/telegram'

export const dynamic = 'force-dynamic'

const MAX_LINES = 50
const MAX_QUANTITY = 99
const LIST_SEPARATOR = '; '

function generateOrderID(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${randomPart}`
}

function generateCustomerID(): string {
  const timestamp = (Date.now() + 1).toString(36).toUpperCase()
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CUST-${timestamp}-${randomPart}`
}

function text(value: unknown): string {
  return value === undefined || value === null ? '' : String(value).trim()
}

function phoneKey(phone: unknown): string {
  return text(phone).replace(/\D/g, '').slice(-9)
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
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
    const body = (await request.json()) as Record<string, unknown>

    const customerName = text(body.Customer_Name)
    const phone = text(body.Phone)
    const location = text(body.Location) || text(body.Delivery_Address)
    const instructions = text(body.Special_Instructions)

    if (!customerName) {
      return createErrorResponse('Missing required field: Customer_Name', 400)
    }
    if (!phone || phoneKey(phone).length < 9) {
      return createErrorResponse('Enter a valid phone number', 400)
    }
    if (!location) {
      return createErrorResponse('Missing required field: Location', 400)
    }

    const rawLines: unknown[] = Array.isArray(body.Items) ? body.Items : [body]

    if (rawLines.length === 0) {
      return createErrorResponse('Your cart is empty', 400)
    }
    if (rawLines.length > MAX_LINES) {
      return createErrorResponse('Too many items in one order', 400)
    }

    const lines: { productId: string; size: string; quantity: number }[] = []
    for (const raw of rawLines) {
      const line = (raw ?? {}) as Record<string, unknown>
      const productId = text(line.Product_ID)
      const size = text(line.Size)
      const quantity = Number(line.Quantity)

      if (!productId || !size) {
        return createErrorResponse('Each item needs a product and a size', 400)
      }
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return createErrorResponse(
          `Quantity must be a whole number from 1 to ${MAX_QUANTITY}`,
          400
        )
      }
      lines.push({ productId, size, quantity })
    }

    const products = (await readSheet('Products')) as any[]
    const productById = new Map<string, any>()
    for (const p of products) productById.set(String(p.Product_ID), p)

    const orderId = generateOrderID()
    const date = new Date().toISOString()
    let orderTotal = 0

    const productIds: string[] = []
    const productNames: string[] = []
    const sizes: string[] = []
    const quantities: number[] = []
    const unitPrices: number[] = []

    for (const line of lines) {
      const product = productById.get(line.productId)
      if (!product) {
        return createErrorResponse(
          'An item in your cart is no longer available. Remove it and try again.',
          404
        )
      }

      const unitPrice = Number(product.Price)
      if (!Number.isFinite(unitPrice)) {
        return createErrorResponse(
          `"${product.Product_Name}" has no valid price. Please contact us.`,
          400
        )
      }

      orderTotal += unitPrice * line.quantity
      productIds.push(line.productId)
      productNames.push(text(product.Product_Name))
      sizes.push(line.size)
      quantities.push(line.quantity)
      unitPrices.push(unitPrice)
    }

    const single = lines.length === 1
    const join = (values: (string | number)[]) => values.join(LIST_SEPARATOR)

    const orderRow: Record<string, string | number> = {
      Order_ID: orderId,
      Date: date,
      Customer_Name: customerName,
      Phone: phone,
      Location: location,
      Product_ID: join(productIds),
      Product_Name: join(productNames),
      Size: join(sizes),
      Quantity: single ? quantities[0] : join(quantities),
      Unit_Price: single ? unitPrices[0] : join(unitPrices),
      Total_Price: round2(orderTotal),
      Special_Instructions: instructions,
      Status: 'Pending',
    }

    const customers = (await readSheet('Customers')) as any[]
    const key = phoneKey(phone)
    const alreadyCustomer = customers.some((c) => phoneKey(c.Phone) === key)

    if (!alreadyCustomer) {
      await addRowToSheet('Customers', {
        Customer_ID: generateCustomerID(),
        Full_Name: customerName,
        Phone: phone,
        Location: location,
      })
    }

   await addRowToSheet('Orders', orderRow)

    // Send Telegram notification for the new order
    await sendOrderNotification({
      orderId,
      customerName,
      phone,
      location,
      productNames: join(productNames),
      sizes: join(sizes),
      quantities: single ? quantities[0] : join(quantities),
      totalPrice: round2(orderTotal),
      instructions,
    })

    return createSuccessResponse(

      {
        orderID: orderId,
        total: round2(orderTotal),
        itemCount: lines.length,
        message: 'Order placed successfully',
      },
      201
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return createErrorResponse('Failed to create order', 500)
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const orderId = text(body.Order_ID)
    const newStatus = text(body.Status)

    if (!orderId) {
      return createErrorResponse('Missing Order_ID', 400)
    }

    const validStatuses = ['Pending', 'Completed', 'Cancelled']
    if (!validStatuses.includes(newStatus)) {
      return createErrorResponse('Invalid status value', 400)
    }

    const updated = await updateRowById('Orders', 'Order_ID', orderId, {
      Status: newStatus,
    })

    if (!updated) {
      return createErrorResponse('Order not found', 404)
    }

    return createSuccessResponse({ Order_ID: orderId, Status: newStatus })
  } catch (error) {
    console.error('Error updating order status:', error)
    return createErrorResponse('Failed to update order status', 500)
  }
}
