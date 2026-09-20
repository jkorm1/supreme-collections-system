"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Plus } from "lucide-react";

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    Customer_Name: "",
    Phone: "",
    Delivery_Address: "",
    Size: "",
    Quantity: 1,
    Special_Instructions: "",
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        if (data.success) {
          setProducts(data.data);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleOrderNow = (product: Product) => {
    setSelectedProduct(product);
    setIsOrderDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) return;

    try {
      // Create the order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Order_ID: `ORD-${Date.now()}`,
          Date: new Date().toISOString(),
          Customer_Name: orderDetails.Customer_Name,
          Phone: orderDetails.Phone,
          Location: orderDetails.Location,
          Delivery_Address: orderDetails.Delivery_Address,
          Product_ID: selectedProduct.Product_ID,
          Product_Name: selectedProduct.Product_Name,
          Size: orderDetails.Size,
          Color: orderDetails.Color,
          Quantity: orderDetails.Quantity,
          Unit_Price: selectedProduct.Price,
          Total_Price: selectedProduct.Price * orderDetails.Quantity,
          Special_Instructions: orderDetails.Special_Instructions,
        }),
      });

      if (orderResponse.ok) {
        // Reset form and close dialog
        setOrderDetails({
          Customer_Name: "",
          Phone: "",
          Location: "",
          Delivery_Address: "",
          Size: "",
          Color: "",
          Quantity: 1,
          Special_Instructions: "",
        });
        setIsOrderDialogOpen(false);
        setSelectedProduct(null);

        // Show success message
        alert("Order placed successfully!");
      } else {
        const errorData = await orderResponse.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again.");
    }
  };

  return (
    <section
      id="showcase"
      className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <p className="text-accent font-semibold tracking-widest uppercase text-center mb-4 text-xs">
          Explore Luxury
        </p>
        <h2 className="text-5xl md:text-6xl font-bold text-primary mb-4 text-center font-serif">
          Our Collection
        </h2>
        <div className="h-1.5 w-32 bg-gradient-to-r from-primary via-accent to-primary mx-auto mb-10" />
        <p className="text-lg text-primary/80 text-center max-w-2xl mx-auto font-medium">
          Discover our extraordinary selection of premium men&apos;s shoes and
          authentic Ghana-made slippers, each crafted with precision and
          elegance.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-foreground/60">
          <p>
            Products will appear here. Start by adding products in the admin
            dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.Product_ID}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border/50">
                {/* Image Placeholder */}
                <div className="w-full h-64 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded mx-auto mb-3" />
                    <p className="text-xs text-foreground/40">Product Image</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-accent/15 text-primary text-xs font-semibold rounded-full">
                      {product.Category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">
                    {product.Product_Name}
                  </h3>

                  <p className="text-xs text-foreground/60 mb-4 line-clamp-2">
                    {product.Description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        GHS {product.Price.toFixed(2)}
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {product.Stock_Quantity > 0 ? (
                          <span className="text-accent font-semibold">
                            {product.Stock_Quantity} in stock
                          </span>
                        ) : (
                          <span className="text-red-600">Out of stock</span>
                        )}
                      </p>
                    </div>
                    {product.Sizes && (
                      <div className="flex flex-wrap gap-2">
                        {product.Sizes.split(",")
                          .slice(0, 4)
                          .map((size) => (
                            <span
                              key={size}
                              className="text-xs px-2.5 py-1 bg-primary/10 rounded text-primary font-medium"
                            >
                              {size.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                    <Button
                      onClick={() => handleOrderNow(product)}
                      disabled={product.Stock_Quantity === 0}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Place Your Order</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {selectedProduct.Product_Name}
                </h3>
                <p className="text-sm text-foreground/70">
                  Price: GHS {selectedProduct.Price.toFixed(2)}
                </p>
                <p className="text-sm text-foreground/70">
                  Sizes: {selectedProduct.Sizes}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="Customer_Name">Full Name *</Label>
                  <Input
                    id="Customer_Name"
                    name="Customer_Name"
                    value={orderDetails.Customer_Name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Phone">Phone Number *</Label>
                  <Input
                    id="Phone"
                    name="Phone"
                    value={orderDetails.Phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Location">Location *</Label>
                  <Input
                    id="Location"
                    name="Location"
                    value={orderDetails.Location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Delivery_Address">Delivery Address *</Label>
                  <Input
                    id="Delivery_Address"
                    name="Delivery_Address"
                    value={orderDetails.Delivery_Address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Size">Size *</Label>
                  <Input
                    id="Size"
                    name="Size"
                    value={orderDetails.Size}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="Color">Color</Label>
                  <Input
                    id="Color"
                    name="Color"
                    value={orderDetails.Color}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="Quantity">Quantity *</Label>
                  <Input
                    id="Quantity"
                    name="Quantity"
                    type="number"
                    min="1"
                    value={orderDetails.Quantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="Special_Instructions">
                  Special Instructions
                </Label>
                <Textarea
                  id="Special_Instructions"
                  name="Special_Instructions"
                  value={orderDetails.Special_Instructions}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-lg font-semibold">
                  Total: GHS{" "}
                  {(selectedProduct.Price * orderDetails.Quantity).toFixed(2)}
                </div>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Place Order
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
