'use client';

import { useEffect } from 'react';

export default function ViewCounter({ slug }: { slug: string }) {
  useEffect(() => {
    try {
      const key = `viewed_${slug}`;
      if (!localStorage.getItem(key)) {
        fetch(`/api/views/${slug}`, { method: 'POST' })
          .then((res) => {
            if (res.ok) {
              localStorage.setItem(key, 'true');
            }
          })
          .catch((err) =>
            console.error('Failed to increment view counter', err)
          );
      }
    } catch {
      // Fallback if localStorage is disabled/unsupported (e.g. private mode)
      fetch(`/api/views/${slug}`, { method: 'POST' }).catch((err) =>
        console.error('Failed to increment view counter', err)
      );
    }
  }, [slug]);

  return null;
}
