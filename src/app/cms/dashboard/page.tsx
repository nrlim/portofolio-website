'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Plus, LogOut, Eye, EyeOff, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { AIArticleGenerator } from '@/components/ai-article-generator';
import type { BlogArticle } from '@/types/database';

interface AlertState {
  show: boolean;
  type: 'error' | 'success' | 'warning';
  message: string;
  articleId?: string;
}

export default function CMSDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState>({ show: false, type: 'error', message: '' });
  const [authenticated, setAuthenticated] = useState(false);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Check authentication and fetch articles
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch articles to check if authenticated
        const response = await fetch('/api/blog/articles');
        if (!response.ok && response.status === 401) {
          router.push('/cms/login');
          return;
        }
        setAuthenticated(true);
        fetchArticles();
      } catch (err) {
        router.push('/cms/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/articles?published=false&limit=1000');
      if (response.ok) {
        const data = await response.json();
        setArticles(Array.isArray(data) ? data : data.articles || []);
      }
    } catch (err) {
      showAlert('error', 'Failed to fetch articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type: 'error' | 'success' | 'warning', message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ ...alert, show: false }), 5000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/cms/login');
  };

  const handleTakedown = async (id: string, title: string) => {
    if (!confirm(`Unpublish "${title}"? It will no longer be visible to the public.`)) return;

    try {
      setActionInProgress(id);
      const article = articles.find(a => a.id === id);
      if (!article) return;

      const response = await fetch(`/api/blog/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...article,
          published: false,
        }),
      });

      if (!response.ok) {
        showAlert('error', 'Failed to unpublish article');
        return;
      }

      // Revalidate the articles page cache
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/articles' }),
      });

      // Update local state
      setArticles(articles.map(a => a.id === id ? { ...a, published: false } : a));
      showAlert('success', `"${title}" has been unpublished`);
    } catch (err) {
      showAlert('error', 'Failed to unpublish article');
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDelete = async (id: string, title: string, isPublished: boolean) => {
    if (isPublished) {
      showAlert('warning', 'Cannot delete published articles. Please unpublish first.');
      return;
    }

    if (!confirm(`Permanently delete "${title}"? This action cannot be undone.`)) return;

    try {
      setActionInProgress(id);
      const response = await fetch(`/api/blog/articles/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        showAlert('error', 'Failed to delete article');
        return;
      }

      // Revalidate the articles page cache
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: '/articles' }),
      });

      setArticles(articles.filter((a) => a.id !== id));
      showAlert('success', `"${title}" has been deleted`);
    } catch (err) {
      showAlert('error', 'Failed to delete article');
      console.error(err);
    } finally {
      setActionInProgress(null);
    }
  };

  if (!authenticated) return null;

  const publishedCount = articles.filter(a => a.published).length;
  const draftCount = articles.filter(a => !a.published).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-accent bg-clip-text text-transparent">
              CMS Dashboard
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your articles and content
            </p>
          </div>
          <div className="flex gap-3">
            <AIArticleGenerator onArticleGenerated={fetchArticles} />
            <Button
              onClick={() => router.push('/cms/editor')}
              className="gap-2 bg-gradient-to-r from-blue-600 to-accent hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              New Article
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Toast */}
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
              alert.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900'
                : alert.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900'
            }`}
          >
            {alert.type === 'error' && <AlertCircle className={`flex-shrink-0 w-5 h-5 text-red-600 dark:text-red-400 mt-0.5`} />}
            {alert.type === 'success' && <CheckCircle className={`flex-shrink-0 w-5 h-5 text-green-600 dark:text-green-400 mt-0.5`} />}
            {alert.type === 'warning' && <AlertCircle className={`flex-shrink-0 w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5`} />}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                alert.type === 'error'
                  ? 'text-red-800 dark:text-red-300'
                  : alert.type === 'success'
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-yellow-800 dark:text-yellow-300'
              }`}>
                {alert.message}
              </p>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        {!loading && articles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{articles.length}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{publishedCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Drafts</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{draftCount}</p>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 dark:border-t-blue-400"></div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No articles yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first article to get started
            </p>
            <Button onClick={() => router.push('/cms/editor')} className="gap-2">
              <Plus size={18} />
              Create Article
            </Button>
          </motion.div>
        ) : (
          /* Articles Grid */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6"
          >
            {articles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Article Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                        {article.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {article.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        {article.category || 'General'}
                      </span>
                      <span>•</span>
                      <span>{new Date(article.created_at).toLocaleDateString('id-ID')}</span>
                      <span>•</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          article.published
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {article.published ? (
                          <>
                            <Eye size={12} />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} />
                            Draft
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap md:flex-col gap-2 md:gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/cms/editor/${article.id}`)}
                      disabled={actionInProgress === article.id}
                      className="gap-1 flex-1 md:flex-none"
                    >
                      <Edit2 size={16} />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>

                    {article.published ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTakedown(article.id, article.title)}
                        disabled={actionInProgress === article.id}
                        className="gap-1 flex-1 md:flex-none text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        title="Unpublish this article"
                      >
                        <EyeOff size={16} />
                        <span className="hidden sm:inline">Takedown</span>
                      </Button>
                    ) : null}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(article.id, article.title, article.published)}
                      disabled={actionInProgress === article.id || article.published}
                      className={`gap-1 flex-1 md:flex-none text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                        article.published ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title={article.published ? 'Cannot delete published articles' : 'Delete article'}
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
}
