'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Send, MessageSquare, ArrowUpRight } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/dynamic-icon';

type ContactData = {
  email?: string;
  socialLinks?: { platform: string; url: string; icon: string }[];
};

export default function ContactSection({ data }: { data: ContactData }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setToast({ type: 'success', msg: "Message sent! I'll get back to you soon." });
        setForm({ name: '', email: '', message: '' });
      } else {
        setToast({ type: 'error', msg: 'Failed to send. Please try again.' });
      }
    } catch {
      setToast({ type: 'error', msg: 'Network error.' });
    } finally {
      setSending(false);
      setTimeout(() => setToast(null), 5000);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 px-6 max-w-5xl mx-auto border-t border-border/40">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Left Column: Direct Info & Social Bento Card (5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Collaboration
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
              Let’s build something exceptional together.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1">
              Currently available for consulting, freelance software projects, and high-impact engineering roles.
            </p>
          </div>

          {/* Email Bento Tile */}
          {data.email && (
            <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col gap-1.5 shadow-2xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Direct Contact
              </span>
              <a
                href={`mailto:${data.email}`}
                className="text-sm font-bold font-mono text-foreground hover:underline flex items-center gap-1.5"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>{data.email}</span>
              </a>
            </div>
          )}

          {/* Social Links Bento Tile */}
          {data.socialLinks && data.socialLinks.length > 0 && (
            <div className="p-5 rounded-3xl bg-card border border-border/80 flex flex-col gap-3 shadow-2xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Online Profiles
              </span>
              <div className="flex flex-wrap gap-2">
                {data.socialLinks.map((s) => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-full border border-border/60 bg-secondary/60 hover:bg-secondary text-foreground text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    <DynamicIcon name={s.icon} className="w-3.5 h-3.5" />
                    <span>{s.platform}</span>
                    <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Form Bento Card (7 cols) */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="md:col-span-7 p-7 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xs flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground">Your Name</label>
              <Input
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="John Doe"
                required
                className="bg-background/60 border-border/70 rounded-xl px-4 py-2.5 text-xs font-sans text-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono font-medium text-muted-foreground">Email Address</label>
              <Input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="john@example.com"
                required
                className="bg-background/60 border-border/70 rounded-xl px-4 py-2.5 text-xs font-sans text-foreground"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono font-medium text-muted-foreground">Message / Project Scope</label>
            <Textarea
              value={form.message}
              onChange={e => set('message', e.target.value)}
              placeholder="Tell me about your timeline, ideas, or goals..."
              rows={4}
              required
              className="bg-background/60 border-border/70 rounded-xl px-4 py-3 text-xs font-sans text-foreground resize-none min-h-[110px]"
            />
          </div>

          {toast && (
            <div className={`p-3.5 rounded-xl text-xs font-mono border ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}>
              {toast.msg}
            </div>
          )}

          <Button
            type="submit"
            disabled={sending}
            className="w-fit px-6 py-2.5 bg-foreground text-background hover:opacity-90 rounded-full font-mono text-xs font-medium transition-opacity disabled:opacity-50 inline-flex items-center gap-2 self-start mt-2"
          >
            <span>{sending ? 'Sending…' : 'Send Message'}</span>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </motion.form>

      </div>
    </section>
  );
}
