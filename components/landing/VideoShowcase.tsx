'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export function VideoShowcase() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Experience Supreme Collections
        </h2>
        <p className="text-lg text-foreground/60 text-center max-w-2xl mx-auto mb-16">
          Watch how our products transform the way people walk, celebrate, and express themselves.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: item * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <Play className="w-6 h-6 fill-current" />
              </motion.div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            <h3 className="text-lg font-semibold text-foreground mt-4">
              {item === 1 && 'Product Showcase'}
              {item === 2 && 'Customer Stories'}
              {item === 3 && 'Behind the Scenes'}
            </h3>
            <p className="text-foreground/60 text-sm mt-2">
              {item === 1 && 'Discover the artistry behind each product'}
              {item === 2 && 'Real customers sharing their experiences'}
              {item === 3 && 'See how we craft excellence'}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
