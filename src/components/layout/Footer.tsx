import Link from 'next/link';
import { DynamicIcon } from '@/components/ui/dynamic-icon';

export default function Footer({ contactData }: { contactData: { email?: string; socialLinks?: { platform: string; url: string; icon: string }[] } }) {
  return (
    <footer className="bg-alabaster border-t border-dashed border-charcoal/15 py-16 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Large Serif CTA */}
        <h3 className="font-serif italic font-bold text-3xl md:text-5xl text-charcoal mb-10 text-center max-w-2xl leading-tight">
          Hire Me for Your Next Big Project!
        </h3>

        {/* Navigation & Socials Row */}
        <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center font-mono text-xs uppercase tracking-widest text-charcoal/60 mb-12">
          <Link href="#about" className="hover:text-charcoal transition-all">ABOUT</Link>
          <Link href="#skills" className="hover:text-charcoal transition-all">SKILLS</Link>
          <Link href="#projects" className="hover:text-charcoal transition-all">PROJECTS</Link>
          <Link href="#contact" className="hover:text-charcoal transition-all">CONTACT</Link>
          
          {contactData?.socialLinks?.map(l => (
            <a
              key={l.platform}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-charcoal hover:underline flex items-center gap-1.5 transition-all"
            >
              <DynamicIcon name={l.icon} className="w-3.5 h-3.5" />
              {l.platform}
            </a>
          ))}
        </div>

        {/* Bottom copyright */}
        <div className="w-full border-t border-dashed border-charcoal/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-[10px] text-charcoal/40 uppercase tracking-widest">
            © {new Date().getFullYear()} · All rights reserved.
          </p>
          <p className="font-mono text-[10px] text-charcoal/40 uppercase tracking-widest">
            Built with Next.js & Tailwind · <Link href="/admin" className="underline hover:text-charcoal transition-colors">Admin Panel</Link>
          </p>
        </div>

      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-charcoal/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-charcoal/10 pointer-events-none" />
    </footer>
  );
}
