'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic_import from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RichTextEditor = dynamic_import(() => import('@/components/admin/RichTextEditor'), { ssr: false });

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', coverUrl: '', content: '',
    tags: [] as string[], liveUrl: '', githubUrl: '', featured: false
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const set = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));
  const addTag = () => {
    const v = tagInput.trim();
    if (v && !form.tags.includes(v)) {
      set('tags', [...form.tags, v]);
      setTagInput('');
    }
  };

  const handleSave = async () => {
    if (!form.title) return setToast({ type: 'error', msg: 'Title required.' });
    setSaving(true);
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const d = await res.json();
        router.push(`/admin/projects/${d._id}/edit`);
      } else {
        setToast({ type: 'error', msg: 'Failed to save.' });
      }
    } catch {
      setToast({ type: 'error', msg: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">New Project</h1>
        <p className="text-muted-foreground text-sm mt-1">Create a new project showcase item</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6">
          <Input
            value={form.title}
            onChange={(e) => {
              set('title', e.target.value);
              if (!form.slug) set('slug', slugify(e.target.value));
            }}
            placeholder="Project title…"
            className="text-xl md:text-2xl font-bold p-6 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-violet-500 h-14"
          />
          <RichTextEditor content={form.content} onChange={(html) => set('content', html)} placeholder="Describe this project…" />
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                  className="rounded border-border text-violet-600 focus:ring-violet-500/20 w-4.5 h-4.5 accent-violet-500"
                />
                Featured project
              </label>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer">
                {saving ? 'Saving…' : '💾 Save Project'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Slug</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={form.slug}
                onChange={(e) => set('slug', slugify(e.target.value))}
                placeholder="project-slug"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Excerpt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={form.excerpt}
                onChange={(e) => set('excerpt', e.target.value)}
                placeholder="Brief summary..."
                rows={3}
                className="bg-muted/30 border-border focus-visible:ring-violet-500 resize-y"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cover Image URL</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={form.coverUrl}
                onChange={(e) => set('coverUrl', e.target.value)}
                placeholder="https://…"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                value={form.liveUrl}
                onChange={(e) => set('liveUrl', e.target.value)}
                placeholder="Live URL"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
              <Input
                value={form.githubUrl}
                onChange={(e) => set('githubUrl', e.target.value)}
                placeholder="GitHub URL"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 border border-border rounded-md min-h-[40px] items-center">
                {form.tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-violet-500/10 border border-violet-500/30 text-violet-400 rounded-full text-xs font-medium">
                    {t}
                    <button type="button" onClick={() => set('tags', form.tags.filter((x) => x !== t))} className="hover:text-destructive text-[10px] font-bold">✕</button>
                  </span>
                ))}
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tag…"
                  className="flex-1 bg-transparent border-none outline-none text-xs text-foreground min-w-[80px] placeholder:text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
