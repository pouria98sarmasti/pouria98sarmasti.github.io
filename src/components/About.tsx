import { Reveal } from './Reveal';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * About — the background frame at this scroll depth is bright (light suit),
 * so text sits on a radial scrim for guaranteed 4.5:1+ contrast regardless
 * of frame. Fact cards reuse the project-card hover treatment
 * (accent border + lift + shared shadow token) for cross-section consistency.
 */
export function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col justify-center px-6 pb-16 pt-24 sm:px-10 lg:px-[8vw]"
    >
      {/* Readability scrim — sits behind text, above the canvas/veil.
          Light theme uses a white scrim instead of black; in RTL the gradient
          mirrors so the dark side stays behind the text column. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 start-0 w-full bg-gradient-to-r from-black/85 via-black/70 to-transparent light:from-white/90 light:via-white/75 rtl:bg-gradient-to-l lg:w-2/3"
      />

      <Reveal className="relative">
        <div className="kicker">{a.kicker}</div>
        <h2 className="mb-10 text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {a.titleLine1}
          <br />
          {a.titleLine2}
        </h2>
        <p className="max-w-[55ch] text-lg leading-normal text-fg sm:text-xl lg:text-2xl">
          {a.leadBefore}
          <b className="font-bold text-accent">{a.leadName}</b>
          {a.leadAfter}
        </p>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {a.facts.map((fact) => (
            <div
              key={fact.title}
              className="rounded-2xl border border-hairline bg-surface/80 p-6 backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lift"
            >
              <h3 className="mb-2 text-base font-bold text-fg">{fact.title}</h3>
              <p className="text-sm leading-relaxed text-fg-muted">{fact.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
