'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
    <section id="contact" className="py-24 md:py-36 bg-background px-6 md:px-12 relative border-t border-dashed border-foreground/15">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
        
        {/* Left Column: CTA Headline & Socials */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col justify-between"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 font-bold block mb-4">
              // LET'S COLLABORATE
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight text-foreground mb-6">
              Let's turn your creative ideas into stunning realities!
            </h2>
            <div className="border-b border-dashed border-foreground/20 my-6" />
          </div>

          <div className="flex flex-col gap-6">
            {data.email && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 font-bold block mb-1">
                  WRITE ME
                </span>
                <a
                  href={`mailto:${data.email}`}
                  className="font-mono text-sm font-bold text-foreground hover:underline"
                >
                  {data.email}
                </a>
              </div>
            )}
            
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 font-bold block mb-2">
                  STAY CONNECTED
                </span>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {data.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs uppercase tracking-wider text-foreground/60 hover:text-foreground hover:underline flex items-center gap-1.5 transition-all"
                    >
                      <DynamicIcon name={link.icon} className="w-3.5 h-3.5" />
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 flex flex-col gap-8 bg-background relative p-6 sm:p-10 border border-foreground/10 rounded-[24px]"
        >
          {/* Dashed outer border */}
          <div className="absolute -inset-[1px] border border-dashed border-foreground/20 rounded-[24px] pointer-events-none opacity-40" />

          <div className="flex flex-col gap-1.5 relative z-10">
            <label htmlFor="contact-name" className="font-mono text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
              Name
            </label>
            <Input
              id="contact-name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Your name"
              required
              className="bg-transparent border-0 border-b border-foreground/20 rounded-none px-0 pb-2 focus:ring-0 focus-visible:ring-0 focus-visible:border-foreground font-mono text-sm placeholder:text-foreground/30 text-foreground shadow-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative z-10">
            <label htmlFor="contact-email" className="font-mono text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
              Email Address
            </label>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="hello@domain.com"
              required
              className="bg-transparent border-0 border-b border-foreground/20 rounded-none px-0 pb-2 focus:ring-0 focus-visible:ring-0 focus-visible:border-foreground font-mono text-sm placeholder:text-foreground/30 text-foreground shadow-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 relative z-10">
            <label htmlFor="contact-message" className="font-mono text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
              Tell me about your project
            </label>
            <Textarea
              id="contact-message"
              value={form.message}
              onChange={e => set('message', e.target.value)}
              placeholder="Share the details..."
              rows={4}
              required
              className="bg-transparent border-0 border-b border-foreground/20 rounded-none px-0 pb-2 focus:ring-0 focus-visible:ring-0 focus-visible:border-foreground font-mono text-sm placeholder:text-foreground/30 text-foreground shadow-none resize-none min-h-[100px]"
            />
          </div>

          {toast && (
            <div className={`p-4 rounded-xl text-xs font-mono border relative z-10 ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                : 'bg-destructive/10 border-destructive/20 text-destructive'
            }`}>
              {toast.msg}
            </div>
          )}

          <Button
            type="submit"
            disabled={sending}
            className="w-full sm:w-fit px-8 py-3.5 bg-foreground text-background hover:opacity-90 rounded-full font-mono text-xs uppercase tracking-widest transition-all relative z-10 disabled:opacity-60 disabled:cursor-not-allowed shadow-none"
          >
            {sending ? 'Sending…' : 'Send Message'}
          </Button>
        </motion.form>
      </div>

      {/* Decorative dashed lines */}
      <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[1px] border-l border-dashed border-foreground/10 pointer-events-none" />
      <div className="absolute right-6 md:right-12 top-0 bottom-0 w-[1px] border-r border-dashed border-foreground/10 pointer-events-none" />
    </section>
  );
}
