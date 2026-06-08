'use client';

import { useActionState } from 'react';
import { changePassword } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const [state, action, pending] = useActionState(changePassword, undefined);

  return (
    <div className="space-y-6 max-w-lg animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage admin settings and security credentials</p>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-foreground">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          {state?.error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 text-sm text-destructive font-medium mb-4 animate-in fade-in duration-200">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md p-3 text-sm text-emerald-400 font-medium mb-4 animate-in fade-in duration-200">
              Password changed successfully!
            </div>
          )}

          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Current Password</label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Password</label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Confirm New Password</label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                className="bg-muted/30 border-border focus-visible:ring-violet-500"
              />
            </div>
            <Button
              type="submit"
              disabled={pending}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-md shadow-sm hover:translate-y-[-1px] transition-all cursor-pointer mt-2"
            >
              {pending ? 'Updating…' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
