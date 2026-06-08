'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Eye } from 'lucide-react';

type Post = { _id: string; title: string; published: boolean; views: number; publishedAt: string; };

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/blog');
    const data = await res.json();
    setPosts(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage articles and thoughts</p>
        </div>
        <Link href="/admin/blog/new" className={cn(buttonVariants({ variant: 'default' }), "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-95 text-white font-semibold cursor-pointer")}>
          + New Post
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Title</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[120px]">Status</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">Views</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[180px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-transparent">
                <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">Loading…</TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow className="border-transparent">
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-sm">
                  No posts yet. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id} className="border-border hover:bg-muted/20">
                  <TableCell className="font-medium text-foreground py-4 max-w-[200px] truncate" title={post.title}>
                    {post.title}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="secondary" className={`text-xs font-semibold border px-2 py-0.5 ${
                      post.published
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-4 flex items-center gap-1.5 h-14">
                    <Eye className="w-4 h-4 text-muted-foreground/60" /> {post.views}
                  </TableCell>
                  <TableCell className="text-right py-4 space-x-2">
                    <Link href={`/admin/blog/${post._id}/edit`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), "border-border hover:border-violet-500 hover:text-violet-400 cursor-pointer")}>
                      Edit
                    </Link>
                    <Button onClick={() => deletePost(post._id)} variant="destructive" size="sm" className="bg-destructive/10 text-destructive border-transparent hover:bg-destructive hover:text-white transition-colors cursor-pointer">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
