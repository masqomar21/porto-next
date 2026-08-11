'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

type HeroData = {
  name: string;
  roles: string[];
  tagline: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  imageUrl: string;
};

export default function HeroAdminPage() {
  const [data, setData] = useState<HeroData>({
    name: '', roles: [], tagline: '',
    ctaPrimaryLabel: '', ctaPrimaryUrl: '',
    ctaSecondaryLabel: '', ctaSecondaryUrl: '',
    imageUrl: '',
  });
  const [roleInput, setRoleInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/hero')
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) {
          setData({
            name: d.name || '',
            roles: d.roles || [],
            tagline: d.tagline || '',
            ctaPrimaryLabel: d.ctaPrimaryLabel || '',
            ctaPrimaryUrl: d.ctaPrimaryUrl || '',
            ctaSecondaryLabel: d.ctaSecondaryLabel || '',
            ctaSecondaryUrl: d.ctaSecondaryUrl || '',
            imageUrl: d.imageUrl || '',
          });
        }
      })
      .catch(console.error);
  }, []);

  const addRole = () => {
    const trimmed = roleInput.trim();
    if (trimmed && !data.roles.includes(trimmed)) {
      setData((p) => ({ ...p, roles: [...p.roles, trimmed] }));
      setRoleInput('');
    }
  };

  const removeRole = (role: string) => {
    setData((p) => ({ ...p, roles: p.roles.filter((r) => r !== role) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        setToast({ type: 'success', msg: 'Hero section updated successfully!' });
      } else {
        setToast({ type: 'error', msg: result.error || 'Failed to update' });
      }
    } catch {
      setToast({ type: 'error', msg: 'Network error. Try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Hero Section</h1>
        <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">
          Manage the hero content of your homepage
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-card border border-border p-6 rounded-md shadow-xs">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">YOUR NAME</label>
          <Input
            value={data.name}
            onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">PROFILE IMAGE</label>
          <ImageUpload
            value={data.imageUrl}
            onChange={(url) => setData((p) => ({ ...p, imageUrl: url }))}
            allowedTypes={['image/png', 'image/jpeg', 'image/webp', 'image/gif']}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">TYPEWRITER ROLES</label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/40 border-0 border-b border-border/60 rounded-none min-h-[48px] items-center">
            {data.roles.map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-foreground text-background font-mono rounded-xs text-xs font-semibold">
                {r}
                <button type="button" onClick={() => removeRole(r)} className="hover:opacity-80 transition-opacity text-xs font-bold">✕</button>
              </span>
            ))}
            <input
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
              placeholder="Add role, press Enter…"
              className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-foreground min-w-[150px] placeholder:text-muted-foreground/50 placeholder:font-mono"
            />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground block mt-1">Press Enter to add each role. These cycle in the homepage typewriter animation.</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">TAGLINE</label>
          <Textarea
            value={data.tagline}
            onChange={(e) => setData((p) => ({ ...p, tagline: e.target.value }))}
            placeholder="Share the details..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">PRIMARY CTA LABEL</label>
            <Input
              value={data.ctaPrimaryLabel}
              onChange={(e) => setData((p) => ({ ...p, ctaPrimaryLabel: e.target.value }))}
              placeholder="View Projects"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">PRIMARY CTA URL</label>
            <Input
              value={data.ctaPrimaryUrl}
              onChange={(e) => setData((p) => ({ ...p, ctaPrimaryUrl: e.target.value }))}
              placeholder="#projects"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">SECONDARY CTA LABEL</label>
            <Input
              value={data.ctaSecondaryLabel}
              onChange={(e) => setData((p) => ({ ...p, ctaSecondaryLabel: e.target.value }))}
              placeholder="Read Blog"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">SECONDARY CTA URL</label>
            <Input
              value={data.ctaSecondaryUrl}
              onChange={(e) => setData((p) => ({ ...p, ctaSecondaryUrl: e.target.value }))}
              placeholder="/blog"
            />
          </div>
        </div>

        {toast && (
          <div className={`p-3 rounded-none font-mono text-xs border ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-destructive/10 border-destructive/30 text-destructive'
          }`}>
            {toast.msg}
          </div>
        )}

        <Button
          type="submit"
          disabled={saving}
          className="bg-foreground text-background text-xs font-mono font-bold hover:opacity-90 transition-opacity cursor-pointer rounded-none px-6"
        >
          {saving ? 'SAVING...' : 'SAVE CHANGES'}
        </Button>
      </form>
    </div>
  );
}
