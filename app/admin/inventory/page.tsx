'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { Plus, Edit2, Trash2 } from 'lucide-react'

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (data.success) {
          setProducts(data.data)
        }
      } catch (err) {
        console.error('Failed to load products:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">Inventory</h1>
          <p className="text-foreground/60 mt-1">Manage products and stock levels</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">
            No products found. Add your first product to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-primary/5">
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr
                    key={product.Product_ID}
                    className="border-b border-border hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-foreground font-medium">
                        {product.Product_Name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-foreground/60">
                      {product.Category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      GHS {product.Price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.Stock_Quantity < 5
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.Stock_Quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.Status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-accent/10 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-foreground/60" />
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
