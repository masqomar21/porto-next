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
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Contact & Social Links</h1>
        <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">Manage contact email and social profile links</p>
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

      <div className="space-y-6">
        <Card className="bg-card border-border shadow-xs rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Contact Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">EMAIL ADDRESS</label>
              <Input
                value={data.email}
                onChange={e => setData(p => ({ ...p, email: e.target.value }))}
                placeholder="hello@domain.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center mb-1">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Platform</span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">URL</span>
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Icon</span>
              <span />
            </div>

            {data.socialLinks.map((link, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                <Input
                  value={link.platform}
                  onChange={e => updateLink(i, 'platform', e.target.value)}
                  placeholder="GitHub"
                />
                <Input
                  value={link.url}
                  onChange={e => updateLink(i, 'url', e.target.value)}
                  placeholder="https://github.com/…"
                />
                <select
                  value={link.icon}
                  onChange={e => updateLink(i, 'icon', e.target.value)}
                  className="flex h-10 w-full rounded-none border-0 border-b border-border/60 bg-muted/40 px-3.5 py-2.5 text-xs font-mono text-foreground focus:border-b-2 focus:border-foreground focus:bg-muted/60 outline-hidden transition-colors cursor-pointer"
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
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 border-border text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer rounded-none"
                >
                  ✕
                </Button>
              </div>
            ))}

            <Button onClick={addLink} variant="outline" className="border-border text-xs font-mono font-bold hover:bg-muted cursor-pointer mt-2 rounded-none">
              + ADD LINK
            </Button>
          </CardContent>
        </Card>

        <Button
          onClick={save}
          disabled={saving}
          className="bg-foreground text-background text-xs font-mono font-bold hover:opacity-90 transition-opacity cursor-pointer rounded-none px-6"
        >
          {saving ? 'SAVING...' : 'SAVE CONTACT'}
        </Button>
      </div>
    </div>
  );
}
