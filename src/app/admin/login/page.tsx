'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.15)_0%,transparent_60%)] pointer-events-none" />
      <Card className="w-full max-w-[420px] bg-card border-border shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <CardHeader className="text-center space-y-1 pb-6">
          <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-xl text-white shadow-md mx-auto mb-4">
            🛡️
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Admin CMS</CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            Sign in to manage your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                required
                autoComplete="email"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>

            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm text-destructive font-medium animate-in fade-in duration-200">
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full py-5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-md hover:translate-y-[-1px] transition-all hover:shadow-[0_4px_20px_rgba(124,58,237,0.2)] disabled:opacity-60 cursor-pointer"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
