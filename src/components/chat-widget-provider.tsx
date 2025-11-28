'use client';

import { usePathname } from 'next/navigation';
import { ChatWidgetModern } from '@/components/chat-widget';

export function ChatWidgetProvider() {
  const pathname = usePathname();

  // Hide chat widget on CMS and articles pages
  if (pathname.startsWith('/cms') || pathname.startsWith('/articles')) {
    return null;
  }

  return <ChatWidgetModern />;
}
