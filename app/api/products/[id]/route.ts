import { updateRowById, deleteRowById } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'
import { Product } from '@/types'

export const dynamic = 'force-dynamic'

// Next.js 15+: params is a Promise.
// On Next.js 13/14 change this to: { params: { id: string } } and drop the await.
type RouteContext = { params: Promise<{ id: string }> }

function errorText(base: string, error: unknown): string {
  if (process.env.NODE_ENV === 'production') return base
  return `${base}: ${error instanceof Error ? error.message : String(error)}`
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const body = (await request.json()) as Partial<Product>

    if (!body.Product_Name || !body.Category || body.Price === undefined) {
      return createErrorResponse('Missing required fields', 400)
    }

    const price = Number(body.Price)
    if (Number.isNaN(price)) {
      return createErrorResponse('Price must be a number', 400)
    }

    // Only these fields can change (never the ID)
    const updates = {
      Product_Name: body.Product_Name,
      Category: body.Category,
      Price: price,
      Description: body.Description || '',
      Sizes: body.Sizes || '6,7,8,9,10,11,12,13',
      Image_URL: body.Image_URL || '',
    }

    const updated = await updateRowById('Products', 'Product_ID', id, updates)

    if (!updated) {
      return createErrorResponse('Product not found', 404)
    }

    return createSuccessResponse({ Product_ID: id, ...updates })
  } catch (error) {
    console.error('Error updating product:', error)
    return createErrorResponse(
      errorText('Failed to update product', error),
      500
    )
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    const deleted = await deleteRowById('Products', 'Product_ID', id)

    if (!deleted) {
      return createErrorResponse('Product not found', 404)
    }

    return createSuccessResponse({ Product_ID: id })
  } catch (error) {
    console.error('Error deleting product:', error)
    return createErrorResponse(
      errorText('Failed to delete product', error),
      500
    )
  }
}