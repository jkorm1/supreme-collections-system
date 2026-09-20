'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-white border-t border-primary py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 border-2 border-accent flex items-center justify-center rounded">
                <span className="text-sm font-bold text-accent">SC</span>
              </div>
              <h3 className="text-lg font-bold text-white font-serif">SUPREME COLLECTIONS</h3>
            </div>
            <p className="text-sm text-white/80">
              Step In Excellence. Premium men&apos;s shoes and authentic Ghana-made slippers.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Products', 'FAQ', 'Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              {['Contact Us', 'Shipping Info', 'Returns', 'Warranty'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/70">
          <p>
            &copy; 2024 Supreme Collections. All rights reserved.
          </p>
          <p className="flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-accent fill-accent" /> in Ghana
          </p>
        </div>
      </div>
    </footer>
  )
}
