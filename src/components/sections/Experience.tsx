'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export type ExperienceItem = {
  _id: string;
  role: string;
  company: string;
  companyUrl?: string;
  duration: string;
  description: string;
  tags: string[];
  links?: { label: string; url: string }[];
  order: number;
};

export default function ExperienceSection({ data }: { data: ExperienceItem[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section id="experience" className="py-24 md:py-36 bg-background px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">Experience</h2>
            <div className="border-b border-dashed border-foreground/20 my-6" />
            <p className="font-mono text-xs leading-relaxed text-foreground/60 uppercase tracking-widest">
              A timeline of my professional career, software engineering roles, and technical contributions.
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-foreground/10 lg:border-0 lg:pt-0">
            <Link
              href="/experience"
              className="inline-block bg-foreground text-background hover:bg-foreground/80 rounded-full font-mono text-xs uppercase tracking-widest px-8 py-3.5 transition-all text-center w-full sm:w-auto"
            >
              View Full Timeline →
            </Link>
          </div>
        </div>

        {/* Right Column: Timeline Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {data.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative border border-transparent rounded-[24px] p-6 md:p-8 hover:bg-card/40 hover:border-border hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              {/* Layout: Date on left, details on right for wide screens */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                
                {/* Duration */}
                <div className="md:col-span-3">
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-foreground/45 font-semibold block pt-1">
                    {item.duration}
                  </span>
                </div>

                {/* Details */}
                <div className="md:col-span-9 flex flex-col">
                  {/* Job Title & Company Name */}
                  <h3 className="font-serif text-xl font-bold text-foreground leading-snug">
                    {item.companyUrl ? (
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-foreground group-hover:text-primary transition-colors cursor-pointer"
                      >
                        <span>{item.role}</span>
                        <span className="text-foreground/30 font-normal font-sans">·</span>
                        <span>{item.company}</span>
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 text-sm sm:text-base">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <span>{item.role}</span>
                        <span className="text-foreground/30 font-normal font-sans">·</span>
                        <span className="text-foreground/85">{item.company}</span>
                      </span>
                    )}
                  </h3>

                  {/* Job Description */}
                  <p className="mt-3 text-xs sm:text-sm text-foreground/65 leading-relaxed font-sans whitespace-pre-wrap">
                    {item.description}
                  </p>

                  {/* Associated Project / External Links */}
                  {item.links && item.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {item.links.map((link, lIdx) => (
                        <a
                          key={lIdx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-foreground/60 hover:text-foreground hover:underline transition-colors"
                        >
                          <svg
                            className="w-3.5 h-3.5 opacity-60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Skills / Tech Badge Pills */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-foreground/[0.04] dark:bg-foreground/[0.06] border border-foreground/[0.06] hover:bg-foreground/[0.08] text-foreground/80 font-mono text-[10px] font-semibold tracking-wider px-3 py-1 rounded-full transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
