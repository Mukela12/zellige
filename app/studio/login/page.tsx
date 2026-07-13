import { redirect } from "next/navigation";
import { isOperator } from "@/lib/studio-auth";
import { OperatorSidebar } from "@/components/studio/operator-sidebar";
import { LoginForm } from "@/components/studio/login-form";
import { ZelligeWordmark } from "@/components/site/brand";

export default async function StudioLogin() {
  if (await isOperator()) redirect("/studio");

  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <OperatorSidebar />
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <ZelligeWordmark size={24} />
          </div>
          <p className="eyebrow mt-8 lg:mt-0">Operator console</p>
          <h1 className="serif mt-2 text-[2rem] font-semibold tracking-[-0.02em]">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            An internal view of captured leads and CRM webhook activity. Not part of the public site.
          </p>
          <div className="mt-8">
            <LoginForm demoPassword={process.env.OPERATOR_PASSWORD} />
          </div>
        </div>
      </div>
    </div>
  );
}
