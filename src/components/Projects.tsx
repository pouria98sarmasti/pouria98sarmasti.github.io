import { ProjectCard } from './ProjectCard';
import { Reveal } from './Reveal';
import { useLanguage } from '../i18n/LanguageContext';

/**
 * Card grid: 1 column on mobile → 2 at md → 3 at lg. `items-stretch` +
 * flex column cards keep repo links aligned at the bottom within each row.
 * Project content comes from the active language dictionary.
 */
export function Projects() {
  const { t } = useLanguage();
  const p = t.projects;

  return (
    <section id="projects" className="relative flex min-h-screen flex-col justify-center px-6 py-24 sm:px-10 lg:px-[8vw]">
      <Reveal>
        <div className="kicker">{p.kicker}</div>
        <h2 className="mb-10 text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {p.title}
        </h2>
      </Reveal>
      <Reveal>
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
          {p.items.map((project) => (
            <ProjectCard key={project.id} project={project} viewRepoLabel={p.viewRepo} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
