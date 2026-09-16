import type { ProjectEntry } from '../i18n/dictionaries';

interface ProjectCardProps {
  project: ProjectEntry;
  viewRepoLabel: string;
}

/**
 * Project card — redesigned for scannability:
 * - oversized ghost numeral (accent ghost) as a visual anchor, category pill top-right
 * - strict content hierarchy: title → description → divider → learnings
 * - flex column + mt-auto keeps the repo action pinned to the card bottom
 * - hover: accent border + lift with the shared shadow token; focus ring via
 *   the global :focus-visible rule
 * Logical props (end and pe utilities) keep the numeral gutter correct
 * under dir=rtl, and the marker flips direction in Persian.
 */
export function ProjectCard({ project, viewRepoLabel }: ProjectCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-hairline bg-surface/70 p-6 backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:border-accent hover:shadow-lift focus-within:border-accent sm:p-7">
      {/* Ghost numeral — decorative, tucked behind the header row */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-5 end-3 select-none text-8xl font-extrabold leading-none text-accent/10 transition-colors duration-200 group-hover:text-accent/25"
      >
        {project.index}
      </span>

      <div className="mb-5 flex items-center gap-3">
        <span className="text-xs font-bold text-accent">/{project.index}</span>
        <span className="rounded-full border border-hairline bg-base/60 px-3 py-1 text-xs font-medium text-fg-faint">
          {project.category}
        </span>
      </div>

      <h3 className="mb-2.5 pe-14 text-xl font-bold tracking-tight sm:text-[1.35rem]">
        {project.title}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-fg-muted">{project.description}</p>

      <ul className="flex flex-col gap-2.5 border-t border-hairline pt-5 text-sm text-fg-muted">
        {project.learnings.map((learning) => (
          <li key={learning} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-0.5 inline-block text-accent rtl:-scale-x-100">
              ▸
            </span>
            <span>{learning}</span>
          </li>
        ))}
      </ul>

      {/* Card action — button-styled link, pinned to the bottom so repo links align */}
      <a
        href={project.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm font-semibold text-fg no-underline transition-colors duration-200 hover:border-accent hover:text-accent"
      >
        {viewRepoLabel} <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}
