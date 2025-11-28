'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Wand2, Loader, X, Check } from 'lucide-react';
import Link from 'next/link';

interface AIArticleGeneratorProps {
  onArticleGenerated?: () => void;
}

export function AIArticleGenerator({ onArticleGenerated }: AIArticleGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [category, setCategory] = useState('Technology');
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedArticleId, setGeneratedArticleId] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/ai/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          category,
          featured,
          published: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to generate article');
        return;
      }

      setSuccess(true);
      setGeneratedArticleId(data.article.id);
      setInstruction('');
      
      // Refresh articles list after 2 seconds
      setTimeout(() => {
        onArticleGenerated?.();
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Wand2 size={18} />
        AI Generate
      </Button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => !loading && setIsOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl p-6 max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-purple-600" />
              AI Article Generator
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Generate articles with AI while maintaining your content style
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Success State */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg mb-4 flex items-center gap-3"
          >
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-300">
                Article generated successfully!
              </p>
              <p className="text-sm text-green-800 dark:text-green-400">
                Your article has been created as a draft. You can now edit and publish it.
              </p>
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleGenerate} className="space-y-4">
          {/* Instruction Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Article Instruction *
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g., Write about microservices architecture best practices using .NET and RabbitMQ, include code examples..."
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:focus:ring-purple-500 focus:outline-none resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Be specific about the topic, include any key points, code examples, or style preferences
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent dark:focus:ring-purple-500 focus:outline-none"
            >
              <option>Technology</option>
              <option>Backend</option>
              <option>Frontend</option>
              <option>DevOps</option>
              <option>Architecture</option>
              <option>Leadership</option>
              <option>Product Development</option>
              <option>Other</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-sm text-red-700 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !instruction.trim()}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate Article
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-900">
          <p className="text-sm text-purple-900 dark:text-purple-300">
            <strong>💡 Tip:</strong> The AI will generate a complete article with your style. You can edit it before publishing. Articles are saved as drafts by default.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
