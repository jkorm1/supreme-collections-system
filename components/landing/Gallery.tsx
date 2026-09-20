'use client'

import { motion } from 'framer-motion'

export function Gallery() {
  const gallery = [1, 2, 3, 4, 5, 6]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
          Our Gallery
        </h2>
        <p className="text-lg text-foreground/60 text-center max-w-2xl mx-auto mb-16">
          Explore our collection through stunning photography
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((item) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden cursor-pointer"
          >
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-foreground/40">Gallery Image {item}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
