'use client';

import { useEffect } from 'react';

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: 'POST' }).catch((err) =>
      console.error('Failed to increment view counter', err)
    );
  }, [slug]);

  return null;
}
