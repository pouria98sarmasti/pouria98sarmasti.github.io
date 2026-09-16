import { useCallback, useEffect, useState } from 'react';
import { ScrollSequenceBackground } from './components/ScrollSequenceBackground';
import { Veil } from './components/Veil';
import { Nav } from './components/Nav';
import { MobileMenu } from './components/MobileMenu';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ThemeProvider } from './hooks/useTheme';
import { LanguageProvider } from './i18n/LanguageContext';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Hash deep links: the browser's native anchor scroll fires before React
  // renders the sections, so land on the hash target ourselves after mount
  // and on manual hash edits (hash-only routing, no server rewrites needed).
  useEffect(() => {
    const scrollToHash = (): void => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      // 'instant' — deep links jump, they don't animate; also immune to the
      // smooth-scroll/layout race during initial load.
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    };
    scrollToHash();
    // Re-assert once layout settles (double-rAF) and again after full load
    // (fonts/images can shift section offsets late).
    requestAnimationFrame(() => requestAnimationFrame(scrollToHash));
    const t = window.setTimeout(scrollToHash, 200);
    window.addEventListener('load', scrollToHash);
    window.addEventListener('hashchange', scrollToHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('load', scrollToHash);
      window.removeEventListener('hashchange', scrollToHash);
    };
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScrollSequenceBackground />
        <Veil />

        <div className="relative z-2">
          <Nav onOpenMenu={() => setMenuOpen(true)} menuOpen={menuOpen} />
          <MobileMenu open={menuOpen} onClose={closeMenu} />

          <main>
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
