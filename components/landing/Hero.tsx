'use client'

import { motion } from 'framer-motion'

interface HeroProps {
  onOrderClick: () => void
}

export function Hero({ onOrderClick }: HeroProps) {
  return (
    <section id="hero" className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/95 flex items-center justify-center pt-20 pb-12 relative overflow-hidden">
      {/* Decorative elements with wine color accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full blur-3xl opacity-40 -mr-48" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/30 rounded-full blur-3xl opacity-50 -ml-40" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* SC Logo animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 border-3 border-accent flex items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
            <span className="text-5xl font-bold text-accent">SC</span>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4"
        >
          <p className="text-accent font-serif text-3xl md:text-4xl tracking-widest">
            SUPREME COLLECTIONS
          </p>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1.5 w-32 bg-gradient-to-r from-accent via-white/80 to-accent mx-auto mb-12"
        />

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight text-balance font-serif drop-shadow-lg"
        >
          Step In Excellence
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-accent mb-6 max-w-2xl mx-auto italic font-semibold"
        >
          Premium men&apos;s classic shoes and authentic Ghana-made slippers
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-white text-base md:text-lg mb-12 text-opacity-90"
        >
          Luxury craftsmanship meets comfort
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button
            onClick={() => {
              const element = document.getElementById('showcase')
              element?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-8 py-4 bg-accent text-primary rounded-lg font-semibold hover:shadow-2xl hover:shadow-accent/50 transition-all duration-300 transform hover:scale-105 text-lg"
          >
            Explore Collection
          </button>

          <button
            onClick={onOrderClick}
            className="px-8 py-4 border-2 border-accent text-accent rounded-lg font-semibold hover:bg-accent hover:text-primary transition-all duration-300 text-lg"
          >
            Order Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}
