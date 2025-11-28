'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/blog';

interface ArticleSectionProps {
  featuredPosts: BlogPost[];
}

export function ArticleSection({ featuredPosts }: ArticleSectionProps) {
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
    <section id="articles" className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
            Latest Articles
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Articles & Insights
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights on software engineering, microservices architecture, and team leadership from 7+ years of building scalable systems.
          </p>
        </motion.div>

        {/* Featured Articles Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {featuredPosts.length === 0 ? (
            <motion.div variants={itemVariants} className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No articles yet. Check back soon!</p>
            </motion.div>
          ) : (
            featuredPosts.map((post) => (
              <motion.article
                key={post.slug}
                variants={itemVariants}
                className="group h-full"
              >
                <Link href={`/articles/${post.slug}`}>
                  <div className="h-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10 bg-white dark:bg-slate-900 flex flex-col cursor-pointer">
                    {/* Category */}
                    <div className="px-6 pt-6">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50">
                        {post.category}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-6 py-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 text-sm">
                        {post.description}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.date}>
                          {new Date(post.date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <Clock className="w-4 h-4" />
                        {post.readingTime} min read
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </motion.div>

        {/* View All Articles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/articles">
            <Button size="lg" className="gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
