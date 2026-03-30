'use client';

import { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ArticleImage({ src, alt, className }: ArticleImageProps) {
  const [error, setError] = useState(false);

  if (error || !src) return null;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
