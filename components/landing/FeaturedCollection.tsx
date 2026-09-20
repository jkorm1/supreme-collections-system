'use client'

import { motion } from 'framer-motion'

export function FeaturedCollection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center">
            Featured Collection
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center"
          >
            <div className="text-center">
              <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-4" />
              <p className="text-foreground/40">Featured Product Image</p>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p className="text-primary font-semibold mb-2">LUXURY COLLECTION</p>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Handcrafted Excellence
              </h3>
            </div>

            <p className="text-lg text-foreground/70">
              Each piece in our featured collection represents the pinnacle of craftsmanship and luxury. Meticulously selected for their superior quality and timeless design.
            </p>

            <ul className="space-y-3">
              {['Premium Materials', 'Handcrafted Design', 'Limited Edition', 'Lifetime Support'].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <button className="mt-6 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
