"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Plus, Edit2, Trash2, X } from "lucide-react";
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

// Add this after the imports and before the component definition
const PRODUCT_CATEGORIES = ["Slippers", "Sneakers", "Shoes"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    Product_Name: "",
    Category: "",
    Price: 0,
    Description: "",
    Sizes: "6,7,8,9,10,11,12,13",
    Image_URL: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

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
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  const handleAddProduct = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setFormData({
      Product_Name: "",
      Category: "",
      Price: 0,
      Description: "",
      Sizes: "6,7,8,9,10,11,12,13",
      Image_URL: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setEditingProduct(product);
    setFormData({
      Product_Name: product.Product_Name,
      Category: product.Category,
      Price: product.Price,
      Description: product.Description || "",
      Sizes: product.Sizes || "6,7,8,9,10,11,12,13",
      Image_URL: product.Image_URL || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((p) => p.Product_ID !== productId));
        setMessage({ type: "success", text: "Product deleted successfully!" });
      } else {
        const data = await response.json();
        setMessage({
          type: "error",
          text: data.error || "Failed to delete product",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const url =
        isEditing && editingProduct
          ? `/api/products/${editingProduct.Product_ID}`
          : "/api/products";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: isEditing
            ? "Product updated successfully!"
            : "Product added successfully!",
        });
        setIsDialogOpen(false);

        // Refresh the product list
        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();
        if (productsData.success) {
          setProducts(productsData.data);
        }
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to save product",
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">Products</h1>
          <p className="text-foreground/60 mt-1">
            Manage your product inventory
          </p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </motion.div>

      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

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
                      <div className="flex items-center gap-3">
                        {product.Image_URL && (
                          <img
                            src={product.Image_URL}
                            alt={product.Product_Name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="text-foreground font-medium">
                            {product.Product_Name}
                          </p>
                          <p className="text-xs text-foreground/60">
                            {product.Description?.substring(0, 50)}
                            {product.Description &&
                            product.Description.length > 50
                              ? "..."
                              : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground/60">
                      {product.Category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary">
                      GHS {product.Price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 hover:bg-accent/10 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-foreground/60" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product.Product_ID)
                          }
                          className="p-2 hover:bg-red-500/20 rounded transition-colors"
                        >
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

      {/* Add/Edit Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="Product_Name">Product Name *</Label>
              <Input
                id="Product_Name"
                name="Product_Name"
                value={formData.Product_Name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="Category">Category *</Label>
              <select
                id="Category"
                name="Category"
                value={formData.Category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="Price">Price (GHS) *</Label>
              <Input
                id="Price"
                name="Price"
                type="number"
                min="0"
                step="0.01"
                value={formData.Price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="Description">Description</Label>
              <Textarea
                id="Description"
                name="Description"
                value={formData.Description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="Sizes">Sizes (comma-separated)</Label>
              <Input
                id="Sizes"
                name="Sizes"
                value={formData.Sizes}
                onChange={handleChange}
                placeholder="6,7,8,9,10,11,12,13"
              />
            </div>

            <div>
              <Label htmlFor="Image_URL">Image URL</Label>
              <Input
                id="Image_URL"
                name="Image_URL"
                type="url"
                value={formData.Image_URL}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                pattern="https?://.+"
                title="Please enter a valid URL starting with http:// or https://"
              />
              <p className="text-xs text-foreground/60 mt-1">
                Enter a valid web URL for the product image
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Product"
                    : "Add Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
