'use client';

import { useActionState, useState, useEffect } from 'react';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (state?.email) {
      setEmail(state.email);
    }
  }, [state?.email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <Card className="w-full max-w-[420px] bg-card border border-border shadow-xs relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-300 rounded-md">
        <CardHeader className="text-center space-y-1.5 pb-6">
          <CardTitle className="text-2xl font-extrabold text-foreground tracking-tight">Admin CMS</CardTitle>
          <CardDescription className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
            SIGN IN TO MANAGE YOUR PORTFOLIO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                EMAIL ADDRESS
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@domain.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {state?.error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-none p-3 text-xs font-mono text-destructive animate-in fade-in duration-200">
                {state.error}
              </div>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-foreground text-background text-xs font-mono font-bold hover:opacity-90 transition-opacity cursor-pointer rounded-none px-6 py-2.5 mt-2"
            >
              {pending ? 'SIGNING IN…' : 'SIGN IN'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
