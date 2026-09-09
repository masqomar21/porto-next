'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, ArrowUpRight } from 'lucide-react';

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
    <section id="experience" className="py-20 md:py-28 px-6 max-w-5xl mx-auto border-t border-border/40">
      <div className="flex flex-col gap-10">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Career Journey
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
              Work Experience & Roles
            </h2>
          </div>
          <Link
            href="/experience"
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
          >
            <span>Full timeline</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Bento Timeline Stack */}
        <div className="flex flex-col gap-4">
          {data.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.4 }}
              className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 hover:border-foreground/20 hover:shadow-xs transition-all duration-300 flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              {/* Left Column: Role + Company */}
              <div className="flex flex-col gap-1.5 md:w-1/3">
                <span className="text-xs font-mono text-muted-foreground font-medium">
                  {item.duration}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  {item.role}
                </h3>
                {item.companyUrl ? (
                  <a
                    href={item.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1 w-fit"
                  >
                    <span>{item.company}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs font-mono text-muted-foreground">{item.company}</span>
                )}
              </div>

              {/* Right Column: Description + Tech Badges */}
              <div className="flex flex-col gap-4 md:w-2/3">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-secondary/80 text-foreground/80 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
