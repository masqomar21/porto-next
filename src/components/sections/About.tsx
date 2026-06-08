'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

interface AboutProps {
  data: {
    bio?: string;
    photoUrl?: string;
    resumeUrl?: string;
  };
  name?: string;
  email?: string;
}

export default function AboutSection({ data, name, email }: AboutProps) {
  const details = [
    { label: 'NAME', value: name || 'Emma Lesley' },
    { label: 'EMAIL', value: email || 'hello@emmalesley.com' },
    { label: 'ROLE', value: 'Full-Stack Developer' },
    { label: 'STATUS', value: 'Available for Hire' },
    { label: 'LOCATION', value: 'Remote / Worldwide' },
  ];

  return (
    <section id="about" className="py-24 md:py-36 bg-background px-6 md:px-12 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground tracking-tight">Biography</h2>
          <div className="border-b border-dashed border-foreground/20 mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Monospace Key-Values */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div className="divide-y divide-foreground/10 font-mono text-xs text-foreground/85">
              {details.map((item) => (
                <div key={item.label} className="py-4 flex justify-between items-start gap-4">
                  <span className="text-foreground/40 font-bold tracking-widest">{item.label}</span>
                  <span className="text-right font-medium tracking-wide break-all">{item.value}</span>
                </div>
              ))}
            </div>

            {data.resumeUrl && (
              <div className="mt-8 pt-6 border-t border-foreground/10">
                <a
                  href={data.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-foreground text-background hover:bg-foreground/80 rounded-full font-mono text-xs uppercase tracking-widest px-8 py-3.5 transition-all text-center"
                >
                  Download CV
                </a>
              </div>
            )}
          </motion.div>

          {/* Right Column: Bio Paragraph and styled photo */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col md:flex-row gap-10 items-start"
          >
            {/* Styled Portrait Avatar with Offset Frame & Arched Top */}
            {data.photoUrl && (
              <div className="relative w-40 h-52 shrink-0 self-center md:self-start group">
                <div className="absolute -inset-2 bg-pastel-blue rounded-t-[50px] translate-x-2.5 translate-y-2.5 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5 duration-300" />
                <div
                  className="w-full h-full rounded-t-[50px] border border-foreground/10 relative z-10 bg-muted/40"
                  style={{
                    backgroundImage: `url(${data.photoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
            )}

            <div className="flex-1">
              <p className="font-mono text-sm leading-relaxed text-foreground/75 whitespace-pre-wrap">
                {data.bio || 'Your bio goes here. Edit it from the admin panel!'}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
