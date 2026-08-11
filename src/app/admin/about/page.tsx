'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { FileUpload } from '@/components/ui/file-upload';

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
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">About Section</h1>
        <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">
          Manage the biography and file links on your site
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-card border border-border p-6 rounded-md shadow-xs">
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">BIOGRAPHY</label>
          <Textarea
            value={data.bio}
            onChange={(e) => setData((p) => ({ ...p, bio: e.target.value }))}
            placeholder="Share the details..."
            rows={6}
          />
          <span className="text-[10px] font-mono text-muted-foreground block mt-1">Supports simple paragraphs and formatting.</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">PHOTO</label>
          <ImageUpload
            value={data.photoUrl}
            onChange={(url) => setData((p) => ({ ...p, photoUrl: url }))}
            allowedTypes={['image/png', 'image/jpeg', 'image/webp']}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">RESUME FILE</label>
          <FileUpload
            value={data.resumeUrl}
            onChange={(url) => setData((p) => ({ ...p, resumeUrl: url }))}
            allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
          />
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
          {saving ? 'SAVING...' : 'SAVE ABOUT'}
        </Button>
      </form>
    </div>
  );
}
