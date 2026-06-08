'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  if (categoriesList.length === 0) return null;

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  // Pastel accent colors for dot indicators
  const colors = [
    'bg-pastel-pink',
    'bg-pastel-teal',
    'bg-pastel-blue',
  ];

  return (
    <section id="skills" className="py-24 md:py-36 bg-background px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-4">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground tracking-tight">Main Skills</h2>
          <div className="border-b border-dashed border-foreground/20 my-6" />
          <p className="font-mono text-xs leading-relaxed text-foreground/60 uppercase tracking-widest">
            A visual overview of technical expertise and tools integrated into my development workflow.
          </p>
        </div>

        {/* Right Column: Grouped Skills with Dot Indicators */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          {categoriesList.map(({ category, skills }, catIdx) => {
            const dotColor = colors[catIdx % colors.length];
            const isExpanded = !!expandedCategories[category];
            const hasMore = skills.length > 3;
            const visibleSkills = hasMore ? skills.slice(0, 3) : skills;
            const extraSkills = hasMore ? skills.slice(3) : [];

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-foreground/10 rounded-[24px] p-8 bg-background relative group"
              >
                {/* Dashed absolute border offsets */}
                <div className="absolute -inset-[1px] border border-dashed border-foreground/20 rounded-[24px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <h3 className="font-serif italic text-2xl text-foreground mb-6 border-b border-foreground/10 pb-2">
                  {category}
                </h3>
                
                <div className="flex flex-col gap-5">
                  {visibleSkills.map((s) => {
                    const activeDots = Math.round((s.level / 100) * 10);
                    return (
                      <div key={s._id} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
                        <span className="sm:col-span-4 font-mono text-xs uppercase tracking-wider text-foreground font-semibold truncate">
                          {s.name}
                        </span>
                        
                        {/* Dot indicator container */}
                        <div className="sm:col-span-7 flex gap-2 items-center">
                          {Array.from({ length: 10 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full border border-foreground/10 transition-colors ${
                                i < activeDots ? dotColor : 'bg-foreground/5'
                              }`}
                            />
                          ))}
                        </div>

                        <span className="sm:col-span-1 font-mono text-xs text-foreground/40 text-right">
                          {s.level}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-5 pt-5 border-t border-dashed border-foreground/10 mt-5">
                        {extraSkills.map((s) => {
                          const activeDots = Math.round((s.level / 100) * 10);
                          return (
                            <div key={s._id} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
                              <span className="sm:col-span-4 font-mono text-xs uppercase tracking-wider text-foreground font-semibold truncate">
                                {s.name}
                              </span>
                              
                              {/* Dot indicator container */}
                              <div className="sm:col-span-7 flex gap-2 items-center">
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full border border-foreground/10 transition-colors ${
                                      i < activeDots ? dotColor : 'bg-foreground/5'
                                    }`}
                                  />
                                ))}
                              </div>

                              <span className="sm:col-span-1 font-mono text-xs text-foreground/40 text-right">
                                {s.level}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {hasMore && (
                  <button
                    onClick={() => toggleCategory(category)}
                    className="mt-6 flex items-center justify-between w-full font-mono text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors pt-4 border-t border-dashed border-foreground/15"
                  >
                    <span>{isExpanded ? 'Show Less' : `Show ${extraSkills.length} More ${extraSkills.length === 1 ? 'Skill' : 'Skills'}`}</span>
                    <motion.svg
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4 h-4 text-foreground/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </motion.svg>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
