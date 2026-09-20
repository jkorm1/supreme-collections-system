'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Order } from '@/types'
import { Eye, Trash2 } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch('/api/orders')
        const data = await response.json()
        if (data.success) {
          setOrders(data.data)
        }
      } catch (err) {
        console.error('Failed to load orders:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [])

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o: any) => o.Status === filterStatus)

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Processing: 'bg-blue-100 text-blue-800',
    Delivered: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-primary">Orders</h1>
        <p className="text-foreground/60 mt-1">
          Manage and track all customer orders
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 flex-wrap"
      >
        {['all', 'Pending', 'Processing', 'Delivered', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-primary text-white'
                : 'bg-accent/10 text-foreground hover:bg-accent/20'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-primary/5">
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr
                    key={order.Order_ID}
                    className="border-b border-border hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-accent">
                      {order.Order_ID}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-foreground font-medium">
                          {order.Customer_Name}
                        </p>
                        <p className="text-xs text-foreground/60">
                          {order.Phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {order.Product_Name}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      GHS {order.Total_Price?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[order.Status] ||
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/60 text-xs">
                      {new Date(order.Date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-accent/10 rounded transition-colors">
                          <Eye className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button className="p-2 hover:bg-red-500/20 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
