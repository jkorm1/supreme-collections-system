"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    label: "Dashboard",
    href: "/admin",
  },
  {
    icon: <ShoppingCart className="w-5 h-5" />,
    label: "Orders",
    href: "/admin/orders",
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    label: "Sales",
    href: "/admin/sales",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    label: "Expenses",
    href: "/admin/expenses",
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: "Products",
    href: "/admin/products",
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: "Inventory",
    href: "/admin/inventory",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Customers",
    href: "/admin/customers",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    label: "Settings",
    href: "/admin/settings",
  },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-sidebar-accent rounded-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-sidebar-accent flex items-center justify-center rounded">
              <span className="text-xs font-bold text-sidebar-accent">SC</span>
            </div>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground">
                SUPREME
              </p>
              <p className="text-xs text-sidebar-foreground/50">Collections</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/10"
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50 text-center">
          <p>Supreme Collections</p>
          <p>© 2024</p>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
