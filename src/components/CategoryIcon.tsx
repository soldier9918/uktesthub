import iconDriving from "@/assets/icon-driving.png";
import iconCitizenship from "@/assets/icon-citizenship.png";
import iconEnglish from "@/assets/icon-english.png";
import iconEducation from "@/assets/icon-education.png";
import iconCareer from "@/assets/icon-career.png";
import iconProfessional from "@/assets/icon-professional.png";
import iconNhs from "@/assets/icon-nhs.png";
import iconFun from "@/assets/icon-fun.png";

// `name` is the lucide icon key kept in src/data/categories.ts so we don't have
// to migrate the data layer — we just map it to a premium illustrated PNG.
const iconMap: Record<string, string> = {
  Car: iconDriving,
  Crown: iconCitizenship,
  Languages: iconEnglish,
  GraduationCap: iconEducation,
  Briefcase: iconCareer,
  ShieldCheck: iconProfessional,
  HeartPulse: iconNhs,
  Sparkles: iconFun,
};

export function CategoryIcon({
  name,
  className,
  alt = "",
}: {
  name: string;
  className?: string;
  alt?: string;
}) {
  const src = iconMap[name] ?? iconFun;
  return (
    <img
      src={src}
      alt={alt}
      width={512}
      height={512}
      loading="lazy"
      className={className}
      draggable={false}
    />
  );
}

// Soft tinted background plates used behind the icon on each card. Designed to
// echo the dominant colour of the illustrated icon for a cohesive premium feel.
export const accentClasses: Record<string, string> = {
  coral: "bg-gradient-to-br from-coral/15 to-coral/5 ring-1 ring-coral/15",
  gold: "bg-gradient-to-br from-gold/25 to-gold/5 ring-1 ring-gold/20",
  navy: "bg-gradient-to-br from-royal/15 to-royal/5 ring-1 ring-royal/15",
  success: "bg-gradient-to-br from-success/15 to-success/5 ring-1 ring-success/15",
};
