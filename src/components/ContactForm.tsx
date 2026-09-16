import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { SOCIALS } from '../data/socials';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * ContactForm — layout follows the user's reference (Name / Email / Phone /
 * Website / Message pills + full-width Send button), but restyled to this site's
 * tokens: hairline borders, solid surface fills, accent focus, shared radius.
 *
 * Deliberate deviation from the reference's glassmorphism: per the owner's
 * request the form sits DIRECTLY on the site background — the wrapper is
 * transparent with no backdrop-blur, and inputs use a solid (opaque) surface
 * fill so text stays readable over bright canvas frames without any blur.
 * Another deviation: visible <label>s above each pill instead of
 * placeholder-only fields (ui-ux-pro-max form rule: every field needs a
 * real label, hint, and clear error message).
 *
 * Delivery: Web3Forms (POST https://api.web3forms.com/submit) — pure
 * client-side fetch, so it works on static GitHub Pages with no backend.
 * The key is read ONLY from `VITE_WEB3FORMS_KEY` (never hard-coded); when it
 * is missing the form explains itself and falls back to a mailto link.
 */

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = 'name' | 'email' | 'phone' | 'website' | 'message';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Required phone: optional leading +, 7–15 digits ignoring separators. */
function isValidPhone(raw: string): boolean {
  const v = raw.trim();
  if (!/^\+?[0-9][0-9\s\-().]{5,19}$/.test(v)) return false;
  return (v.replace(/\D/g, '').length ?? 0) >= 7 && v.replace(/\D/g, '').length <= 15;
}

function normalizeWebsite(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null; // optional — empty is valid
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const url = new URL(withProto);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'invalid';
    return withProto;
  } catch {
    return 'invalid';
  }
}

