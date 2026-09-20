'use client'

import { motion } from 'framer-motion'
import { Database, RotateCcw, Download, Upload } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold text-primary">System Settings</h1>
        <p className="text-foreground/60 mt-1">Manage database, backups, and configuration</p>
      </motion.div>

      {/* Database Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-semibold text-primary">Database Management</h2>
        </div>

        <div className="space-y-3">
          <p className="text-foreground/60 text-sm">
            Manage your Excel database schema, create backups, and restore data
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Initialize Database
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2">
              <Download className="w-4 h-4" />
              Backup Now
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Restore Backup
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </button>
          </div>
        </div>
      </motion.div>

      {/* Company Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-primary mb-4">Company Information</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Company Name
            </label>
            <input
              type="text"
              defaultValue="SUPREME COLLECTIONS"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                defaultValue="0240958968"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Instagram Handle
              </label>
              <input
                type="text"
                defaultValue="supreme_collections"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all font-medium">
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  )
}
