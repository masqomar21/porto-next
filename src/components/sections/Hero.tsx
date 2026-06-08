"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DynamicIcon } from "@/components/ui/dynamic-icon";

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
    : ["Full-Stack Developer", "UI/UX Designer"];
  let displaySkills =
    skills.length > 0
      ? skills
      : [
          { name: "REACT" },
          { name: "NEXT.JS" },
          { name: "TYPESCRIPT" },
          { name: "TAILWIND" },
          { name: "MONGODB" },
        ];
  displaySkills = displaySkills.slice(0, 10);
  const displaySocials =
    socialLinks.length > 0
      ? socialLinks
      : [
          { platform: "GITHUB", url: "https://github.com", icon: "github" },
          {
            platform: "LINKEDIN",
            url: "https://linkedin.com",
            icon: "linkedin",
          },
          { platform: "TWITTER", url: "https://twitter.com", icon: "twitter" },
        ];

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background px-6 md:px-12 py-32"
    >
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(226,232,228,0.4)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(28,28,28,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(28,28,28,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        {/* Left Column: Follow Me Vertical Links */}
        <div className="lg:col-span-2 flex lg:flex-col items-center gap-6 justify-center lg:justify-start lg:pt-10">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-foreground/40 [writing-mode:vertical-lr] rotate-180 hidden lg:inline-block">
            FOLLOW ME
          </span>
          <div className="hidden lg:block w-[1px] h-12 bg-foreground/20" />
          <div className="flex lg:flex-col gap-4 font-mono text-[11px] uppercase tracking-wider text-foreground/60">
            {displaySocials.map((l) => (
              <a
                key={l.platform}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground hover:underline flex items-center gap-1.5 transition-all"
              >
                <DynamicIcon name={l.icon} className="w-3.5 h-3.5" />
                {l.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Center Column: Portrait, Name & Subtitle */}
        <div className="lg:col-span-6 flex flex-col items-center text-center">
          {/* Circular Avatar with Pastel Offset Backdrop */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 mb-8 group">
            <div className="absolute -inset-2 bg-pastel-pink rounded-full translate-x-2 translate-y-2 transition-transform group-hover:translate-x-1 group-hover:translate-y-1 duration-300" />
            <div className="w-full h-full rounded-full bg-foreground text-background flex items-center justify-center font-serif italic text-5xl border border-foreground/10 relative z-10 overflow-hidden shadow-inner">
              {data.imageUrl ? (
                <img
                  src={data.imageUrl}
                  alt={data.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : data.name ? (
                data.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              ) : (
                "EL"
              )}
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-4"
          >
            {data.name || "Emma Lesley"}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs md:text-sm uppercase tracking-widest text-foreground/60 flex items-center gap-2 mb-8"
          >
            <span>//</span>
            <span>{roles.join(" & ")}</span>
            <span>//</span>
          </motion.div>

          {/* Tools Grid / Horizontal row */}
          <div className="flex gap-4 items-center justify-center flex-wrap opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            {displaySkills.map((skill, index) => (
              <span
                key={skill._id || index}
                className="font-mono text-[10px] tracking-wider uppercase border border-foreground/20 px-2.5 py-1 rounded"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Tagline & Circle Arrow Button */}
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 md:pl-8">
          <div className="font-mono text-sm leading-relaxed text-foreground/80 max-w-sm border-l-2 border-pastel-teal pl-4 py-1">
            {data.tagline ||
              "I build fast, beautiful, and highly scalable web applications, designing interfaces that feel alive and responsive."}
          </div>

          <div className="flex flex-col items-center lg:items-start gap-2 group mt-2">
            <Link
              href={data.ctaPrimaryUrl || "#projects"}
              className="w-16 h-16 rounded-full border border-foreground text-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <span className="text-2xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300">
                ↗
              </span>
            </Link>
            <Link
              href={data.ctaPrimaryUrl || "#projects"}
              className="font-mono text-[11px] uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
            >
              {data.ctaPrimaryLabel || "VIEW WORKS"}
            </Link>
          </div>
          <div className="flex flex-col items-center lg:items-start gap-2 group mt-2">
            <Link
              href={data.ctaSecondaryUrl || "/blog"}
              className="w-16 h-16 rounded-full border border-foreground text-foreground flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300"
            >
              <span className="text-2xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-300">
                ↗
              </span>
            </Link>
            <Link
              href={data.ctaSecondaryUrl || "#blog"}
              className="font-mono text-[11px] uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
            >
              {data.ctaSecondaryLabel || "VIEW BLOG"}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative dashed lines or borders */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
