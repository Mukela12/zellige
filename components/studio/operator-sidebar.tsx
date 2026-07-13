"use client";

import dynamic from "next/dynamic";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { Database, ShieldCheck, Repeat } from "lucide-react";
import { ZelligeMark } from "@/components/site/brand";

const RiveCharacter = dynamic(() => import("./rive-character"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-[#F4EEE2]">
      <div className="h-16 w-16 animate-pulse rounded-full bg-[#BE4A2B]/15" />
    </div>
  ),
});

const POINTS = [
  { Icon: Database, label: "Every request lands straight in Postgres, ready to read." },
  { Icon: ShieldCheck, label: "Inbound CRM webhooks are HMAC-verified and logged." },
  { Icon: Repeat, label: "Duplicate retries are absorbed. One event, one effect." },
];

export function OperatorSidebar() {
  const mouse = useMousePosition();

  return (
    <aside className="relative hidden h-full flex-col overflow-hidden border-r border-[#E3DBCB] bg-[#F4EEE2] lg:flex">
      <div className="relative min-h-0 flex-1">
        <RiveCharacter className="absolute inset-0 h-full w-full" mouseX={mouse.x} mouseY={mouse.y} />
      </div>

      <div className="absolute left-8 top-8 z-10 flex items-center gap-2.5">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E3DBCB]/70 bg-[#F4EEE2]/75 px-3.5 py-2 backdrop-blur-md">
          <ZelligeMark size={20} className="text-[#BE4A2B]" />
          <span className="serif text-[1.05rem] font-semibold text-[#251C14]">Zellige</span>
        </span>
        <span className="rounded-full border border-[#BE4A2B]/25 bg-[#F4EEE2]/75 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#9A3D22] backdrop-blur-md">
          Operator console
        </span>
      </div>

      <div className="absolute inset-x-8 bottom-8 z-10 rounded-[18px] border border-[#E3DBCB]/70 bg-[#F4EEE2]/82 p-6 backdrop-blur-md">
        <p className="text-[1.7rem] font-semibold leading-tight tracking-[-0.02em] text-[#251C14]" style={{ fontFamily: "var(--font-display)" }}>
          See every lead <span className="serif-accent text-[#9A3D22]">land</span>.
        </p>
        <div className="mt-5 space-y-3">
          {POINTS.map(({ Icon, label }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} className="mt-0.5 shrink-0 text-[#9A3D22]" />
              <span className="text-[13px] leading-snug text-[#4A4136]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
