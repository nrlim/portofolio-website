'use client';

import { usePathname } from 'next/navigation';
import { ChatWidgetModern } from '@/components/chat-widget';

export function ChatWidgetProvider() {
  const pathname = usePathname();

  // Hide chat widget on CMS pages
  if (pathname.startsWith('/cms')) {
    return null;
  }

  return <ChatWidgetModern />;
}
