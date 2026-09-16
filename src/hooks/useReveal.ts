import { useEffect, useRef } from 'react';

/**
 * Observes the returned element and adds `.is-visible` once it enters the
 * viewport (transition handled by CSS; reduced-motion users get a plain fade).
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