export function ContactForm() {
  const { t, lang } = useLanguage();
  const f = t.form;

  const [values, setValues] = useState({ name: '', email: '', phone: '', website: '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const summaryRef = useRef<HTMLDivElement | null>(null);

  // Env-only key: `VITE_WEB3FORMS_KEY` must be set in `.env` locally and as a
  // GitHub Actions secret (see README). Never commit the real key.
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
  const keyMissing = !accessKey || accessKey === 'TODO-replace-with-your-key';

  const set = (field: Field, value: string): void => {
    setValues((v) => ({ ...v, [field]: value }));
    // Clear a field's error as soon as the user starts fixing it.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const validate = (): Partial<Record<Field, string>> => {
    const next: Partial<Record<Field, string>> = {};
    if (!values.name.trim()) next.name = f.errRequiredName;
    const email = values.email.trim();
    if (!email) next.email = f.errRequiredEmail;
    else if (!EMAIL_RE.test(email)) next.email = f.errInvalidEmail;
    const phone = values.phone.trim();
    if (!phone) next.phone = f.errRequiredPhone;
    else if (!isValidPhone(phone)) next.phone = f.errInvalidPhone;
    if (normalizeWebsite(values.website) === 'invalid') next.website = f.errInvalidWebsite;
    if (values.message.trim().length < 10) next.message = f.errRequiredMessage;
    return next;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (status === 'sending') return;

    const found = validate();
    setErrors(found);
    const fields = Object.keys(found) as Field[];
    if (fields.length > 0) {
      // Multi-error rule: focus a linked error summary after submit.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setStatus('sending');
    try {
      const website = normalizeWebsite(values.website);
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Portfolio contact: ${values.name.trim()}`,
          from_name: values.name.trim(),
          replyto: values.email.trim(),
          name: values.name.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          website: typeof website === 'string' ? website : '',
          message: values.message.trim(),
          language: lang,
          botcheck: false,
        }),
      });
      const data = (await res.json()) as { success?: boolean };
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const reset = (): void => {
    setValues({ name: '', email: '', phone: '', website: '', message: '' });
    setErrors({});
    setStatus('idle');
  };

  /* ---------- terminal states ----------
     Panels use a SOLID surface fill (still no blur): the transparent form
     wrapper is unreadable behind these states over bright canvas frames. */

  if (status === 'success') {
    return (
      <div
        role="status"
        tabIndex={-1}
        className="flex flex-col items-start gap-4 rounded-3xl border border-hairline bg-surface p-8 sm:p-10"
      >
        <span
          aria-hidden="true"
          className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-xl text-accent"
        >
          ✓
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight text-fg">{f.successTitle}</h3>
        <p className="text-sm leading-relaxed text-fg-muted sm:text-base">{f.successMsg}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-hairline px-6 py-2.5 text-sm font-semibold text-fg transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          {f.sendAnother}
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div
        role="alert"
        tabIndex={-1}
        className="flex flex-col items-start gap-4 rounded-3xl border border-hairline bg-surface p-8 sm:p-10"
      >
        <span
          aria-hidden="true"
          className="grid h-12 w-12 place-items-center rounded-full bg-red-500/15 text-xl text-red-400 light:text-red-700"
        >
          !
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight text-fg">{f.failTitle}</h3>
        <p className="text-sm leading-relaxed text-fg-muted sm:text-base">{f.failMsg}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setStatus('idle')}
            className="btn-primary inline-flex min-h-11 cursor-pointer items-center rounded-full px-6 py-2.5 text-sm font-bold"
          >
            {f.retry}
          </button>
          <a
            href={`mailto:${SOCIALS.email}`}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-hairline px-6 py-2.5 text-sm font-semibold text-fg no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
          >
            {f.emailMe}
          </a>
        </div>
      </div>
    );
  }

  /* ---------- form ---------- */

  const errorFields = (Object.keys(errors) as Field[]).filter((k) => errors[k]);

  const inputClass = (field: Field, rounded: string): string =>
    `w-full ${rounded} border bg-surface px-5 py-3.5 text-[0.95rem] text-fg transition-colors duration-200 placeholder:text-fg-faint focus:outline-none focus:ring-2 focus:ring-accent/30 ${
      errors[field]
        ? 'border-red-400 light:border-red-700'
        : 'border-hairline hover:border-fg-faint focus:border-accent'
    }`;

  const labelClass = 'mb-2 block text-sm font-semibold text-fg';

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Error summary — focused on failed submit, links jump to each field */}
      {errorFields.length > 0 && (
        <div
          ref={summaryRef}
          role="alert"
          tabIndex={-1}
          className="mb-6 rounded-2xl border border-red-400/60 bg-surface p-5 focus:outline-none light:border-red-700/50"
        >
          <p className="mb-2 text-sm font-bold text-red-400 light:text-red-700">{f.errorSummary}</p>
          <ul className="flex flex-col gap-1.5">
            {errorFields.map((field) => (
              <li key={field}>
                <a
                  href={`#contact-${field}`}
                  className="text-sm font-medium text-red-400 underline underline-offset-2 light:text-red-700"
                >
                  {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {f.nameLabel} <span aria-hidden="true" className="text-accent">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            placeholder={f.namePh}
            value={values.name}
            onChange={(e) => set('name', e.target.value)}
            disabled={status === 'sending'}
            className={inputClass('name', 'rounded-full')}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-2 text-sm font-medium text-red-400 light:text-red-700">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {f.emailLabel} <span aria-hidden="true" className="text-accent">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            dir="ltr"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            placeholder={f.emailPh}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
            disabled={status === 'sending'}
            className={inputClass('email', 'rounded-full')}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-2 text-sm font-medium text-red-400 light:text-red-700">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            {f.phoneLabel} <span aria-hidden="true" className="text-accent">*</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            dir="ltr"
            required
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            placeholder={f.phonePh}
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            disabled={status === 'sending'}
            className={inputClass('phone', 'rounded-full')}
          />
          {errors.phone && (
            <p id="contact-phone-error" className="mt-2 text-sm font-medium text-red-400 light:text-red-700">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-website" className={labelClass}>
            {f.websiteLabel}
          </label>
          <input
            id="contact-website"
            name="website"
            type="url"
            autoComplete="url"
            inputMode="url"
            dir="ltr"
            aria-invalid={Boolean(errors.website)}
            aria-describedby={errors.website ? 'contact-website-error' : undefined}
            placeholder={f.websitePh}
            value={values.website}
            onChange={(e) => set('website', e.target.value)}
            disabled={status === 'sending'}
            className={inputClass('website', 'rounded-full')}
          />
          {errors.website && (
            <p id="contact-website-error" className="mt-2 text-sm font-medium text-red-400 light:text-red-700">
              {errors.website}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className={labelClass}>
            {f.messageLabel} <span aria-hidden="true" className="text-accent">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            placeholder={f.messagePh}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            disabled={status === 'sending'}
            className={`${inputClass('message', 'rounded-3xl')} min-h-32 resize-y`}
          />
          {errors.message && (
            <p id="contact-message-error" className="mt-2 text-sm font-medium text-red-400 light:text-red-700">
              {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot — bots fill it, humans never see it (uncontrolled on purpose) */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <p className="text-xs text-fg-faint">{f.requiredNote}</p>

        <button
          type="submit"
          disabled={status === 'sending' || keyMissing}
          className="btn-primary inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-bold"
        >
          {status === 'sending' ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              />
              {f.sending}
            </>
          ) : (
            f.send
          )}
        </button>

        {/* Missing-key notice: honest empty state + direct-email fallback */}
        {keyMissing && (
          <p role="note" className="rounded-2xl border border-hairline bg-surface p-4 text-sm leading-relaxed text-fg-muted">
            {f.missingKeyMsg}{' '}
            <a
              href={`mailto:${SOCIALS.email}`}
              className="font-semibold text-accent no-underline hover:underline"
            >
              {SOCIALS.email}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}
