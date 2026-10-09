"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, RefreshCw } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o: any) => o.Status === filterStatus);

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Order_ID: orderId, Status: newStatus }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.Order_ID === orderId ? { ...o, Status: newStatus } : o,
          ),
        );
      } else {
        console.error("Failed to update order status:", response.statusText);
      }
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

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
        {["all", "Pending", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-primary text-white"
                : "bg-accent/10 text-foreground hover:bg-accent/20"
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
        <div className="flex justify-end p-4">
          <button
            onClick={fetchOrders}
            className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Refresh orders"
          >
            <RefreshCw className="w-4 h-4 text-primary" />
          </button>
        </div>

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
                  {Object.keys(filteredOrders[0] || {}).map((key) => (
                    <th
                      key={key}
                      className="px-6 py-3 text-left font-semibold text-primary"
                    >
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left font-semibold text-primary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any, index: number) => (
                  <tr
                    key={order.Order_ID || `order-fallback-${index}`}
                    className="border-b border-border hover:bg-primary/5 transition-colors"
                  >
                    {Object.keys(order).map((key) => (
                      <td key={key} className="px-6 py-4 text-foreground">
                        {key === "Status" ? (
                          <select
                            value={order.Status || "Pending"}
                            onChange={(e) =>
                              handleStatusChange(order.Order_ID, e.target.value)
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer appearance-none outline-none border-none bg-no-repeat bg-[right_0.5rem_center] bg-[length:1em] pr-6 ${
                              statusColors[order.Status] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        ) : key === "Total_Price" ? (
                          <span className="font-semibold text-primary">
                            GHS {(Number(order[key]) || 0).toFixed(2)}
                          </span>
                        ) : key === "Date" ? (
                          <span className="text-foreground/60 text-xs">
                            {order[key]
                              ? new Date(order[key]).toLocaleDateString()
                              : ""}
                          </span>
                        ) : (
                          <span
                            className={
                              key === "Order_ID"
                                ? "font-mono text-xs text-accent"
                                : ""
                            }
                          >
                            {order[key]}
                          </span>
                        )}
                      </td>
                    ))}
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
  );
}
