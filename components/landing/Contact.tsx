'use client'

import { motion } from 'framer-motion'
import { Phone, Share2, MessageCircle, MapPin, Clock } from 'lucide-react'

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-center">
            Get In Touch
          </h2>
          <p className="text-lg text-foreground/60 text-center max-w-2xl mx-auto mb-16">
            Have questions? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              { icon: <Phone className="w-6 h-6" />, title: 'Phone', text: '0240958968', href: 'tel:0240958968' },
              { icon: <MessageCircle className="w-6 h-6" />, title: 'WhatsApp', text: 'Chat with us', href: 'https://wa.me/233240958968' },
              { icon: <Share2 className="w-6 h-6" />, title: 'Instagram', text: '@supreme_collections', href: 'https://instagram.com/supreme_collections' },
              { icon: <MapPin className="w-6 h-6" />, title: 'Location', text: 'KNUST Campus', href: '#' },
              { icon: <Clock className="w-6 h-6" />, title: 'Business Hours', text: 'Mon - Sun: 9AM - 8PM', href: '#' },
            ].map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-4 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="text-primary flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-foreground/60">{item.text}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border border-border"
          >
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-4" />
              <p className="text-foreground/40">Map Location</p>
              <p className="text-sm text-foreground/30 mt-2">KNUST Campus</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
