'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardMetrics } from '@/types'
import { TrendingUp, Package, Users, ShoppingCart } from 'lucide-react'

const MetricCard = ({ icon, label, value, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-foreground/60 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
        {trend && (
          <p className="text-xs text-accent mt-1">↑ {trend} from last month</p>
        )}
      </div>
      <div className="text-primary/30">{icon}</div>
    </div>
  </motion.div>
)

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const token = localStorage.getItem('authToken')
        const response = await fetch('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await response.json()
        if (data.success) {
          setMetrics(data.data)
        }
      } catch (err) {
        console.error('Failed to load metrics:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadMetrics()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (!metrics) {
    return <div className="text-center py-16 text-foreground/60">Failed to load metrics</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-primary mb-2">
          Dashboard
        </h1>
        <p className="text-foreground/60">
          Welcome back to Supreme Collections admin
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<TrendingUp className="w-8 h-8" />}
          label="Total Revenue"
          value={`GHS ${metrics.totalRevenue.toFixed(2)}`}
          trend="12%"
        />
        <MetricCard
          icon={<ShoppingCart className="w-8 h-8" />}
          label="Total Sales"
          value={metrics.totalSales}
          trend="8%"
        />
        <MetricCard
          icon={<Package className="w-8 h-8" />}
          label="Products in Stock"
          value={metrics.productsInStock}
        />
        <MetricCard
          icon={<Users className="w-8 h-8" />}
          label="Pending Orders"
          value={metrics.pendingOrders}
        />
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-foreground font-semibold mb-4">Today's Sales</h3>
          <p className="text-3xl font-bold text-primary">
            GHS {metrics.todaysSales.toFixed(2)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-foreground font-semibold mb-4">This Week</h3>
          <p className="text-3xl font-bold text-primary">
            GHS {metrics.thisWeeksSales.toFixed(2)}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-foreground font-semibold mb-4">Top Product</h3>
          <p className="text-lg text-foreground">{metrics.topSellingProduct}</p>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h3 className="text-foreground font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
            Add Product
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
            Record Sale
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
            Record Expense
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium">
            View Reports
          </button>
        </div>
      </motion.div>
    </div>
  )
}
