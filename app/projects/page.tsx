import { Github, ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/data";

export default function ProjectsPage() {
  const projects = PROJECTS.slice(0, 2);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* First two projects */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group border border-border hover:border-accent/40 bg-surface/30 rounded-sm p-6 transition-all duration-300 hover:bg-surface/70 flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  {project.featured && (
                    <span className="font-mono text-[10px] text-accent border border-accent/30 px-1.5 py-0.5 rounded-sm">
                      featured
                    </span>
                  )}
                  <span className="font-mono text-xs text-text-muted">
                    {project.year}
                  </span>
                </div>
                <span className="text-xs text-text-muted border border-border px-2 py-0.5 rounded-sm">
                  {project.category}
                </span>
              </div>

              <h3 className="font-display text-2xl font-semibold text-text-primary mb-3 group-hover:text-accent transition-colors">
                {project.title}
              </h3>

              <p className="text-base text-text-muted leading-relaxed flex-1 mb-5">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs text-text-muted bg-border/50 px-2 py-0.5 rounded-sm"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 5 && (
                  <span className="font-mono text-xs text-text-muted px-1">
                    +{project.tech.length - 5}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                  >
                    <Github size={13} />
                    Code
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                  >
                    <ExternalLink size={13} />
                    Live
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
