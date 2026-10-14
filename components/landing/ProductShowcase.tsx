"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types";
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

  const handleSelectSize = (
    productId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: e.target.value }));
    if (missingSizeFor === productId) setMissingSizeFor(null);
  };

  const handleAddToCart = (product: Product) => {
    const size = selectedSizes[product.Product_ID]?.trim();

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
      className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 lg:px-10"
    >
      {/* Header: left aligned, bold, minimal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Explore Luxury
          </p>
          <h2 className="font-sans text-4xl font-extrabold uppercase leading-none tracking-tight text-primary sm:text-5xl md:text-6xl">
            Our Collection
          </h2>
        </div>
        {!loading && products.length > 0 && (
          <p className="text-sm font-medium text-foreground/60">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        )}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] animate-pulse bg-[#f5f5f5]" />
              <div className="mt-3 h-4 w-2/3 animate-pulse bg-[#f5f5f5]" />
              <div className="mt-2 h-4 w-1/4 animate-pulse bg-[#f5f5f5]" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center text-foreground/60">
          <p>
            Products will appear here. Start by adding products in the admin
            dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-2 gap-y-10 lg:grid-cols-3">
          {products.map((product, index) => {
            const id = product.Product_ID;
            const selected = selectedSizes[id] || "";
            const missing = missingSizeFor === id;
            const added = justAddedId === id;
            const soldOut = isSoldOut(product);
            const sizeHint = parseSizes(product.Sizes);

            return (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  delay: (index % 3) * 0.08,
                }}
                className="group"
              >
                {/* Image tile */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5]">
                  {product.Image_URL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.Image_URL}
                      alt={product.Product_Name}
                      className={`h-full w-full object-contain p-4 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105 sm:p-8 ${
                        soldOut ? "opacity-50" : ""
                      }`}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <p className="text-xs text-foreground/40">No Image</p>
                    </div>
                  )}

                  {soldOut && (
                    <span className="absolute left-3 top-3 bg-white px-2.5 py-1 text-xs font-semibold text-foreground">
                      Sold out
                    </span>
                  )}

                  {/* Quick add: slides up on hover/focus (desktop),
                      always visible on touch screens */}
                  {!soldOut && (
                    <div className="absolute inset-x-2 bottom-2 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur transition-all duration-300 md:translate-y-[120%] md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                      <label
                        htmlFor={`size-${id}`}
                        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-foreground/60"
                      >
                        Size
                      </label>
                      <input
                        id={`size-${id}`}
                        type="text"
                        inputMode="numeric"
                        placeholder={`e.g. ${sizeHint[Math.floor(sizeHint.length / 2)] ?? "9"}`}
                        value={selected}
                        onChange={(e) => handleSelectSize(id, e)}
                        aria-invalid={missing}
                        className={`w-full rounded-full border bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                          missing
                            ? "border-red-400"
                            : "border-border hover:border-primary"
                        }`}
                      />
                      {missing && (
                        <p role="alert" className="mt-1.5 text-xs text-red-600">
                          Enter a size to add this to your cart.
                        </p>
                      )}

                      <button
                        onClick={() => handleAddToCart(product)}
                        aria-live="polite"
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {added ? (
                          <>
                            <Check className="h-4 w-4" />
                            Added to cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            Add to cart
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mt-3 px-1">
                  <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">
                    {product.Product_Name}
                  </h3>
                  <p className="mt-2 text-[15px] font-semibold text-foreground">
                    GHS {product.Price.toFixed(2)}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
