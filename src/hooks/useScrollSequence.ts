import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

const FRAME_COUNT = 90;
/** Relative path — frames ship under public/frames next to index.html. */
const frameSrc = (i: number) =>
  `frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

/**
 * Ports the original scroll-driven image-sequence canvas:
 * - all 90 frames preloaded, rendering boots as soon as frame 1 is ready
 * - scroll progress across the WHOLE page maps to frame index
 * - RAF loop lerps `current` toward `target` with exponential smoothing
 * - "cover" fit anchored to the top, DPR capped at 2
 * All mutable animation state lives in refs so React re-renders never
 * restart the loop; everything is torn down on unmount.
 */
export function useScrollSequence(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const reducedMotion = usePrefersReducedMotion();

  // Mutable animation state — deliberately outside React state.
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef(0);
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let disposed = false;
    let booted = false;

    const shownIndex = () =>
      Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(currentRef.current)));

    function render(): void {
      const { w, h, dpr } = sizeRef.current;
      const img = framesRef.current[shownIndex()];
      if (!img || !img.complete || !img.naturalWidth) return;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, w, h);
      // "Cover" fit, anchored to the top edge.
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx!.drawImage(img, (w - dw) / 2, 0, dw, dh);
    }

    function resize(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = {
        w: window.innerWidth,
        h: window.innerHeight,
        dpr,
      };
      canvas!.width = window.innerWidth * dpr;
      canvas!.height = window.innerHeight * dpr;
      render();
    }

    function tick(now: number): void {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = now;
      // Exponential smoothing toward the scroll target.
      currentRef.current +=
        (targetRef.current - currentRef.current) * (1 - Math.exp(-8 * dt));
      if (Math.abs(targetRef.current - currentRef.current) < 0.001) {
        currentRef.current = targetRef.current;
      }
      render();
      rafRef.current =
        currentRef.current !== targetRef.current
          ? requestAnimationFrame(tick)
          : null;
    }

    function onScroll(): void {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // Guard: short pages where scrollHeight - innerHeight === 0.
      const progress = max > 0 ? window.scrollY / max : 0;
      targetRef.current = progress * (FRAME_COUNT - 1);
      if (rafRef.current === null) {
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    function boot(): void {
      if (booted || disposed) return;
      booted = true;
      resize();
      onScroll();
      currentRef.current = targetRef.current;
      render();
    }

    // Preload all frames; errors are tolerated (a failed frame just never draws).
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => {
        if (disposed) return;
        if (!booted) boot(); // frame 1 (first to resolve) is enough to start
        // If the currently shown frame finished late, redraw it.
        if (booted && i - 1 === shownIndex()) render();
      };
      img.src = frameSrc(i);
      framesRef.current[i - 1] = img;
    }

    resize();
    onScroll();
    const bootTimer = window.setTimeout(boot, 1200); // fallback if events stall

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      disposed = true;
      window.clearTimeout(bootTimer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [canvasRef]);

  // Reduced motion: draw one static frame for the current scroll position and
  // never run the smoothing loop or scroll listener.
  useEffect(() => {
    if (!reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeStatic = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      const idx = Math.round(progress * (FRAME_COUNT - 1));
      const img = framesRef.current[idx];
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (img && img.complete && img.naturalWidth) {
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        ctx.drawImage(
          img,
          (w - img.naturalWidth * scale) / 2,
          0,
          img.naturalWidth * scale,
          img.naturalHeight * scale,
        );
      }
    };

    resizeStatic();
    window.addEventListener('resize', resizeStatic);
    return () => window.removeEventListener('resize', resizeStatic);
    // Preloads run in the main effect; static redraw on late loads isn't critical.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, canvasRef]);

  return reducedMotion;
}
