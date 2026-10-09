"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, Save, Receipt, RefreshCw } from "lucide-react";

export default function ExpensesPage() {
  const [formData, setFormData] = useState({
    Category: "",
    Description: "",
    Amount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      if (data.success) {
        setExpenses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

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
        setFormData({
          Category: "",
          Description: "",
          Amount: 0,
        });
        fetchExpenses();
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
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground/80"
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
              <label className="block text-sm font-medium text-foreground/80 mb-1">
                Description
              </label>
              <input
                type="text"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground/80"
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
                min=""
                step="1"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground/80"
                required
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

        {/* Expenses Table */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Expense Records
              </h2>
            </div>
            <button
              onClick={fetchExpenses}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Refresh expenses"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
            </button>
          </div>

          {isLoadingExpenses ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : expenses.length === 0 ? (
            <p className="text-center text-foreground/60 py-8">
              No expenses recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-foreground/70">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Category</th>
                    <th className="pb-3 pr-4 font-medium">Description</th>
                    <th className="pb-3 pr-4 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.ID}
                      className="border-b border-border/50 last:border-0 text-foreground/70"
                    >
                      <td className="py-3 text-xs text-foreground/60">
                        {expense.Date
                          ? new Date(expense.Date).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs">
                        {expense.ID}
                      </td>
                      <td className="py-3 pr-4 text-foreground/70">
                        {expense.Category}
                      </td>
                      <td className="py-3 pr-4 text-foreground/70">
                        {expense.Description}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-primary">
                        GHS {Number(expense.Amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
