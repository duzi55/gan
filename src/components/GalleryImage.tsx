'use client';

import { useState } from 'react';

interface GalleryImageProps {
  src: string;
  alt: string;
  gradient: string;
}

export function GalleryImage({ src, alt, gradient }: GalleryImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="absolute inset-0" style={{ background: gradient }} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
      onError={() => setFailed(true)}
    />
  );
}
