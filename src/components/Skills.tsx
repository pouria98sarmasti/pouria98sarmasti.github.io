import { Reveal } from './Reveal';
import { useLanguage } from '../i18n/LanguageContext';

export function Skills() {
  const { t } = useLanguage();
  const s = t.skills;

  return (
    <section
      id="skills"
      className="relative flex min-h-screen flex-col justify-center px-6 py-24 sm:px-10 lg:px-[8vw]"
    >
      <Reveal>
        <div className="kicker">{s.kicker}</div>
        <h2 className="mb-10 text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {s.title}
        </h2>

        {s.groups.map((group) => (
          <div key={group.group} className="mb-9 last:mb-0">
            <h3 className="mb-3 text-base font-bold text-fg sm:text-lg">
              {/* Marker flips under dir=rtl via the global rtl variant */}
              <span aria-hidden="true" className="me-2 inline-block text-accent rtl:-scale-x-100">
                ▸
              </span>
              {group.group}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  // Tech terms stay Latin even in Persian — enforce LTR so
                  // mixed-script chips (e.g. "CI/CD") never reorder.
                  dir="ltr"
                  className="rounded-full border border-hairline bg-surface/70 px-4 py-2 text-sm font-medium text-fg-muted backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-fg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
