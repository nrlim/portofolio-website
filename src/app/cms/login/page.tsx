'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { AlertCircle, Lock, Mail, LogIn, Loader2, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        console.error('Login error:', data);
        return;
      }

      // Redirect to CMS dashboard
      router.push('/cms/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_25%,rgba(68,68,68,.05)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.05)_75%,rgba(68,68,68,.05))] bg-[length:60px_60px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Main Card */}
        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-slate-700/50 overflow-hidden relative">
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8 relative z-10"
          >
            {/* Icon Container */}
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 rounded-2xl shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            </div>

            {/* Title and Description */}
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl font-black bg-gradient-to-r from-blue-300 via-blue-200 to-cyan-300 bg-clip-text text-transparent mb-2"
            >
              CMS Dashboard
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 dark:text-slate-400 text-base font-medium"
            >
              Secure access to manage your content
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <label className="block text-sm font-bold text-slate-200 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email Address
              </label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="pl-12 pr-4 py-3 bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-600/50 text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white/15 dark:focus:bg-slate-800/70 focus:border-blue-400/50 dark:focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/30 rounded-xl transition-all duration-300"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="group"
            >
              <label className="block text-sm font-bold text-slate-200 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                Password
              </label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="pl-12 pr-4 py-3 bg-white/10 dark:bg-slate-800/50 border border-white/20 dark:border-slate-600/50 text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white/15 dark:focus:bg-slate-800/70 focus:border-cyan-400/50 dark:focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/30 rounded-xl transition-all duration-300"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-500/15 dark:bg-red-500/10 border border-red-500/30 dark:border-red-500/20 rounded-xl text-sm text-red-300 dark:text-red-400 flex items-start gap-3 backdrop-blur-sm"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-700 dark:to-cyan-700 dark:hover:from-blue-800 dark:hover:to-cyan-800 text-white font-bold text-base shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-600/30 transition-all duration-300 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-6 p-4 bg-blue-500/10 dark:bg-blue-900/20 border border-blue-500/20 dark:border-blue-500/30 rounded-xl text-xs text-slate-300 dark:text-slate-400 flex items-start gap-3 relative z-10"
          >
            <Shield className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <span>Your login credentials are securely transmitted and encrypted.</span>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 pt-6 border-t border-white/10 dark:border-slate-700/50 text-center text-sm text-slate-300 dark:text-slate-400 relative z-10"
          >
            <p className="flex items-center justify-center gap-2">
              <span>Back to</span>
              <Link
                href="/"
                className="text-blue-300 dark:text-blue-400 hover:text-cyan-300 dark:hover:text-cyan-300 font-bold transition-colors flex items-center gap-1 group"
              >
                Portfolio
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Bottom decorative text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6"
        >
          CMS v1.0 • Secure Management System
        </motion.p>
      </motion.div>
    </div>
  );
}
