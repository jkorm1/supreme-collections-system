"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, Save, TrendingUp } from "lucide-react";

export default function SalesPage() {
  const [formData, setFormData] = useState({
    Employee: "",
    Product: "",
    Quantity: 1,
    Price: 0,
    Event: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Employee list
  const employees = [
    "Kofi Adu Owusu",
    "Joseph Korm",
    "Ama Mensah",
    "Kwame Boateng",
    "Efua Ofori",
  ];

  // Product list (shoes)
  const products = [
    "Nike Air Max",
    "Adidas Ultraboost",
    "Puma RS-X",
    "New Balance 990",
    "Converse Chuck Taylor",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Changed to always use the value directly
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Sales recorded successfully!" });
        // Reset form
        setFormData({
          Employee: "",
          Product: "",
          Quantity: 1,
          Price: 0,
          Event: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to record sales",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate amounts based on fixed percentages
  const totalSales = formData.Quantity * formData.Price;
  const amounts = {
    "Cost of production": totalSales * 0.5,
    Savings: totalSales * 0.333,
    Tithe: totalSales * 0.1,
    "Sales payroll": totalSales * 0.2,
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-sidebar-foreground">
          Sales Management
        </h1>
        <p className="text-sidebar-foreground/60 mt-1">
          Record and track all sales data
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Sales Form */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Record New Sale
            </h2>
          </div>

          {message.text && (
            <div
              className={`p-3 rounded-lg mb-4 ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Employee
                </label>
                <select
                  name="Employee"
                  value={formData.Employee}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                >
                  <option value="" disabled>
                    Select an employee
                  </option>
                  {employees.map((employee) => (
                    <option key={employee} value={employee}>
                      {employee}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Product
                </label>
                <select
                  name="Product"
                  value={formData.Product}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                >
                  <option value="" disabled>
                    Select a product
                  </option>
                  {products.map((product) => (
                    <option key={product} value={product}>
                      {product}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  name="Quantity"
                  value={formData.Quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Price (GHS)
                </label>
                <input
                  type="number"
                  name="Price"
                  value={formData.Price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Event
                </label>
                <input
                  type="text"
                  name="Event"
                  value={formData.Event}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-primary">
                  Total: GHS {totalSales.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Record Sale
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sales Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Sales Breakdown
              </h2>
            </div>

            <div className="mb-4 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-foreground/70 mb-2">
                Fixed Percentages:
              </p>
              <div className="grid grid-cols-2 gap-2 text-foreground text-sm">
                <div>Cost of production: 50%</div>
                <div>Savings: 33.3%</div>
                <div>Tithe: 10%</div>
                <div>Sales payroll: 20%</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Total Sales</span>
                <span className="text-lg font-semibold text-primary">
                  GHS {totalSales.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">
                  Cost of Production (50%)
                </span>
                <span className="text-lg font-semibold text-primary">
                  GHS {amounts["Cost of production"].toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Savings (33.3%)</span>
                <span className="text-lg font-semibold text-primary">
                  GHS {amounts.Savings.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Tithe (10%)</span>
                <span className="text-lg font-semibold text-primary">
                  GHS {amounts.Tithe.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Sales Payroll (20%)</span>
                <span className="text-lg font-semibold text-primary">
                  GHS {amounts["Sales payroll"].toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
