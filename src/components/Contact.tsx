import { SOCIALS } from '../data/socials';
import { Reveal } from './Reveal';
import { ContactForm } from './ContactForm';
import { useLanguage } from '../i18n/LanguageContext';

const EXTERNAL_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
} as const;

/**
 * Contact — when navigated to (Get in touch / #contact), the section top
 * aligns with the viewport top, so the top padding defines where content
 * appears: ~55% of the viewport height = neck level of the full-body frame
 * in the background sequence, on any device size.
 * Email is intentionally smaller (clamp ≤ 2.6rem) — readable, not shouty.
 *
 * Layout follows the user's reference: info column (heading + email +
 * socials) beside a form column. The form wrapper is transparent with NO
 * backdrop-blur — it sits directly on the site background per the owner's
 * request; readable contrast comes from the inputs' solid surface fill.
 * Under dir=rtl the two columns mirror automatically (info right, form left).
 */
export function Contact() {
  const { t } = useLanguage();
  const c = t.contact;

  const SOCIAL_LINKS = [
    { label: 'LinkedIn', href: SOCIALS.linkedin, num: '01' },
    { label: 'GitHub', href: SOCIALS.github, num: '02' },
  ];

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-start px-6 pb-24 pt-[55vh] sm:px-10 lg:px-[8vw]"
    >
      <Reveal>
        <div className="kicker">{c.kicker}</div>
        <h2 className="mb-8 max-w-[16ch] text-3xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-4xl lg:text-5xl">
          {c.title}
        </h2>

        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          {/* Info column — email, intro, socials */}
          <div>
            <p className="max-w-[45ch] text-sm leading-relaxed text-fg-muted sm:text-base">
              {c.intro}
            </p>

            {/* Email link — compact size, break-all keeps it inside 320px */}
            <p className="mt-6 break-all text-[clamp(1.4rem,4.5vw,2.6rem)] font-extrabold leading-tight tracking-tight">
              <a
                href={`mailto:${SOCIALS.email}`}
                aria-label={`${c.emailAriaLabel} ${SOCIALS.email}`}
                className="border-b-2 border-accent text-fg no-underline transition-colors hover:text-accent"
              >
                {SOCIALS.email}
              </a>
            </p>

            {/* Social row — numbered, card-like tappable links */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  {...EXTERNAL_PROPS}
                  className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-hairline bg-surface/70 py-2.5 pe-5 ps-4 text-sm font-semibold text-fg no-underline backdrop-blur-md transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  <span className="text-xs font-bold text-accent">{social.num}</span>
                  {social.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
              <span className="text-sm text-fg-faint">{c.location}</span>
            </div>
          </div>

          {/* Form column — transparent wrapper, no blur, directly on background */}
          <div className="rounded-3xl border border-hairline p-6 sm:p-8">
            <h3 className="mb-6 text-xl font-extrabold tracking-tight">{c.formHeading}</h3>
            <ContactForm />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
