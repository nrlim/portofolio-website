import Link from 'next/link';
import { Suspense } from 'react';
import { ArticleList } from '@/components/article-list';
import { supabaseServer } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { BlogArticle } from '@/types/database';

// Mark this page as dynamic to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function ArticlesContent() {
  // Fetch published articles from database
  const { data: articles, error } = await supabaseServer
    .from('blog_articles')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const posts = (articles as BlogArticle[])?.map((article) => ({
    slug: article.id,
    title: article.title,
    description: article.description,
    date: article.created_at,
    author: 'Nuralim',
    category: article.category || 'General',
    readingTime: Math.ceil(article.content.split(' ').length / 200),
    featured: article.featured,
    thumbnail: article.image_url || '',
    content: article.content,
  })) || [];

  return <ArticleList posts={posts} />;
}

export default function ArticlesPage() {
  return (
    <div className="bg-white dark:bg-slate-950 pt-20 pb-12">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with navigation */}
        <div className="mb-8">
          <Link href="/">
            <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-shadow">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Button>
          </Link>
        </div>

        <Suspense fallback={null}>
          <ArticlesContent />
        </Suspense>
      </div>
    </div>
  );
}
