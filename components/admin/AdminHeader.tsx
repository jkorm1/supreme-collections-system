'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    router.push('/')
  }

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      <h1 className="text-lg font-semibold text-primary">
        Admin Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-accent/10 hover:text-primary rounded-lg transition-colors">
          <User className="w-4 h-4" />
          <span className="text-sm">CEO</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </header>
  )
}
