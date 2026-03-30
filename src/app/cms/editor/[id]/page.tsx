'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Save, X, Eye, EyeOff, Calendar, Clock } from 'lucide-react';
import { parseMarkdown } from '@/lib/markdown';
import 'highlight.js/styles/atom-one-dark.css';
import type { BlogArticle } from '@/types/database';

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    loadArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  useEffect(() => {
    // Update preview HTML when content changes
    if (preview && content) {
      setPreviewHtml(parseMarkdown(content));
    }
  }, [content, preview]);

  const loadArticle = async () => {
    try {
      const response = await fetch(`/api/blog/articles/${articleId}`);
      if (!response.ok) throw new Error('Failed to load article');
      const article: BlogArticle = await response.json();
      setTitle(article.title);
      setDescription(article.description);
      setContent(article.content);
      setCategory(article.category || '');
      setImageUrl(article.image_url || '');
      setPublished(article.published || false);
    } catch (err) {
      setError('Failed to load article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const articleData = {
        title,
        description,
        content,
        category,
        image_url: imageUrl,
        published,
      };

      const response = await fetch(`/api/blog/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save article');
      }

      router.push('/cms/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Article
          </h1>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreview(!preview)}
              className="gap-2"
            >
              {preview ? (
                <>
                  <EyeOff size={18} />
                  Edit
                </>
              ) : (
                <>
                  <Eye size={18} />
                  Preview
                </>
              )}
            </Button>
            <Button onClick={() => router.push('/cms/dashboard')} className="gap-2">
              <X size={18} />
              Close
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded text-sm text-red-700 dark:text-red-400"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Editor */}
          {!preview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2"
            >
              <form onSubmit={handleSave} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Title *
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Article title"
                    required
                    disabled={saving}
                    className="text-lg"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of the article"
                    required
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:focus:ring-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Category
                  </label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Technology, Leadership, Web Dev"
                    disabled={saving}
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Featured Image URL
                  </label>
                  <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={saving}
                  />
                  {imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Content (Markdown) *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your article content in markdown..."
                    required
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:focus:ring-blue-500 focus:outline-none font-mono text-sm"
                    rows={15}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full gap-2 py-6 text-base"
                >
                  <Save size={20} />
                  {saving ? 'Saving...' : 'Update Article'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Preview/Sidebar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${
              preview ? 'col-span-full' : 'col-span-1'
            } space-y-6`}
          >
            {/* Options */}
            {!preview && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Options
                </h3>

                {/* Published Toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    disabled={saving}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {published ? '🟢' : '🔴'} Publish Article
                  </span>
                </label>
              </div>
            )}

            {/* Preview - Sidebar (when not in preview mode) */}
            {!preview && (
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Preview
                </h3>
                <div className="text-sm space-y-4">
                  {title ? (
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {title}
                      </h4>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Title will appear here</p>
                  )}

                  {description ? (
                    <p className="text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">Description will appear here</p>
                  )}

                  {category && (
                    <div className="flex gap-2 flex-wrap pt-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-semibold">
                        {category}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 flex-wrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        published
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {published ? '🟢 Published' : '🔴 Draft'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Preview - Fullscreen */}
            {preview && (
              <div className="bg-white dark:bg-slate-950 min-h-screen rounded-lg shadow overflow-auto">
                <style>{`
                  /* Typography */
                  .editor-preview h1 {
                    font-size: 2.25rem;
                    font-weight: bold;
                    color: #111827;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    line-height: 1.2;
                  }
                  
                  .dark .editor-preview h1 {
                    color: #f1f5f9;
                  }
                  
                  .editor-preview h2 {
                    font-size: 1.875rem;
                    font-weight: bold;
                    color: #111827;
                    margin-top: 2rem;
                    margin-bottom: 1rem;
                    line-height: 1.2;
                    border-bottom: 2px solid #0A84FF;
                    padding-bottom: 0.5rem;
                  }
                  
                  .dark .editor-preview h2 {
                    color: #f1f5f9;
                  }
                  
                  .editor-preview h3 {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #111827;
                    margin-top: 1.5rem;
                    margin-bottom: 0.75rem;
                    line-height: 1.2;
                  }
                  
                  .dark .editor-preview h3 {
                    color: #f1f5f9;
                  }
                  
                  .editor-preview h4 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #111827;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                  }
                  
                  .dark .editor-preview h4 {
                    color: #f1f5f9;
                  }
                  
                  .editor-preview p {
                    color: #374151;
                    line-height: 1.8;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                  }
                  
                  .dark .editor-preview p {
                    color: #d1d5db;
                  }
                  
                  .editor-preview a {
                    color: #2563eb;
                    text-decoration: underline;
                    font-weight: 500;
                    transition: colors 0.2s;
                  }
                  
                  .dark .editor-preview a {
                    color: #60a5fa;
                  }
                  
                  .editor-preview a:hover {
                    color: #1d4ed8;
                  }
                  
                  .dark .editor-preview a:hover {
                    color: #3b82f6;
                  }
                  
                  /* Lists */
                  .editor-preview ul {
                    list-style-type: disc;
                    margin-left: 1rem;
                    margin-bottom: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                  }
                  
                  .editor-preview ol {
                    list-style-type: decimal;
                    margin-left: 1rem;
                    margin-bottom: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                  }
                  
                  .editor-preview li {
                    color: #374151;
                    line-height: 1.6;
                  }
                  
                  .dark .editor-preview li {
                    color: #d1d5db;
                  }
                  
                  /* Code */
                  .editor-preview code {
                    background-color: #e2e8f0;
                    color: #1e293b;
                    border-radius: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                  }
                  
                  .dark .editor-preview code {
                    background-color: #334155;
                    color: #f1f5f9;
                  }
                  
                  .editor-preview pre {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: #e8e8e8;
                    border-radius: 0.5rem;
                    padding: 1rem;
                    overflow-x: auto;
                    margin-bottom: 1rem;
                    border: 1px solid #334155;
                  }
                  
                  .editor-preview pre code {
                    background: transparent;
                    padding: 0;
                    color: #e8e8e8;
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
                  .editor-preview blockquote {
                    border-left: 4px solid #3b82f6;
                    padding-left: 1rem;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    margin: 1rem 0;
                    background-color: #eff6ff;
                    font-style: italic;
                    color: #374151;
                  }
                  
                  .dark .editor-preview blockquote {
                    background-color: rgba(30, 58, 138, 0.2);
                    color: #d1d5db;
                  }
                  
                  /* Tables */
                  .editor-preview table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 1rem 0;
                    border: 1px solid #d1d5db;
                  }
                  
                  .dark .editor-preview table {
                    border-color: #4b5563;
                  }
                  
                  .editor-preview th {
                    background-color: #eff6ff;
                    padding: 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: #111827;
                    border: 1px solid #d1d5db;
                  }
                  
                  .dark .editor-preview th {
                    background-color: rgba(30, 58, 138, 0.3);
                    color: #f1f5f9;
                    border-color: #4b5563;
                  }
                  
                  .editor-preview td {
                    padding: 1rem;
                    color: #374151;
                    border: 1px solid #d1d5db;
                  }
                  
                  .dark .editor-preview td {
                    color: #d1d5db;
                    border-color: #4b5563;
                  }
                  
                  .editor-preview tr:nth-child(even) {
                    background-color: #f9fafb;
                  }
                  
                  .dark .editor-preview tr:nth-child(even) {
                    background-color: rgba(15, 23, 42, 0.5);
                  }
                  
                  /* Strong & Emphasis */
                  .editor-preview strong {
                    font-weight: bold;
                    color: #111827;
                  }
                  
                  .dark .editor-preview strong {
                    color: #f1f5f9;
                  }
                  
                  .editor-preview em {
                    font-style: italic;
                    color: #374151;
                  }
                  
                  .dark .editor-preview em {
                    color: #d1d5db;
                  }
                  
                  /* HR */
                  .editor-preview hr {
                    border-top: 2px solid #d1d5db;
                    margin: 1.5rem 0;
                  }
                  
                  .dark .editor-preview hr {
                    border-color: #4b5563;
                  }
                `}</style>
                
                <div className="max-w-3xl mx-auto px-6 py-8 dark:bg-slate-950">
                  {/* Featured Image */}
                  {imageUrl && (
                    <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Metadata Header */}
                  <div className="mb-8 pb-8 border-b-2 border-gray-200 dark:border-gray-700">
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
                      {title || 'Untitled Article'}
                    </h1>
                    
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {description || 'No description provided'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {Math.ceil((content.split(/\s+/).length || 0) / 200)} min read
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {category && (
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-xs font-semibold">
                          {category}
                        </span>
                      )}
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          published
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
                        }`}
                      >
                        {published ? '🟢 Published' : '🔴 Draft'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  {previewHtml ? (
                    <div 
                      className="editor-preview prose-base max-w-none"
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  ) : (
                    <p className="text-gray-400 italic text-center py-12">
                      No content to preview. Start writing in the editor.
                    </p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
