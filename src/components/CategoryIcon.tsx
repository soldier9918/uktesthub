import {
  Car,
  Crown,
  Languages,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
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
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = map[name] ?? Sparkles;
  return <Icon className={className} />;
}

export const accentClasses: Record<string, string> = {
  coral: "bg-gradient-coral text-coral-foreground shadow-coral",
  gold: "bg-gradient-gold text-gold-foreground",
  navy: "bg-navy text-navy-foreground",
  success: "bg-success text-success-foreground",
};
