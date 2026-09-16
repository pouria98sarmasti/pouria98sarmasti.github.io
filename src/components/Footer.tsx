import { useLanguage } from '../i18n/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative z-2 flex flex-wrap items-center justify-between gap-4 border-t border-hairline px-6 pb-10 pt-8 text-sm text-fg-faint sm:px-10 lg:px-[8vw]">
      <span>{t.footer.rights}</span>
      <span>{t.footer.role}</span>
    </footer>
  );
}
