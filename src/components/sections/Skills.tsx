'use client';

import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';

type Skill = {
  _id: string;
  category: string;
  name: string;
  level: number;
};

export default function SkillsSection({ data }: { data: Skill[] }) {
  const categoriesList: { category: string; skills: Skill[] }[] = [];
  data.forEach((s) => {
    let cat = categoriesList.find((c) => c.category === s.category);
    if (!cat) {
      cat = { category: s.category, skills: [] };
      categoriesList.push(cat);
    }
    cat.skills.push(s);
  });

  if (categoriesList.length === 0) return null;

  return (
    <section id="skills" className="py-20 md:py-28 px-6 max-w-5xl mx-auto border-t border-border/40">
      <div className="flex flex-col gap-10">

        {/* Section Header */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Capabilities & Stack
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Technical Proficiency & Frameworks
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            Core technologies, programming languages, libraries, and tools I use to build scalable products.
          </p>
        </div>

        {/* Clean Bento Grid of Skill Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categoriesList.map(({ category, skills }, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 hover:border-foreground/20 hover:shadow-xs transition-all duration-300 flex flex-col gap-5"
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h3 className="font-bold text-base text-foreground">
                  {category}
                </h3>
                <span className="text-[11px] font-mono text-muted-foreground bg-secondary/80 px-2.5 py-0.5 rounded-full font-medium">
                  {skills.length} skills
                </span>
              </div>

              {/* Skill Pill Badges Grid */}
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <div
                    key={s._id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/60 hover:bg-secondary hover:border-foreground/20 transition-all text-xs font-sans group/skill"
                  >
                    <span className="font-medium text-foreground/90">{s.name}</span>
                    {s.level > 0 && (
                      <span className="text-[10px] font-mono text-muted-foreground bg-background/60 px-1.5 py-0.5 rounded-md border border-border/40">
                        {s.level}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
