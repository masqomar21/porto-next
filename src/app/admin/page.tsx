import { Metadata } from 'next';
import connectDB from '@/lib/mongodb';
import Post from '@/models/Post';
import Project from '@/models/Project';
import Skill from '@/models/Skill';
import Experience from '@/models/Experience';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FileText,
  Briefcase,
  Zap,
  Eye,
  Sparkles,
  Mail,
  Globe,
  Clock
} from 'lucide-react';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  await connectDB();
  const [totalPosts, publishedPosts, totalProjects, totalSkills, totalExperiences] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ published: true }),
    Project.countDocuments(),
    Skill.countDocuments(),
    Experience.countDocuments(),
  ]);

  const totalViews = await Post.aggregate([
    { $group: { _id: null, total: { $sum: '$views' } } },
  ]).then((r) => r[0]?.total ?? 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-card border-border hover:border-violet-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Blog Posts
            </CardTitle>
            <FileText className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalPosts}</div>
            <p className="text-xs text-muted-foreground mt-1">{publishedPosts} published</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-violet-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Projects
            </CardTitle>
            <Briefcase className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Showcased works</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-violet-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Experience
            </CardTitle>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalExperiences}</div>
            <p className="text-xs text-muted-foreground mt-1">Timeline roles</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-violet-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Skills
            </CardTitle>
            <Zap className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalSkills}</div>
            <p className="text-xs text-muted-foreground mt-1">Tech capabilities</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-violet-500 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Blog Views
            </CardTitle>
            <Eye className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-foreground">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative views</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          <Link
            href="/admin/blog/new"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <FileText className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">New Blog Post</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <Briefcase className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">New Project</span>
          </Link>
          <Link
            href="/admin/experience"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <Clock className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">Manage Experience</span>
          </Link>
          <Link
            href="/admin/hero"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <Sparkles className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">Edit Hero</span>
          </Link>
          <Link
            href="/admin/skills"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <Zap className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">Manage Skills</span>
          </Link>
          <Link
            href="/admin/contact"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <Mail className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">Edit Contact</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-xl text-center hover:border-violet-500 hover:bg-violet-500/5 hover:-translate-y-0.5 transition-all group"
          >
            <Globe className="w-8 h-8 mb-3 text-muted-foreground group-hover:text-violet-500 transition-colors" />
            <span className="text-xs font-semibold text-foreground">View Live Site</span>
          </a>
        </div>
      </div>
    </div>
  );
}
