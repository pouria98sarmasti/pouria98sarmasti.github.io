import { scrollToHash } from './scrollToHash';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from '../hooks/useTheme';

/**
 * Hero — layout follows the user's reference: "Hi, I'm" + name on the left,
 * the role as oversized display text anchored bottom-right, two action pills
 * under the lead, capability chips, and a scroll cue labelled "Scroll down".
 * Directional utilities use logical props (text-end, end-*) so the layout
 * mirrors automatically under dir=rtl.
 */
export function Hero() {
  const { t } = useLanguage();
  const { resolved } = useTheme();
  const h = t.hero;

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-center px-6 pb-28 pt-28 sm:px-10 lg:px-[8vw]"
    >
      {/* Left column: greeting, name, lead, actions, chips */}
      <div className="relative max-w-xl">
        {/* Readability scrim — bright canvas frames sit behind this column.
            Light theme swaps the black scrim for a white one; in RTL the
            gradient mirrors (dark side behind the text column on the right). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -inset-y-8 -z-10 rounded-3xl bg-gradient-to-r from-black/70 via-black/50 to-transparent light:from-white/85 light:via-white/60 rtl:bg-gradient-to-l"
        />
        <p className="mb-1 text-2xl font-bold sm:text-3xl">{h.greeting}</p>
        <h1 className="text-[clamp(3rem,9vw,6.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em]">
          <span className="block text-accent">{h.nameLine1}</span>
          <span className="block">{h.nameLine2}</span>
        </h1>
        {/* Lead color is theme-state-driven (inline style, not a utility) so it
            stays readable no matter what stylesheet state is served: white in
            dark mode, near-black in light. Values mirror the --color-fg tokens. */}
        <p
          style={{ color: resolved === 'light' ? '#131316' : '#ffffff' }}
          className="mt-6 max-w-[44ch] text-sm leading-relaxed sm:text-base"
        >
          {h.lead}
        </p>

        {/* Action pills — 44px touch targets per the skill's touch rule */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          {/* TODO: replace public/Pouria-Sarmasti-CV.pdf with the real CV.
              Served next to index.html at the user-page root, so a plain
              relative URL resolves correctly. */}
          <a
            href="Pouria-Sarmasti-CV.pdf"
            download="Pouria-Sarmasti-CV.pdf"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-hairline bg-surface/70 px-6 py-2.5 text-sm font-semibold text-fg no-underline backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M8 1v9m0 0L4.5 6.5M8 10l3.5-3.5M2 13.5h12"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {h.downloadCV}
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollToHash('#projects');
            }}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-hairline px-6 py-2.5 text-sm font-semibold text-fg no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
              <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
              <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            {h.viewProjects}
          </a>
        </div>

        {/* Capability chips — glassmorphism token card */}
        <div className="mt-10 rounded-2xl border border-hairline bg-surface/70 p-5 backdrop-blur-md">
          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {h.tags.map((tag) => (
              <li key={tag.num} className="flex items-baseline gap-2 text-sm font-semibold">
                <span className="font-bold text-accent">{tag.num}</span>
                <span>{tag.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Role — oversized display text anchored bottom-end (decorative echo
          of the H1's content; hidden from AT to avoid duplicate headings) */}
      <p
        aria-hidden="true"
        className="pointer-events-none mt-14 text-end text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold uppercase leading-[0.95] tracking-tight lg:absolute lg:bottom-28 lg:end-[8vw] lg:mt-0"
      >
        <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-accent sm:text-base">
          {h.roleKicker}
        </span>
        {h.roleLine1}
        <br />
        {h.roleLine2}
      </p>

      {/* Scroll cue + label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="flex h-12 w-7 items-start justify-center rounded-full border border-hairline pt-2">
          <span className="scroll-cue-dot block h-2 w-2 rounded-full bg-accent" />
        </span>
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-fg-faint">
          {h.scrollDown}
        </span>
      </div>
    </section>
  );
}
