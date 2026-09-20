import { readSheet, addRowToSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse } from '@/lib/auth'
import { Product } from '@/types'

// Never cache this route: the sheet can change at any time
export const dynamic = 'force-dynamic'

const DEFAULT_SIZES = '6,7,8,9,10,11,12,13'

function generateProductID(): string {
  return `PROD-${Date.now().toString(36).toUpperCase()}`
}

// Shows the real error while developing, a generic one in production
function errorText(base: string, error: unknown): string {
  if (process.env.NODE_ENV === 'production') return base
  return `${base}: ${error instanceof Error ? error.message : String(error)}`
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')?.toLowerCase()

    const rows = await readSheet('Products')

    // Sheets return every cell as a string, so convert Price to a number
    let products = rows.map((row) => ({
      ...row,
      Price: Number(row.Price) || 0,
      Sizes: row.Sizes || DEFAULT_SIZES,
    }))

    if (category) {
      products = products.filter((p) => p.Category === category)
    }

    if (search) {
      products = products.filter(
        (p) =>
          (p.Product_Name ?? '').toLowerCase().includes(search) ||
          (p.Description ?? '').toLowerCase().includes(search)
      )
    }

    return createSuccessResponse(products)
  } catch (error) {
    console.error('Error reading products:', error)
    return createErrorResponse(errorText('Failed to read products', error), 500)
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<Product>
    const price = Number(body.Price)

    if (!body.Product_Name || !body.Category || Number.isNaN(price)) {
      return createErrorResponse('Missing required fields', 400)
    }

    const product: Product = {
      Product_ID: generateProductID(),
      Product_Name: body.Product_Name,
      Category: body.Category,
      Price: price,
      Description: body.Description || '',
      Sizes: body.Sizes || DEFAULT_SIZES,
      Image_URL: body.Image_URL || '',
    }

    await addRowToSheet('Products', product as any)

    return createSuccessResponse(product, 201)
  } catch (error) {
    console.error('Error creating product:', error)
    return createErrorResponse(
      errorText('Failed to create product', error),
      500
    )
  }
}