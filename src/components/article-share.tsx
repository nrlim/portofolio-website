'use client';

import { Share, MessageCircle, Mail, Copy, Facebook, Linkedin, Twitter, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

interface ArticleShareProps {
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  compact?: boolean;
}

export function ArticleShare({ title, url, description, imageUrl, compact = false }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Improved share text with better formatting for social platforms
  const shareText = `📚 ${title}\n\n${description || ''}\n\n🔗 Read Full Article:\n${url}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(title);

  // Share URLs for different platforms
  const shareLinks = {
    whatsapp: imageUrl 
      ? `https://wa.me/?text=${encodedText}` 
      : `https://wa.me/?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(shareText)}`,
  };

  const shareOptions = [
    {
      platform: 'copy',
      label: 'Copy Link',
      icon: <Copy className="w-5 h-5" />,
      color: 'hover:text-gray-700 dark:hover:text-gray-300',
      bgColor: 'hover:bg-gray-100 dark:hover:bg-slate-800',
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'hover:text-green-600 dark:hover:text-green-400',
      bgColor: 'hover:bg-green-50 dark:hover:bg-green-950/30',
    },
    {
      platform: 'email',
      label: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
    {
      platform: 'telegram',
      label: 'Telegram',
      icon: <span className="text-base">✈️</span>,
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
    {
      platform: 'twitter',
      label: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'hover:text-sky-600 dark:hover:text-sky-400',
      bgColor: 'hover:bg-sky-50 dark:hover:bg-sky-950/30',
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'hover:text-blue-600 dark:hover:text-blue-400',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      copyToClipboard();
      return;
    }
    
    // For WhatsApp, show a note about adding the image
    if (platform === 'whatsapp' && imageUrl) {
      const whatsappMessage = `${shareText}\n\n📸 Tip: Add the article cover image for more engagement!`;
      const encodedWhatsappMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/?text=${encodedWhatsappMessage}`, '_blank', 'noopener,noreferrer');
      return;
    }
    
    const link = shareLinks[platform as keyof typeof shareLinks];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center w-5 h-5 transition-all duration-200 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 group"
          title="Share article"
          aria-label="Share article"
        >
          <Share className="w-5 h-5" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 py-2 z-50 min-w-max animate-in fade-in slide-in-from-top-2 duration-200">
            {shareOptions.map((share) => (
              <button
                key={share.platform}
                onClick={() => {
                  handleShare(share.platform);
                  if (share.platform === 'copy') {
                    setIsOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-800 ${share.color}`}
              >
                {share.platform === 'copy' && copied ? (
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  share.icon
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {share.platform === 'copy' && copied ? 'Copied!' : share.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Share:</span>
      
      {/* Primary Share Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleShare('copy')}
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 hover:text-gray-700 dark:hover:text-gray-300 group"
          title="Copy Link"
          aria-label="Copy Link"
        >
          {copied ? (
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* More Options Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 hover:border-gray-300 dark:hover:border-slate-600 ${isOpen ? 'bg-gray-100 dark:bg-slate-800 border-gray-300 dark:border-slate-600' : ''}`}
          title="More sharing options"
          aria-label="More sharing options"
        >
          <Share className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50 min-w-max animate-in fade-in slide-in-from-top-2 duration-200">
            {shareOptions.slice(1).map((share) => (
              <button
                key={share.platform}
                onClick={() => {
                  handleShare(share.platform);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-slate-800 ${share.color}`}
              >
                {share.icon}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{share.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
