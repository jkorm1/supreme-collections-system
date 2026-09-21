"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "./CartContext";

const FALLBACK_SIZES = "6,7,8,9,10,11,12,13";

function parseSizes(sizes?: string): string[] {
  return (sizes || FALLBACK_SIZES)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Sheet cells come back as strings and may be empty, so only treat an
// explicit 0 (or less) as sold out.
function isSoldOut(product: Product): boolean {
  const raw = product.Stock_Quantity as unknown;
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return false;
  }
  return Number(raw) <= 0;
}

export function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Size picked on each card, keyed by Product_ID
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );
  // Card that was tapped without a size chosen
  const [missingSizeFor, setMissingSizeFor] = useState<string | null>(null);
  // Card that just had an item added (drives the "Added" button state)
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { addItem } = useCart();

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

    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const handleSelectSize = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    if (missingSizeFor === productId) setMissingSizeFor(null);
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.Product_ID];

    if (!size) {
      setMissingSizeFor(product.Product_ID);
      return;
    }

    addItem(product, 1, size);

    setJustAddedId(product.Product_ID);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAddedId(null), 1500);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const id = product.Product_ID;
            const sizes = parseSizes(product.Sizes);
            const selected = selectedSizes[id];
            const missing = missingSizeFor === id;
            const added = justAddedId === id;
            const soldOut = isSoldOut(product);

            return (
              <article
                key={id}
                className="bg-card rounded-lg border border-border/50 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-5"
              >
                {product.Image_URL ? (
                  <img
                    src={product.Image_URL}
                    alt={product.Product_Name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-primary/20 rounded-md flex items-center justify-center">
                    <p className="text-xs text-foreground/40">No Image</p>
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-foreground line-clamp-2">
                    {product.Product_Name}
                  </h3>

                  <p className="text-xl font-bold text-primary mt-1">
                    GHS {product.Price.toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium text-foreground/60 mb-2">
                    Size
                  </p>
                  <div
                    role="group"
                    aria-label={`Size for ${product.Product_Name}`}
                    className="flex flex-wrap gap-2"
                  >
                    {sizes.map((size) => {
                      const isSelected = selected === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectSize(id, size)}
                          className={`min-w-10 px-3 py-1.5 rounded border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : `bg-transparent text-primary hover:border-primary ${
                                  missing ? "border-red-400" : "border-border"
                                }`
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                  {missing && (
                    <p role="alert" className="text-xs text-red-600 mt-2">
                      Pick a size to add this to your cart.
                    </p>
                  )}
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={soldOut}
                  aria-live="polite"
                  className="w-full mt-auto bg-primary hover:bg-primary/90"
                >
                  {soldOut ? (
                    "Sold out"
                  ) : added ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to cart
                    </>
                  )}
                </Button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
