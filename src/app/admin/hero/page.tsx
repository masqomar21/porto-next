'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
      .then((d) => setData({
        name: d.name || '',
        roles: d.roles || [],
        tagline: d.tagline || '',
        ctaPrimaryLabel: d.ctaPrimaryLabel || '',
        ctaPrimaryUrl: d.ctaPrimaryUrl || '',
        ctaSecondaryLabel: d.ctaSecondaryLabel || '',
        ctaSecondaryUrl: d.ctaSecondaryUrl || '',
        imageUrl: d.imageUrl || '',
      }));
  }, []);

  const addRole = () => {
    const v = roleInput.trim();
    if (v && !data.roles.includes(v)) {
      setData((p) => ({ ...p, roles: [...p.roles, v] }));
      setRoleInput('');
    }
  };

  const removeRole = (r: string) => {
    setData((p) => ({ ...p, roles: p.roles.filter((x) => x !== r) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', msg: 'Hero section saved!' });
      else setToast({ type: 'error', msg: 'Failed to save.' });
    } catch {
      setToast({ type: 'error', msg: 'Network error.' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Hero Section</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage the hero content of your homepage</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Name</label>
          <Input
            value={data.name}
            onChange={(e) => setData((p) => ({ ...p, name: e.target.value }))}
            placeholder="John Doe"
            className="bg-muted/30 border-border focus-visible:ring-violet-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile Image URL</label>
          <div className="flex gap-4 items-center">
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt="Profile Preview"
                className="w-12 h-12 rounded-full object-cover border border-border bg-muted/40 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <Input
              value={data.imageUrl}
              onChange={(e) => setData((p) => ({ ...p, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1 bg-muted/30 border-border focus-visible:ring-violet-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Typewriter Roles</label>
          <div className="flex flex-wrap gap-2 p-3 bg-muted/30 border border-border rounded-md min-h-[48px] items-center">
            {data.roles.map((r) => (
              <span key={r} className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full text-xs font-medium">
                {r}
                <button type="button" onClick={() => removeRole(r)} className="text-muted-foreground hover:text-destructive transition-colors text-xs font-semibold">✕</button>
              </span>
            ))}
            <input
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
              placeholder="Add role, press Enter…"
              className="flex-1 bg-transparent border-none outline-none text-sm text-foreground min-w-[150px] placeholder:text-muted-foreground"
            />
          </div>
          <span className="text-[10px] text-muted-foreground block mt-1">Press Enter to add each role. These cycle in the homepage typewriter animation.</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tagline</label>
          <Input
            value={data.tagline}
            onChange={(e) => setData((p) => ({ ...p, tagline: e.target.value }))}
            placeholder="I build fast, beautiful..."
            className="bg-muted/30 border-border focus-visible:ring-violet-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary CTA Label</label>
            <Input
              value={data.ctaPrimaryLabel}
              onChange={(e) => setData((p) => ({ ...p, ctaPrimaryLabel: e.target.value }))}
              placeholder="View Projects"
              className="bg-muted/30 border-border focus-visible:ring-violet-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Primary CTA URL</label>
            <Input
              value={data.ctaPrimaryUrl}
              onChange={(e) => setData((p) => ({ ...p, ctaPrimaryUrl: e.target.value }))}
              placeholder="#projects"
              className="bg-muted/30 border-border focus-visible:ring-violet-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secondary CTA Label</label>
            <Input
              value={data.ctaSecondaryLabel}
              onChange={(e) => setData((p) => ({ ...p, ctaSecondaryLabel: e.target.value }))}
              placeholder="Read Blog"
              className="bg-muted/30 border-border focus-visible:ring-violet-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Secondary CTA URL</label>
            <Input
              value={data.ctaSecondaryUrl}
              onChange={(e) => setData((p) => ({ ...p, ctaSecondaryUrl: e.target.value }))}
              placeholder="/blog"
              className="bg-muted/30 border-border focus-visible:ring-violet-500"
            />
          </div>
        </div>

        {toast && (
          <div className={`p-3 rounded-md text-sm border ${
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
          className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-md shadow-sm hover:opacity-95 hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          {saving ? 'Saving…' : 'Save Hero'}
        </Button>
      </form>
    </div>
  );
}
