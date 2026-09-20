'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Heart, Zap, Shield } from 'lucide-react'

export function WhyUs() {
  const reasons = [
    { icon: <CheckCircle className="w-8 h-8" />, title: 'Premium Quality', desc: 'Only the finest materials and craftsmanship' },
    { icon: <Heart className="w-8 h-8" />, title: 'Affordable Luxury', desc: 'Premium products at reasonable prices' },
    { icon: <Zap className="w-8 h-8" />, title: 'Fast Delivery', desc: 'Quick and reliable delivery to your location' },
    { icon: <Shield className="w-8 h-8" />, title: 'Excellent Support', desc: '24/7 customer service and lifetime support' },
  ]

  return (
    <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            Why Choose Supreme Collections
          </h2>
          <p className="text-lg text-foreground/60 text-center max-w-2xl mx-auto mb-16">
            We're committed to delivering excellence in every aspect of our business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border hover:border-primary/30 transition-colors"
            >
              <div className="text-primary mb-4">{reason.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{reason.title}</h3>
              <p className="text-foreground/60 text-sm">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
