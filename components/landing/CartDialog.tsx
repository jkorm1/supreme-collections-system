"use client";

import { useState } from "react";
import { Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "./CartContext";

const ORDERS_ENDPOINT = "/api/orders";
const GENERIC_ERROR =
  "We couldn't place your order. Check your details and try again.";

// These names match the Customers and Orders sheet columns
const EMPTY_FORM = {
  Customer_Name: "",
  Phone: "",
  Location: "",
  Special_Instructions: "",
};

interface Confirmation {
  orderID: string;
  total: number;
}

interface CartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDialog({ open, onOpenChange }: CartDialogProps) {
  const { items, removeItem, updateItemQuantity, clearCart, totalPrice } =
    useCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setError("");
      // Start fresh the next time the cart opens
      setConfirmation(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0 || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      // Prices are not sent: the server reads them from the Products sheet.
      const response = await fetch(ORDERS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Customer_Name: form.Customer_Name,
          Phone: form.Phone,
          Location: form.Location,
          Special_Instructions: form.Special_Instructions,
          Items: items.map((item) => ({
            Product_ID: item.product.Product_ID,
            Size: item.size,
            Quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        // 4xx messages are written for the customer, so show them as they are
        setError(
          response.status < 500 && typeof data?.error === "string"
            ? data.error
            : GENERIC_ERROR,
        );
        return;
      }

      setConfirmation({
        orderID: data.data.orderID,
        total: Number(data.data.total) || totalPrice,
      });
      clearCart();
      setForm(EMPTY_FORM);
    } catch (err) {
      console.error("Failed to place order:", err);
      setError(GENERIC_ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto">
        {confirmation ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <CheckCircle2 className="w-12 h-12 text-accent" />
            <DialogHeader className="items-center">
              <DialogTitle>Order placed</DialogTitle>
              <DialogDescription>
                Thank you. We&apos;ll contact you on the phone number you gave
                to confirm your order and delivery.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm">
              <p className="text-foreground/60">Order number</p>
              <p className="font-mono font-semibold text-foreground">
                {confirmation.orderID}
              </p>
              <p className="mt-2 text-foreground/60">Total</p>
              <p className="font-semibold text-primary">
                GHS {confirmation.total.toFixed(2)}
              </p>
            </div>
            <Button
              onClick={() => handleOpenChange(false)}
              className="bg-primary hover:bg-primary/90"
            >
              Continue shopping
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-4 py-6">
            <DialogHeader className="items-center">
              <DialogTitle>Your cart is empty</DialogTitle>
              <DialogDescription>
                Pick a size on any product and choose Add to cart.
              </DialogDescription>
            </DialogHeader>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Browse the collection
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Your cart</DialogTitle>
              <DialogDescription>
                Review your items, then enter your details to place the order.
              </DialogDescription>
            </DialogHeader>

            {/* Order summary */}
            <ul className="divide-y divide-border/60 border-y border-border/60">
              {items.map((item) => (
                <li key={item.id} className="py-4 flex flex-col gap-3">
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground line-clamp-2">
                        {item.product.Product_Name}
                      </p>
                      <p className="text-sm text-foreground/60">
                        Size {item.size}
                      </p>
                    </div>
                    <p className="font-semibold text-primary whitespace-nowrap">
                      GHS {(item.product.Price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Decrease quantity of ${item.product.Product_Name}`}
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <span
                        className="w-8 text-center text-sm font-medium"
                        aria-live="polite"
                      >
                        {item.quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`Increase quantity of ${item.product.Product_Name}`}
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Remove
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground/70">Total</span>
              <span className="text-xl font-bold text-primary">
                GHS {totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Customer details */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="Customer_Name">Full name *</Label>
                <Input
                  id="Customer_Name"
                  name="Customer_Name"
                  autoComplete="name"
                  value={form.Customer_Name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="Phone">Phone number *</Label>
                <Input
                  id="Phone"
                  name="Phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.Phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="Location">Delivery location *</Label>
                <Input
                  id="Location"
                  name="Location"
                  value={form.Location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="Special_Instructions">
                  Special instructions
                </Label>
                <textarea
                  id="Special_Instructions"
                  name="Special_Instructions"
                  rows={3}
                  value={form.Special_Instructions}
                  onChange={handleChange}
                  className="flex min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {submitting ? "Placing order…" : "Place order"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
