'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type AboutData = {
  bio: string;
  photoUrl: string;
  resumeUrl: string;
};

export default function AboutAdminPage() {
  const [data, setData] = useState<AboutData>({
    bio: '',
    photoUrl: '',
    resumeUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/about')
      .then((r) => r.json())
      .then((d) => setData({
        bio: d.bio || '',
        photoUrl: d.photoUrl || '',
        resumeUrl: d.resumeUrl || '',
      }))
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/about', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', msg: 'About section saved!' });
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
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">About Section</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage the biography and file links on your site</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Biography</label>
          <Textarea
            value={data.bio}
            onChange={(e) => setData((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Introduce yourself, your experience, and your passion..."
            rows={6}
            className="bg-muted/30 border-border focus-visible:ring-violet-500"
          />
          <span className="text-[10px] text-muted-foreground block mt-1">Supports simple paragraphs and formatting.</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Photo URL</label>
          <Input
            value={data.photoUrl}
            onChange={(e) => setData((p) => ({ ...p, photoUrl: e.target.value }))}
            placeholder="/images/profile.jpg or external HTTPS link"
            className="bg-muted/30 border-border focus-visible:ring-violet-500"
          />
          <span className="text-[10px] text-muted-foreground block mt-1">Use a relative file path inside the public folder or an external image URL.</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resume URL</label>
          <Input
            value={data.resumeUrl}
            onChange={(e) => setData((p) => ({ ...p, resumeUrl: e.target.value }))}
            placeholder="/resume.pdf or Google Drive link"
            className="bg-muted/30 border-border focus-visible:ring-violet-500"
          />
          <span className="text-[10px] text-muted-foreground block mt-1">Provide a direct link to download or view your resume.</span>
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
          className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          {saving ? 'Saving…' : 'Save About'}
        </Button>
      </form>
    </div>
  );
}
