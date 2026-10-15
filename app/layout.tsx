import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";

import { CartProvider } from "@/components/landing/CartContext";

export const metadata: Metadata = {
  title: "SUPREME COLLECTIONS | Premium Shoes & Slippers",
  description:
    "Step In Excellence. Premium men's classic shoes and Ghana made slippers. Shop luxury footwear online.",
  generator: "v0.app",

  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#6B001B" }],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-background text-foreground">
        <CartProvider>
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </CartProvider>
      </body>
    </html>
  );
}
