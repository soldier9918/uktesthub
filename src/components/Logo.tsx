import { GraduationCap } from "lucide-react";

import { UnionJack } from "./UnionJack";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`.trim()}>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <UnionJack className="absolute inset-0 h-full w-full" />
        <span className="absolute inset-0 bg-background/15" />
        <GraduationCap className="relative h-5 w-5 text-primary-foreground drop-shadow" />
      </span>
      {!compact && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          UK Test <span className="text-coral">Hub</span>
        </span>
      )}
    </span>
  );
}