import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import InboxMessage from '@/models/InboxMessage';
import MediaAsset from '@/models/MediaAsset';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Briefcase,
  Zap,
  Eye,
  Sparkles,
  Mail,
  Inbox,
  Image as ImageIcon,
  Globe,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard - Admin' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectDB();
  const [
    totalPosts,
    publishedPosts,
    totalProjects,
    totalSkills,
    totalExperiences,
    totalInboxMessages,
    unreadInboxMessages,
    totalMediaAssets,
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ published: true }),
    Project.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
    InboxMessage.countDocuments(),
    InboxMessage.countDocuments({ read: false }),
    MediaAsset.countDocuments(),
  ]);

  const totalViews = await Post.aggregate([
    { $group: { _id: null, total: { $sum: '$views' } } },
  ]).then((r) => r[0]?.total ?? 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">
          System Overview & Content Management Metrics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Blog Posts
            </CardTitle>
            <FileText className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">{publishedPosts} published</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Projects
            </CardTitle>
            <Briefcase className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Showcased works</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Inbox Messages
            </CardTitle>
            <Inbox className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalInboxMessages}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              {unreadInboxMessages > 0 ? (
                <span className="font-semibold text-foreground">{unreadInboxMessages} unread</span>
              ) : (
                'All messages read'
              )}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Media Assets
            </CardTitle>
            <ImageIcon className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalMediaAssets}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Uploaded files & images</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Experience
            </CardTitle>
            <Clock className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalExperiences}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Timeline roles</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Skills
            </CardTitle>
            <Zap className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalSkills}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Tech capabilities</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-foreground/50 transition-colors shadow-none rounded-md sm:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">
              Blog Views
            </CardTitle>
            <Eye className="w-4 h-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-mono font-extrabold text-foreground">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 font-sans">Cumulative article views</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <Link
            href="/admin/blog/new"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <FileText className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">New Post</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <Briefcase className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">New Project</span>
          </Link>
          <Link
            href="/admin/inbox"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <Inbox className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">View Inbox</span>
          </Link>
          <Link
            href="/admin/media"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <ImageIcon className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">Media Library</span>
          </Link>
          <Link
            href="/admin/experience"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <Clock className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">Experience</span>
          </Link>
          <Link
            href="/admin/hero"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <Sparkles className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">Edit Hero</span>
          </Link>
          <Link
            href="/admin/skills"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <Zap className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">Manage Skills</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-4 bg-card border border-border rounded-md text-center hover:border-foreground hover:bg-muted transition-all group"
          >
            <Globe className="w-6 h-6 mb-2 text-foreground group-hover:scale-105 transition-transform" />
            <span className="text-[11px] font-semibold text-foreground">View Site</span>
          </a>
        </div>
      </div>
    </div>
  );
}
