/** Smoothly scrolls to a hash anchor and moves keyboard focus there. */
export function scrollToHash(
  hash: string,
  // Structural type: accepts both React synthetic and native mouse events.
  event?: { preventDefault(): void },
): void {
  const id = hash.replace(/^#/, '');
  const el = document.getElementById(id);
  if (!el) return;

  event?.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Update focus without scrolling again — keeps keyboard users oriented.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  // Keep the URL hash consistent (anchor fallback for no-JS is preserved
  // because href stays a plain #hash link).
  if (event) window.history.replaceState(null, '', hash);
}
