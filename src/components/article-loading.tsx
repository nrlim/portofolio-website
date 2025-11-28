'use client';

import { motion } from 'framer-motion';

export function ArticleLoadingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 h-10 w-32 bg-gray-200 dark:bg-slate-800 rounded-lg"
        />

        {/* Featured Image Skeleton */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-8 h-96 w-full bg-gray-200 dark:bg-slate-800 rounded-lg"
        />

        {/* Title Skeleton */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-4 h-12 w-3/4 bg-gray-200 dark:bg-slate-800 rounded-lg"
        />

        {/* Meta Info Skeletons */}
        <div className="mb-12 space-y-3">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-6 w-1/2 bg-gray-200 dark:bg-slate-800 rounded-lg"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-6 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Content Skeletons */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg"
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ArticleListLoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(3)].map((_, idx) => (
        <motion.div
          key={idx}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.1 }}
          className="border-b border-gray-200 dark:border-gray-800 py-8 flex gap-6"
        >
          {/* Content skeleton */}
          <div className="flex-1 space-y-3">
            <div className="h-8 w-2/3 bg-gray-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-6 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-6 w-4/5 bg-gray-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg" />
          </div>

          {/* Image skeleton */}
          <div className="hidden sm:block h-28 w-40 bg-gray-200 dark:bg-slate-800 rounded-lg flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  );
}
