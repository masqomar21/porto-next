"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { ArrowUpRight, Sparkles, MapPin, Code2 } from "lucide-react";

type HeroData = {
  name?: string;
  roles?: string[];
  tagline?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  imageUrl?: string;
};

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Skill {
  _id?: string;
  name: string;
  level?: number;
}

export default function HeroSection({
  data,
  socialLinks = [],
  skills = [],
}: {
  data: HeroData;
  socialLinks?: SocialLink[];
  skills?: Skill[];
}) {
  const roles = data.roles?.length
    ? data.roles
    : ["Full-Stack Engineer", "UI/UX Designer"];
  const displaySkills = skills.slice(0, 8);
  const displaySocials =
    socialLinks.length > 0
      ? socialLinks
      : [
          { platform: "GitHub", url: "https://github.com", icon: "github" },
          { platform: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
          { platform: "Twitter", url: "https://twitter.com", icon: "twitter" },
        ];

  return (
    <section
      id="hero"
      className="pt-28 pb-16 md:pt-36 md:pb-24 px-6 max-w-5xl mx-auto relative overflow-hidden"
    >
      {/* Background Soft Ambient Light Blobs */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[300px] bg-pastel-teal/15 dark:bg-pastel-teal/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[400px] h-[280px] bg-pastel-pink/15 dark:bg-pastel-pink/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-[500px] h-[250px] bg-pastel-blue/15 dark:bg-pastel-blue/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Main Bento Hero Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 relative z-10">

        {/* Main Card: Profile + Headline (8 cols on desktop, order-2 on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1 md:col-span-8 p-7 md:p-9 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between gap-6"
        >
          <div className="flex flex-col gap-4">
            {/* Status indicator pill */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/60 text-xs font-mono text-muted-foreground w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available for new projects</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Building modern web products with precision & craft.
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-sans">
              {data.tagline ||
                "Full-stack engineer specialized in creating high-performance interfaces, scalable backends, and intuitive user experiences."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={data.ctaPrimaryUrl || "#projects"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-mono text-xs font-medium hover:opacity-90 transition-opacity shadow-xs"
            >
              <span>{data.ctaPrimaryLabel || "Explore Works"}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={data.ctaSecondaryUrl || "#contact"}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-secondary text-foreground font-mono text-xs font-medium transition-colors"
            >
              <span>{data.ctaSecondaryLabel || "Get in Touch"}</span>
            </Link>
          </div>
        </motion.div>

        {/* Side Card: Portrait + Quick Info (4 cols on desktop, order-1 on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 md:order-2 md:col-span-4 p-6 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col justify-between items-center text-center gap-6"
        >
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-border shadow-xs bg-muted/30">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={data.name || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-2xl text-muted-foreground bg-secondary/50">
                MQ
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <h2 className="font-bold text-lg text-foreground">
              {data.name || "Muhammad Qomarudin"}
            </h2>
            <p className="text-xs font-mono text-muted-foreground">
              {roles[0] || "Full-Stack Developer"}
            </p>
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-muted-foreground/70 mt-1">
              <MapPin className="w-3 h-3" />
              <span>Indonesia / Worldwide</span>
            </div>
          </div>

          {/* Social Icons Bar */}
          <div className="flex items-center gap-2 w-full justify-center pt-3 border-t border-border/60">
            {displaySocials.map((s) => (
              <a
                key={s.platform}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl border border-border/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title={s.platform}
              >
                <DynamicIcon name={s.icon} className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bottom Banner: Tech Stack Strip (12 cols, order-3) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="order-3 md:order-3 md:col-span-12 px-6 py-4 rounded-2xl bg-card/60 border border-border/70 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <Code2 className="w-4 h-4 text-primary" />
            <span className="font-semibold uppercase tracking-wider">Primary Stack</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {displaySkills.map((skill, index) => (
              <span
                key={skill._id || index}
                className="text-xs font-mono px-3 py-1 rounded-lg bg-secondary/70 border border-border/50 text-foreground/80"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
