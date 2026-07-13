"use client";

import { useActionState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { studioLogin } from "@/lib/studio-actions";

export function LoginForm({ demoPassword }: { demoPassword?: string }) {
  const [state, action, pending] = useActionState(studioLogin, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          defaultValue={demoPassword}
          autoComplete="current-password"
          className="field field--mono"
          placeholder="Operator password"
        />
        {state?.error && <p className="mt-1.5 text-sm text-destructive">{state.error}</p>}
      </div>
      <button type="submit" disabled={pending} className="btn btn--primary w-full">
        {pending ? <><Loader2 size={16} className="animate-spin" /> Signing in</> : <>Enter console <ArrowRight size={16} /></>}
      </button>
      {demoPassword && (
        <p className="text-center text-xs text-muted-foreground">
          Demo password prefilled. This console is read-only.
        </p>
      )}
    </form>
  );
}
