'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, Tag, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog';

interface ArticleListProps {
  posts: BlogPost[];
}

export function ArticleList({ posts }: ArticleListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4 leading-tight py-2">
          Articles & Insights
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Explore in-depth articles on software engineering, product development, technical leadership, and industry insights.
        </p>
      </motion.div>

      {/* Articles Grid - Medium.com Style */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-0"
      >
        {posts.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-800"
          >
            <Sparkles className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
              No articles yet. Check back soon for new insights!
            </p>
          </motion.div>
        ) : (
          posts.map((post) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="group relative border-b border-gray-200 dark:border-gray-800 last:border-b-0 py-8 cursor-pointer"
            >
              <Link href={`/articles/${post.slug}`}>
                <div className="flex gap-6 items-start px-4 py-4 rounded-lg hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-all duration-200 -mx-4">
                  {/* Content - Left Side */}
                  <div className="flex-1 min-w-0 pr-4">
                    {/* Badge Container */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.featured && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-block"
                        >
                          <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        </motion.div>
                      )}

                      {post.category && (
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-500">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.category}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-3">
                      {post.title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed text-base">
                      {post.description}
                    </p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-500">
                      <div className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Image - Right Side (Medium.com style) */}
                  {post.thumbnail && (
                    <div className="hidden sm:block flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 group-hover:shadow-lg transition-shadow">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </motion.article>
          ))
        )}
      </motion.div>
    </>
  );
}
