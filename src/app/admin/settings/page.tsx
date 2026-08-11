'use client';

import { useActionState } from 'react';
import { changePassword } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const [state, action, pending] = useActionState(changePassword, undefined);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-xs font-mono mt-1 uppercase tracking-wider">Manage admin settings and security credentials</p>
      </div>

      <Card className="bg-card border-border shadow-xs rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-none p-3 text-xs font-mono text-destructive mb-4 animate-in fade-in duration-200">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-none p-3 text-xs font-mono text-emerald-400 mb-4 animate-in fade-in duration-200">
              Password changed successfully!
            </div>
          )}

          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">CURRENT PASSWORD</label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">NEW PASSWORD</label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-widest block mb-1">CONFIRM NEW PASSWORD</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-foreground text-background text-xs font-mono font-bold hover:opacity-90 transition-opacity cursor-pointer rounded-none px-6 mt-2"
            >
              {pending ? 'UPDATING…' : 'UPDATE PASSWORD'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
