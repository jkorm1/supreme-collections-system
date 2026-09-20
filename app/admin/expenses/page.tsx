"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, Save, Receipt } from "lucide-react";

export default function ExpensesPage() {
  const [formData, setFormData] = useState({
    Category: "",
    Description: "",
    Amount: 0,
    Notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Amount" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Expense recorded successfully!" });
        // Reset form
        setFormData({
          Category: "",
          Description: "",
          Amount: 0,
          Notes: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to record expense",
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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-sidebar-foreground">
          Expense Management
        </h1>
        <p className="text-sidebar-foreground/60 mt-1">
          Record and track all business expenses
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Expense Form */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Record New Expense
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Category
              </label>
              <select
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Utilities">Utilities</option>
                <option value="Rent">Rent</option>
                <option value="Supplies">Supplies</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Description
              </label>
              <input
                type="text"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Amount (GHS)
              </label>
              <input
                type="number"
                name="Amount"
                value={formData.Amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Notes
              </label>
              <textarea
                name="Notes"
                value={formData.Notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-primary">
                  Amount: GHS {formData.Amount.toFixed(2)}
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
                    Record Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Expense Summary */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Expense Summary
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Category</span>
                <span className="text-lg font-semibold text-primary">
                  {formData.Category || "Not selected"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Description</span>
                <span className="text-lg font-semibold text-primary">
                  {formData.Description || "Not provided"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                <span className="text-foreground/70">Amount</span>
                <span className="text-lg font-semibold text-primary">
                  GHS {formData.Amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
