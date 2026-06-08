'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SocialLink = { platform: string; url: string; icon: string; };
type ContactData = { email: string; socialLinks: SocialLink[]; };

export default function ContactAdminPage() {
  const [data, setData] = useState<ContactData>({ email: '', socialLinks: [] });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetch('/api/admin/contact')
      .then(r => r.json())
      .then(d => {
        setData({
          email: d.email || '',
          socialLinks: Array.isArray(d.socialLinks) ? d.socialLinks : [],
        });
      });
  }, []);

  const updateLink = (i: number, field: keyof SocialLink, val: string) => {
    const links = [...data.socialLinks];
    links[i] = { ...links[i], [field]: val };
    setData(p => ({ ...p, socialLinks: links }));
  };

  const addLink = () => setData(p => ({ ...p, socialLinks: [...p.socialLinks, { platform: '', url: '', icon: '' }] }));
  const removeLink = (i: number) => setData(p => ({ ...p, socialLinks: p.socialLinks.filter((_, j) => j !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setToast({ type: res.ok ? 'success' : 'error', msg: res.ok ? 'Contact saved!' : 'Failed.' });
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
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Contact & Social Links</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage contact email and social profile links</p>
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

      <div className="space-y-6">
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Contact Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <Input
                value={data.email}
                onChange={e => setData(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center mb-1">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Platform</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">URL</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Icon</span>
              <span />
            </div>

            {data.socialLinks.map((link, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <Input
                  value={link.platform}
                  onChange={e => updateLink(i, 'platform', e.target.value)}
                  placeholder="GitHub"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500 h-9"
                />
                <Input
                  value={link.url}
                  onChange={e => updateLink(i, 'url', e.target.value)}
                  placeholder="https://github.com/…"
                  className="bg-muted/30 border-border focus-visible:ring-violet-500 h-9"
                />
                <select
                  value={link.icon}
                  onChange={e => updateLink(i, 'icon', e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-muted/30 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground cursor-pointer"
                >
                  <option value="" disabled>Select Icon</option>
                  <option value="github">Github</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter / X</option>
                  <option value="globe">Globe / Website</option>
                  <option value="mail">Email</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                </select>
                <Button
                  onClick={() => removeLink(i)}
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white cursor-pointer"
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button onClick={addLink} variant="outline" className="border-border text-sm font-semibold hover:border-violet-500 hover:text-violet-400 cursor-pointer mt-2">
              + Add Link
            </Button>
          </CardContent>
        </Card>

        <Button
          onClick={save}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-md shadow-sm hover:opacity-95 hover:translate-y-[-1px] transition-all cursor-pointer"
        >
          {saving ? 'Saving…' : 'Save Contact'}
        </Button>
      </div>
    </div>
  );
}
