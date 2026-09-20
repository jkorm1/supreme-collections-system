'use client'

import { useState } from 'react'
import { Menu, X, LogIn, Search } from 'lucide-react'
import Link from 'next/link'

interface NavigationProps {
  onLoginClick: () => void
}

export function Navigation({ onLoginClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Showcase', href: '#showcase' },
    { label: 'Order', href: '#order' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' },
  ]

  const handleNavClick = (href: string) => {
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary to-primary/95 backdrop-blur-md border-b border-primary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 border-2 border-accent flex items-center justify-center rounded bg-white/10">
                <span className="text-sm font-bold text-accent">SC</span>
              </div>
              <span className="text-lg font-bold text-accent hidden sm:inline">SUPREME</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-white/90 hover:text-accent transition-colors text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden sm:flex">
              <Search className="w-5 h-5 text-accent" />
            </button>

            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 text-accent border border-accent rounded-lg hover:bg-accent hover:text-primary transition-colors text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">CEO Login</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-accent" />
              ) : (
                <Menu className="w-5 h-5 text-accent" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 bg-primary/90">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-2 text-white/90 hover:bg-white/10 hover:text-accent transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
