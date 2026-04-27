import {
  Car,
  Crown,
  Languages,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Car,
  Crown,
  Languages,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  HeartPulse,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Sparkles;
  return <Icon className={className} />;
}

export const accentClasses: Record<string, string> = {
  coral: "bg-coral/10 text-coral",
  gold: "bg-gold/15 text-[oklch(0.55_0.13_75)]",
  navy: "bg-royal/10 text-royal",
  success: "bg-success/10 text-success",
};
