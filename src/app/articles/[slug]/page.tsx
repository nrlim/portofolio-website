import { Calendar, Clock, User, ArrowLeft, Loader } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';
import { ArticleContent } from '@/components/article-content';
import { ArticleImage } from '@/components/article-image';
import { supabaseServer } from '@/lib/supabase';
import { Suspense } from 'react';
import type { BlogArticle } from '@/types/database';

// Mark this page as dynamic to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  // Fetch the specific article
  const { data: article, error } = await supabaseServer
    .from('blog_articles')
    .select('*')
    .eq('id', slug)
    .eq('published', true)
    .single();

  // Fetch related articles
  const { data: allArticles } = await supabaseServer
    .from('blog_articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (!article) {
    notFound();
  }

  const post = {
    slug: article.id,
    title: article.title,
    description: article.description,
    date: article.created_at,
    author: 'Nuralim',
    category: article.category || 'General',
    readingTime: Math.ceil((article.content.split(/\s+/).length || 0) / 200),
    featured: article.featured,
    thumbnail: article.image_url || '',
    content: article.content,
  };

  const relatedPosts = (allArticles as BlogArticle[])
    ?.filter((p) => p.id !== slug)
    .slice(0, 2)
    .map((a) => ({
      slug: a.id,
      title: a.title,
      description: a.description,
      date: a.created_at,
      author: 'Nuralim',
      category: a.category || 'General',
      readingTime: Math.ceil((a.content.split(/\s+/).length || 0) / 200),
      featured: a.featured,
      thumbnail: a.image_url || '',
      content: a.content,
    })) || [];

  return (
    <article className="min-h-screen bg-white dark:bg-slate-950 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/articles">
            <Button variant="ghost" className="gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Articles
            </Button>
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="space-y-6">
              {/* Featured Image Skeleton */}
              <div className="mb-8 h-96 w-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />

              {/* Title Skeleton */}
              <div className="h-12 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-slate-800 dark:to-slate-700 rounded-lg animate-pulse" />

              {/* Meta Info Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>

              {/* Content Skeleton */}
              <div className="space-y-4 pt-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg animate-pulse"
                    style={{ width: `${Math.random() * 30 + 70}%` }}
                  />
                ))}
              </div>
            </div>
          }
        >
          {/* Featured Image */}
          {post.thumbnail && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <ArticleImage
                src={post.thumbnail}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 break-words">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 flex-shrink-0" />
                {post.readingTime} min read
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 flex-shrink-0" />
                {post.author}
              </div>
            </div>
          </header>

          {/* Content */}
          <ArticleContent content={post.content} relatedPosts={relatedPosts} />
        </Suspense>
      </div>
    </article>
  );
}
