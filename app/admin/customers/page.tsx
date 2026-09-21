"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Save, Users, Phone, MapPin, RefreshCw } from "lucide-react";

export default function CustomersPage() {
  const [formData, setFormData] = useState({
    Full_Name: "",
    Phone: "",
    Location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const response = await fetch("/api/customers");
      const data = await response.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Customer recorded successfully!",
        });
        // Reset form
        setFormData({
          Full_Name: "",
          Phone: "",
          Location: "",
        });
        fetchCustomers();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to record customer",
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
          Customers
        </h1>
        <p className="text-sidebar-foreground/60 mt-1">
          Manage customer relationships and purchase history
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Customer Form */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary">
              Record New Customer
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
                Full Name
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
                <input
                  type="text"
                  name="Full_Name"
                  value={formData.Full_Name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter customer's full name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
                <input
                  type="tel"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-4 h-4" />
                <input
                  type="text"
                  name="Location"
                  value={formData.Location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter customer's location"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Record Customer
                </>
              )}
            </button>
          </form>
        </div>

        {/* Customers Table */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-primary">
                Customer Records
              </h2>
            </div>
            <button
              onClick={fetchCustomers}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Refresh customers"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
            </button>
          </div>

          {isLoadingCustomers ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : customers.length === 0 ? (
            <p className="text-center text-foreground/60 py-8">
              No customers recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-foreground/70">
                  <tr>
                    <th className="pb-3 pr-4 font-medium">ID</th>
                    <th className="pb-3 pr-4 font-medium">Full Name</th>
                    <th className="pb-3 pr-4 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.Customer_ID}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="py-3 pr-4 font-mono text-xs">
                        {customer.Customer_ID}
                      </td>
                      <td className="py-3 pr-4">{customer.Full_Name}</td>
                      <td className="py-3 pr-4">{customer.Phone}</td>
                      <td className="py-3">{customer.Location}</td>
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
