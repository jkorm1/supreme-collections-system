"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store token
      localStorage.setItem("authToken", data.data.token);

      // Navigate to dashboard
      router.push("/admin");
      onClose();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-br from-primary to-primary/95 rounded-2xl shadow-2xl p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-accent">
                    Admin Login
                  </h2>
                  <p className="text-sm text-white/80 mt-1">
                    CEO Dashboard Access
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-accent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Error Message */}
                {error && (
                  <div className="flex gap-3 p-3 bg-red-50/20 border border-red-400/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-200 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-100">{error}</p>
                  </div>
                )}

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-accent mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-4 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white/10 text-white placeholder-white/50"
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-accent mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-accent/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-white/10 text-white placeholder-white/50"
                    disabled={isLoading}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-primary py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Info */}
              <p className="text-xs text-center text-white/60 mt-4">
                Default: admin / jkorm123
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
