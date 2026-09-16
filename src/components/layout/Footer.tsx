import { ArrowUp } from 'lucide-react';

export default function Footer({
  contactData: _,
}: {
  contactData?: {
    email?: string;
    socialLinks?: { platform: string; url: string; icon: string }[];
  };
}) {
  return (
    <footer className="border-t border-border/40 py-12 px-6 max-w-5xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
        <p>© {new Date().getFullYear()} Muhammad Qomarudin. All rights reserved.</p>
        <a
          href="#hero"
          className="hover:text-foreground transition-colors inline-flex items-center gap-1"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </a>
      </div>
    </footer>
  );
}
