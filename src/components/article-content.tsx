'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/lib/blog';
import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { parseMarkdown } from '@/lib/markdown';
import 'highlight.js/styles/atom-one-dark.css';

interface ArticleContentProps {
  content: string;
  relatedPosts: BlogPost[];
}

export function ArticleContent({ content, relatedPosts }: ArticleContentProps) {
  // Parse markdown once
  const htmlContent = useMemo(() => {
    try {
      return parseMarkdown(content);
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content;
    }
  }, [content]);
  return (
    <>
      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-none mb-12"
      >
        <style>{`
          /* Typography */
          .article-content h1 {
            @apply text-4xl font-bold text-gray-900 dark:text-white mt-8 mb-4 leading-tight;
          }
          
          .article-content h2 {
            @apply text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4 leading-tight;
            border-bottom: 2px solid #0A84FF;
            padding-bottom: 0.5rem;
          }
          
          .article-content h3 {
            @apply text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3 leading-tight;
          }
          
          .article-content h4 {
            @apply text-xl font-semibold text-gray-900 dark:text-white mt-4 mb-2;
          }
          
          .article-content p {
            @apply text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base;
            line-height: 1.8;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          
          .article-content a {
            @apply text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium transition-colors;
            word-break: break-word;
          }
          
          /* Lists */
          .article-content ul {
            @apply list-disc list-inside space-y-2 mb-4 ml-4;
          }
          
          .article-content ol {
            @apply list-decimal list-inside space-y-2 mb-4 ml-4;
          }
          
          .article-content li {
            @apply text-gray-700 dark:text-gray-300 leading-relaxed;
          }
          
          /* Code */
          .article-content code {
            @apply bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded px-2 py-1 font-mono text-sm;
          }
          
          .article-content pre {
            @apply bg-slate-900 dark:bg-black text-slate-100 rounded-lg p-4 overflow-x-auto mb-4 border border-slate-700;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          }
          
          .article-content pre code {
            @apply bg-transparent p-0 text-slate-100;
          }
          
          /* Highlight.js syntax colors */
          .hljs {
            background: #1e1e1e !important;
            color: #e8e8e8 !important;
          }
          
          .hljs-attr,
          .hljs-attribute {
            color: #9cdcfe;
          }
          
          .hljs-string {
            color: #ce9178;
          }
          
          .hljs-literal,
          .hljs-number {
            color: #b5cea8;
          }
          
          .hljs-keyword {
            color: #569cd6;
          }
          
          .hljs-function {
            color: #dcdcaa;
          }
          
          .hljs-title {
            color: #4ec9b0;
          }
          
          .hljs-comment {
            color: #6a9955;
          }
          
          .hljs-variable {
            color: #9cdcfe;
          }
          
          .hljs-params {
            color: #9cdcfe;
          }
          
          /* Blockquotes */
          .article-content blockquote {
            @apply border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic text-gray-700 dark:text-gray-300;
          }
          
          /* Tables */
          .article-content table {
            @apply w-full border-collapse my-4 border border-gray-300 dark:border-gray-600;
          }
          
          .article-content th {
            @apply bg-blue-50 dark:bg-blue-900/30 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600;
          }
          
          .article-content td {
            @apply px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600;
          }
          
          .article-content tr:nth-child(even) {
            @apply bg-slate-50 dark:bg-slate-800/50;
          }
          
          /* Strong & Emphasis */
          .article-content strong {
            @apply font-bold text-gray-900 dark:text-white;
          }
          
          .article-content em {
            @apply italic text-gray-700 dark:text-gray-300;
          }
          
          /* HR */
          .article-content hr {
            @apply border-t-2 border-gray-300 dark:border-gray-600 my-6;
          }
        `}</style>
        
        <div className="article-content prose-base max-w-none">
          {/* Render markdown as HTML */}
          <div 
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            className="space-y-4"
          />
        </div>
      </motion.div>

      {/* Footer - About Author */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-800"
      >
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 md:p-8 border border-blue-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            👨‍💻 Tentang Nuralim
          </h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Product & Technology Development Manager dengan 7+ tahun pengalaman membangun solusi software yang scalable. 
            Passionate tentang clean architecture, team leadership, dan engineering excellence.
          </p>
          <Link href="/#contact">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              Hubungi Saya <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.footer>

      {/* Related Articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-blue-500">
            📚 Artikel Terkait
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((post) => (
              <RelatedArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </motion.section>
      )}
    </>
  );
}

// Separate component for related article card to handle image errors
function RelatedArticleCard({ post }: { post: BlogPost }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link href={`/articles/${post.slug}`}>
      <motion.div 
        whileHover={{ translateY: -4 }}
        className="group border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer h-full bg-white dark:bg-slate-800 shadow-sm hover:shadow-lg flex flex-col"
      >
        {/* Thumbnail */}
        {post.thumbnail && !imageError && (
          <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 overflow-hidden flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          </div>
        )}
        
        <div className="p-4 sm:p-6 flex flex-col flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1 leading-tight text-sm sm:text-base break-words">
              {post.title}
            </h3>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0 ml-2 mt-0.5" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1 break-words">
            {post.description}
          </p>
          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 dark:text-gray-500 flex-wrap">
            <span className="whitespace-nowrap">⏱️ {post.readingTime} min</span>
            {post.category && <span>•</span>}
            {post.category && <span className="text-blue-600 dark:text-blue-400 font-medium truncate">{post.category}</span>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
