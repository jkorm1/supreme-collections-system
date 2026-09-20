'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, AlertCircle, CheckCircle } from 'lucide-react'
import { Product, OrderRequest } from '@/types'

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [successOrderID, setSuccessOrderID] = useState('')

  const [formData, setFormData] = useState({
    Customer_Name: '',
    Phone: '',
    Location: '',
    Delivery_Address: '',
    Size: '',
    Color: '',
    Quantity: 1,
    Special_Instructions: '',
  })

  // Load products when modal opens
  useEffect(() => {
    if (isOpen && products.length === 0) {
      loadProducts()
    }
  }, [isOpen])

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      if (data.success) {
        setProducts(data.data)
      }
    } catch (err) {
      console.error('Failed to load products:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) {
      setError('Please select a product')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const orderData: OrderRequest = {
        Product_ID: selectedProduct.Product_ID,
        Customer_Name: formData.Customer_Name,
        Phone: formData.Phone,
        Location: formData.Location,
        Delivery_Address: formData.Delivery_Address,
        Size: formData.Size,
        Color: formData.Color,
        Quantity: formData.Quantity,
        Special_Instructions: formData.Special_Instructions,
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to place order')
        return
      }

      setSuccess(true)
      setSuccessOrderID(data.data.orderID)
      
      // Reset form
      setTimeout(() => {
        setFormData({
          Customer_Name: '',
          Phone: '',
          Location: '',
          Delivery_Address: '',
          Size: '',
          Color: '',
          Quantity: 1,
          Special_Instructions: '',
        })
        setSelectedProduct(null)
        setSuccess(false)
        onClose()
      }, 3000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading && !success) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              {/* Success State */}
              {success && (
                <div className="space-y-4 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex justify-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-foreground">Order Placed Successfully!</h3>
                  <p className="text-foreground/60">
                    Your order reference number is: <span className="font-mono font-bold text-primary">{successOrderID}</span>
                  </p>
                  <p className="text-sm text-foreground/50">
                    You will be contacted shortly to confirm delivery details.
                  </p>
                </div>
              )}

              {!success && (
                <>
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6" />
                        Place Your Order
                      </h2>
                    </div>
                    <button
                      onClick={handleClose}
                      disabled={isLoading}
                      className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error */}
                    {error && (
                      <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    )}

                    {/* Product Selection */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Product *
                      </label>
                      <select
                        value={selectedProduct?.Product_ID || ''}
                        onChange={(e) => {
                          const product = products.find((p) => p.Product_ID === e.target.value)
                          setSelectedProduct(product || null)
                        }}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                        disabled={isLoading}
                      >
                        <option value="">Choose a product...</option>
                        {products.map((product) => (
                          <option key={product.Product_ID} value={product.Product_ID}>
                            {product.Product_Name} - GHS {product.Price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Product Details */}
                    {selectedProduct && (
                      <div className="p-4 bg-muted rounded-lg border border-border">
                        <p className="text-sm font-semibold text-foreground">Selected: {selectedProduct.Product_Name}</p>
                        <p className="text-sm text-foreground/60 mt-1">Price: GHS {selectedProduct.Price.toFixed(2)}</p>
                        <p className="text-sm text-foreground/60">Stock: {selectedProduct.Stock_Quantity} units</p>
                      </div>
                    )}

                    {/* Size */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Size *
                      </label>
                      <select
                        value={formData.Size}
                        onChange={(e) => setFormData({ ...formData, Size: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                        disabled={isLoading || !selectedProduct}
                      >
                        <option value="">Choose size...</option>
                        {selectedProduct?.Sizes.split(',').map((size) => (
                          <option key={size} value={size.trim()}>
                            Size {size.trim()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color and Quantity */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Color
                        </label>
                        <input
                          type="text"
                          value={formData.Color}
                          onChange={(e) => setFormData({ ...formData, Color: e.target.value })}
                          placeholder="e.g., Black"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={formData.Quantity}
                          onChange={(e) => setFormData({ ...formData, Quantity: parseInt(e.target.value) })}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Delivery Information</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={formData.Customer_Name}
                          onChange={(e) => setFormData({ ...formData, Customer_Name: e.target.value })}
                          placeholder="Full Name *"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                          disabled={isLoading}
                        />
                        <input
                          type="tel"
                          value={formData.Phone}
                          onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                          placeholder="Phone Number (e.g., 0240958968) *"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                          disabled={isLoading}
                        />
                        <input
                          type="text"
                          value={formData.Location}
                          onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                          placeholder="City/Area (e.g., KNUST) *"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                          disabled={isLoading}
                        />
                        <textarea
                          value={formData.Delivery_Address}
                          onChange={(e) => setFormData({ ...formData, Delivery_Address: e.target.value })}
                          placeholder="Full Delivery Address *"
                          rows={3}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input resize-none"
                          disabled={isLoading}
                        />
                        <textarea
                          value={formData.Special_Instructions}
                          onChange={(e) => setFormData({ ...formData, Special_Instructions: e.target.value })}
                          placeholder="Special Instructions (optional)"
                          rows={2}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input resize-none"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Order Summary */}
                    {selectedProduct && (
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex justify-between items-center font-semibold text-lg">
                          <span>Total Amount:</span>
                          <span className="text-primary">
                            GHS {(selectedProduct.Price * formData.Quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading || !selectedProduct}
                      className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          Place Order
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
