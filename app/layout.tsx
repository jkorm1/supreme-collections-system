import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GoogleSheetsInit } from "@/components/GoogleSheetsInit";
import { CartProvider } from "@/components/landing/CartContext";

export const metadata: Metadata = {
  title: "SUPREME COLLECTIONS | Premium Shoes & Slippers",
  description:
    "Step In Excellence. Premium men's classic shoes and Ghana made slippers. Shop luxury footwear online.",
  generator: "v0.app",

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
          <GoogleSheetsInit />
          {children}
          {process.env.NODE_ENV === "production" && <Analytics />}
        </CartProvider>
      </body>
    </html>
  );
}
