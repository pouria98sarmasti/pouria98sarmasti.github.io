import { useRef } from 'react';
import { useScrollSequence } from '../hooks/useScrollSequence';

/** Full-viewport canvas rendering the scroll-driven image sequence. */
export function ScrollSequenceBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useScrollSequence(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      // bg-canvas: dimmed via CSS in light mode so text keeps contrast.
      className="bg-canvas fixed inset-0 z-0 block h-full w-full"
    />
  );
}
