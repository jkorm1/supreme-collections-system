"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/common/Navigation";
import { Hero } from "@/components/landing/Hero";
import { LoginModal } from "@/components/modals/LoginModal";
import { OrderModal } from "@/components/modals/OrderModal";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { FeaturedCollection } from "@/components/landing/FeaturedCollection";
import { VideoShowcase } from "@/components/landing/VideoShowcase";
import { WhyUs } from "@/components/landing/WhyUs";
import { Reviews } from "@/components/landing/Reviews";
import { Gallery } from "@/components/landing/Gallery";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/common/Footer";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  return (
    <main className="bg-background">
      <Navigation onLoginClick={() => setIsLoginOpen(true)} />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Order Modal */}
      <OrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />

      {/* Sections */}
      <Hero onOrderClick={() => setIsOrderOpen(true)} />
      <ProductShowcase />
      <FeaturedCollection />
      <VideoShowcase />
      <WhyUs />
      <Reviews />
      <Gallery />
      <Contact />
      <Footer />
    </main>
  );
}
