'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import dynamic_import from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/ui/image-upload';

const RichTextEditor = dynamic_import(() => import('@/components/admin/RichTextEditor'), { ssr: false });

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', coverUrl: '', content: '', tags: [] as string[], published: false });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/blog/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setForm(d);
        setLoading(false);
      });
  }, [id]);

  const set = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const addTag = () => {
    const v = tagInput.trim();
    if (v && !form.tags.includes(v)) {
      set('tags', [...form.tags, v]);
      setTagInput('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) setToast({ type: 'success', msg: 'Post saved!' });
      else setToast({ type: 'error', msg: 'Failed to save.' });
    } catch {
      setToast({ type: 'error', msg: 'Network error.' });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground animate-pulse">Loading…</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Edit Post</h1>
        <p className="text-muted-foreground text-sm mt-1">Modify your blog article details</p>
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
            onChange={(e) => set('title', e.target.value)}
            placeholder="Post title…"
            className="text-xl md:text-2xl font-bold p-6 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-violet-500 h-14"
          />
          <RichTextEditor content={form.content} onChange={(html) => set('content', html)} />
        </div>

        <div className="space-y-6">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set('published', e.target.checked)}
                  className="rounded border-border text-violet-600 focus:ring-violet-500/20 w-4.5 h-4.5 accent-violet-500"
                />
                {form.published ? 'Published' : 'Draft'}
              </label>
              <Button onClick={handleSave} disabled={saving} className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer">
                {saving ? 'Saving…' : '💾 Save'}
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
                placeholder="url-slug"
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
                placeholder="Short description for the post listing…"
                rows={3}
                className="bg-muted/30 border-border focus-visible:ring-violet-500 resize-y"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={form.coverUrl}
                onChange={(url) => set('coverUrl', url)}
                allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
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
