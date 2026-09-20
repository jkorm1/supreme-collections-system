'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export function Reviews() {
  const reviews = [
    { name: 'John Mensah', rating: 5, text: 'Best shoes I\'ve ever owned. Extremely comfortable and stylish!' },
    { name: 'Ama Osei', rating: 5, text: 'Fast delivery and excellent customer service. Highly recommended!' },
    { name: 'Kwame Asante', rating: 5, text: 'Premium quality at affordable prices. Will definitely buy again.' },
  ]

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            What Our Customers Say
          </h2>
          <p className="text-lg text-foreground/60 text-center max-w-2xl mx-auto mb-16">
            Join thousands of satisfied customers who trust Supreme Collections
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/70 mb-6 italic">"{review.text}"</p>

              <div>
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-foreground/60">Verified Customer</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
