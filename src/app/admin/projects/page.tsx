'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Pencil, Trash2, Briefcase, GripVertical } from 'lucide-react';

type Project = { _id: string; title: string; excerpt: string; coverUrl: string; tags: string[]; };

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fetch_ = async () => {
    const res = await fetch('/api/admin/projects');
    setProjects(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const del = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    fetch_();
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updated = [...projects];
    const draggedItem = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setProjects(updated);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    try {
      const orders = projects.map((p, idx) => ({ id: p._id, order: idx }));
      await fetch('/api/admin/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });
    } catch (err) {
      console.error('Failed to save projects order:', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage project showcase items (drag to reorder)</p>
        </div>
        <Link href="/admin/projects/new" className={cn(buttonVariants({ variant: 'default' }), "bg-violet-600 hover:bg-violet-700 text-white font-semibold cursor-pointer")}>
          + New Project
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-20 text-muted-foreground">Loading…</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
          No projects yet. Add your first project!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <Card
              key={p._id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={cn(
                "group bg-card border-border overflow-hidden flex flex-col h-full hover:border-violet-500 transition-all relative cursor-grab active:cursor-grabbing",
                draggedIndex === i ? "opacity-40 border-violet-500 scale-95 duration-100" : "duration-200"
              )}
            >
              {/* Drag Handle Overlay */}
              <div className="absolute top-3 right-3 p-1.5 rounded bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                <GripVertical className="w-3.5 h-3.5" />
              </div>

              <div
                className="h-36 flex items-center justify-center bg-muted/20"
                style={{
                  backgroundImage: p.coverUrl ? `url(${p.coverUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!p.coverUrl && <Briefcase className="w-8 h-8 text-muted-foreground/45" />}
              </div>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base font-bold text-foreground leading-snug">{p.title}</CardTitle>
                <p className="text-xs text-muted-foreground leading-normal mt-1 line-clamp-2">{p.excerpt || 'No excerpt'}</p>
              </CardHeader>
              <CardContent className="px-5 py-2 flex-grow">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="bg-violet-500/10 text-violet-400 border-transparent text-[10px] px-2 py-0.5">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-3 border-t border-border/50 flex gap-2" onDragStart={(e) => e.preventDefault()} draggable={false}>
                <Link href={`/admin/projects/${p._id}/edit`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "flex-1 border-border text-xs font-semibold hover:border-violet-500 hover:text-violet-400 cursor-pointer flex items-center justify-center gap-1.5")}>
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Link>
                <Button onClick={() => del(p._id)} variant="destructive" size="sm" className="flex-1 bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
