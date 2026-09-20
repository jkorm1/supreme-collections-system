import { readSheet } from '@/lib/google-sheets/client'
import { createSuccessResponse, createErrorResponse, getTokenFromRequest, verifyToken } from '@/lib/auth'
import { DashboardMetrics } from '@/types'

export async function GET(request: Request) {
  try {
    // Verify authentication
    const token = getTokenFromRequest(request)
    if (!token || !verifyToken(token)) {
      return createErrorResponse('Unauthorized', 401)
    }

    const orders = await readSheet('Orders')
    const sales = await readSheet('Sales')
    const products = await readSheet('Products')
    const expenses = await readSheet('Expenses')

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Calculate metrics
    const todaysSales = sales
      .filter((s: any) => {
        const saleDate = new Date(s.Date)
        return (
          saleDate.getDate() === new Date().getDate() &&
          saleDate.getMonth() === currentMonth &&
          saleDate.getFullYear() === currentYear
        )
      })
      .reduce((sum: number, s: any) => sum + (s.Total_Amount || 0), 0)

    const thisMonthSales = sales
      .filter((s: any) => {
        const saleDate = new Date(s.Date)
        return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear
      })
      .reduce((sum: number, s: any) => sum + (s.Total_Amount || 0), 0)

    const thisWeekStart = new Date()
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay())

    const thisWeekSales = sales
      .filter((s: any) => new Date(s.Date) >= thisWeekStart)
      .reduce((sum: number, s: any) => sum + (s.Total_Amount || 0), 0)

    const pendingOrders = orders.filter((o: any) => o.Status === 'Pending').length
    const productsInStock = products.filter((p: any) => p.Stock_Quantity > 0).length

    const topSellingProduct =
      sales.length > 0
        ? sales.reduce((prev: any, current: any) =>
            (prev.Quantity || 0) > (current.Quantity || 0) ? prev : current
          )?.Product_Name || 'N/A'
        : 'N/A'

    const lowStockAlerts = products.filter((p: any) => p.Stock_Quantity < 5).length

    const metrics: DashboardMetrics = {
      totalRevenue: thisMonthSales,
      totalSales: sales.length,
      pendingOrders,
      productsInStock,
      todaysSales,
      thisWeeksSales: thisWeekSales,
      topSellingProduct,
      lowStockAlerts,
    }

    return createSuccessResponse(metrics)
  } catch (error) {
    console.error('Error getting dashboard metrics:', error)
    return createErrorResponse('Failed to get dashboard metrics', 500)
  }
}
